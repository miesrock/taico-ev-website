# TAICO EV ICP Candidate Matrix

**Status:** Internal research draft — not public or CRM-ready  
**Scope:** Global export, generic; TAICO MC 2026 Catalog v1.3, pages 4–11  
**Technical evidence record:** [`website/src/data/products.ts`](../website/src/data/products.ts)  
**Last reviewed:** 2026-07-31

## Governance boundary

This document records product-to-organisation hypotheses for research. The catalog supports the product models and the exact **Catalog Use Cases** below; it does not confirm buyers, countries, market availability, customer references, demand, urgency, revenue, or TAICO commercial fit.

`relationshipId` is the stable internal key for one product–ICP candidate. An ICP is not a public segment, customer claim, CRM segment, or go-to-market decision.

## Definitions and promotion gates

- **Product/scenario fit (1–5):** How directly the exact catalog Use Case supports researching the candidate scenario; 5 is direct, 1 is remote.
- **Cross-market reusability (1–5):** Research hypothesis about how broadly the candidate can be investigated across export markets; it does not select countries or establish availability.
- **Buying urgency (1–5):** Research hypothesis about the time sensitivity of the scenario; it is not a market finding or public claim.
- **Research priority:** `product/scenario fit + cross-market reusability + buying urgency` (maximum 15). High: 12–15; Medium: 8–11; Low: 3–7. It orders research only.
- **TAICO commercial fit:** Always `TBD — sales confirmation required` at this stage; it is excluded from the research score and cannot create a GTM priority.
- **Evidence levels:** E0 = unlinked hypothesis; E1 = catalog Use Case linked; E2 = sales-confirmed relationship; E3 = customer-validated relationship; E4 = revenue-proven relationship. All current rows are E1.
- **CRM gate:** Blocked until E2, a named commercial owner, and explicit CRM-segment approval. E2 does not automatically create a CRM segment.
- **Public gate:** Blocked until E3, current-market and public-wording approval, and customer consent where customer evidence is used. E3/E4 do not automatically create public claims.

## 1. ICP Registry

The registry defines candidate organisation types once. It does not assert that any organisation buys, operates, distributes, or qualifies for a TAICO product.

| `icpId` | `icpSlug` | Candidate organisation | Internal definition | Scope | Default evidence / status |
| --- | --- | --- | --- | --- | --- |
| `icp-01` | `roadside-assistance-provider` | EV roadside-assistance provider | Organisation that may coordinate roadside EV support | Global export, generic | E1 candidate; internal only |
| `icp-02` | `ev-mobility-service-provider` | EV mobility service provider | Organisation that may operate EV mobility services | Global export, generic | E1 candidate; internal only |
| `icp-03` | `automotive-club` | Automotive club | Membership organisation that may provide vehicle-support services | Global export, generic | E1 candidate; internal only |
| `icp-04` | `on-demand-ev-charging-operator` | On-demand EV charging service operator | Organisation that may dispatch or operate on-demand charging | Global export, generic | E1 candidate; internal only |
| `icp-05` | `fleet-operator` | EV fleet operator | Organisation that may manage an EV fleet | Global export, generic | E1 candidate; internal only |
| `icp-06` | `delivery-fleet-operator` | Delivery fleet operator | Organisation that may manage delivery vehicles | Global export, generic | E1 candidate; internal only |
| `icp-07` | `parking-operator` | Parking operator | Organisation that may manage parking facilities | Global export, generic | E1 candidate; internal only |
| `icp-08` | `mobile-ev-charging-service-provider` | Mobile EV charging service operator | Organisation that may operate mobile EV charging services | Global export, generic | E1 candidate; internal only |
| `icp-09` | `temporary-power-provider` | Temporary-power service provider | Organisation that may deploy temporary power for events, construction, or emergencies | Global export, generic | E1 candidate; internal only |
| `icp-10` | `construction-infrastructure-contractor` | Construction and infrastructure contractor | Organisation that may deliver construction or infrastructure work | Global export, generic | E1 candidate; internal only |
| `icp-11` | `pv-ess-integrator` | PV-ESS integrator | Organisation that may integrate PV and energy-storage systems | Global export, generic | E1 candidate; internal only |
| `icp-12` | `ci-solar-installer` | C&I solar installer | Organisation that may install commercial and industrial solar systems | Global export, generic | E1 candidate; internal only |
| `icp-13` | `microgrid-epc` | Microgrid EPC | Organisation that may engineer, procure, or construct microgrids | Global export, generic | E1 candidate; internal only |
| `icp-14` | `charge-point-operator` | Charge point operator (CPO) | Organisation that may operate EV charge points | Global export, generic | E1 candidate; internal only |
| `icp-15` | `charging-infrastructure-developer` | Charging-infrastructure developer | Organisation that may develop charging infrastructure | Global export, generic | E1 candidate; internal only |

## 2. Product–ICP Fit Matrix

Each row is one retained catalog-backed candidate. The commercial relationship and fit score are internal hypotheses, not catalog claims; they do not identify a person or a buying-committee role.

| `relationshipId` | Product (catalog page) | Exact Catalog Use Case(s) | `icpId` / `icpSlug` | Candidate commercial relationship | Evidence | Product/scenario fit (1–5) |
| --- | --- | --- | --- | --- | ---: |
| `rel-tkmc-800-1500-roadside-assistance` | TKMC-800 (4); TKMC-1500 (5) | Mobile Charger; Roadside EV Rescue | `icp-01` / `roadside-assistance-provider` | Potential buyer or operating user | E1 | 5 |
| `rel-tkmc-800-1500-ev-mobility` | TKMC-800 (4); TKMC-1500 (5) | Mobile Charger; Roadside EV Rescue | `icp-02` / `ev-mobility-service-provider` | Potential buyer or operating user | E1 | 3 |
| `rel-tkmc-800-1500-automotive-club` | TKMC-800 (4); TKMC-1500 (5) | Mobile Charger; Roadside EV Rescue | `icp-03` / `automotive-club` | Potential channel, buyer, or operator | E1 | 3 |
| `rel-tkmc-1000-on-demand-operator` | TKMC-1000 (6) | Mobile EV Charger | `icp-04` / `on-demand-ev-charging-operator` | Potential buyer or operating user | E1 | 5 |
| `rel-tkmc-1000-fleet-operator` | TKMC-1000 (6) | Mobile EV Charger | `icp-05` / `fleet-operator` | Potential buyer or operating user | E1 | 3 |
| `rel-tkmc-1000-delivery-fleet` | TKMC-1000 (6) | Mobile EV Charger | `icp-06` / `delivery-fleet-operator` | Potential buyer or operating user | E1 | 2 |
| `rel-tkmc-1000-parking-operator` | TKMC-1000 (6) | Mobile EV Charger | `icp-07` / `parking-operator` | Potential buyer or operating user | E1 | 2 |
| `rel-tkmc-2000p-mobile-charging-service` | TKMC-2000P (7) | Mobile Charger; AC Output | `icp-08` / `mobile-ev-charging-service-provider` | Potential buyer or operating user | E1 | 4 |
| `rel-tkmc-2000p-temporary-power` | TKMC-2000P (7) | Mobile Charger; AC Output | `icp-09` / `temporary-power-provider` | Potential buyer, operator, or channel | E1 | 4 |
| `rel-tkmc-4000-construction-infrastructure` | TKMC-4000 (8) | Mobile Charger; AC Output; Engineering Power Supply | `icp-10` / `construction-infrastructure-contractor` | Potential operating user or buyer | E1 | 4 |
| `rel-tkmc-4000-temporary-power` | TKMC-4000 (8) | Mobile Charger; AC Output; Engineering Power Supply | `icp-09` / `temporary-power-provider` | Potential buyer, operator, or channel | E1 | 5 |
| `rel-tkmc-4000-mobile-charging-service` | TKMC-4000 (8) | Mobile Charger; AC Output; Engineering Power Supply | `icp-08` / `mobile-ev-charging-service-provider` | Potential buyer or operating user | E1 | 3 |
| `rel-tkmc-10000-pv-ess-integrator` | TKMC-10000 (9) | Mobile Charger; PV Storage Charger; AC Output | `icp-11` / `pv-ess-integrator` | Potential channel, specifier, or buyer | E1 | 5 |
| `rel-tkmc-10000-ci-solar-installer` | TKMC-10000 (9) | Mobile Charger; PV Storage Charger; AC Output | `icp-12` / `ci-solar-installer` | Potential channel or specifier | E1 | 4 |
| `rel-tkmc-10000-microgrid-epc` | TKMC-10000 (9) | Mobile Charger; PV Storage Charger; AC Output | `icp-13` / `microgrid-epc` | Potential channel, specifier, or buyer | E1 | 4 |
| `rel-tkmc-2000-2600-cpo` | TKMC-2000 (10); TKMC-2600 (11) | PV-Storage Charging Station; Grid Complementary System | `icp-14` / `charge-point-operator` | Potential buyer or operating user | E1 | 5 |
| `rel-tkmc-2000-2600-charging-developer` | TKMC-2000 (10); TKMC-2600 (11) | PV-Storage Charging Station; Grid Complementary System | `icp-15` / `charging-infrastructure-developer` | Potential buyer or developer | E1 | 4 |
| `rel-tkmc-2000-2600-pv-ess-integrator` | TKMC-2000 (10); TKMC-2600 (11) | PV-Storage Charging Station; Grid Complementary System | `icp-11` / `pv-ess-integrator` | Potential channel, specifier, or buyer | E1 | 4 |

## 3. Validation & Priority Tracker

All scores below are initial research hypotheses. Research priority is not GTM priority; every row remains blocked from CRM and public use while TAICO commercial fit is unconfirmed.

| `relationshipId` | Cross-market reusability (1–5) | Buying urgency (1–5) | Research score (0–15) | Research priority | TAICO commercial fit | Evidence / validation status | CRM promotion gate | Public promotion gate |
| --- | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| `rel-tkmc-800-1500-roadside-assistance` | 5 | 4 | 14 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-800-1500-ev-mobility` | 4 | 3 | 10 | Medium | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-800-1500-automotive-club` | 4 | 3 | 10 | Medium | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-1000-on-demand-operator` | 5 | 4 | 14 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-1000-fleet-operator` | 5 | 4 | 12 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-1000-delivery-fleet` | 5 | 4 | 11 | Medium | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-1000-parking-operator` | 5 | 3 | 10 | Medium | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-2000p-mobile-charging-service` | 5 | 4 | 13 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-2000p-temporary-power` | 5 | 4 | 13 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-4000-construction-infrastructure` | 5 | 4 | 13 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-4000-temporary-power` | 5 | 4 | 14 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-4000-mobile-charging-service` | 5 | 4 | 12 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-10000-pv-ess-integrator` | 5 | 3 | 13 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-10000-ci-solar-installer` | 4 | 3 | 11 | Medium | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-10000-microgrid-epc` | 4 | 3 | 11 | Medium | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-2000-2600-cpo` | 5 | 4 | 14 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-2000-2600-charging-developer` | 5 | 3 | 12 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |
| `rel-tkmc-2000-2600-pv-ess-integrator` | 5 | 3 | 12 | High | TBD — sales confirmation required | E1 — validate buyer, operator, country, and configuration | Blocked: E2 + owner + CRM approval | Blocked: E3 + market, wording, and consent approval |

## Buyer-group validation record

Complete one record for a `relationshipId` before proposing E2. These fields deliberately separate the account type from the people and organisations involved in a purchase.

| Field | Required E2 evidence |
| --- | --- |
| Economic buyer | Role or department, decision authority, and evidence source |
| Operating user | Role or team that would operate the product, and evidence source |
| Technical evaluator / influencer | Role or team that specifies, approves, or influences the configuration |
| Channel role | Reseller, rental partner, installer, EPC, or `None`; do not infer it from the account type |
| Account qualification | Industry, operating scale, geography, and exclusion / no-fit condition |
| Product configuration | Model, connector / configuration requirement, and deployment scenario |
| Commercial evidence | Sales call, opportunity, signed validation, or other dated source; named owner and review date |

Historical strategy, customer-segment, case-study, and market material remain excluded from this matrix. The internal [`ICP Archive Signal Register`](./icp-archive-signal-register.md) is an E0 lead source until revalidated.
