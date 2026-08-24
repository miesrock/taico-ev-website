import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  readControlRoom,
  SEARCH_CONSOLE_PROPERTY,
  type SeoDatabase,
} from "../../../src/lib/seo-control-room.ts";

export type SeoApiEnv = {
  SEO_DB?: SeoDatabase;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
};

export type SeoApiContext = {
  request: Request;
  env: SeoApiEnv;
};

const responseHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "private, no-store",
  vary: "Cookie, CF-Access-JWT-Assertion",
};

function json(payload: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: new Headers({ ...responseHeaders, ...extra }),
  });
}

function accessDomain(value: string) {
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    if (url.protocol !== "https:") return null;
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

export async function verifyAccessRequest(request: Request, env: SeoApiEnv) {
  const token = request.headers.get("cf-access-jwt-assertion");
  const domain = env.ACCESS_TEAM_DOMAIN ? accessDomain(env.ACCESS_TEAM_DOMAIN) : null;
  const audience = env.ACCESS_AUD?.trim();
  if (!token || !domain || !audience) return false;
  try {
    const issuer = domain.origin;
    const jwks = createRemoteJWKSet(new URL("/cdn-cgi/access/certs", issuer));
    await jwtVerify(token, jwks, { audience, issuer });
    return true;
  } catch {
    return false;
  }
}

export async function onRequest(context: SeoApiContext): Promise<Response> {
  if (context.request.method !== "GET") return json({ ok: false, code: "METHOD_NOT_ALLOWED" }, 405, { allow: "GET" });
  if (!(await verifyAccessRequest(context.request, context.env))) return json({ ok: false, code: "AUTH_REQUIRED" }, 401);
  if (!context.env.SEO_DB) return json({ ok: false, code: "CONFIGURATION_ERROR" }, 503);

  try {
    const payload = await readControlRoom(context.env.SEO_DB, SEARCH_CONSOLE_PROPERTY);
    return json(payload);
  } catch {
    console.error("seo.control_room_read_failed", { code: "D1_READ_FAILED" });
    return json({ ok: false, code: "DATA_UNAVAILABLE" }, 503);
  }
}
