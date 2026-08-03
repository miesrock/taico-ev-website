import assert from "node:assert/strict";
import test from "node:test";

import { onRequest, type LeadEnv } from "../functions/api/leads.ts";
import { sanitizeEmailHeader, validateLead, validateLeadContext } from "../functions/lib/lead.ts";

const validLead = {
  name: "  Avery  Lee ",
  company: "Northstar Mobility",
  email: "AVERY@EXAMPLE.COM",
  country: "United Kingdom",
  application: "Fleet charging",
  phone: "+44 20 1234 5678",
  timeline: "Within 3 months",
  requirements: "We need mobile charging for a new electric delivery fleet.",
  privacyConsent: "on",
};

test("accepts and normalizes a valid inquiry", () => {
  const result = validateLead(validLead);

  assert.deepEqual(result, {
    ok: true,
    value: {
      ...validLead,
      name: "Avery  Lee",
      email: "avery@example.com",
      privacyConsent: true,
    },
  });
});

test("returns field errors at required and length boundaries", () => {
  const result = validateLead({
    ...validLead,
    name: "A",
    company: "",
    email: "not-an-email",
    country: "",
    application: "Unknown",
    requirements: "Too short",
    privacyConsent: false,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.deepEqual(Object.keys(result.fields).sort(), [
      "application",
      "company",
      "country",
      "email",
      "name",
      "privacyConsent",
      "requirements",
    ]);
  }
});

test("rejects invalid optional values and ignores unknown input", () => {
  const result = validateLead({
    ...validLead,
    phone: "x".repeat(51),
    timeline: "Tomorrow",
    unexpected: "must not reach the validated value",
  });

  assert.equal(result.ok, false);
  if (!result.ok) assert.deepEqual(Object.keys(result.fields).sort(), ["phone", "timeline"]);
});

test("normalizes line endings and removes newlines from email headers", () => {
  const result = validateLead({
    ...validLead,
    requirements: "Line one\r\n\r\n\r\nLine two with spaces   \r\n",
  });

  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.requirements, "Line one\n\nLine two with spaces");
  assert.equal(sanitizeEmailHeader("TAICO\r\nBcc: attacker@example.com"), "TAICO Bcc: attacker@example.com");
});

test("validates controlled source context and drops unknown fields from its value", () => {
  const result = validateLeadContext({ source: "product-detail", product: "tkmc-800", unexpected: "ignored" });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.productSlug, "tkmc-800");
    assert.equal("unexpected" in result.value, false);
  }
});

class FakeDatabase {
  row: Record<string, unknown> | null = null;
  failInsert = false;
  insertCount = 0;

  prepare(query: string) {
    return {
      bind: (...values: unknown[]) => ({
        first: async <T>() => query.startsWith("SELECT") ? this.row as T | null : null,
        run: async () => {
          if (query.startsWith("INSERT")) {
            if (this.failInsert) throw new Error("d1 unavailable");
            if (this.row) return { meta: { changes: 0 } };
            this.insertCount += 1;
            this.row = {
              id: values[0],
              submission_key: values[1],
              created_at: values[2],
              updated_at: values[2],
              name: values[3],
              company: values[4],
              email: values[5],
              country: values[6],
              phone: values[8],
              application: values[9],
              timeline: values[10],
              message: values[11],
              product_slug: values[12],
              solution_slug: values[13],
              application_slug: values[14],
              page_path: values[15],
              source_component: values[16],
              locale: values[17],
              referrer: values[18],
              utm_source: values[19],
              utm_medium: values[20],
              utm_campaign: values[21],
              utm_content: values[22],
              utm_term: values[23],
              icp_decision: values[24],
              icp_top_match: values[25],
              icp_score: values[26],
              icp_band: values[27],
              icp_rule_version: values[28],
              icp_snapshot: values[29],
              notification_status: values[30],
              notification_attempts: values[31],
              notification_error: values[32],
            };
            return { meta: { changes: 1 } };
          }
          if (query.includes("SET notification_status = 'pending'")) {
            const [startedAt, id, expectedStatus, maxAttempts] = values;
            if (this.row?.id === id && this.row.notification_status === expectedStatus && Number(this.row.notification_attempts) < Number(maxAttempts)) {
              this.row.notification_status = "pending";
              this.row.notification_attempts = Number(this.row.notification_attempts) + 1;
              this.row.notification_started_at = startedAt;
              return { meta: { changes: 1 } };
            }
            return { meta: { changes: 0 } };
          }
          if (query.includes("SET notification_status = 'failed'")) {
            const [error, updatedAt, id] = values;
            if (this.row?.id === id) {
              this.row.notification_status = "failed";
              this.row.notification_error = error;
              this.row.updated_at = updatedAt;
            }
            return { meta: { changes: 1 } };
          }
          if (query.includes("SET notification_status = 'sent'")) {
            const [notifiedAt, id] = values;
            if (this.row?.id === id) {
              this.row.notification_status = "sent";
              this.row.notified_at = notifiedAt;
            }
            return { meta: { changes: 1 } };
          }
          return { meta: { changes: 1 } };
        },
      }),
    };
  }
}

const validRequest = {
  ...validLead,
  application: "Roadside assistance",
  requirements: "We need mobile charging for roadside EV rescue operations.",
  submission_key: "11111111-1111-4111-8111-111111111111",
  source: "product-detail",
  product: "tkmc-800",
  solution: "emergency-ev-charging",
  application_context: "roadside-ev-rescue",
  page_path: "/products/tkmc-800/",
  "cf-turnstile-response": "turnstile-token",
};

const leadEnv = (database: FakeDatabase, overrides: Partial<LeadEnv> = {}): LeadEnv => ({
  LEADS_DB: database,
  TURNSTILE_SECRET_KEY: "turnstile-secret",
  EMAIL_API_ACCOUNT_ID: "account-id",
  EMAIL_API_TOKEN: "email-token",
  LEAD_NOTIFICATION_TO: "sales@example.com",
  LEAD_NOTIFICATION_FROM: "noreply@example.com",
  ALLOWED_ORIGINS: "https://taicoev.com",
  ...overrides,
});

async function submitLead(database: FakeDatabase, body = validRequest, overrides: Partial<LeadEnv> = {}, emailOk = true, accept = "application/json") {
  const pending: Promise<unknown>[] = [];
  const originalFetch = globalThis.fetch;
  let emailCalls = 0;
  globalThis.fetch = async (input) => {
    if (String(input).includes("siteverify")) return Response.json({ success: true });
    emailCalls += 1;
    return emailOk ? Response.json({ success: true, result: { delivered: ["sales@example.com"] } }) : Response.json({ success: false }, { status: 400 });
  };
  try {
    const response = await onRequest({
      request: new Request("https://taicoev.com/api/leads", {
        method: "POST",
        headers: {
          origin: "https://taicoev.com",
          accept,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(body),
      }),
      env: leadEnv(database, overrides),
      waitUntil: (promise) => pending.push(promise),
    });
    await Promise.all(pending);
    return { response, emailCalls };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("stores a server-derived ICP snapshot and ignores client ICP fields", async () => {
  const database = new FakeDatabase();
  const { response } = await submitLead(database, { ...validRequest, icp_decision: "matched", icp_top_match: "forged", icp_score: "100" });

  assert.equal(response.status, 200);
  assert.equal(database.row?.icp_top_match, "roadside-assistance-provider");
  assert.notEqual(database.row?.icp_top_match, "forged");
  const snapshot = JSON.parse(String(database.row?.icp_snapshot));
  assert.equal(snapshot.decision, "matched");
  assert.equal(snapshot.ruleVersion, "0.1.0");
  assert.equal(snapshot.matches[0].fitScore, 100);
  assert.equal(snapshot.eligibleForPublicUse, false);
});

test("same submission key is idempotent and sends one notification", async () => {
  const database = new FakeDatabase();
  const first = await submitLead(database);
  const second = await submitLead(database);

  assert.equal(first.response.status, 200);
  assert.equal(second.response.status, 200);
  assert.equal(database.insertCount, 1);
  assert.equal(first.emailCalls + second.emailCalls, 1);
  assert.equal(database.row?.notification_status, "sent");
});

test("native form submission redirects after D1 persistence", async () => {
  const database = new FakeDatabase();
  const { response } = await submitLead(database, validRequest, {}, true, "text/html");

  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "https://taicoev.com/thank-you/");
});

test("D1 failure never returns success", async () => {
  const database = new FakeDatabase();
  database.failInsert = true;
  const { response } = await submitLead(database);

  assert.equal(response.status, 503);
  assert.equal(JSON.parse(await response.text()).ok, false);
});

test("notification failure preserves the saved inquiry and marks it failed", async () => {
  const database = new FakeDatabase();
  const { response } = await submitLead(database, validRequest, {}, false);

  assert.equal(response.status, 200);
  assert.equal(database.row?.notification_status, "failed");
  assert.equal(database.row?.notification_error, "provider_400");
});
