import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeEmailHeader, validateLead } from "../functions/lib/lead.ts";

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
