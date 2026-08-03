export const site = {
  name: "TAICO EV",
  domain: 'taicoev.com',
  logo: "/brand/taico-mark.png",
  email: "sales12@taicopower.com",
  emailHref: "mailto:sales12@taicopower.com?subject=TaicoEV Inquiry"
};

export type ContactContext = {
  source?: string;
  product?: string;
  solution?: string;
  application?: string;
  page?: string;
};

export function contactHref(context: ContactContext = {}) {
  const params = new URLSearchParams({ source: context.source || "contact-cta" });
  for (const [key, value] of Object.entries(context)) {
    if (key !== "source" && value) params.set(key, value);
  }
  return `/contact/?${params}`;
}
