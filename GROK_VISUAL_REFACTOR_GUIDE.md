# GROK_VISUAL_REFACTOR_GUIDE.md

**Project:** TAICO EV Website  
**Version:** 1.1  
**Primary Agent:** Grok CLI / Grok Coding Agent  
**Scope:** Homepage / Family / Solution / Product / Resources / Knowledge / Case Study  
**Goal:** 在不破坏现有 TAICO Design System 的前提下，引入一套可持续的 **Product Visual + Evidence Asset System**，把网站从“漂亮的资料站 / SaaS 感页面”升级成“可信的 B2B 制造企业品牌与产品橱窗”。

---

# 1. Mission

你不是重新设计 TAICO EV 网站。

你的任务是：

> 保留当前 TAICO EV 的 typography、grid、card、color、spacing 和现代技术感，增加真实产品、应用场景、技术视觉和可验证 Evidence，使用户在不阅读大量文字的情况下，也能快速理解 TAICO 是谁、卖什么、能做什么、为什么值得信任。

核心视觉模型：

```text
Product
   ↓
Context
   ↓
Capability
   ↓
Evidence
```

简称：

**PCCE**

任何新增图片、插画、Render、照片或视觉组件，都必须服务于至少一个 PCCE 角色。

---

# 2. Primary Design Principle

不要把“增加图片”理解成“装饰页面”。

正确目标是：

```text
Current TAICO
=
Typography
+ Card
+ Grid
+ Gradient
+ Decorative Line

Target TAICO
=
Current TAICO Design System
+ Product Reality
+ Application Reality
+ Manufacturing Reality
+ Project Reality
```

最终目标：

> **Make the physical business visible.**

---

# 3. What to Learn from BESEN

不要复制 BESEN 的颜色、字体、布局或视觉语言。

只学习它的视觉销售逻辑。

## 3.1 Hero

BESEN 的首屏通常通过：

```text
EV
+
Charging Product
+
Application Environment
```

让用户几乎不需要阅读正文，就能判断：

> 这是一个 EV Charging Manufacturer 网站。

TAICO 的 Hero 也应该优先建立这种 **Instant Category Recognition**。

---

## 3.2 Visual Evidence Chain

BESEN 不只是“放很多图”。

不同图片承担不同信任任务：

| Visual | Business Meaning |
|---|---|
| Product | 我们有这个产品 |
| Installation | 产品可以真实部署 |
| Factory | 我们是实体制造商 |
| Testing | 我们有质量控制 |
| Exhibition | 我们在真实市场活动 |
| Packaging | 我们能出口交付 |
| Shipment | 我们在持续出货 |
| Project | 客户已经在使用 |

因此：

> 每张图都应该回答一个采购问题。

---

## 3.3 Homepage Visual Flow

建议按照以下采购认知顺序组织视觉：

```text
Who are you?
↓
What do you sell?
↓
Where is it used?
↓
Can you manufacture it?
↓
Why should I trust you?
↓
Who has used it?
↓
What should I do next?
```

---

# 4. Current TAICO Visual Problem

TAICO 当前主要问题不是 Design System。

当前 UI 已经具备：

- clean layout
- clear hierarchy
- modern typography
- soft blue / white
- rounded cards
- structured information
- technical feeling

真正缺少的是：

**Visual Evidence Density**

大量页面当前主要依赖：

```text
Text
+
Card
+
Gradient
+
Border
+
Decorative Graphic
```

导致页面容易产生：

```text
SaaS
Documentation
AI Startup
Developer Platform
```

而不是：

```text
EV Charging Manufacturer
Engineering Company
Physical Product Business
Industrial Supplier
```

本轮改造的核心不是添加更多 UI，而是添加更多 **Reality**。

---

# 5. Two Visual Systems

必须严格区分：

## A. Product Visual System

负责：

```text
LOOK
+
UNDERSTAND
```

包括：

- Product Hero
- Product Render
- Product Detail
- Product Installation
- Scenario Visual
- Technical Diagram
- Comparison Visual
- Annotated Product Visual

---

## B. Evidence Visual System

负责：

```text
TRUST
```

包括：

- Factory
- Assembly
- Testing
- Certification
- Shipment
- Exhibition
- Customer Visit
- Real Installation
- Project Case

两套系统可以出现在同一页面，但不能混淆语义。

---

# 6. AI Visual Policy

AI 可以大量用于“橱窗层”，但不能污染 Evidence。

---

## F1 — Exact Product

来源：

- real photography
- CAD
- 3D render
- approved product render

具体产品必须准确。

适用于：

- Product Page
- Specs
- Comparison
- Documentation
- Buyer Guide
- Technical Article

要求：

```text
Product Fidelity = Exact
```

---

## F2 — Reference-Locked AI

推荐用于快速建立 TAICO 场景资产库。

流程：

```text
Real Product Reference
↓
Lock Product Shape
↓
Generate Environment
↓
Composite / Relight
↓
Human QA
↓
Approved Asset
```

AI 可以调整：

- environment
- lighting
- vegetation
- people
- vehicles
- background
- atmosphere
- camera composition

AI 不允许改变：

- enclosure shape
- screen position
- connector
- cable
- logo
- button
- product proportions
- mounting logic
- interface layout

适用于：

- Homepage Hero
- Family Hero
- Solution Hero
- Resources Hero
- Campaign Visual

---

## F3 — Conceptual

纯概念视觉。

可以表现：

- smart charging
- EV ecosystem
- load balancing
- energy flow
- charging network

不应表现为：

> 某个具体真实型号的真实项目照片。

主要用于：

- Knowledge
- Campaign
- Abstract technical concept

---

# 7. Evidence Level

每个视觉资产必须具备 Evidence Level。

---

## L0 — Decorative

包括：

- gradient
- abstract background
- AI atmosphere
- decorative line

用途：

视觉辅助。

证据价值：

**0**

---

## L1 — Render

包括：

- approved 3D render
- studio render

用途：

展示产品。

证据价值：

证明产品设计存在，但不证明生产与交付。

---

## L2 — Real Product

包括：

- real product photography
- real sample photography

用途：

证明实际产品存在。

---

## L3 — Operational Evidence

最高等级。

包括：

- real factory
- real assembly
- real testing
- real project
- real installation
- real customer visit
- real shipment
- real exhibition

长期目标：

```text
L0 ↓
L1 stable
L2 ↑
L3 ↑↑
```

---

# 8. Mandatory Truth Rule

以下内容禁止使用 AI 生成图伪装成真实 Evidence：

- Factory
- Production Line
- Testing
- Certification
- Customer Project
- Customer Visit
- Shipment
- Exhibition
- Case Study

AI 可以：

- crop
- relight
- clean background
- remove visual noise
- correct perspective
- create layout composition

但不能改变：

> “这件事情是否真实发生过”。

---

# 9. Homepage Refactor Standard

Homepage 的首要任务：

> 用户 1 秒内知道 TAICO 做 EV Charging。

推荐 Hero 内容：

```text
EV
+
TAICO Charger
+
Application Environment
```

推荐场景：

- commercial parking
- residential garage
- workplace parking
- apartment parking

避免：

- 纯 floating product render
- 纯抽象渐变
- 与充电无关的 generic smart city
- stock-tech background

推荐首页结构：

```text
Hero
↓
Product Families
↓
Applications
↓
Why TAICO / Capability
↓
Factory / Testing Evidence
↓
Project Evidence
↓
Certification
↓
CTA
```

---

# 10. Resources Page Refactor Standard

当前 Resources Hero 是第一轮推荐测试页面。

目标：

保留当前 Typography 和整体 Container 体系，但加入：

> Product + Engineering Context Visual

Desktop 推荐：

```text
┌──────────────────────────────────────────────┐
│ TEXT 42%           │ VISUAL 58%              │
│                    │                         │
│ VERIFIED RESOURCES │ TAICO Charger           │
│                    │ Datasheet               │
│ Title              │ Laptop                  │
│ Description        │ Connector               │
│ CTA                │ Technical Drawing       │
│                    │                         │
└──────────────────────────────────────────────┘
```

Mobile：

```text
Text
↓
Visual
```

推荐视觉：

```text
TAICO Charger
+
Datasheet
+
Laptop / Tablet
+
Connector
+
Engineering Drawing
```

页面应该产生：

> EV Charging Technical Resource Center

的感觉，而不是普通 Blog。

---

# 11. Family Page Standard

例如：

```text
AC EV Chargers
```

Hero 应包含：

```text
Product Family
+
Typical Application Context
```

避免：

> 3 台白底产品并排后就结束。

推荐结构：

```text
Family Hero
↓
Product Range
↓
Comparison
↓
Installation
↓
Technical Features
↓
Selection Guidance
↓
Case Evidence
```

目标：

> 帮助采购理解这个产品家族，并继续进入选型。

---

# 12. Solution Page Standard

Solution 页面最重要的是：

**Context**

例如：

Residential EV Charging

Hero 首先表现：

```text
House
+
Garage
+
EV
+
Charger
```

而不是：

```text
Big Charger Render
```

推荐结构：

```text
Application Hero
↓
Customer Problem
↓
System Architecture
↓
Recommended Products
↓
Installation
↓
Project Evidence
↓
CTA
```

Solution Visual 应先告诉用户：

> 这个方案在哪里使用。

---

# 13. Product Page Standard

Product Page 不允许过度 AI 化。

优先使用：

- real product
- approved render
- engineering diagram
- real installation

推荐结构：

```text
Product Hero
↓
Key Features
↓
Real Product Detail
↓
Specifications
↓
Installation
↓
Dimensions
↓
Testing
↓
Certification
↓
Real Project
↓
CTA
```

Product Page 的目标：

> 从“看起来不错”逐步进入“可以拿来做项目”。

---

# 14. Knowledge Page Standard

Knowledge 页面视觉重点不是摄影。

优先：

```text
Diagram
Comparison
Workflow
Annotated Product
Architecture
Selection Matrix
```

原则：

> Diagram > Decorative Image

图片必须帮助用户：

- understand
- compare
- select
- install
- troubleshoot

---

# 15. Case Study Standard

Case Study 是 Evidence Page。

严禁使用 AI 场景冒充项目。

每个完整 Case 建议至少包含：

```text
01 Site Overview
02 Installed Product
03 Product Close-up
04 Electrical / Construction Detail
05 Operating Environment
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

Case Study 中：

> Real Photography > Beautiful Photography

真实性优先于视觉完美。

---

# 16. Factory / Capability Standard

不要只建立一个巨大 Factory Gallery。

每张图片必须证明一个能力。

例如：

```text
Factory Exterior
→ 实体制造能力

Assembly
→ 组装能力

Aging Test
→ 老化测试能力

Electrical Test
→ 电气安全测试

Packaging
→ 出口包装能力

Container Loading
→ 国际交付能力
```

Caption 必须有信息。

GOOD：

```text
Final functional testing before shipment
```

BAD：

```text
TAICO Factory
```

---

# 17. Technical Visual Library

建立可复用技术视觉库：

```text
AC vs DC Charging
Single Phase vs Three Phase
Load Balancing
OCPP Architecture
Residential Charging Layout
Commercial Parking Layout
Connector Types
Installation Workflow
Power Selection
Charging Workflow
```

这些视觉应该被多个页面复用。

不要为每篇文章重复重新绘制同一概念。

---

# 18. Asset Directory

推荐：

```text
src/assets/

product/
  TKMC-A/
    hero/
    front/
    side/
    detail/
    dimension/
    installation/

scenario/
  residential/
  apartment/
  workplace/
  commercial/
  fleet/

factory/
  exterior/
  assembly/
  testing/
  warehouse/
  packaging/

project/
  UK/
  Germany/
  Middle-East/

certification/

technical/
  diagrams/
  comparison/
  workflow/

business/
  exhibition/
  customer-visit/
  shipment/
```

---

# 19. Asset Metadata

图片不要只依赖 filename。

建议至少包含：

```yaml
id:
type:
product:
application:
visual_source:
product_fidelity:
evidence_level:
approved_for:
not_approved_for:
status:
```

Example：

```yaml
id: residential-charging-001

type: scenario

product:
  - TKMC-A

application:
  - residential

visual_source:
  product: real_reference
  environment: ai_generated

product_fidelity: F2

evidence_level: L0

approved_for:
  - homepage
  - family
  - solution

not_approved_for:
  - case-study
  - factory
  - certification

status: approved
```

---

# 20. SEO Image Standard

所有正式图片优先使用：

```text
AVIF
WebP
```

必须设置：

```text
width
height
```

避免：

```text
CLS
```

优先：

```text
srcset
sizes
lazy-loading
```

但 Hero / LCP 图片不要错误 lazy-load。

Filename 必须语义化。

GOOD：

```text
taico-22kw-ac-ev-charger-residential.webp
```

BAD：

```text
IMG_923492.webp
```

---

# 21. Alt Text Standard

Alt Text 描述：

> 图片中真正存在的内容。

GOOD：

```text
TAICO wall-mounted AC EV charger in a residential garage setting
```

BAD：

```text
best cheap EV charger manufacturer China AC EV charger supplier
```

禁止：

Keyword Stuffing。

AI 概念图不能写成：

```text
TAICO EV charging project in Germany
```

除非它真的来自德国项目。

---

# 22. Component Strategy

不要每个页面手写一套图片逻辑。

推荐建立：

```text
VisualHero
ScenarioHero
ProductGallery
ProductDetailGallery
EvidenceCard
EvidenceStrip
TechnicalDiagram
ProjectGallery
CertificationPanel
```

组件应该支持：

```text
asset
visualType
productFidelity
evidenceLevel
caption
alt
```

Example：

```astro
<VisualHero
  type="scenario"
  asset={heroAsset}
  evidenceLevel="L0"
  productFidelity="F2"
/>
```

---

# 23. Visual QA

所有正式视觉进入网站前必须经过 QA。

## Product QA

```text
[ ] enclosure shape correct
[ ] screen correct
[ ] button correct
[ ] connector correct
[ ] cable correct
[ ] logo correct
[ ] proportions correct
[ ] mounting logic correct
```

任何关键结构错误：

```text
REJECT
```

---

## Engineering QA

```text
[ ] installation direction reasonable
[ ] cable path reasonable
[ ] connector correct
[ ] EV placement reasonable
[ ] charger scale reasonable
[ ] electrical scene has no obvious technical error
```

---

## Evidence QA

如果：

```text
evidence_level = L3
```

必须检查：

```text
[ ] real project
[ ] real factory / test / shipment
[ ] traceable source
[ ] page claim matches reality
[ ] no AI-generated factual fabrication
```

---

# 24. Minimum Asset Set

第一阶段不要追求几千张图片。

先建立约 100 个高价值资产。

建议：

| Asset | Target |
|---|---:|
| Main Product Hero | 8–12 |
| Product Detail | 30 |
| Installation / Reference-Locked Scenario | 10 |
| Factory | 10 |
| Testing | 10 |
| Packaging / Shipment | 8 |
| Certification | 全部整理 |
| Complete Case | 3 |
| Technical Diagram | 10 |
| Exhibition / Customer Visit | 10 |

原则：

> 100 张结构化资产 > 1000 张无结构照片。

---

# 25. Implementation Phases

禁止一次重构整个网站。

按照：

```text
Phase 1
Resources Hero

Phase 2
Homepage Hero

Phase 3
Product Family Pages

Phase 4
Solution Pages

Phase 5
Product Detail Pages

Phase 6
Evidence Components

Phase 7
Case Study System
```

每个 Phase：

```text
Audit
↓
Proposal
↓
Implementation
↓
Screenshot
↓
Compare
↓
QA
↓
Commit
```

---

# 26. Required Grok Output Before Coding

每轮修改前，先输出：

## Current Problem

当前视觉和内容问题。

## Proposed Change

准备怎么改。

## Why

为什么这比当前方案更好。

## Preserve

哪些现有设计必须保留。

## Files

计划修改哪些文件。

## Assets Needed

需要哪些视觉资产。

## Risk

可能影响：

- layout
- responsiveness
- SEO
- performance
- accessibility

## Acceptance Criteria

如何判断本轮成功。

如果任务明确要求 “audit only”：

> 不允许直接改代码。

---

# 27. Required Grok Output After Coding

实施后输出：

## Changed

具体改了什么。

## Files Changed

修改文件列表。

## Visual Impact

桌面 / 手机端变化。

## SEO Impact

说明：

- LCP
- image size
- semantic structure
- alt
- CLS
- lazy-loading

是否变化。

## QA Result

逐项检查结果。

## Remaining Assets

还缺哪些：

- photo
- render
- project evidence
- certification
- diagram

## Next Recommended Step

只推荐一个最优先下一步。

---

# 28. Acceptance Criteria

整个视觉改造最终满足：

### A. Instant Recognition

用户不读正文，也可以识别：

> TAICO 是 EV Charging Company。

### B. Page-Type Differentiation

Homepage / Family / Solution / Product / Resources / Case

拥有不同视觉职责。

### C. Product Fidelity

具体产品外观保持一致。

### D. Truth Separation

AI Visual 与 Real Evidence 清晰区分。

### E. Evidence Growth

L2 / L3 Visual 占比持续增加。

### F. Performance

不能明显降低 Core Web Vitals。

### G. Existing Brand Preservation

继续保持 TAICO：

```text
clean
technical
modern
structured
light
```

的视觉语言。

---

# 29. First Recommended Task

第一轮建议只改：

> Resources Hero

Prompt：

```text
Read GROK_VISUAL_REFACTOR_GUIDE.md first.

Audit the current TAICO EV Resources page.

Do not modify code yet.

Focus specifically on the existing large blue-bordered hero section.

Evaluate:

1. current information hierarchy
2. current visual hierarchy
3. why it feels like a documentation / SaaS page
4. where a Product + Engineering Context visual can be introduced
5. which existing design tokens and components should be preserved
6. desktop and mobile layout
7. recommended image aspect ratio
8. responsive behavior
9. LCP / CLS / SEO implications
10. required image assets

Target desktop layout:

42% text
58% visual

Visual direction:

TAICO Charger
+
Datasheet
+
Laptop / Tablet
+
Connector
+
Technical Drawing

Do not redesign the rest of the page.

Do not change the TAICO Design System.

Do not invent product details.

Return:

Current Problem
Proposed Change
Why
Preserve
Files
Assets Needed
Risk
Acceptance Criteria

Wait for approval before implementation.
```

---

# 30. Final Principle

不要衡量：

> “我们现在是不是有更多图片了？”

要衡量：

> “用户现在是不是更快理解了产品、更相信这家公司、更容易进入下一步选型或询盘？”

最终系统：

```text
TAICO Design System
+
Product Visual System
+
Evidence Asset System
+
Structured Metadata
+
Reusable Components
=
B2B Manufacturing Brand System
```

**Do not decorate the website. Make the business visible.**
