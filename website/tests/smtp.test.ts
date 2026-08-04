import assert from "node:assert/strict";
import test from "node:test";
import { buildSmtpMessage, parseSmtpReplies } from "../functions/lib/smtp.ts";

test("parses multiline replies and dot-stuffs SMTP message bodies", () => {
  const parsed = parseSmtpReplies("250-mail.example\r\n250 AUTH LOGIN\r\n334 VXNlcm5hbWU6\r\npartial");
  assert.deepEqual(parsed.replies.map((reply) => reply.code), [250, 334]);
  assert.equal(parsed.rest, "partial");
  const firstChunk = parseSmtpReplies("250-mail.example\r\n");
  assert.deepEqual(firstChunk.replies, []);
  assert.equal(parseSmtpReplies(firstChunk.rest + "250 AUTH LOGIN\r\n").replies[0]?.code, 250);

  const message = buildSmtpMessage({
    from: "sales@example.com",
    to: "sales@example.com",
    replyTo: "customer@example.com",
    subject: "New inquiry",
    text: "First line\n.dot-prefixed",
  });
  assert.match(message, /Reply-To: customer@example\.com/);
  assert.match(message, /First line\r\n\.\.dot-prefixed/);
});
