export const applications = [
  "EV dealership",
  "Roadside assistance",
  "Fleet charging",
  "Commercial property",
  "Construction / temporary site",
  "Distributor / partnership",
  "Other",
] as const;

export const purchaseTimelines = [
  "Within 3 months",
  "3–6 months",
  "More than 6 months",
  "Researching options",
] as const;

type Application = (typeof applications)[number];
type PurchaseTimeline = (typeof purchaseTimelines)[number];

export type LeadInput = {
  name: string;
  company: string;
  email: string;
  country: string;
  application: Application | "";
  phone: string;
  timeline: PurchaseTimeline | "";
  requirements: string;
  privacyConsent: boolean;
};

export type LeadValidation =
  | { ok: true; value: LeadInput }
  | { ok: false; fields: Partial<Record<keyof LeadInput, string>> };

const hasValue = <T extends readonly string[]>(values: T, value: string): value is T[number] =>
  (values as readonly string[]).includes(value);

export function normalizeText(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\t ]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizeEmailHeader(value: string): string {
  return normalizeText(value).replace(/\n+/g, " ");
}

export function validateLead(input: Record<string, unknown>): LeadValidation {
  const value: LeadInput = {
    name: normalizeText(input.name),
    company: normalizeText(input.company),
    email: normalizeText(input.email).toLowerCase(),
    country: normalizeText(input.country),
    application: normalizeText(input.application) as LeadInput["application"],
    phone: normalizeText(input.phone),
    timeline: normalizeText(input.timeline) as LeadInput["timeline"],
    requirements: normalizeText(input.requirements),
    privacyConsent: input.privacyConsent === true || input.privacyConsent === "true" || input.privacyConsent === "on",
  };
  const fields: Partial<Record<keyof LeadInput, string>> = {};

  if (value.name.length < 2 || value.name.length > 80) fields.name = "Enter a name between 2 and 80 characters.";
  if (value.company.length < 2 || value.company.length > 120) fields.company = "Enter a company name between 2 and 120 characters.";
  if (value.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) fields.email = "Enter a valid business email.";
  if (value.country.length < 2 || value.country.length > 80) fields.country = "Enter a country or region between 2 and 80 characters.";
  if (!hasValue(applications, value.application)) fields.application = "Choose an application.";
  if (value.phone.length > 50) fields.phone = "Enter no more than 50 characters.";
  if (value.timeline && !hasValue(purchaseTimelines, value.timeline)) fields.timeline = "Choose a valid purchase timeline.";
  if (value.requirements.length < 20 || value.requirements.length > 2000) fields.requirements = "Enter requirements between 20 and 2,000 characters.";
  if (!value.privacyConsent) fields.privacyConsent = "Consent is required to send an inquiry.";

  return Object.keys(fields).length ? { ok: false, fields } : { ok: true, value };
}
