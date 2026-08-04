import { connect } from "node:tls";

export type SmtpMessage = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

type SmtpConfig = { host: string; port: number; user: string; password: string };
type Reply = { code: number; lines: string[] };

export function parseSmtpReplies(buffer: string) {
  const replies: Reply[] = [];
  const lines = buffer.split("\r\n");
  const tail = lines.pop() || "";
  let current: string[] = [];
  for (const line of lines) {
    current.push(line);
    const match = /^(\d{3}) /.exec(line);
    if (match) {
      replies.push({ code: Number(match[1]), lines: current });
      current = [];
    }
  }
  return { replies, rest: current.length ? `${current.join("\r\n")}\r\n${tail}` : tail };
}

export function buildSmtpMessage(message: SmtpMessage) {
  const subject = btoa(String.fromCharCode(...new TextEncoder().encode(message.subject)));
  const body = message.text.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
  return [
    `From: ${message.from}`,
    `To: ${message.to}`,
    `Reply-To: ${message.replyTo}`,
    `Subject: =?UTF-8?B?${subject}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].join("\r\n");
}

export async function sendSmtp(config: SmtpConfig, message: SmtpMessage): Promise<string | null> {
  const socket = connect({ host: config.host, port: config.port, servername: config.host });
  const replies: Reply[] = [];
  const waiting: Array<{ resolve: (reply: Reply) => void; reject: (error: Error) => void }> = [];
  let buffer = "";
  let failure: Error | null = null;

  const rejectAll = (error: Error) => {
    failure = error;
    while (waiting.length) waiting.shift()!.reject(error);
  };
  socket.on("data", (chunk) => {
    const parsed = parseSmtpReplies(buffer + chunk.toString("utf8"));
    buffer = parsed.rest;
    for (const reply of parsed.replies) {
      const pending = waiting.shift();
      if (pending) pending.resolve(reply);
      else replies.push(reply);
    }
  });
  socket.on("error", rejectAll);

  const nextReply = () => {
    if (replies.length) return Promise.resolve(replies.shift()!);
    if (failure) return Promise.reject(failure);
    return new Promise<Reply>((resolve, reject) => waiting.push({ resolve, reject }));
  };
  const expect = async (codes: number[]) => {
    const reply = await nextReply();
    if (!codes.includes(reply.code)) throw new Error(`smtp_${reply.code}`);
  };
  const command = async (value: string, codes: number[]) => {
    socket.write(`${value}\r\n`);
    await expect(codes);
  };

  const run = async () => {
    await new Promise<void>((resolve, reject) => {
      socket.once("secureConnect", resolve);
      socket.once("error", reject);
    });
    await expect([220]);
    await command("EHLO taicoev.com", [250]);
    await command("AUTH LOGIN", [334]);
    await command(btoa(config.user), [334]);
    await command(btoa(config.password), [235]);
    await command(`MAIL FROM:<${message.from}>`, [250]);
    await command(`RCPT TO:<${message.to}>`, [250, 251]);
    await command("DATA", [354]);
    await command(`${buildSmtpMessage(message)}\r\n.`, [250]);
    await command("QUIT", [221]);
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      run(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("smtp_timeout")), 15_000);
      }),
    ]);
    return null;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "smtp_network";
    return /^smtp_(?:\d{3}|timeout)$/.test(reason) ? reason : "smtp_network";
  } finally {
    if (timer) clearTimeout(timer);
    socket.destroy();
  }
}
