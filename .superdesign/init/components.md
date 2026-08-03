# Shared components

## CtaBand
- Source: `website/src/components/CtaBand.astro`
- Description: Shared conversion CTA band with configurable copy and primary/secondary links.

```astro
---
import {site} from "../data/site.ts";
interface Props {
  title?: string;
  body?: string;
  href?: string;
  label?: string;
}

const {
  title = "Tell Us About Your Charging Challenge",
  body = "Share your site constraints, vehicle mix, and deployment timeline. We will map a mobile energy solution.",
  href = site.emailHref,
  label = "Request configuration",
} = Astro.props;
---

<section class="section-pad">
  <div class="glass relative overflow-hidden rounded-3xl px-6 py-12 sm:px-10">
    <div
      class="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl"
      style="background: radial-gradient(circle, rgba(34,211,238,0.35), transparent 70%)"
      aria-hidden="true"
    >
    </div>
    <div
      class="pointer-events-none absolute -bottom-16 left-10 h-40 w-40 rounded-full blur-3xl"
      style="background: radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)"
      aria-hidden="true"
    >
    </div>
    <p class="label-tech">Signal · Request</p>
    <h2 class="font-display mt-4 max-w-2xl text-2xl font-semibold tracking-wide text-ink sm:text-3xl">
      {title}
    </h2>
    <p class="mt-3 max-w-xl text-muted">{body}</p>
    <div class="mt-8 flex flex-wrap gap-3">
      <a class="btn-primary" href={href}>{label}</a>
      <a class="btn-ghost" href="/resources/product-comparison/">Compare TKMC products</a>
    </div>
  </div>
</section>

```

## WaveField
- Source: `website/src/components/WaveField.astro`
- Description: Shared decorative waveform and grid background.

```astro
---
/**
 * Analogue Waves — ambient waveform field (decorative)
 */
interface Props {
  class?: string;
  intensity?: "low" | "mid" | "high";
}

const { class: className = "", intensity = "mid" } = Astro.props;
const opacity = intensity === "high" ? 0.55 : intensity === "low" ? 0.22 : 0.38;
---

<div
  class:list={["pointer-events-none absolute inset-0 overflow-hidden", className]}
  aria-hidden="true"
  style={`opacity: ${opacity}`}
>
  <!-- soft orbs -->
  <div
    class="absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl"
    style="background: radial-gradient(circle, rgba(34,211,238,0.35), transparent 70%)"
  >
  </div>
  <div
    class="absolute -right-16 top-24 h-80 w-80 rounded-full blur-3xl"
    style="background: radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)"
  >
  </div>
  <div
    class="absolute bottom-0 left-1/3 h-64 w-64 rounded-full blur-3xl"
    style="background: radial-gradient(circle, rgba(59,130,246,0.22), transparent 70%)"
  >
  </div>

  <!-- analogue waveforms -->
  <svg
    class="absolute inset-x-0 bottom-0 h-[55%] w-full"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    fill="none"
  >
    <path
      d="M0 180 C120 120, 200 240, 320 190 C440 140, 520 80, 640 120 C760 160, 840 250, 960 210 C1080 170, 1180 90, 1280 130 C1340 155, 1400 190, 1440 170 L1440 320 L0 320 Z"
      fill="url(#waveFill1)"
      opacity="0.35"></path>
    <path
      d="M0 210 C100 170, 180 260, 300 220 C420 180, 500 120, 620 160 C740 200, 820 270, 940 230 C1060 190, 1160 130, 1280 170 C1340 190, 1400 220, 1440 200"
      stroke="url(#waveStroke1)"
      stroke-width="2"
      opacity="0.85"></path>
    <path
      d="M0 240 C140 200, 220 280, 360 240 C500 200, 580 150, 700 190 C820 230, 900 290, 1020 250 C1140 210, 1220 170, 1340 200 C1380 215, 1420 230, 1440 225"
      stroke="url(#waveStroke2)"
      stroke-width="1.5"
      opacity="0.7"></path>
    <path
      d="M0 160 C80 200, 160 100, 260 140 C360 180, 440 240, 560 190 C680 140, 760 70, 880 110 C1000 150, 1100 230, 1220 180 C1300 145, 1380 120, 1440 140"
      stroke="url(#waveStroke3)"
      stroke-width="1"
      stroke-dasharray="4 8"
      opacity="0.55"></path>
    <defs>
      <linearGradient id="waveFill1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
        <stop stop-color="#22d3ee" stop-opacity="0.25"></stop>
        <stop offset="0.5" stop-color="#3b82f6" stop-opacity="0.18"></stop>
        <stop offset="1" stop-color="#8b5cf6" stop-opacity="0.22"></stop>
      </linearGradient>
      <linearGradient id="waveStroke1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
        <stop stop-color="#22d3ee"></stop>
        <stop offset="0.5" stop-color="#3b82f6"></stop>
        <stop offset="1" stop-color="#8b5cf6"></stop>
      </linearGradient>
      <linearGradient id="waveStroke2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
        <stop stop-color="#34d399"></stop>
        <stop offset="1" stop-color="#22d3ee"></stop>
      </linearGradient>
      <linearGradient id="waveStroke3" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
        <stop stop-color="#f472b6"></stop>
        <stop offset="1" stop-color="#8b5cf6"></stop>
      </linearGradient>
    </defs>
  </svg>

  <!-- scan / grid -->
  <div class="grid-overlay absolute inset-0 opacity-60"></div>
</div>

```

