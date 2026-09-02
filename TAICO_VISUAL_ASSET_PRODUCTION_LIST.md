# TAICO_VISUAL_ASSET_PRODUCTION_LIST.md

**Project:** TAICO EV Website  
**Version:** 1.0  
**Purpose:** TAICO EV 全站图片制作清单 + 可直接复制的 AI 作图提示词  
**Scope:** Homepage / Products / Product Family / Solution / Resources / Knowledge / Comparison / Documentation / Evidence

---

# 0. 使用方法

每张图片包含：Asset ID、页面、位置、内容、风格、尺寸、AI Fidelity、Evidence Level、Prompt、Negative Prompt、状态。

建议流程：

```text
真实产品参考图
→ AI 场景生成 / 合成
→ 产品一致性 QA
→ 工程合理性 QA
→ Web 优化
→ Asset Library
```

---

# 1. 全站统一视觉风格

## GLOBAL STYLE PROMPT

```text
Premium industrial product photography for a professional B2B EV charging manufacturer. Clean contemporary European commercial environment, restrained neutral colors, natural daylight, realistic materials, technically credible installation, generous negative space, precise perspective, realistic shadows and reflections, visually calm and modern, high-end industrial catalog quality, physically grounded product, subtle blue-gray architectural tones, no exaggerated luxury, no cinematic sci-fi mood.

The TAICO product must remain the visual focus. The image should feel like a real professional product campaign created for an international industrial manufacturer, suitable for a clean modern B2B website.

No embedded text, no fake UI overlays, no futuristic holograms, no cyberpunk neon, no exaggerated architecture, no dramatic fantasy lighting.
```

## PRODUCT LOCK PROMPT

```text
Use the supplied TAICO product reference exactly. Preserve the original enclosure geometry, dimensions, proportions, screen position, buttons, connectors, charging cables, handles, wheels, vents, doors, seams, logo placement and industrial design details. Do not redesign, simplify, stylize or invent any part of the product.

The final product must remain recognizable as the exact supplied TAICO model.
```

## GLOBAL NEGATIVE PROMPT

```text
wrong product geometry, redesigned charger, altered logo, incorrect screen, extra buttons, missing cable, incorrect connector, duplicated wheels, warped cabinet, floating product, impossible cable routing, sci-fi interface, neon cyberpunk lighting, fake text, unreadable labels, fantasy architecture, excessive depth of field, oversaturated colors, stock-photo smile, unrealistic reflections, distorted car, duplicate objects, physically impossible installation
```

---

# 2. 图片规格母版

| Type | Suggested Size | Ratio | Use |
|---|---:|---:|---|
| HERO-L | 1920×1200 | 8:5 | Homepage / Solution Hero |
| HERO-SPLIT | 1600×1200 | 4:3 | Family / Resources Hero |
| PRODUCT-1 | 1600×1600 | 1:1 | Product cutout / card |
| SCENE-CARD | 1200×900 | 4:3 | Application / Solution card |
| DIAGRAM | 1600×1000 | 8:5 | Technical diagram |
| ARTICLE | 1200×800 | 3:2 | Knowledge cover |
| EVIDENCE | 1600×1200 | 4:3 | Factory / testing / project |
| MOBILE-HERO | 1080×1350 | 4:5 | Mobile safe crop |

Hero 主体尽量放在中央 60% 安全区。

---

# 3. P0 — 8 个产品标准抠图

共同要求：3/4 angle、透明或浅灰蓝背景、统一相机高度、统一阴影、准确产品比例、F1 Exact。

## P01 — TKMC-800 Product Hero

**位置：** Products / Product Page / Family / Comparison  
**尺寸：** 1600×1600  
**Fidelity：** F1 Exact  
**Evidence：** L1 Render / L2 Real Product

```text
Create a premium studio product image of the supplied TAICO TKMC-800 mobile EV charging unit.

Use the supplied TAICO TKMC-800 reference exactly. Preserve the original enclosure geometry, dimensions, proportions, display, handles, wheels, charging cables, connectors, vents, seams, doors and TAICO logo placement. Do not redesign or simplify the product.

Camera: clean three-quarter front view at approximately chest height, slightly above the product centerline.
Lighting: soft professional studio daylight with controlled highlights and natural contact shadow.
Background: transparent if supported; otherwise very light neutral gray-blue.
Composition: centered product, generous clear space around the object, full product visible, no cropping.
Style: high-end industrial catalog photography, realistic material response, accurate metal/plastic surfaces, technically precise, modern B2B manufacturer presentation.

No environment, no people, no vehicle, no text, no props.
```

**Status：** ☐

## P02 — TKMC-1500 Product Hero

**尺寸：** 1600×1600

```text
Create a premium studio product image of the supplied TAICO TKMC-1500 mobile EV charging unit.

Use the supplied TAICO TKMC-1500 product reference exactly. Preserve enclosure geometry, scale, wheels, handles, display, ports, cable layout, charging connectors, vents, seams and TAICO branding. Do not change the industrial design.

Camera: consistent three-quarter front view matching the TAICO product image system.
Lighting: soft neutral daylight studio lighting, realistic contact shadow, subtle material reflections.
Background: transparent if supported, otherwise very light neutral gray-blue.
Composition: entire unit visible, centered, no cropping, sufficient margin for web cards and comparison layouts.
Style: premium international industrial equipment catalog, photorealistic and technically accurate.

No environment, no people, no car, no text.
```

**Status：** ☐

## P03 — TKMC-1000 Charging Robot Product Hero

**尺寸：** 1600×1600

```text
Create a premium studio product image of the supplied TAICO TKMC-1000 self-propelled mobile charging robot.

Preserve the exact supplied product design: body geometry, wheel system, charging interface, display, doors, seams, sensors, connectors, cable arrangement and TAICO logo. Do not invent autonomous-driving hardware that is not visible in the reference.

Camera: three-quarter front view, slightly elevated enough to reveal the mobile base and body shape.
Lighting: soft professional daylight studio lighting.
Background: transparent or very light neutral gray-blue.
Composition: entire robot visible, centered with generous margin.
Style: precise industrial robotics photography, modern B2B catalog, realistic surfaces, no futuristic exaggeration.

No parking garage, no vehicle, no people, no holographic UI, no text.
```

**Status：** ☐

## P04 — TKMC-2000P Product Hero

**尺寸：** 1600×1600

```text
Create a premium studio image of the supplied TAICO TKMC-2000P mobile power and EV charging system.

Use the supplied TKMC-2000P reference exactly. Preserve cabinet proportions, wheels or mobility hardware, displays, doors, vents, connectors, charging cables, handles, seams and TAICO branding.

Camera: three-quarter front view consistent with the other TAICO family product images.
Lighting: soft neutral daylight studio lighting with realistic contact shadow.
Background: transparent or very light gray-blue.
Composition: full equipment visible with clear negative space.
Style: high-end industrial energy equipment catalog, realistic, robust, technically credible.

Do not add construction equipment, vehicles, cables not present in the reference, text or decorative elements.
```

**Status：** ☐

## P05 — TKMC-4000 Product Hero

```text
Create a premium industrial studio product image of the supplied TAICO TKMC-4000 mobile power system.

Preserve the exact reference geometry, cabinet proportions, mobility components, access panels, vents, display, ports, charging connections and TAICO logo placement.

Use a clean three-quarter front camera angle that communicates the larger industrial scale while keeping the full unit visible.
Soft professional daylight, realistic metal surfaces and grounded contact shadow.
Transparent or very light neutral background.
No environment, people, vehicles, text or fictional features.

The final image should look like a professional engineering equipment catalog photograph for an international B2B manufacturer.
```

**Size：** 1600×1600  
**Status：** ☐

## P06 — TKMC-10000 Product Hero

```text
Create a premium studio product image of the supplied TAICO TKMC-10000 large mobile energy storage and charging system.

Preserve the exact TAICO reference: enclosure proportions, structural frame, access doors, vents, interfaces, charging equipment, mobility structure and logo placement.

Camera: slightly elevated three-quarter perspective suitable for a large industrial system.
Lighting: neutral daylight studio illumination with realistic shadows and subtle reflections.
Background: transparent or very light cool gray.
Composition: full system visible, no crop, enough surrounding space to communicate scale.
Style: large-scale industrial energy equipment catalog photography, precise and credible.

Do not invent container features, extra doors, solar panels, trucks, people, text or futuristic elements.
```

**Size：** 1600×1600  
**Status：** ☐

## P07 — TKMC-2000 Stationary Product Hero

```text
Create a premium studio product image of the supplied TAICO TKMC-2000 stationary PV-ESS EV charging system.

Use the exact supplied reference. Preserve cabinet dimensions, doors, vents, control panel, interfaces, cable positions, base, seams and TAICO logo.

Camera: three-quarter front view showing the stationary cabinet clearly.
Lighting: soft natural studio daylight.
Background: transparent or light neutral gray-blue.
Composition: full cabinet visible with clear margin.
Style: professional stationary energy storage and EV charging equipment catalog, minimal, realistic, technically precise.

No solar panels, cars, buildings, people or text in this studio asset.
```

**Size：** 1600×1600  
**Status：** ☐

## P08 — TKMC-2600 Stationary Product Hero

```text
Create a premium studio product image of the supplied TAICO TKMC-2600 stationary PV-storage and EV charging system.

Preserve every visible industrial design element from the reference: cabinet geometry, proportions, access panels, vents, interface positions, base, seams, cable interfaces and TAICO branding.

Camera: clean three-quarter front view consistent with the TKMC-2000 image.
Lighting: soft neutral professional daylight.
Background: transparent or very light cool gray.
Composition: entire system visible, no crop, generous margin.
Style: international B2B energy equipment catalog, realistic and technically credible.

No environment, solar canopy, EV, text or fictional features.
```

**Size：** 1600×1600  
**Status：** ☐

---

# 4. Homepage Assets

## H01 — Homepage Main Hero

**位置：** Homepage 首屏  
**内容：** TAICO mobile charger + EV + flexible/off-grid context  
**尺寸：** 1920×1200  
**Fidelity：** F2 Reference-Locked  
**Evidence：** L0  
**Priority：** ★★★★★

```text
Create a premium hero image for the homepage of TAICO EV, an international B2B EV charging and mobile energy storage manufacturer.

Scene: a modern European roadside service or commercial parking environment in daylight. A real TAICO mobile EV charging unit, based exactly on the supplied product reference, is positioned next to a contemporary electric vehicle and actively connected through the correct charging cable.

The scene should immediately communicate: charging capacity can be brought to the vehicle even when fixed charging infrastructure is unavailable.

Use the supplied TAICO product reference exactly. Preserve the original enclosure geometry, proportions, screen, handles, wheels, charging connector, cable routing, vents, seams and TAICO logo. Do not redesign the product.

Composition:
- product and EV are the clear focal point
- TAICO equipment placed in the central-right visual zone
- leave generous negative space on the left for homepage headline and CTA
- realistic safe parking position
- believable charging cable routing
- full product visible
- clean architecture and uncluttered background

Style: premium industrial product campaign, realistic contemporary European environment, natural daylight, restrained colors, subtle cool gray-blue architecture, realistic reflections and shadows, professional manufacturer website, calm and credible.

No embedded text, no futuristic city, no neon, no sci-fi UI, no impossible cable routing, no exaggerated luxury.
```

**Status：** ☐

## H02 — Operating Constraint Diagram

**尺寸：** 1600×1000

```text
Create a clean technical editorial illustration for a modern B2B EV charging website.

Concept: fixed charging infrastructure is far away, while a TAICO mobile charging unit brings charging directly to the EV.

Show a simple left-to-right system:
1. fixed charger or grid point in the distance
2. clear physical distance / operational gap
3. electric vehicle
4. TAICO mobile charger positioned next to the vehicle

Use a minimalist engineering infographic style with white and very light blue-gray background, precise simple geometry, subtle line icons, restrained color use, no decorative complexity.

The visual should communicate “bring charging capacity to where the operation needs it” in less than one second.

No embedded headline text. Labels should be minimal or omitted so website HTML can provide copy.
```

**Status：** ☐

---

# 5. Six Solution Scene Assets

## S01 — Roadside EV Rescue

**尺寸：** 1920×1200  
**Fidelity：** F2  
**Priority：** ★★★★★

```text
Create a premium industrial marketing scene for TAICO EV showing roadside EV rescue charging.

Scene: a contemporary electric vehicle is safely parked in a roadside service area or wide urban roadside pull-off in daylight. A TAICO mobile EV charging unit based exactly on the supplied product reference has arrived and is connected to the vehicle for emergency charging.

The scene should communicate professional roadside charging support, not an accident.

Product requirements:
Use the supplied TAICO mobile charger reference exactly. Preserve enclosure geometry, wheels, handles, display, vents, cable, charging connector and logo placement. Do not redesign the unit.

Composition:
- EV and TAICO unit both clearly visible
- realistic cable connection
- enough safe space around the vehicle
- charger located near the charging port according to believable vehicle geometry
- leave some negative space for website copy
- no tow truck dominating the scene

Style: realistic premium B2B industrial campaign, European roadside/service environment, natural daylight, restrained neutral color palette, professional fleet-service feeling, calm and credible.

No crash, no damaged vehicle, no emergency siren, no dangerous highway lane, no neon, no text.
```

**Status：** ☐

## S02 — Charge On Demand / Charging Robot

**尺寸：** 1920×1200  
**Fidelity：** F2  
**Priority：** ★★★★★

```text
Create a premium commercial parking scene for TAICO EV showing on-demand robotic EV charging.

Scene: a modern clean commercial or office parking facility with several parked electric vehicles. A TAICO TKMC-1000 charging robot, based exactly on the supplied reference, has moved to one parked EV and is charging it while the vehicle remains in its normal parking bay.

The visual concept is: the charger moves to the car, instead of the car moving to a fixed charger.

Use the supplied TKMC-1000 reference exactly. Preserve body geometry, wheel base, display, interfaces, cable system, seams, sensors visible in the reference and TAICO branding. Do not invent futuristic robotics features.

Composition:
- charging robot is the visual focus
- one EV actively connected
- 2–4 other parked cars provide operational context
- clear parking bay markings
- enough floor area to imply movement path
- modern commercial architecture
- negative space for website headline

Style: clean contemporary European parking environment, natural daylight or bright architectural lighting, premium industrial robotics photography, restrained palette, realistic proportions, technically credible.

No holograms, no glowing autonomous-driving path, no sci-fi robot eyes, no text, no impossible cable routing.
```

**Status：** ☐

## S03 — AC Output / E-Generator

**尺寸：** 1920×1200

```text
Create a realistic premium B2B scene for TAICO EV showing a mobile energy storage system used as both EV charging equipment and temporary AC power source.

Scene: a clean outdoor engineering, event-support or temporary operations site. A TAICO mobile power system based exactly on the supplied reference is supplying power to a small professional AC load setup while also being positioned for EV charging capability.

The scene must communicate dual-purpose mobile energy:
- EV charging
- AC output for temporary equipment

Use the supplied TAICO product reference exactly. Preserve geometry, panels, vents, wheels, screens, connectors, cable interfaces and TAICO logo.

Composition:
- TAICO equipment clearly visible
- one believable AC load such as professional site equipment, temporary office equipment or event infrastructure
- optional EV in secondary position
- realistic power cable routing
- uncluttered environment
- leave negative space for copy

Style: premium industrial manufacturer campaign, realistic natural daylight, restrained modern colors, professional temporary-power environment, no disaster or military context.

No household extension-cord chaos, no sparks, no futuristic UI, no text.
```

**Status：** ☐

## S04 — Engineering Power Supply

```text
Create a premium industrial scene for TAICO EV showing mobile energy storage used for engineering power supply.

Scene: a clean modern construction support or infrastructure maintenance environment. A TAICO mobile power system based exactly on the supplied product reference is supplying temporary electrical power to a small site office, professional tools or light engineering equipment.

The scene should communicate reliable temporary power for engineering operations without looking like a dramatic heavy-construction advertisement.

Preserve the exact TAICO enclosure, proportions, panels, interfaces, wheels, vents, display, cables and branding from the supplied reference.

Composition:
- TAICO product is prominent
- one or two clear electrical loads
- realistic cable routing
- modern site environment
- optional EV or service van as context
- generous negative space
- physically grounded equipment

Style: realistic European industrial field photography, premium B2B catalog campaign, natural daylight, neutral materials, clean and technically credible.

No heavy dust storm, no sparks, no giant cranes dominating the image, no neon, no text.
```

**Size：** 1920×1200  
**Status：** ☐

## S05 — PV Storage Mobile Charger

**安放位置：** `/solutions/pv-storage-charger/` 首屏 Hero 右侧主视觉；桌面端图文并排，移动端放在标题、简介和 CTA 之后。  
**交付文件：** `deliverables/visual-assets-preview-2026-09-01/S05-pv-storage-mobile-charger-v2.png`  
**上线建议路径：** `website/public/solutions/pv-storage-charger-hero.webp`（上线前从交付 PNG 转为 WebP）  
**裁切：** 保持 8:5 横图；使用 `object-fit: cover`，焦点居中，必须同时保留完整设备、车辆充电口和连接电缆。  
**使用边界：** 这是 AI 环境效果图，只用于解决方案场景展示，不替代 TKMC-2000P 白底产品主图或真实项目案例图。

```text
Create a premium renewable-energy EV charging scene for TAICO EV.

Scene: a TAICO mobile energy storage charging system based exactly on the supplied reference is positioned in a clean semi-temporary solar charging environment. Nearby solar panels or a modest solar canopy provide renewable-energy context, and an EV is connected to the TAICO system.

The visual should communicate:
Solar PV → stored energy → EV charging.

Preserve the supplied TAICO product exactly, including body geometry, wheels, panels, screen, vents, connectors, charging cable and logo placement.

Composition:
- TAICO unit and EV are primary
- solar panels are visible but secondary
- realistic cable routing
- believable physical scale
- open clean environment
- generous copy space

Style: modern European renewable-energy infrastructure, natural daylight, realistic materials, premium industrial campaign, subtle blue-gray and neutral palette.

No giant solar farm, no futuristic smart-city graphics, no text, no glowing energy beams.
```

**Size：** 1920×1200  
**Status：** ☑ v2 generated; scale and perspective corrected against 2660 × 1250 × 1300 mm product dimensions

## S06 — PV-ESS Stationary Charging

```text
Create a flagship premium hero image for TAICO EV showing a stationary PV-ESS EV charging site.

Scene: a modern European commercial parking facility with a clean solar canopy, several electric vehicles, and a TAICO stationary energy storage and EV charging cabinet based exactly on the supplied reference.

The image should visually communicate an integrated system:
Solar PV + Energy Storage + Grid Support + EV Charging.

Use the supplied TAICO stationary product reference exactly. Preserve cabinet geometry, proportions, doors, vents, control interface, base, seams, cable interfaces and TAICO logo placement.

Composition:
- TAICO cabinet clearly visible in the foreground or midground
- one or two EVs charging
- solar canopy readable but not overpowering
- modern commercial building background
- clean parking layout
- natural cable and equipment placement
- generous negative space for website copy
- premium “industrial showroom” feeling

Style: high-end B2B renewable-energy infrastructure photography, realistic daylight, calm contemporary European architecture, restrained neutral colors, precise perspective, credible engineering installation.

No futuristic city, no exaggerated solar farm, no neon lighting, no fake energy beams, no text.
```

**Size：** 1920×1200  
**Status：** ☐

---

# 6. Product Family Hero Assets

## F01 — Mobile Charging Systems

```text
Create a premium product-family hero image for TAICO Mobile Charging Systems.

Feature the supplied TAICO TKMC-800 and TKMC-1500 product references together in one coherent roadside and fleet-service charging context.

The visual message is: flexible EV charging can be deployed to the vehicle instead of relying only on fixed charging infrastructure.

Preserve both TAICO products exactly. Do not change enclosure geometry, proportions, wheels, handles, screens, connectors, cable systems, vents or logos.

Composition:
- TKMC-800 and TKMC-1500 clearly distinguishable
- one product closer to camera, second slightly behind to create hierarchy
- contemporary EV in realistic charging context
- clean roadside service / fleet operations environment
- enough negative space for Family Page title
- do not make both products appear identical in scale

Style: premium industrial product-family photography, realistic European environment, natural daylight, restrained colors, professional manufacturer website.

No text, no futuristic effects, no duplicated products, no fake scale.
```

**Size：** 1600×1200  
**Status：** ☐

## F02 — Charging Robot

```text
Create a premium product-family hero image for TAICO Charging Robot systems.

Show the supplied TAICO TKMC-1000 self-propelled charging robot in a clean modern commercial parking environment, moving operationally between parked electric vehicles.

One EV may be actively charging while other vehicles remain parked in normal bays.

Preserve the supplied TKMC-1000 exactly. Do not redesign the body, wheel system, display, interfaces, charging cable, sensors or branding.

Composition:
- robot is the main focal point
- visible parking layout
- clear sense that the charger moves between vehicles
- modern architecture
- clean floor and lighting
- generous negative space for Family title

Style: premium B2B robotics and EV infrastructure photography, realistic, elegant, technically credible, no science-fiction aesthetic.

No holographic path, no glowing robot, no text.
```

**Size：** 1600×1200  
**Status：** ☐

## F03 — Mobile Power Systems

```text
Create a premium family hero image for TAICO Mobile Power Systems.

Show three supplied TAICO product models representing increasing mobile energy-storage scale: TKMC-2000P, TKMC-4000 and TKMC-10000.

Preserve each supplied product reference exactly. Maintain correct relative scale and distinct geometry.

Scene: a clean industrial temporary-power environment with subtle context such as service vehicles, site equipment or infrastructure maintenance, while keeping the product family as the dominant subject.

Composition:
- three products arranged from smaller to larger scale
- enough separation so each model can be recognized
- realistic ground contact and shadows
- restrained industrial background
- negative space for page title

Style: premium industrial equipment campaign, realistic daylight, neutral palette, high-end B2B catalog quality.

No fantasy construction site, no giant machinery dominating the frame, no text.
```

**Size：** 1600×1200  
**Status：** ☐

## F04 — Stationary Charging Systems

```text
Create a premium family hero image for TAICO Stationary Charging Systems.

Show the supplied TAICO TKMC-2000 and TKMC-2600 stationary energy storage charging systems in a modern commercial EV charging site with subtle solar-PV context.

Preserve both TAICO products exactly, including cabinet proportions, doors, vents, panels, interfaces, base and logo placement.

Composition:
- two products clearly distinguishable
- one closer, one secondary
- modern EV charging parking environment
- solar canopy or PV elements in background
- realistic scale
- clean technical installation
- generous negative space for title

Style: contemporary European energy infrastructure photography, premium B2B manufacturer presentation, natural daylight, restrained colors.

No futuristic city, no fake energy beam, no text.
```

**Size：** 1600×1200  
**Status：** ☐

---

# 7. Resources Assets

## R01 — Resources Hero

**位置：** `/resources/` Hero 右侧  
**尺寸：** 1600×1200  
**Priority：** ★★★★★

```text
Create a premium technical-resource hero image for the TAICO EV Resources page.

Scene: an elegant engineering workbench or technical desk composition featuring one supplied TAICO EV charging product as the primary object, combined with professional technical materials.

Include:
- the exact supplied TAICO product
- a clean technical datasheet or specification sheet
- a laptop or tablet with a subtle engineering interface
- an EV charging connector or cable detail
- a partially visible engineering drawing / dimensional diagram

The visual should communicate:
technical resources, product selection, engineering documentation and professional buyer support.

Use the supplied TAICO product exactly. Preserve its geometry, screen, buttons, connector, cables, vents and logo.

Composition:
- product occupies approximately 45–55% of the image
- documentation and engineering objects support the story without clutter
- strong clean negative space
- slightly elevated three-quarter tabletop view
- suitable for a split Hero with text on the left and image on the right

Style: premium Japanese/European technical catalog still life, clean white and light blue-gray palette, precise natural studio daylight, refined shadows, calm professional engineering mood, modern B2B manufacturer.

No coffee cup lifestyle styling, no fake handwritten notes, no futuristic holograms, no embedded text, no messy office.
```

**Status：** ☐

## R02 — Technical Documentation Hero

```text
Create a clean technical documentation visual for TAICO EV.

Show an exact supplied TAICO product beside a structured stack of professional product documentation:
- product datasheet
- technical specification pages
- dimensional drawing
- connector diagram
- catalog cover

The visual should feel like an engineering documentation library, not an office lifestyle photograph.

Use a clean white / light blue-gray studio background, soft daylight, precise alignment, high-end industrial catalog aesthetics.

Preserve the supplied product exactly.
No people, no coffee, no decorative stationery, no fake readable text, no futuristic UI.
```

**Size：** 1600×1000  
**Status：** ☐

---

# 8. Products Index

## PI01 — Product Range Group Visual

```text
Create a premium product-range group image for TAICO EV.

Arrange four representative supplied TAICO product references from the four main deployment families:
1. Mobile Charging System
2. Charging Robot
3. Mobile Power System
4. Stationary Charging System

Preserve every product exactly and maintain believable relative scale.

Composition:
- clean studio group arrangement
- products separated enough to remain individually readable
- visually balanced from compact to large scale
- slight three-quarter view
- soft grounded shadows
- generous negative space for page title
- no environment

Background: very light neutral gray-blue or transparent if supported.
Style: premium international industrial equipment catalog, realistic, precise and modern.

No text, no environment, no duplicated units, no fake scale.
```

**Size：** 1920×1000  
**Status：** ☐

---

# 9. Product Comparison

## C01 — Product Range Scale Graphic

```text
Create a clean horizontal product-range comparison graphic for TAICO EV.

Show simplified but recognizable silhouettes or exact product cutouts of the TAICO product range arranged from lower to higher stored-energy capacity.

The visual should help a technical buyer understand the scale progression across the range.

Design language:
- white or very light blue-gray background
- thin precise technical guide lines
- restrained typography placeholders or no embedded text
- proportional product silhouettes
- calm engineering infographic style
- clear left-to-right progression
- no decorative illustration

Leave space below or above each product for HTML labels such as model name, kWh and kW values.

Do not invent specification values inside the image. The website will render text separately.
```

**Size：** 1800×900  
**Status：** ☐

---

# 10. Six Solution Technical Diagrams

## D01 — Roadside Rescue Workflow

```text
Create a clean five-stage technical workflow diagram for roadside EV rescue charging.

Stages:
1. Driver requests help
2. Mobile charger is dispatched
3. TAICO unit arrives
4. Charger connects to EV
5. Vehicle receives enough energy to continue

Use simple modern technical icons and minimal isometric or flat engineering illustration.
White and light blue-gray background.
Clear left-to-right flow.
Professional B2B technical-documentation style.
No decorative characters, no cartoon aesthetic, no complex text.
Leave labels to HTML where possible.
```

**Size：** 1600×1000  
**Status：** ☐

## D02 — Charging Robot Parking Workflow

```text
Create a top-view technical diagram of an on-demand robotic EV charging parking system.

Show:
- 6–8 parking bays
- several parked EVs
- one TAICO charging robot
- a simple route from a waiting position to a target EV
- no fixed charger required at every bay

Use a clean architectural plan-view style, white/light blue-gray background, subtle parking-bay lines, restrained technical graphics and clear spatial logic.

The diagram should communicate: the charger moves to the parked vehicle.

No futuristic glowing navigation lines, no text-heavy labels, no cartoon style.
```

**Size：** 1600×1000  
**Status：** ☐

## D03 — AC Output Dual-Use Diagram

```text
Create a minimal technical energy-flow diagram for a TAICO mobile energy storage system with dual output.

Show one central energy storage system branching into:
- DC EV charging
- AC electrical load

Use a clean engineering infographic style:
white background, light blue-gray technical lines, simple icons, clear directional arrows, restrained visual hierarchy.

No decorative scene, no glowing energy, no fake numbers, no embedded long text.
```

**Size：** 1600×1000  
**Status：** ☐

## D04 — Engineering Power Diagram

```text
Create a clean engineering power-supply diagram for a mobile energy storage system.

Show:
TAICO Mobile Energy Storage
→ Temporary Site Distribution
→ Site Office / Professional Tools / EV Charging

Use minimal technical iconography, precise arrows, white/light blue-gray background and modern B2B documentation aesthetics.

The diagram should explain flexible temporary power distribution at a glance.

No fake specifications, no decorative landscape, no cartoon people.
```

**Size：** 1600×1000  
**Status：** ☐

## D05 — Mobile PV Storage Diagram

```text
Create a clean technical energy-flow diagram showing:

Solar PV
↓
TAICO Mobile Energy Storage
↓
EV Charging

Optionally show grid input as a secondary source only if visually useful.

Use precise simple icons, thin directional arrows, white/light blue-gray background, modern renewable-energy engineering-documentation style.

No glowing energy beams, no futuristic UI, no decorative scenery, no fake specification numbers.
```

**Size：** 1600×1000  
**Status：** ☐

## D06 — Stationary PV-ESS Diagram

```text
Create a clean technical system architecture diagram for a stationary PV-ESS EV charging solution.

Show:
Solar PV
↓
TAICO Energy Storage System
↔ Grid
↓
EV Charging

Use clean engineering iconography, subtle blue-gray lines, clear energy-direction arrows, white background, balanced spacing and professional B2B technical-documentation aesthetics.

The system relationships must be visually obvious in less than three seconds.

No fake numbers, no decorative buildings, no glowing energy effects.
```

**Size：** 1600×1000  
**Status：** ☐

---

# 11. Knowledge / Article Visual Assets

## K01 — Mobile EV Charger Buyer’s Guide Cover

```text
Create a clean editorial technical illustration for a B2B article conceptually titled “Mobile EV Charger Buyer’s Guide”.

Show four charging deployment categories as a coherent visual family:
- mobile charging unit
- charging robot
- larger mobile power system
- stationary charging system

Use simplified accurate industrial silhouettes or approved TAICO product cutouts, arranged in a clear progression.

Style: premium technical editorial, white/light blue-gray background, restrained colors, clean grid, no lifestyle photography, no embedded headline text.

The image should communicate “choose the right deployment format”.
```

**Size：** 1200×800  
**Status：** ☐

## K02 — Buyer Selection Map

```text
Create a clean EV charging product-selection decision diagram.

Decision logic:
Emergency roadside charging → Mobile Charging
Charging multiple parked vehicles on demand → Charging Robot
Temporary power plus EV charging → Mobile Power System
Permanent PV / ESS charging site → Stationary Charging System

Use a simple branching decision-tree layout, modern engineering infographic style, white and light blue-gray background, clean icons, strong visual hierarchy.

Do not embed long text. Keep text placeholders minimal so final labels can be rendered in HTML.
```

**Size：** 1600×1000  
**Status：** ☐

## K03 — kW vs kWh Cover

```text
Create a clean technical editorial illustration explaining the difference between kWh and kW for EV charging.

Visual metaphor:
- kWh = how much energy is stored, represented by a battery reservoir / tank volume
- kW = how fast energy can be delivered, represented by the output flow rate

Use a highly simplified professional engineering visual, not a childish cartoon.
White/light blue-gray background, restrained accent color, precise labels area, strong side-by-side comparison.

No embedded long text, no decorative photography.
```

**Size：** 1200×800  
**Status：** ☐

## K04 — kW vs kWh Practical Diagram

```text
Create a practical technical diagram showing that battery energy capacity and charging power are separate quantities.

Show:
Battery / Energy Storage block
→ charging output
→ EV battery

Visually separate:
Energy Capacity (kWh)
from
Power Output (kW)

Use modern technical documentation styling, white/light blue-gray background, clear arrows, simple geometric components, restrained visual language.

Do not invent numerical specifications. Leave values to HTML.
```

**Size：** 1600×1000  
**Status：** ☐

## K05 — Roadside EV Charging 5-Step Workflow

```text
Create a premium five-step horizontal workflow illustration for roadside EV charging operations.

Five clear stages:
1. Request
2. Dispatch
3. Arrive
4. Connect and Charge
5. Vehicle Continues

Use consistent minimal technical illustrations showing an EV, service dispatch and mobile charging unit.

Style: modern B2B technical editorial, clean white/light blue-gray background, restrained colors, precise icons, strong visual rhythm, generous spacing.

No cartoon characters, no dramatic emergency scene, no embedded paragraphs.
```

**Desktop：** 2000×800  
**Mobile：** 1080×1800  
**Status：** ☐

---

# 12. Optional Product Application Scenes

第一阶段可以直接复用 S01–S06；Product Page 需要更强视觉时再做。

## PA01 — TKMC-800 Roadside

```text
Create a close premium application image of the exact supplied TAICO TKMC-800 providing emergency EV charging in a safe roadside service area.

The TKMC-800 must be the primary focal point and occupy more of the frame than in a general Solution Hero.
Show the full unit clearly, connected to one contemporary EV with realistic cable routing.

Use natural daylight, restrained European roadside environment, clean professional fleet-service aesthetics and realistic product scale.

Preserve every product detail exactly.
No accident, no tow-truck dominance, no text, no sci-fi effects.
```

**Size：** 1600×1200  
**Status：** ☐

## PA02 — TKMC-1500 Fleet Service

```text
Create a premium application image of the exact supplied TAICO TKMC-1500 operating in a professional EV service-fleet or roadside assistance environment.

Show one service vehicle or EV in a clean fleet operations location, with the TKMC-1500 clearly visible and correctly connected.

Preserve product geometry, wheels, interfaces, screen, connectors, cables and TAICO logo exactly.

Style: realistic professional fleet-service photography, natural daylight, restrained neutral colors, international B2B manufacturer campaign.

No emergency drama, no text, no fake equipment.
```

**Size：** 1600×1200  
**Status：** ☐

## PA03 — TKMC-1000 Robot Close Application

```text
Create a premium close application image of the exact supplied TAICO TKMC-1000 charging robot positioned next to a parked EV in a modern commercial parking facility.

The robot must occupy approximately 40–50% of the visual frame and all major product details must remain clearly readable.

Preserve the exact product geometry and charging hardware.
Use realistic cable routing and physical scale.

Style: clean premium industrial robotics photography, modern European parking environment, bright architectural light, calm and credible.

No holograms, no glowing path, no sci-fi redesign, no text.
```

**Size：** 1600×1200  
**Status：** ☐

## PA04 — TKMC-2000P Dual-Use

```text
Create a premium application image of the exact supplied TAICO TKMC-2000P used in a temporary-power and EV charging environment.

Show the product clearly supplying one professional AC load while an EV or charging connector establishes the EV charging context.

Preserve every product detail exactly.
Natural daylight, realistic industrial setting, uncluttered composition, premium B2B manufacturer aesthetic.

No fictional interfaces, no sparks, no messy cables, no text.
```

**Size：** 1600×1200  
**Status：** ☐

## PA05 — TKMC-4000 Engineering

```text
Create a premium application image of the exact supplied TAICO TKMC-4000 used as a larger mobile energy source for professional engineering operations.

Show a clean infrastructure-maintenance or temporary site-power environment with realistic electrical loads.

The product remains the dominant subject.
Preserve all geometry, panels, vents, mobility components, interfaces and TAICO branding exactly.

Style: realistic industrial field photography, clean modern B2B campaign, natural daylight, neutral materials.

No giant construction spectacle, no sparks, no text.
```

**Size：** 1600×1200  
**Status：** ☐

## PA06 — TKMC-10000 Large Mobile Energy

```text
Create a premium application image of the exact supplied TAICO TKMC-10000 operating as a large mobile energy storage and charging system in a professional infrastructure or charging-support environment.

Preserve the supplied product exactly and communicate its larger physical scale through believable nearby vehicles or infrastructure.

Use realistic daylight, restrained industrial architecture, wide composition and premium large-scale energy infrastructure photography.

No fake container features, no fantasy power plant, no text, no glowing energy beams.
```

**Size：** 1600×1200  
**Status：** ☐

## PA07 — TKMC-2000 Stationary PV-ESS

```text
Create a premium close application image of the exact supplied TAICO TKMC-2000 installed in a commercial PV-ESS EV charging site.

Show the cabinet clearly, with solar canopy context and one EV charging nearby.

Preserve cabinet geometry, panels, vents, control interface, cable interfaces and branding exactly.

Style: premium renewable-energy infrastructure photography, clean contemporary European parking environment, natural daylight.

No futuristic architecture, no fake energy graphics, no text.
```

**Size：** 1600×1200  
**Status：** ☐

## PA08 — TKMC-2600 Stationary PV-Grid

```text
Create a premium application image of the exact supplied TAICO TKMC-2600 installed in a larger commercial or light-industrial EV charging site with solar PV and grid-complementary context.

The product must be clearly visible and accurately reproduced.
Show realistic EV charging infrastructure, clean solar canopy or rooftop PV context and believable site scale.

Style: high-end European B2B energy infrastructure photography, natural daylight, restrained colors, precise engineering installation.

No sci-fi smart city, no glowing energy lines, no text.
```

**Size：** 1600×1200  
**Status：** ☐

---

# 13. Real Evidence Assets — 不使用 AI 伪造

## E01 — Factory Exterior
- 尺寸：1600×1200
- 内容：工厂入口 / 建筑 / TAICO 标识
- 白天、建筑垂直、可清理杂物但不伪造厂房
- Status：☐

## E02 — Assembly
- EV charger assembly
- cable installation
- cabinet assembly
- electrical assembly
- Size：1600×1200
- Status：☐

## E03 — Functional Testing
- final functional test
- charging test
- electrical safety test
- aging test
- Size：1600×1200
- Caption 示例：`Final functional testing before shipment`
- Status：☐

## E04 — Packaging
- product protection
- foam
- carton / wooden crate
- pallet
- Status：☐

## E05 — Shipment
- pallet
- warehouse
- forklift
- container loading
- Status：☐

## E06 — Exhibition
- booth
- products
- visitors
- venue
- Status：☐

## E07 — Customer Visit
- product discussion
- factory tour
- technical meeting
- group photo
- Status：☐

## E08 — Project Case Pack

每个项目尽量收集：

```text
01-site-overview
02-product-installed
03-product-close-up
04-electrical-installation
05-operating-environment
```

同时记录：

```text
Country
City
Project Type
Product
Quantity
Power
Application
Installer
Date
```

---

# 14. 制作优先级

## Batch 1 — 立刻做

```text
P01–P08  8 个产品标准图
R01      Resources Hero
H01      Homepage Main Hero
S01      Roadside Rescue
S02      Charge On Demand
S06      PV-ESS Charging
```

共 **13 张**。

## Batch 2

```text
S03
S04
S05
F01
F02
F03
F04
PI01
```

共 **8 张**。

## Batch 3

```text
D01–D06
C01
R02
```

共 **8 张**。

## Batch 4

```text
K01–K05
```

共 **5–6 张**。

## Batch 5

持续补充真实 Evidence：Factory / Testing / Packaging / Shipment / Exhibition / Customer Visit / Project Cases。

---

# 15. AI 图片 QA Checklist

## Product

```text
[ ] 外壳轮廓正确
[ ] 产品比例正确
[ ] 屏幕位置正确
[ ] Logo 正确
[ ] 按钮数量正确
[ ] 枪头正确
[ ] 线缆数量正确
[ ] 轮子 / 支撑结构正确
[ ] 门板 / 通风口正确
[ ] 没有 AI 自己增加功能
```

## Scene

```text
[ ] 产品与汽车比例合理
[ ] 设备真正落地
[ ] 充电线不穿墙 / 穿车
[ ] 枪头连接位置合理
[ ] 安装方向合理
[ ] 没有无法解释的电缆
[ ] 人物手脚正常
[ ] 车辆结构正常
```

## Brand

```text
[ ] 不像消费电子广告
[ ] 不像赛博朋克
[ ] 不像 stock photo
[ ] 保持 clean / technical / modern / structured
[ ] 与其它 TAICO 图片风格一致
```

---

# 16. 文件命名

```text
taico-h01-homepage-mobile-charging-hero.webp
taico-s01-roadside-ev-rescue.webp
taico-s02-charge-on-demand-robot.webp
taico-f01-mobile-charging-family.webp
taico-p01-tkmc-800-product.webp
taico-r01-resources-engineering-hero.webp
taico-d01-roadside-workflow.webp
```

不要使用：`final2-new-new.webp`、`IMG_92939.webp`、`hero-final-v3.webp`。

---

# 17. Metadata 示例

```yaml
id: S01-roadside-ev-rescue
type: scenario
application: roadside-ev-rescue

products:
  - tkmc-800
  - tkmc-1500

visual_source:
  product: real_reference
  environment: ai_generated

product_fidelity: F2
evidence_level: L0

size:
  source: 1920x1200
  ratio: 8:5

approved_for:
  - homepage
  - solution
  - family
  - product

not_approved_for:
  - case-study
  - factory-proof

status: approved
```

---

# 18. 最终原则

```text
Product Visual
负责：LOOK + UNDERSTAND

Real Evidence
负责：TRUST
```

AI 主要补齐：Homepage / Family / Solution / Resources / Knowledge。  
真实素材重点投入：Product / Factory / Testing / Certification / Shipment / Project / Customer。

目标不是“生成更多图片”，而是让用户更快理解 TAICO 的产品、使用场景和工程能力，同时更容易相信这是一家真实、持续运营、可以交付的 EV Charging Manufacturer。
