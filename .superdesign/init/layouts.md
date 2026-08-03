# Shared layouts

## Layout
- Source: `website/src/layouts/Layout.astro`
- Description: Global document shell, theme initialization, header, main slot, and footer.

```astro
---
import "../styles/global.css";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";

interface Props {
  title?: string;
  description?: string;
}

const {
  title = "TAICO EV | Mobile Energy Solutions Beyond the Grid",
  description = "Mobile and stationary energy storage charging systems for roadside EV rescue, on-demand charging, AC output, engineering power supply, and PV-storage charging applications.",
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#04060c" />
    <script is:inline>
      (() => {
        try {
          if (localStorage.getItem("taico-theme") === "light") {
            document.documentElement.dataset.theme = "light";
            document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#f4f7fb");
          }
        } catch {}
      })();
    </script>
    <meta name="generator" content={Astro.generator} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/syabro/neat-annotations/neat-annotations.css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Orbitron:wght@500;600;700&family=Shantell+Sans:wght@400;500;600&family=Sora:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>{title}</title>
  </head>
  <body class="flex min-h-screen flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>

```

## Header
- Source: `website/src/components/Header.astro`
- Description: Responsive header with desktop mega-menu, mobile dialog navigation, and theme switch.

```astro
---
import { applications } from "../data/applications";
import { resourceLinks, primaryNavigation } from "../data/navigation";
import { getProduct, getPublishedProducts, productCategories } from "../data/products";
import { site } from "../data/site";
import { solutions } from "../data/solutions";

const products = getPublishedProducts();
const productGroups = productCategories.map((category) => ({
  ...category,
  products: products.filter((product) => product.category === category.slug),
}));
const featuredProduct = getProduct("tkmc-800");
---

<header data-site-header class="sticky top-0 z-50 border-b border-line bg-void/82 backdrop-blur-xl">
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
    <a href="/" class="group flex shrink-0 items-center gap-3" aria-label="TAICO EV home">
      <img
        src="/brand/taico-mark.png"
        alt=""
        class="h-7 w-auto rounded-sm shadow-[0_0_18px_-4px_rgba(34,211,238,0.45)]"
        width="96"
        height="28"
      />
      <span class="hidden flex-col leading-tight xl:flex">
        <span class="font-display text-sm font-semibold tracking-[0.12em] text-ink">TAICO EV</span>
        <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">Beyond the Grid</span>
      </span>
    </a>

    <nav class="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
      {
        primaryNavigation.map((item) => (
          <button
            type="button"
            class="nav-trigger rounded-full px-3 py-2 text-sm font-medium text-muted"
            data-menu-trigger
            data-menu={item.key}
            aria-expanded="false"
            aria-controls="site-mega-menu"
          >
            {item.label}
          </button>
        ))
      }
    </nav>

    <div class="flex items-center gap-2">
      <button type="button" class="theme-toggle" aria-label="Switch to light theme" title="Switch color theme">
        <svg class="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3.5"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path>
        </svg>
        <svg class="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.3 15.6A8.5 8.5 0 0 1 8.4 3.7 8.5 8.5 0 1 0 20.3 15.6Z"></path>
        </svg>
      </button>

      <a href={site.emailHref} class="btn-primary hidden !px-4 !py-2 text-sm sm:inline-flex">Talk to a Specialist</a>
      <button
        type="button"
        class="nav-menu-button inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-wave-cyan lg:hidden"
        data-mobile-menu-open
        aria-label="Open navigation menu"
        aria-controls="mobile-navigation"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5 fill-none stroke-current stroke-2">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
    </div>
  </div>

  <div id="site-mega-menu" data-mega-menu hidden aria-hidden="true" class="absolute inset-x-0 top-full border-b border-line bg-void/97 shadow-2xl">
    <div class="mx-auto max-w-6xl px-6 py-8">
      <section data-menu-panel="solutions" hidden aria-label="Solutions">
        <div class="mb-6 flex items-end justify-between gap-4">
          <div>
            <p class="label-tech">Solutions</p>
            <p class="mt-2 text-sm text-muted">Start with the energy challenge, then review suitable hardware.</p>
          </div>
          <a href="/#solutions" class="text-sm font-semibold text-wave-cyan">Explore solutions →</a>
        </div>
        <div class="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_1.15fr]">
          {
            solutions.map((solution) => (
              <a href={`/solutions/${solution.slug}/`} class="nav-panel-card rounded-2xl p-4">
                <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-wave-violet">{solution.eyebrow}</p>
                <h2 class="mt-2 text-sm font-semibold text-ink">{solution.title}</h2>
                <p class="mt-2 text-xs leading-relaxed text-muted">{solution.headline}</p>
              </a>
            ))
          }
          {
            featuredProduct && (
              <a href={`/products/${featuredProduct.slug}/`} class="nav-featured-card rounded-2xl p-4">
                <p class="label-tech">Featured product</p>
                <div class="mt-3 flex items-center gap-3">
                  <img src={featuredProduct.hero} alt="" class="h-16 w-16 rounded-xl object-contain" loading="lazy" />
                  <div>
                    <p class="font-mono text-xs text-wave-cyan">{featuredProduct.model}</p>
                    <p class="mt-1 text-sm font-semibold text-ink">Mobile EV charging</p>
                  </div>
                </div>
                <p class="mt-3 text-xs leading-relaxed text-muted">Explore the TKMC mobile energy storage charging range.</p>
              </a>
            )
          }
        </div>
      </section>

      <section data-menu-panel="products" hidden aria-label="Products">
        <div class="mb-6 flex items-end justify-between gap-4">
          <div>
            <p class="label-tech">Products</p>
            <p class="mt-2 text-sm text-muted">Eight catalog products, grouped by deployment format.</p>
          </div>
          <a href="/products/" class="text-sm font-semibold text-wave-cyan">View all products →</a>
        </div>
        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {
            productGroups.map((group) => (
              <div>
                <div class="mb-3 flex items-center gap-3">
                  {group.products[0] && <img src={group.products[0].hero} alt="" class="h-12 w-12 rounded-xl object-contain" loading="lazy" />}
                  <h2 class="text-sm font-semibold text-ink">{group.title}</h2>
                </div>
                <ul class="space-y-2 border-l border-line pl-3 text-sm">
                  {
                    group.products.map((product) => (
                      <li>
                        <a href={`/products/${product.slug}/`} class="group block text-muted transition hover:text-wave-cyan">
                          <span class="block font-mono text-xs text-wave-cyan">{product.model}</span>
                          <span class="mt-0.5 block text-xs">{product.capacityKwh} kWh · {product.outputPowerKw} kW</span>
                        </a>
                      </li>
                    ))
                  }
                </ul>
              </div>
            ))
          }
        </div>
      </section>

      <section data-menu-panel="applications" hidden aria-label="Applications">
        <div class="mb-6 flex items-end justify-between gap-4">
          <div>
            <p class="label-tech">Applications</p>
            <p class="mt-2 text-sm text-muted">Catalog-supported operating scenarios for the TKMC range.</p>
          </div>
          <a href="/applications/" class="text-sm font-semibold text-wave-cyan">Browse applications →</a>
        </div>
        <div class="grid max-w-3xl gap-3 md:grid-cols-2">
          {
            applications.map((application) => (
              <a href={`/applications/${application.slug}/`} class="nav-compact-link rounded-2xl p-4">
                <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-wave-violet">{application.eyebrow}</p>
                <div class="mt-2 flex items-center justify-between gap-4"><h2 class="text-sm font-semibold text-ink">{application.title}</h2><span aria-hidden="true">→</span></div>
              </a>
            ))
          }
        </div>
      </section>

      <section data-menu-panel="resources" hidden aria-label="Resources">
        <div class="mb-6">
          <p class="label-tech">Resources</p>
          <p class="mt-2 text-sm text-muted">Use catalog facts to compare the range or request project documentation.</p>
        </div>
        <div class="grid max-w-3xl gap-3 md:grid-cols-2">
          {
            resourceLinks.map((resource) => (
              <a href={resource.href} class="nav-compact-link rounded-2xl p-4">
                <h2 class="text-sm font-semibold text-ink">{resource.label}</h2>
                <div class="mt-2 flex items-center justify-between gap-4"><p class="text-xs leading-relaxed text-muted">{resource.description}</p><span class="shrink-0" aria-hidden="true">→</span></div>
              </a>
            ))
          }
        </div>
      </section>
    </div>
  </div>
</header>

<button type="button" data-nav-backdrop hidden aria-label="Close navigation menu"></button>

<dialog id="mobile-navigation" data-mobile-navigation class="mobile-navigation" aria-label="Mobile navigation">
  <div class="flex items-center justify-between border-b border-line px-5 py-4">
    <p class="font-display text-sm font-semibold tracking-[0.12em] text-ink">TAICO EV</p>
    <form method="dialog">
      <button type="submit" class="nav-menu-button inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-wave-cyan" aria-label="Close navigation menu">×</button>
    </form>
  </div>
  <nav class="space-y-2 p-5" aria-label="Mobile navigation">
    <details open>
      <summary>Solutions</summary>
      <ul>
        {solutions.map((solution) => <li><a href={`/solutions/${solution.slug}/`}>{solution.title}</a></li>)}
      </ul>
    </details>
    <details>
      <summary>Products</summary>
      <ul>
        {products.map((product) => <li><a href={`/products/${product.slug}/`}>{product.model} · {product.capacityKwh} kWh</a></li>)}
      </ul>
    </details>
    <details>
      <summary>Applications</summary>
      <ul>
        {applications.map((application) => <li><a href={`/applications/${application.slug}/`}>{application.title}</a></li>)}
      </ul>
    </details>
    <details>
      <summary>Resources</summary>
      <ul>
        {resourceLinks.map((resource) => <li><a href={resource.href}>{resource.label}</a></li>)}
      </ul>
    </details>
    <a href={site.emailHref} class="btn-primary mt-5 w-full">Talk to a Specialist</a>
  </nav>
</dialog>

<script>
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const megaMenu = document.querySelector<HTMLElement>("[data-mega-menu]");
  const backdrop = document.querySelector<HTMLButtonElement>("[data-nav-backdrop]");
  const triggers = [...document.querySelectorAll<HTMLButtonElement>("[data-menu-trigger]")];
  const panels = [...document.querySelectorAll<HTMLElement>("[data-menu-panel]")];
  const mobileDialog = document.querySelector<HTMLDialogElement>("[data-mobile-navigation]");
  const mobileOpen = document.querySelector<HTMLButtonElement>("[data-mobile-menu-open]");
  const themeButton = document.querySelector<HTMLButtonElement>(".theme-toggle");
  const desktopMedia = window.matchMedia("(min-width: 1024px)");
  const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeMenu = "";
  let closeTimer: number | undefined;
  let openTimer: number | undefined;

  const syncThemeButton = () => {
    const isLight = document.documentElement.dataset.theme === "light";
    themeButton?.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    themeButton?.setAttribute("aria-pressed", String(isLight));
  };

  const closeMenu = (returnFocus = false) => {
    window.clearTimeout(closeTimer);
    window.clearTimeout(openTimer);
    if (!activeMenu) return;

    const previousTrigger = triggers.find((trigger) => trigger.dataset.menu === activeMenu);
    activeMenu = "";
    header?.removeAttribute("data-menu-open");
    megaMenu!.hidden = true;
    megaMenu?.setAttribute("aria-hidden", "true");
    backdrop!.hidden = true;
    triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    panels.forEach((panel) => (panel.hidden = true));
    if (returnFocus) previousTrigger?.focus();
  };

  const openMenu = (menu: string) => {
    window.clearTimeout(closeTimer);
    window.clearTimeout(openTimer);
    const panel = panels.find((item) => item.dataset.menuPanel === menu);
    if (!panel || !header || !megaMenu || !backdrop) return;

    activeMenu = menu;
    header.dataset.menuOpen = menu;
    megaMenu.hidden = false;
    megaMenu.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
    triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", String(trigger.dataset.menu === menu)));
    panels.forEach((item) => (item.hidden = item !== panel));
  };

  const scheduleOpen = (menu: string) => {
    window.clearTimeout(openTimer);
    if (menu === activeMenu) return;
    const delay = reducedMotionMedia.matches || activeMenu ? 0 : 120;
    openTimer = window.setTimeout(() => openMenu(menu), delay);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => closeMenu(), reducedMotionMedia.matches ? 0 : 200);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => (activeMenu === trigger.dataset.menu ? closeMenu() : openMenu(trigger.dataset.menu!)));
    trigger.addEventListener("focus", () => openMenu(trigger.dataset.menu!));
    trigger.addEventListener("pointerenter", () => {
      if (desktopMedia.matches && hoverMedia.matches) scheduleOpen(trigger.dataset.menu!);
    });
  });

  header?.addEventListener("pointerleave", () => {
    if (desktopMedia.matches && hoverMedia.matches) scheduleClose();
  });
  header?.addEventListener("pointerenter", () => window.clearTimeout(closeTimer));
  header?.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (header && !header.contains(document.activeElement)) closeMenu();
    });
  });
  backdrop?.addEventListener("click", () => closeMenu());
  megaMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeMenu) closeMenu(true);
  });
  desktopMedia.addEventListener("change", () => {
    if (!desktopMedia.matches) closeMenu();
  });

  mobileOpen?.addEventListener("click", () => mobileDialog?.showModal());
  mobileDialog?.addEventListener("click", (event) => {
    if (event.target === mobileDialog) mobileDialog.close();
  });
  mobileDialog?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => mobileDialog?.close()));

  syncThemeButton();
  themeButton?.addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme === "light";
    const theme = isLight ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("taico-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f4f7fb" : "#04060c");
    syncThemeButton();
  });
</script>

<style is:global>
  .nav-trigger {
    transition: color 0.18s ease, background-color 0.18s ease;
  }

  .nav-trigger:hover,
  .nav-trigger[aria-expanded="true"] {
    color: var(--color-wave-cyan);
    background: color-mix(in srgb, var(--color-wave-cyan) 10%, transparent);
  }

  .nav-trigger:focus-visible,
  .nav-menu-button:focus-visible,
  [data-menu-panel] a:focus-visible {
    outline: 2px solid var(--color-wave-cyan);
    outline-offset: 3px;
  }

  [data-nav-backdrop] {
    position: fixed;
    inset: 0;
    z-index: 40;
    border: 0;
    background: rgba(4, 6, 12, 0.58);
  }

  .nav-panel-card,
  .nav-featured-card,
  .nav-compact-link {
    display: block;
    border: 1px solid var(--color-line);
    background: color-mix(in srgb, var(--color-panel) 88%, transparent);
    transition: border-color 0.18s ease, transform 0.18s ease, background-color 0.18s ease;
  }

  .nav-panel-card:hover,
  .nav-featured-card:hover,
  .nav-compact-link:hover {
    border-color: var(--color-line-strong);
    background: color-mix(in srgb, var(--color-wave-cyan) 8%, var(--color-panel));
    transform: translateY(-2px);
  }

  .nav-featured-card {
    background: linear-gradient(145deg, color-mix(in srgb, var(--color-wave-cyan) 14%, var(--color-panel)), var(--color-panel));
  }

  .mobile-navigation {
    width: min(24rem, 100%);
    max-width: 100%;
    height: 100dvh;
    margin: 0 0 0 auto;
    padding: 0;
    border: 1px solid var(--color-line);
    color: var(--color-ink);
    background: var(--color-void);
  }

  .mobile-navigation::backdrop {
    background: rgba(4, 6, 12, 0.72);
  }

  .mobile-navigation details {
    border-bottom: 1px solid var(--color-line);
  }

  .mobile-navigation summary {
    cursor: pointer;
    padding: 1rem 0;
    font-weight: 600;
  }

  .mobile-navigation ul {
    display: grid;
    gap: 0.7rem;
    padding: 0 0 1rem 0.75rem;
    font-size: 0.875rem;
    color: var(--color-muted);
  }

  .mobile-navigation a:hover {
    color: var(--color-wave-cyan);
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-trigger,
    .nav-panel-card,
    .nav-featured-card,
    .nav-compact-link {
      transition: none;
    }
  }
</style>

```

## Footer
- Source: `website/src/components/Footer.astro`
- Description: Site-wide catalog, application, resource, and contact navigation.

```astro
---
import { applications } from "../data/applications";
import { resourceLinks } from "../data/navigation";
import { getPublishedProducts } from "../data/products";
import { site } from "../data/site";
import { solutions } from "../data/solutions";

const products = getPublishedProducts();
const year = new Date().getFullYear();
---

<footer class="border-t border-line bg-void-2/80">
  <div class="wave-divider"></div>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
      <div class="lg:col-span-1">
        <div class="flex items-center gap-3">
          <img src="/brand/taico-mark.png" alt="TAICO" class="h-6 w-auto rounded-sm" />
          <p class="font-display text-sm font-semibold tracking-[0.14em] text-ink">TAICO EV</p>
        </div>
        <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Mobile energy storage charging systems for flexible EV charging, temporary power, and PV-ESS applications.
        </p>
      </div>

      <div>
        <p class="label-tech mb-4">Solutions</p>
        <ul class="space-y-2 text-sm text-muted">
          {solutions.map((solution) => <li><a class="transition hover:text-wave-cyan" href={`/solutions/${solution.slug}/`}>{solution.title}</a></li>)}
        </ul>
      </div>

      <div>
        <p class="label-tech mb-4">Products</p>
        <ul class="space-y-2 text-sm text-muted">
          {products.map((product) => <li><a class="transition hover:text-wave-cyan" href={`/products/${product.slug}/`}>{product.model}</a></li>)}
        </ul>
      </div>

      <div>
        <p class="label-tech mb-4">Applications</p>
        <ul class="space-y-2 text-sm text-muted">
          {applications.map((application) => <li><a class="transition hover:text-wave-cyan" href={`/applications/${application.slug}/`}>{application.title}</a></li>)}
        </ul>
      </div>

      <div>
        <p class="label-tech mb-4">Resources</p>
        <ul class="space-y-2 text-sm text-muted">
          {resourceLinks.map((resource) => <li><a class="transition hover:text-wave-cyan" href={resource.href}>{resource.label}</a></li>)}
        </ul>
        <p class="mt-5 text-sm text-muted"><a class="transition hover:text-wave-cyan" href={site.emailHref}>{site.email}</a></p>
      </div>

      <div>
        <p class="label-tech mb-4">Company</p>
        <p class="text-sm leading-relaxed text-muted">TAICO EV</p>
        <a class="mt-2 inline-block text-sm text-muted transition hover:text-wave-cyan" href={site.emailHref}>Contact the team</a>
      </div>
    </div>

    <p class="mt-10 border-t border-line pt-6 font-mono text-[11px] text-faint">
      © {year} TAICO EV · Product facts sourced from TAICO MC 2026 Catalog v1.3
    </p>
  </div>
</footer>

```

