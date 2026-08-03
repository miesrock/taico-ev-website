import { companyTypes, type CompanyType, type IcpMatchResult } from "../../src/lib/icp/types.ts";

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

export const companyTypeLabels = {
  roadside_assistance: "Roadside assistance provider",
  ev_mobility_service_provider: "EV mobility service provider",
  automotive_club: "Automotive club",
  on_demand_charging_operator: "On-demand EV charging operator",
  fleet_operator: "Fleet operator",
  delivery_fleet_operator: "Delivery fleet operator",
  parking_operator: "Parking operator",
  mobile_charging_service_provider: "Mobile charging service provider",
  temporary_power_provider: "Temporary power provider",
  construction_infrastructure_contractor: "Construction / infrastructure contractor",
  pv_ess_integrator: "PV-ESS integrator",
  installer: "C&I solar installer",
  epc: "EPC / engineering contractor",
  charging_operator: "Charge point operator (CPO)",
  charging_infrastructure_developer: "Charging infrastructure developer",
  distributor: "Distributor / partnership",
  commercial_site_operator: "Commercial site operator",
} satisfies Record<CompanyType, string>;

type Application = (typeof applications)[number];
type PurchaseTimeline = (typeof purchaseTimelines)[number];

export type LeadInput = {
  name: string;
  company: string;
  companyType: CompanyType | "";
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

export type LeadContext = {
  sourceComponent: string;
  productSlug: string;
  solutionSlug: string;
  applicationSlug: string;
  pagePath: string;
  locale: "en";
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
};

export type LeadContextValidation =
  | { ok: true; value: LeadContext }
  | { ok: false; fields: Record<string, string> };

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

export function validateLeadContext(input: Record<string, unknown>): LeadContextValidation {
  const value: LeadContext = {
    sourceComponent: normalizeText(input.source).toLowerCase() || "contact-page",
    productSlug: normalizeText(input.product).toLowerCase(),
    solutionSlug: normalizeText(input.solution).toLowerCase(),
    applicationSlug: normalizeText(input.application_context).toLowerCase(),
    pagePath: normalizeText(input.page_path) || "/contact/",
    locale: "en",
    referrer: normalizeText(input.referrer),
    utmSource: normalizeText(input.utm_source),
    utmMedium: normalizeText(input.utm_medium),
    utmCampaign: normalizeText(input.utm_campaign),
    utmContent: normalizeText(input.utm_content),
    utmTerm: normalizeText(input.utm_term),
  };
  const fields: Record<string, string> = {};

  if (!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(value.sourceComponent)) fields.source = "Enter a valid source.";
  if (!/^\/[\x20-\x7e]{0,199}$/.test(value.pagePath)) fields.page_path = "Enter a valid page path.";
  if (value.referrer.length > 500 || (value.referrer && !/^https?:\/\//i.test(value.referrer))) {
    fields.referrer = "Enter a valid referrer.";
  }
  if (value.productSlug.length > 80) fields.product = "Enter a valid product context.";
  if (value.solutionSlug.length > 80) fields.solution = "Enter a valid solution context.";
  if (value.applicationSlug.length > 80) fields.application_context = "Enter a valid application context.";
  if (value.utmSource.length > 100) fields.utm_source = "Enter a shorter campaign source.";
  if (value.utmMedium.length > 100) fields.utm_medium = "Enter a shorter campaign medium.";
  if (value.utmCampaign.length > 100) fields.utm_campaign = "Enter a shorter campaign name.";
  if (value.utmContent.length > 100) fields.utm_content = "Enter a shorter campaign content value.";
  if (value.utmTerm.length > 100) fields.utm_term = "Enter a shorter campaign term.";

  return Object.keys(fields).length ? { ok: false, fields } : { ok: true, value };
}

export function validateLead(input: Record<string, unknown>): LeadValidation {
  const value: LeadInput = {
    name: normalizeText(input.name),
    company: normalizeText(input.company),
    companyType: normalizeText(input.companyType) as LeadInput["companyType"],
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
  if (!hasValue(companyTypes, value.companyType)) fields.companyType = "Choose a company type.";
  if (value.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) fields.email = "Enter a valid business email.";
  if (value.country.length < 2 || value.country.length > 80) fields.country = "Enter a country or region between 2 and 80 characters.";
  if (!hasValue(applications, value.application)) fields.application = "Choose an application.";
  if (value.phone.length > 50) fields.phone = "Enter no more than 50 characters.";
  if (value.timeline && !hasValue(purchaseTimelines, value.timeline)) fields.timeline = "Choose a valid purchase timeline.";
  if (value.requirements.length < 20 || value.requirements.length > 2000) fields.requirements = "Enter requirements between 20 and 2,000 characters.";
  if (!value.privacyConsent) fields.privacyConsent = "Consent is required to send an inquiry.";

  return Object.keys(fields).length ? { ok: false, fields } : { ok: true, value };
}

export type LeadNotificationInput = {
  lead: LeadInput;
  context: LeadContext;
  icp: IcpMatchResult;
  createdAt: string;
};

export type LeadNotification = {
  subject: string;
  replyTo: string;
  text: string;
  html: string;
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[character] ?? character));

const htmlText = (value: string) => escapeHtml(value).replace(/\n/g, "<br />");

export function buildLeadNotification({ lead, context, icp, createdAt }: LeadNotificationInput): LeadNotification {
  const topMatch = icp.matches[0];
  const subject = sanitizeEmailHeader(`[TAICO EV Lead] ${lead.country} · ${lead.application} · ${lead.company}`);
  const rows = [
    ["Contact", lead.name],
    ["Company", lead.company],
    ["Company type", lead.companyType ? companyTypeLabels[lead.companyType] : "Not provided"],
    ["Country / region", lead.country],
    ["Work email", lead.email],
    ["Phone / WhatsApp", lead.phone || "Not provided"],
    ["Application", lead.application],
    ["Purchase timeline", lead.timeline || "Not provided"],
    ["Product", context.productSlug || "Not provided"],
    ["Solution", context.solutionSlug || "Not provided"],
    ["Application context", context.applicationSlug || "Not provided"],
    ["Source", context.sourceComponent],
    ["Page path", context.pagePath],
    ["Referrer", context.referrer || "Not provided"],
    ["UTM", [context.utmSource, context.utmMedium, context.utmCampaign, context.utmContent, context.utmTerm].filter(Boolean).join(" / ") || "Not provided"],
    ["ICP decision", icp.decision],
    ["ICP top match", topMatch?.icpSlug || "Not matched"],
    ["ICP score / band", topMatch ? `${topMatch.fitScore} / ${topMatch.fitBand}` : "Not matched"],
    ["ICP rule version", icp.ruleVersion],
    ["Submitted at", createdAt],
  ] as const;
  const text = [
    subject,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Requirements:",
    lead.requirements,
  ].join("\n");
  const html = `<h1>${escapeHtml(subject)}</h1><table>${rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${htmlText(value)}</td></tr>`).join("")}</table><h2>Requirements</h2><p>${htmlText(lead.requirements)}</p>`;

  return { subject, replyTo: sanitizeEmailHeader(lead.email), text, html };
}
