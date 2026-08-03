# TAICO EV 特斯拉式顶栏扩展导航 — 项目实施计划书

| 字段 | 内容 |
|------|------|
| 项目 | TAICO EV 独立站（`taicoev.com`） |
| 主题 | 顶部 sticky 导航 + 悬停/聚焦扩展面板（Tesla-style mega nav） |
| 仓库 | 移动充电桩 / `website/` |
| 文档版本 | v1.0 |
| 状态 | 待实施 |
| 关联 | `docs/handoff.md`、`Agents.md`、既有 `Header.astro` |

---

## 1. 背景与目标

### 1.1 背景

当前站点已具备：

- Astro + TypeScript + Tailwind 静态站
- 全局 `Layout` 挂载 `Header` / `Footer`
- 内容数据层：`solutions` / `products` / `cases`
- Header 已使用 `sticky top-0` + 毛玻璃背景

但顶栏仅为**扁平文字链接**，与 Footer、数据层不同步；桌面无法预览子内容，移动端 `md` 以下导航直接隐藏且**无汉堡菜单**。

业务侧需要的是 B2B 解决方案导航，而非消费级电商选购。视觉与交互可借鉴特斯拉官网顶栏模式，内容与文案必须符合 TAICO EV 战略：

> **Solutions before products** — 先场景，后产品。

### 1.2 目标

在**不改变路由与页面信息架构**的前提下，将顶栏升级为：

1. **常驻 sticky** 顶栏（滚动不消失）
2. **悬停 / 键盘聚焦** 展开全宽内容面板（mega panel）
3. 面板内容由 **data 层驱动**（与 Footer 同源）
4. **移动端可用**（汉堡 + 全屏/抽屉菜单）
5. 保持现有深色 glass 视觉与主题切换能力
6. 可访问性（键盘、Esc、`aria-*`、减少动效偏好）

### 1.3 非目标（本期不做）

- 不引入 React / Vue 等 heavy island 框架（除非后续证明必要）
- 不做购物车、在线订单流
- 不改产品/案例真实数据与未验证指标
- 不手改 PDF；不新增未确认认证/ROI 文案
- 不重构整站 Layout 或重新设计全站视觉体系

---

## 2. 现状结构摘要

### 2.1 目录与职责

```text
website/src/
├── layouts/Layout.astro          # 全局壳：Header + main + Footer
├── components/Header.astro       # 顶栏（本期主改）
├── components/Footer.astro       # 已用 data 列全量子链
├── data/solutions.ts             # 3 条方案
├── data/products.ts              # 3 条产品（含 hero 图）
├── data/cases.ts                 # 4 条案例（含 hero 图）
├── pages/index.astro             # 首页锚点：#solutions #products #cases #company #contact
├── pages/solutions/[slug].astro
├── pages/products/...
└── pages/cases/...
```

### 2.2 当前顶栏

| 项 | 现状 |
|----|------|
| 定位 | `sticky top-0 z-50` |
| 样式 | `bg-void/70 backdrop-blur-xl` + 底边 |
| 导航 | Solutions → `/#solutions`；Products → `/products/`；Cases → `/cases/`；Company → `/#company` |
| CTA | Talk to a Specialist → `/#contact` |
| 主题 | `.theme-toggle` + `localStorage` |
| 移动 | nav `hidden md:flex`，无替代菜单 |
| 二级 | 无 |

### 2.3 信息架构（保持不变）

```text
Home (/)
├── #solutions / #products / #cases / #company / #contact
Solutions
├── /solutions/ev-dealership-charging/
├── /solutions/ev-roadside-assistance/
└── /solutions/ev-charging-without-grid-upgrade/
Products
├── /products/
├── /products/g2v/
├── /products/mobile-battery-station/
└── /products/commercial-energy-hub/
Cases
├── /cases/
└── /cases/{slug}/
```

---

## 3. 产品设计规格

### 3.1 特斯拉模式拆解（要抄的行为）

| 行为 | 说明 |
|------|------|
| 顶栏常驻 | sticky / fixed，始终可点 |
| 单容器扩展 | 一个向下展开的全宽面板，而非多个小气泡 dropdown |
| 内容切换 | hover 不同一级项时，面板内容切换、高度可动画 |
| 遮罩 | 展开时页面其余区域半透明，可点击关闭 |
| 离开关闭 | 指针离开整个 header 区域后延迟关闭；Esc 立即关闭 |
| 移动分流 | 触屏不做 hover mega，改用全屏/抽屉 |

### 3.2 TAICO 一级导航映射

| 一级 | 触发方式 | 面板内容 | 辅助链接 |
|------|----------|----------|----------|
| **Solutions** | hover / focus / 移动手风琴 | 3 场景卡：eyebrow、title、headline 摘要 | View all → `/#solutions` 或保留首页锚点策略 |
| **Products** | 同上 | 3 产品卡：hero 缩略图、model、title/tier | View all → `/products/` |
| **Cases** | 同上（P1） | 4 案例卡或列表：hero、eyebrow、title | View all → `/cases/` |
| **Company** | 直接跳转 `/#company`，可不展开 | — | — |
| **CTA** | 右侧固定按钮 | — | `/#contact` |

### 3.3 卡片信息字段（来自 data，不新造营销数字）

**Solutions 卡**

- `title`、`headline`（或截断 `summary`）
- `eyebrow`
- 链接：`/solutions/{slug}/`

**Products 卡**

- `model`、`title` 或短 `headline`
- `tier`
- `hero` 图片
- 链接：`/products/{slug}/`

**Cases 卡**

- `title`、`eyebrow`
- `hero` 图片
- 链接：`/cases/{slug}/`

### 3.4 视觉约束

- 沿用 void / glass / wave-cyan 体系，**不做特斯拉大白底**
- 收起：保持现有半透明顶栏
- 展开：面板 `bg-panel` / glass；顶栏可略加重不透明度
- 遮罩：深色半透明（如 `rgba(4,6,12,0.55)`）
- CTA 与主题切换保留在顶栏右侧（移动端 CTA 可缩略为 Contact）
- B2B 用语：Learn more / Talk to a Specialist，无 Order / Shop

### 3.5 无障碍与体验

- 触发器用 `button`（展开）或明确 `aria-expanded` / `aria-controls`
- 面板 `role="region"` 或合适 landmark；关闭时 `aria-hidden`
- 支持 Esc、Tab 焦点不困死
- `prefers-reduced-motion: reduce` 时关闭高度/透明度动画
- 移动端焦点管理：打开抽屉时焦点进入菜单，关闭后回到汉堡按钮

---

## 4. 技术方案

### 4.1 原则

1. **改动面最小化**：主改 `Header.astro`；可选抽取 `src/data/nav.ts` 或 `src/components/nav/` 小模块
2. **数据同源**：从 `solutions` / `products` / `cases` 映射导航视图，禁止 Header 硬编码子项文案
3. **无重框架**：Astro 静态 HTML + 少量 client `<script>`（与 theme toggle 同模式）
4. **移动与桌面分轨**：桌面 mega；移动抽屉/手风琴

### 4.2 建议 DOM 结构

```html
<header class="site-header sticky top-0 z-50" data-open="">
  <div class="bar">
    <!-- logo -->
    <!-- desktop: triggers Solutions / Products / Cases / Company -->
    <!-- theme + CTA -->
    <!-- mobile: hamburger -->
  </div>

  <!-- Desktop mega: 单面板，内部按 data-panel 切换 -->
  <div class="mega" id="mega-panel" hidden aria-hidden="true">
    <div class="mega-inner">
      <!-- panels -->
    </div>
  </div>

  <!-- Mobile drawer -->
  <div class="drawer" id="mobile-nav" hidden aria-hidden="true">
    <!-- accordion sections -->
  </div>

  <div class="backdrop" data-close hidden></div>
</header>
```

### 4.3 交互状态机（简化）

| 状态 | 条件 | UI |
|------|------|-----|
| `closed` | 默认 | 仅 bar |
| `mega:{key}` | 桌面打开某一级 | bar + mega + backdrop |
| `drawer` | 移动打开 | bar + drawer + backdrop |

事件：

| 事件 | 动作 |
|------|------|
| desktop `pointerenter` / `focusin` on trigger | `openMega(key)` |
| `pointerleave` 整个 header | delay ~120–200ms 后 `close()` |
| 进入另一 trigger | 切换 panel key，不先关再开（避免闪烁） |
| backdrop click / Esc | `close()` |
| 汉堡 click | 切换 `drawer` |
| 路由跳转（链接 click） | `close()` |
| 打开任意面板 | 可选 `document.body.style.overflow = 'hidden'` |

### 4.4 样式与动效

推荐用 **grid-template-rows: 0fr → 1fr** 做高度展开（优于难测的 max-height）：

```css
.mega {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.28s ease;
}
.site-header[data-open^="mega"] .mega {
  grid-template-rows: 1fr;
}
.mega-inner {
  overflow: hidden;
}
```

z-index 约定：

- header 整体 `z-50`（保持）
- backdrop 在 bar 下、页面上（或与 mega 同级、在 bar 下）
- 确保 `WaveField` 等装饰层不盖住 header

### 4.5 可选文件拆分

| 路径 | 用途 | 阶段 |
|------|------|------|
| `src/components/Header.astro` | 主组件 | P0 必改 |
| `src/data/nav.ts` | 导航视图类型 + 从 data 映射 | P0 建议 |
| `src/styles/global.css` | 少量 nav 专用 class（若 Tailwind 过长） | 按需 |
| 不新增页面路由 | — | — |

### 4.6 与 Layout 关系

`Layout.astro` **原则上不改**。若后续需要 `padding-top` 补偿 fixed 模式，再评估；本期优先继续 **sticky**，避免全站 main 偏移改造。

---

## 5. 分期实施计划

### 阶段 P0 — 核心可用（优先交付）

**范围**

- [ ] 从 data 映射 Solutions / Products 导航项
- [ ] 桌面：Solutions、Products mega 面板（卡片列表）
- [ ] 桌面：Company 仍为直接锚点链接
- [ ] 打开/关闭逻辑、Esc、backdrop、离开 header 延迟关闭
- [ ] 移动：汉堡按钮 + 抽屉；内含 Solutions / Products 链接组 + Cases / Company + CTA
- [ ] 保留 theme toggle 与 CTA
- [ ] 基础 `aria-expanded` / `aria-controls` / `aria-hidden`
- [ ] `prefers-reduced-motion` 处理

**验收标准**

1. 桌面 hover Solutions / Products 可看到对应子链与摘要，点击可到达正确 URL
2. 键盘可打开、切换、Esc 关闭
3. 宽度 &lt; `md` 可通过汉堡访问全部一级与关键子链
4. 主题切换仍可用；无控制台报错
5. `npm run build` 通过

**预估工作量**：0.5–1 人日

### 阶段 P1 — 完整导航与视觉抛光

**范围**

- [ ] Cases mega 面板（含缩略图）
- [ ] Products / Cases 卡片展示 hero 图（注意体积与 `loading="lazy"`）
- [ ] 展开时顶栏背景加重、遮罩过渡
- [ ] 当前路径高亮（pathname 匹配一级）
- [ ] 面板切换时减少闪烁（内容 crossfade 可选）
- [ ] 移动手风琴：点击一级展开子项

**验收标准**

1. 三个可展开一级均完整
2. 图片不导致明显 CLS；构建产物路径正确
3. 深/浅主题下对比度可读

**预估工作量**：0.5 人日

### 阶段 P2 — 体验增强（可选）

**范围**

- [ ] Company 轻量面板（About 锚点 + Contact）
- [ ] 更精细高度动画 / 焦点陷阱（drawer）
- [ ] 触控设备检测：有 hover 能力才启用 mega hover
- [ ] 分析埋点钩子（若后续接 analytics，仅预留 data 属性）
- [ ] 单元级交互手测清单写入 README 或 handoff 附录

**预估工作量**：0.5 人日（按需）

---

## 6. 任务分解与依赖

```text
[1] 定义 nav 视图类型与映射函数
        ↓
[2] 重构 Header 静态结构（bar + mega + drawer + backdrop）
        ↓
[3] 实现 desktop open/close 脚本
        ↓
[4] 实现 mobile drawer 脚本
        ↓
[5] 样式与主题适配
        ↓
[6] a11y + reduced-motion
        ↓
[7] 本地 dev 手测 → build → preview
        ↓
[8]（P1）Cases + 图片 + 高亮
```

依赖关系：

- [1] 依赖现有 `data/*.ts`，不改业务字段语义
- [3][4] 可在同一 `<script>` 内完成，注意只绑定一次（Astro 页面切换为 MPA 全刷新，相对简单）
- 图片资源已在 `public/products/`、`public/cases/`，P1 直接引用

---

## 7. 风险与对策

| 风险 | 影响 | 对策 |
|------|------|------|
| hover 与 click 在触控设备冲突 | 误开/关不了 | 移动断点强制 drawer；desktop 用 `matchMedia('(hover: hover)')` |
| 离开 trigger 进入 panel 时闪关 | 体验差 | 延迟 close；panel 仍在 header 内 |
| 面板内容过高 | 小高度笔记本遮挡过多 | 限制 max-height + 内部滚动；卡片用紧凑布局 |
| 图片过大 | 首屏变慢 | lazy、适当尺寸；必要时后续做压缩 |
| sticky + backdrop 层级错乱 | 点不到/遮不住 | 统一 z-index；手测首页 WaveField |
| 仅改 Header 导致文案双源 | 漂移 | 强制从 data 映射，禁止第二份硬编码子菜单 |
| 过度动画 | 违和 / 晕动 | 短时长 + reduced-motion 关闭 |

---

## 8. 测试计划

### 8.1 功能

| # | 场景 | 期望 |
|---|------|------|
| F1 | 桌面 hover Solutions | 面板展示 3 个 solution，链接正确 |
| F2 | 桌面 hover Products | 3 个 product，链接正确 |
| F3 | hover 从 Solutions 移到 Products | 内容切换，无明显闪断 |
| F4 | 指针移出 header | 延迟后关闭 |
| F5 | Esc / 点遮罩 | 立即关闭 |
| F6 | 点击子链接 | 到达详情页且菜单关闭 |
| F7 | Company / CTA | 跳转锚点或页面正确 |
| F8 | 移动汉堡 | 可访问全部导航 |
| F9 | 主题切换 | 开/关菜单前后均正常 |
| F10 | 深浅主题 | 面板文字对比度可接受 |

### 8.2 构建与回归

```sh
cd website
npm run dev      # 交互手测
npm run build    # 必须通过
npm run preview  # 静态产物确认
```

回归点：

- 首页、产品列表/详情、方案详情、案例列表/详情顶栏均正常
- Footer 未回归破坏
- 无新增未验证的性能数字文案

### 8.3 浏览器矩阵（最低）

- 最新 Chrome / Safari（桌面）
- iOS Safari 或 Chrome 窄屏模拟
- 系统「减少动态效果」开启时抽测

---

## 9. 交付物清单

| 交付物 | 说明 |
|--------|------|
| 更新后的 `Header.astro`（及可选 `nav.ts`） | 主代码 |
| 本实施计划书 | `docs/tesla-style-nav-implementation-plan.md` |
| 可选：handoff 追加一小节「导航交互」 | 便于后续交接 |
| 构建通过截图或本地验收记录 | 实施后补 |

---

## 10. 实施顺序检查表（给执行 Agent / 开发）

```text
P0
□ 读取 solutions / products / cases 结构，定义 NavItem 映射
□ 改写 Header 结构：bar / mega / drawer / backdrop
□ 桌面 Solutions + Products 面板内容
□ 交互脚本：open / close / Esc / leave delay / backdrop
□ 移动汉堡 + 抽屉链接树
□ a11y 属性与 reduced-motion
□ npm run build 通过 + 手测 F1–F9

P1
□ Cases 面板
□ 卡片图 + lazy
□ 路径高亮 + 顶栏展开态样式
□ 再测 F10 与全路由抽样

P2（可选）
□ Company 轻面板 / 焦点陷阱 / hover 能力检测
```

---

## 11. 成功定义（Definition of Done）

本期 **P0 完成** 即视为导航升级 MVP 成功：

1. 用户在桌面可通过顶栏**停留扩展**快速到达任一 Solution / Product 详情  
2. 用户在手机可通过菜单到达同等关键路径  
3. 导航子项与 `src/data/*` 同源，后续加产品/方案时顶栏自动跟上（或仅改 data）  
4. 视觉符合现有 TAICO EV 深色体系，且不破坏 theme toggle  
5. 生产构建通过，无阻断性 a11y 问题（键盘可关、焦点可辨）

P1 完成视为 **导航体验完整版**。

---

## 12. 附录

### A. 与特斯拉的差异备忘

| 特斯拉 | TAICO |
|--------|-------|
| Vehicles 主入口 | Solutions 主入口 |
| Order / Shop | Contact specialist |
| 白亮大面板 | Dark glass |
| 大量 SKU | 3 + 3 + 4，卡片可更大 |
| 消费品牌 | 海外 B2B OEM 品牌站 |

### B. 关键代码锚点（实施前）

- Header：`website/src/components/Header.astro`
- Layout：`website/src/layouts/Layout.astro`
- 全局样式：`website/src/styles/global.css`
- 数据：`website/src/data/{solutions,products,cases}.ts`
- 战略：`docs/handoff.md`、`Agents.md`

### C. 命令

```sh
cd website
npm install
npm run dev
npm run build
npm run preview
```

---

*本文档为实施计划，不含未验证的业务 KPI。执行时以仓库内 data 与 handoff 为内容真源。*
