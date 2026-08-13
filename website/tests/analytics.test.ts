import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync(new URL("../src/layouts/Layout.astro", import.meta.url), "utf8");
const leadForm = readFileSync(new URL("../src/components/LeadForm.astro", import.meta.url), "utf8");

test("initializes consent mode before loading the Google tag", () => {
  const defaultConsent = layout.indexOf('window.gtag("consent", "default"');
  const googleTag = layout.indexOf("https://www.googletagmanager.com/gtag/js?id=${measurementId}");

  assert.ok(defaultConsent >= 0);
  assert.ok(googleTag > defaultConsent);
  for (const key of ["ad_storage", "analytics_storage", "ad_user_data", "ad_personalization"]) {
    assert.match(layout.slice(defaultConsent, googleTag), new RegExp(`${key}: "denied"`));
  }
  assert.match(layout, /data-analytics-consent/);
  assert.match(layout, /data-analytics-consent-accept/);
  assert.match(layout, /data-analytics-consent-decline/);
  assert.match(layout, /data-analytics-consent-settings/);
  assert.match(layout, /policies\.google\.com\/technologies\/partner-sites/);
  assert.match(layout, /__taicoLoadGoogleTag/);
});

test("reports one non-PII lead event before redirecting", () => {
  const event = leadForm.indexOf('"generate_lead"');
  const redirect = leadForm.indexOf('window.location.assign("/thank-you/")');
  const contextStart = leadForm.indexOf("const context =");
  const contextEnd = leadForm.indexOf("};", contextStart);
  const context = leadForm.slice(contextStart, contextEnd);

  assert.match(leadForm, /let leadEventSent = false/);
  assert.ok(event >= 0 && redirect > event);
  assert.match(leadForm, /event_callback: finish/);
  assert.match(leadForm, /event_timeout: 900/);
  assert.match(leadForm, /window\.setTimeout\(finish, 1000\)/);
  assert.ok(contextStart >= 0 && contextEnd > contextStart);
  for (const field of ["name", "company", "email", "phone", "requirements"]) {
    assert.doesNotMatch(context, new RegExp(`\\b${field}\\b`));
  }
});
