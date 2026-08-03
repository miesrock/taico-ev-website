import { applications as catalogApplications } from "../../src/data/applications.ts";
import { products } from "../../src/data/products.ts";
import { site } from "../../src/data/site.ts";
import { solutions } from "../../src/data/solutions.ts";
import { matchIcp } from "../../src/lib/icp/index.ts";
import type { IcpMatchContext, IcpMatchResult } from "../../src/lib/icp/types.ts";
import {
  buildLeadNotification,
  normalizeText,
  validateLead,
  validateLeadContext,
  type LeadContext,
  type LeadInput,
} from "../lib/lead.ts";

export const MAX_BODY_BYTES = 16 * 1024;

type D1RunResult = { meta?: { changes?: number } };

type D1Statement = {
  bind(...values: unknown[]): D1Statement;
  run(): Promise<D1RunResult>;
  first<T>(): Promise<T | null>;
};

type LeadDatabase = { prepare(query: string): D1Statement };

export type LeadEnv = {
  LEADS_DB?: LeadDatabase;
  TURNSTILE_SECRET_KEY?: string;
  EMAIL_API_ACCOUNT_ID?: string;
  EMAIL_API_TOKEN?: string;
  LEAD_NOTIFICATION_TO?: string;
  LEAD_NOTIFICATION_FROM?: string;
  LEAD_FALLBACK_EMAIL?: string;
  ALLOWED_ORIGINS?: string;
};

export type LeadRequestContext = {
  request: Request;
  env: LeadEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
};

type StoredLead = {
  id: string;
  submission_key: string;
  created_at: string;
  name: string;
  company: string;
  company_type: string;
  email: string;
  country: string;
  phone: string | null;
  application: string;
  timeline: string | null;
  message: string;
  product_slug: string | null;
  solution_slug: string | null;
  application_slug: string | null;
  page_path: string;
  source_component: string;
  locale: "en";
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  icp_decision: IcpMatchResult["decision"];
  icp_top_match: string | null;
  icp_score: number | null;
  icp_band: "strong" | "possible" | "weak" | null;
  icp_rule_version: string;
  icp_snapshot: string;
  notification_status: "pending" | "sent" | "failed";
  notification_attempts: number;
};

const productSlugs = new Set(products.map((product) => product.slug));
const solutionSlugs = new Set(solutions.map((solution) => solution.slug));
const applicationSlugs = new Set(catalogApplications.map((application) => application.slug));
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const applicationIcpSignals: Record<string, Pick<IcpMatchContext, "applicationSlug">> = {
  // ponytail: only exact catalog mappings; company identity stays an explicit form field.
  "EV dealership": {},
  "Roadside assistance": { applicationSlug: "roadside-ev-rescue" },
  "Fleet charging": {},
  "Commercial property": {},
  "Construction / temporary site": {},
  "Distributor / partnership": {},
  Other: {},
};

const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

const errorMessages: Record<string, string> = {
  INVALID_REQUEST: "We could not read that inquiry. Please try again.",
  VALIDATION_ERROR: "Check the highlighted fields and try again.",
  ORIGIN_NOT_ALLOWED: "Refresh the page and try again.",
  TURNSTILE_FAILED: "Please complete the anti-spam check and try again.",
  TURNSTILE_UNAVAILABLE: "The anti-spam check is temporarily unavailable. Please try again shortly.",
  CONFIGURATION_ERROR: "The inquiry form is temporarily unavailable.",
  DATABASE_ERROR: "We could not save your inquiry. Please try again shortly or email the team directly.",
  NOTIFICATION_ERROR: "Your inquiry was saved. The team will follow up after notification recovery.",
};

function wantsJson(request: Request) {
  return request.headers.get("accept")?.toLowerCase().includes("application/json") ?? false;
}

function responseHeaders(extra: Record<string, string> = {}) {
  return new Headers({ ...jsonHeaders, ...extra });
}

function errorResponse(context: LeadRequestContext, status: number, code: string, fields?: Record<string, string>) {
  const payload = {
    ok: false,
    code,
    ...(fields ? { fields } : {}),
    ...(status === 503 ? { fallbackEmail: context.env.LEAD_FALLBACK_EMAIL || site.email } : {}),
  };
  if (wantsJson(context.request)) {
    return new Response(JSON.stringify(payload), { status, headers: responseHeaders() });
  }

  const message = errorMessages[code] || errorMessages.INVALID_REQUEST;
  const fallback = status === 503
    ? `<p>You can email <a href="mailto:${site.email}">${site.email}</a> directly.</p>`
    : "";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inquiry not sent | TAICO EV</title></head><body><main><h1>Inquiry not sent</h1><p>${message}</p>${fallback}<p><a href="/contact/">Return to the inquiry form</a></p></main></body></html>`;
  return new Response(html, { status, headers: new Headers({ "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }) });
}

function successResponse(context: LeadRequestContext) {
  if (!wantsJson(context.request)) return Response.redirect(new URL("/thank-you/", context.request.url), 303);
  return new Response(JSON.stringify({ ok: true, message: "Inquiry received." }), { status: 200, headers: responseHeaders() });
}

function normalizedOrigin(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.pathname === "/" && !url.search && !url.hash ? url.origin : ""
      : "";
  } catch {
    return "";
  }
}

function configuredOrigins(value?: string) {
  return (value || "").split(",").map((origin) => normalizedOrigin(origin.trim())).filter(Boolean);
}

function isAllowedOrigin(request: Request, env: LeadEnv) {
  const origins = configuredOrigins(env.ALLOWED_ORIGINS);
  const origin = normalizedOrigin(request.headers.get("origin") || "");
  return origins.length > 0 && Boolean(origin) && origins.includes(origin);
}

async function readBody(request: Request): Promise<Uint8Array | null> {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

async function parseFormData(request: Request, contentType: string): Promise<FormData | "too_large" | "invalid"> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_BODY_BYTES)) return "too_large";
  const body = await readBody(request);
  if (!body) return "too_large";

  try {
    const parserRequest = new Request(request.url, { method: "POST", headers: { "content-type": contentType }, body });
    return await parserRequest.formData();
  } catch {
    return "invalid";
  }
}

function formDataRecord(formData: FormData) {
  const input: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) input[key] = typeof value === "string" ? value : "";
  return input;
}

function validateContext(input: Record<string, unknown>) {
  const result = validateLeadContext(input);
  if (!result.ok) return result;
  const fields = { ...result.value };
  const errors: Record<string, string> = {};
  if (fields.productSlug && !productSlugs.has(fields.productSlug)) errors.product = "Choose a valid product context.";
  if (fields.solutionSlug && !solutionSlugs.has(fields.solutionSlug)) errors.solution = "Choose a valid solution context.";
  if (fields.applicationSlug && !applicationSlugs.has(fields.applicationSlug)) errors.application_context = "Choose a valid application context.";
  return Object.keys(errors).length ? { ok: false as const, fields: errors } : { ok: true as const, value: fields };
}

async function verifyTurnstile(token: string, secret: string, idempotencyKey: string): Promise<"ok" | "failed" | "unavailable"> {
  if (!token || token.length > 2048) return "failed";
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, idempotency_key: idempotencyKey }),
    });
    if (!response.ok) return "unavailable";
    const result = await response.json() as { success?: unknown };
    return result.success === true ? "ok" : "failed";
  } catch {
    return "unavailable";
  }
}

function inferredCountry(request: Request) {
  const requestWithCf = request as Request & { cf?: { country?: string } };
  const country = normalizeText(requestWithCf.cf?.country || request.headers.get("cf-ipcountry") || "").toUpperCase();
  return /^[A-Z]{2}$/.test(country) ? country : null;
}

function icpContext(lead: LeadInput, context: LeadContext): IcpMatchContext {
  const applicationSignal = applicationIcpSignals[lead.application] || {};
  return {
    companyType: lead.companyType || undefined,
    applicationSlug: context.applicationSlug || applicationSignal.applicationSlug,
    productSlug: context.productSlug || undefined,
    solutionSlug: context.solutionSlug || undefined,
    source: context.sourceComponent,
    country: lead.country,
    rawText: lead.requirements,
    purchaseTimeline: lead.timeline,
  };
}

function leadFromRow(row: StoredLead): LeadInput {
  return {
    name: row.name,
    company: row.company,
    companyType: row.company_type as LeadInput["companyType"],
    email: row.email,
    country: row.country,
    application: row.application as LeadInput["application"],
    phone: row.phone || "",
    timeline: (row.timeline || "") as LeadInput["timeline"],
    requirements: row.message,
    privacyConsent: true,
  };
}

function contextFromRow(row: StoredLead): LeadContext {
  return {
    sourceComponent: row.source_component,
    productSlug: row.product_slug || "",
    solutionSlug: row.solution_slug || "",
    applicationSlug: row.application_slug || "",
    pagePath: row.page_path,
    locale: row.locale,
    referrer: row.referrer || "",
    utmSource: row.utm_source || "",
    utmMedium: row.utm_medium || "",
    utmCampaign: row.utm_campaign || "",
    utmContent: row.utm_content || "",
    utmTerm: row.utm_term || "",
  };
}

function notificationResult(status: number, payload: unknown, recipient: string) {
  if (!Number.isInteger(status) || status < 200 || status >= 300) return `provider_${status}`;
  if (!payload || typeof payload !== "object" || (payload as { success?: unknown }).success !== true) return "provider_rejected";
  const permanentBounces = (payload as { result?: { permanent_bounces?: unknown } }).result?.permanent_bounces;
  if (Array.isArray(permanentBounces) && permanentBounces.includes(recipient)) return "permanent_bounce";
  return null;
}

async function sendNotification(env: LeadEnv, row: StoredLead, icp: IcpMatchResult) {
  const accountId = normalizeText(env.EMAIL_API_ACCOUNT_ID);
  const token = normalizeText(env.EMAIL_API_TOKEN);
  const to = normalizeText(env.LEAD_NOTIFICATION_TO);
  const from = normalizeText(env.LEAD_NOTIFICATION_FROM);
  if (!accountId || !token || !to || !from || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) return "not_configured";

  const notification = buildLeadNotification({ lead: leadFromRow(row), context: contextFromRow(row), icp, createdAt: row.created_at });
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/email/sending/send`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        to,
        from,
        subject: notification.subject,
        text: notification.text,
        html: notification.html,
        headers: { "Reply-To": notification.replyTo },
      }),
    });
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    return notificationResult(response.status, payload, to);
  } catch {
    return "network";
  }
}

function queueNotification(context: LeadRequestContext, row: StoredLead, retry: boolean) {
  const task = (async () => {
    const now = new Date().toISOString();
    const expectedStatus = retry ? "failed" : "pending";
    const maxAttempts = retry ? 2 : 1;
    const attempt = await context.env.LEADS_DB!.prepare(`UPDATE leads
      SET notification_status = 'pending', notification_attempts = notification_attempts + 1,
          notification_started_at = ?1, updated_at = ?1
      WHERE id = ?2 AND notification_status = ?3 AND notification_attempts < ?4`).bind(now, row.id, expectedStatus, maxAttempts).run();
    if (attempt.meta?.changes === 0) return;

    let failure: string | null = null;
    try {
      const icp = JSON.parse(row.icp_snapshot) as IcpMatchResult;
      failure = await sendNotification(context.env, row, icp);
    } catch {
      failure = "invalid_snapshot";
    }

    const finishedAt = new Date().toISOString();
    try {
      if (failure) {
        await context.env.LEADS_DB!.prepare(`UPDATE leads
          SET notification_status = 'failed', notification_error = ?1, notified_at = NULL, updated_at = ?2
          WHERE id = ?3`).bind(failure, finishedAt, row.id).run();
        console.error("lead.notification_failed", { id: row.id, category: failure });
      } else {
        await context.env.LEADS_DB!.prepare(`UPDATE leads
          SET notification_status = 'sent', notification_error = NULL, notified_at = ?1, updated_at = ?1
          WHERE id = ?2`).bind(finishedAt, row.id).run();
      }
    } catch {
      console.error("lead.notification_state_failed", { id: row.id, category: "d1" });
    }
  })().catch(() => console.error("lead.notification_failed", { id: row.id, category: "internal" }));

  if (context.waitUntil) context.waitUntil(task);
  else return task;
  return undefined;
}

async function selectLead(database: LeadDatabase, submissionKey: string) {
  return database.prepare("SELECT * FROM leads WHERE submission_key = ?1").bind(submissionKey).first<StoredLead>();
}

export async function onRequest(context: LeadRequestContext): Promise<Response> {
  const { request, env } = context;
  if (request.method !== "POST") {
    const response = errorResponse(context, 405, "INVALID_REQUEST");
    response.headers.set("allow", "POST");
    return response;
  }
  if (!configuredOrigins(env.ALLOWED_ORIGINS).length) return errorResponse(context, 503, "CONFIGURATION_ERROR");
  if (!isAllowedOrigin(request, env)) return errorResponse(context, 403, "ORIGIN_NOT_ALLOWED");

  const rawContentType = request.headers.get("content-type") || "";
  const mediaType = rawContentType.split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/x-www-form-urlencoded" && mediaType !== "multipart/form-data") {
    return errorResponse(context, 400, "INVALID_REQUEST");
  }

  const parsed = await parseFormData(request, rawContentType);
  if (parsed === "too_large") return errorResponse(context, 413, "INVALID_REQUEST");
  if (parsed === "invalid") return errorResponse(context, 400, "INVALID_REQUEST");
  const input = formDataRecord(parsed);
  if (!input.referrer) input.referrer = request.headers.get("referer") || "";
  if (normalizeText(input.website)) return errorResponse(context, 400, "INVALID_REQUEST");

  const leadResult = validateLead(input);
  if (!leadResult.ok) return errorResponse(context, 422, "VALIDATION_ERROR", leadResult.fields as Record<string, string>);
  const contextResult = validateContext(input);
  if (!contextResult.ok) return errorResponse(context, 422, "VALIDATION_ERROR", contextResult.fields);

  const suppliedKey = normalizeText(input.submission_key);
  if (suppliedKey && !uuidPattern.test(suppliedKey)) return errorResponse(context, 422, "VALIDATION_ERROR", { submission_key: "Use a valid submission key." });
  const submissionKey = suppliedKey || crypto.randomUUID();
  const turnstileSecret = normalizeText(env.TURNSTILE_SECRET_KEY);
  if (!turnstileSecret) return errorResponse(context, 503, "CONFIGURATION_ERROR");
  const turnstile = await verifyTurnstile(normalizeText(input["cf-turnstile-response"]), turnstileSecret, submissionKey);
  if (turnstile === "unavailable") return errorResponse(context, 503, "TURNSTILE_UNAVAILABLE");
  if (turnstile !== "ok") return errorResponse(context, 403, "TURNSTILE_FAILED");
  if (!env.LEADS_DB) return errorResponse(context, 503, "CONFIGURATION_ERROR");

  const lead = leadResult.value;
  const sourceContext = contextResult.value;
  const icp = matchIcp(icpContext(lead, sourceContext));
  const createdAt = new Date().toISOString();
  const id = crypto.randomUUID();
  let existingBefore: StoredLead | null = null;

  try {
    existingBefore = await selectLead(env.LEADS_DB, submissionKey);
    if (!existingBefore) {
      await env.LEADS_DB.prepare(`INSERT OR IGNORE INTO leads (
        id, submission_key, created_at, updated_at, name, company, company_type, email, country, cf_country, phone,
        application, timeline, message, product_slug, solution_slug, application_slug, page_path,
        source_component, locale, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        consent_at, icp_decision, icp_top_match, icp_score, icp_band, icp_rule_version, icp_snapshot,
        notification_status, notification_attempts, notification_error, notification_started_at, notified_at
      ) VALUES (
        ?1, ?2, ?3, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19,
        ?20, ?21, ?22, ?23, ?24, ?25, ?3, ?26, ?27, ?28, ?29, ?30, ?31, ?32, ?33, ?34, NULL, NULL, NULL
      )`).bind(
        id,
        submissionKey,
        createdAt,
        lead.name,
        lead.company,
        lead.companyType,
        lead.email,
        lead.country,
        inferredCountry(request),
        lead.phone || null,
        lead.application,
        lead.timeline || null,
        lead.requirements,
        sourceContext.productSlug || null,
        sourceContext.solutionSlug || null,
        sourceContext.applicationSlug || null,
        sourceContext.pagePath,
        sourceContext.sourceComponent,
        sourceContext.locale,
        sourceContext.referrer || null,
        sourceContext.utmSource || null,
        sourceContext.utmMedium || null,
        sourceContext.utmCampaign || null,
        sourceContext.utmContent || null,
        sourceContext.utmTerm || null,
        icp.decision,
        icp.matches[0]?.icpSlug || null,
        icp.matches[0]?.fitScore ?? null,
        icp.matches[0]?.fitBand || null,
        icp.ruleVersion,
        JSON.stringify(icp),
        "pending",
        0,
        null,
      ).run();
    }

    const stored = await selectLead(env.LEADS_DB, submissionKey);
    if (!stored) return errorResponse(context, 503, "DATABASE_ERROR");
    if (!existingBefore && stored.id === id) queueNotification(context, stored, false);
    else if (stored.notification_status === "failed" && Number(stored.notification_attempts) < 2) queueNotification(context, stored, true);
    return successResponse(context);
  } catch {
    console.error("lead.persistence_failed", { category: "d1" });
    return errorResponse(context, 503, "DATABASE_ERROR");
  }
}
