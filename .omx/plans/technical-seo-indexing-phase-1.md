# TAICO EV 第一阶段自然流量优化计划：技术 SEO 与收录

## 目标与范围

在不写博客、不购买外链、不改版首页的前提下，让 `taicoev.com` 的现有有效页面能够被 Google、Bing 和 AI 搜索爬虫稳定发现、正确归一化并提交收录。

本阶段只处理：

- XML sitemap
- robots.txt
- 真正的 404 响应
- canonical 与索引控制
- `www` 到主域名的统一
- Google Search Console / Bing Webmaster Tools 提交与验证
- 最小自动化回归检查

本阶段不处理：博客系统、文章选题、外链投放、多语言、页面重设计、未经确认的客户案例或商业数据。

## 已确认基线

- Astro 已配置主站地址 `https://taicoev.com` 和尾斜杠规则，但尚未配置 sitemap 集成：`website/astro.config.mjs:7-17`。
- 全局布局已有 title、description、Organization 和 WebSite JSON-LD，但没有 canonical 或页面级 robots 控制：`website/src/layouts/Layout.astro:7-46`。
- `/thank-you/` 是表单完成页，目前没有 `noindex`：`website/src/pages/thank-you.astro:1-5`。
- `website/public/` 中没有项目自有的 `robots.txt`；Cloudflare 当前返回的 managed robots 内容后面拼接了首页 HTML。
- 线上 `/sitemap.xml` 与 `/sitemap-index.xml` 返回首页 HTML，而不是 XML。
- 线上任意不存在的路径返回首页和 HTTP 200；Cloudflare Pages 在缺少顶层 `404.html` 时会按 SPA 回退处理。
- `www.taicoev.com` 与 `taicoev.com` 当前都直接返回 HTTP 200，没有统一到一个主域名。
- `website/public/llms.txt:12` 声明了不存在的 `/solutions/` 汇总路由。

## 验收标准

1. `npm test` 和 `npm run build` 均通过。
2. 构建产物包含 `dist/sitemap-index.xml`、至少一个 sitemap 分片和顶层 `dist/404.html`。
3. sitemap 中只包含返回 200 的规范公开页面；不包含 `/404/`、`/thank-you/`、查询参数 URL 或不存在的 `/solutions/`。
4. `https://taicoev.com/robots.txt` 返回纯文本、HTTP 200，包含 `Allow: /` 和 `Sitemap: https://taicoev.com/sitemap-index.xml`，末尾不再拼接 HTML。
5. 一个随机不存在的生产 URL 返回 HTTP 404，不能返回首页 200。
6. 每个可索引 HTML 页面包含一个绝对地址的自引用 canonical；canonical 不包含 UTM 或其他查询参数，并遵守尾斜杠格式。
7. `/thank-you/` 返回 200，但包含 `noindex, nofollow`，并且不出现在 sitemap 中。
8. `https://www.taicoev.com/<path>` 使用单次永久重定向到 `https://taicoev.com/<path>`；路径和查询参数得到保留。
9. 首页、一个 Solution、一个 Product、Product Comparison 和 Contact 页面在 Google Search Console URL Inspection 中均可抓取且 canonical 正确。
10. Google Search Console 成功读取 sitemap，初次状态没有 XML 解析错误；Bing Webmaster Tools 同样提交该 sitemap。
11. 现有 Organization/WebSite/Product/BreadcrumbList JSON-LD 保持不丢失、不重复，不新增价格、库存、认证、客户、ROI 或其他未验证声明。

## 实施步骤

### 1. 固化 SEO 回归检查

涉及文件：

- 新增 `website/tests/seo.test.ts`
- 复用 `website/package.json:7-14` 已有 Node test runner

最小检查覆盖：

- sitemap 配置存在并排除 `/thank-you/` 与 `/404/`
- robots.txt 声明规范 sitemap URL
- Layout 输出 canonical 和可配置的 robots meta
- Thank-you 页面明确传入 noindex
- 404 页面存在

目的：让后续内容扩展不能悄悄破坏收录基础，不引入测试框架或额外脚手架。

### 2. 使用 Astro 官方 sitemap 集成

涉及文件：

- `website/package.json`
- `website/package-lock.json`
- `website/astro.config.mjs:1-18`

操作：

- 安装官方 `@astrojs/sitemap`，复用已有 `site: 'https://taicoev.com'`。
- 在 sitemap 配置中排除 `/thank-you/` 和 `/404/`。
- 不设置 Google 会忽略的虚构 priority/changefreq，也不添加不真实的 lastmod。
- 在 Layout 的 `<head>` 增加 `<link rel="sitemap" href="/sitemap-index.xml">`。

选择官方集成的原因：它能直接读取 Astro 静态路由和 `getStaticPaths()` 生成的产品/方案页面，比维护手写 URL 清单更少代码、更不易遗漏。

### 3. 修复 404 与 SPA 回退

涉及文件：

- 新增 `website/src/pages/404.astro`

操作：

- 建立符合现有 Layout、Header、Footer 和可访问性样式的简洁 404 页面。
- 页面提供返回首页、Products 和 Solutions 区域的真实链接。
- 输出 `noindex, follow`。
- 不使用 catch-all 重写；依靠 Cloudflare Pages 在存在顶层 `404.html` 时恢复正常静态 404 行为。

构建后必须确认生成的是顶层 `dist/404.html`，而不是仅有 `dist/404/index.html`。

### 4. 增加 canonical 与页面级索引控制

涉及文件：

- `website/src/layouts/Layout.astro:7-46`
- `website/src/pages/thank-you.astro:1-5`

操作：

- Layout 增加最小 Props：`canonicalPath?` 与 `robots?`。
- 默认 canonical 从当前 pathname 和 `https://taicoev.com` 生成，主动丢弃 query/hash。
- 默认 robots 为 `index, follow`；Thank-you 页面显式设置 `noindex, nofollow`；404 页面设置 `noindex, follow`。
- 保留现有 Organization/WebSite schema 和产品页 slot 注入方式，不建立新的 SEO 抽象层。

### 5. 提供干净的 robots.txt

涉及文件：

- 新增 `website/public/robots.txt`
- 修正 `website/public/llms.txt:9-20`

robots.txt 最小内容：

```text
User-agent: *
Allow: /

Sitemap: https://taicoev.com/sitemap-index.xml
```

同时删除 `llms.txt` 中不存在的 `/solutions/` 汇总 URL；保留六个真实 Solution 详情页。

部署后检查 Cloudflare Managed robots.txt 的合并结果。如果 Cloudflare 仍在项目 robots 内容后拼接 HTML，则在 Cloudflare Dashboard 关闭该 zone 的 managed robots.txt，保留仓库文件为唯一来源。训练爬虫策略不在本阶段修改；普通搜索和 OAI-SearchBot 继续允许抓取。

### 6. 统一主域名

外部配置：Cloudflare zone `taicoev.com`。

操作：

- 建立 Cloudflare Single Redirect：`www.taicoev.com/*` 永久跳转到 `https://taicoev.com/$path`，保留 query string。
- 不删除当前 Pages Custom Domain；只统一公开访问入口。
- 先用预览/规则表达式检查目标，再启用生产规则。

验收时首页、Product URL、带 UTM 的 Contact URL 各测试一次，必须只有一次 301/308 后到达 apex 200。

### 7. 本地与构建产物验证

在 `website/` 执行：

```sh
npm test
npm run build
test -f dist/404.html
test -f dist/sitemap-index.xml
test -f dist/sitemap-0.xml
rg -n 'rel="canonical"|name="robots"|rel="sitemap"' dist/index.html dist/contact/index.html dist/thank-you/index.html dist/404.html
rg -n 'thank-you|/404/' dist/sitemap-*.xml
```

最后一个 `rg` 预期无匹配。另用 XML parser 或 `xmllint --noout` 校验 sitemap，而不是只检查文件存在。

### 8. 按项目标准部署并验证生产

流程：

1. 检查 diff，确保只包含本阶段文件。
2. 提交并推送 `main`，由 GitHub → Cloudflare Pages 自动部署。
3. 等待 production deployment 成功。
4. 对 apex、www、robots、sitemap、404、thank-you 和代表性页面执行真实 HTTP 检查。
5. 检查页面 HTML 中的 canonical/robots/schema，而不仅是状态码。

生产探针至少覆盖：

```sh
curl -I https://taicoev.com/nonexistent-seo-check/
curl -I https://www.taicoev.com/products/tkmc-800/?utm_source=seo-check
curl -sS https://taicoev.com/robots.txt
curl -sS https://taicoev.com/sitemap-index.xml
curl -sS https://taicoev.com/contact/?utm_source=seo-check
curl -sS https://taicoev.com/thank-you/
```

### 9. 搜索引擎提交与基线记录

需要站点所有者执行或授权的外部步骤：

- 在 Google Search Console 创建/确认 Domain Property `taicoev.com`。
- 提交 `https://taicoev.com/sitemap-index.xml`。
- 使用 URL Inspection 检查：首页、`/solutions/emergency-ev-charging/`、`/products/tkmc-800/`、`/resources/product-comparison/`、`/contact/`。
- 仅对这五个代表 URL 请求首次索引，不批量重复提交全部页面。
- 在 Bing Webmaster Tools 导入 Search Console 或单独验证，并提交同一个 sitemap。
- 记录执行日期、已发现 URL、已索引 URL、排除原因和首次 impressions，作为第二阶段内容计划基线。

## 预计工作量与完成定义

- 仓库实现与本地验证：约 0.5–1 个工作日。
- Cloudflare 规则、部署和生产验证：约 0.5 个工作日。
- Search Console/Bing 提交：约 30 分钟；实际收录可能需要数天到数周，不作为代码交付阻塞条件。

第一阶段完成的定义不是“Google 已经排名”，而是：技术验收全部通过、搜索引擎能读取 sitemap、代表 URL 可抓取且 canonical 正确、后续能从 Search Console 获得可靠的曝光与查询数据。

## 风险与缓解

- **Cloudflare Managed robots 继续改写响应：** 部署后检查真实响应；若仍污染内容，关闭 managed robots，使用仓库内 robots.txt。
- **404 页面未生成顶层文件：** 构建直接检查 `dist/404.html`；未满足则停止部署并调整 Astro 路由输出。
- **www 重定向形成循环或丢失参数：** 启用前检查规则条件，只匹配 host；生产分别测试路径和 query。
- **sitemap 收录表单完成页：** 配置过滤并用自动测试、XML 检查双重验证。
- **canonical 与尾斜杠/查询参数不一致：** 统一用 Astro 配置的 apex + pathname 生成，并在带 UTM 的生产 URL 上检查。
- **修改破坏现有结构化数据：** 构建后抽查首页和 TKMC-800 JSON-LD，确保现有 schema 不变。
- **过早依据 `site:` 判断失败：** 最终以 Search Console Coverage、URL Inspection 和 Performance 为准。

## 进入第二阶段的门槛

以下条件持续满足 7 天后，再启动第一批 SEO/GEO Guides：

- Search Console 能成功读取 sitemap。
- 代表 URL 无抓取阻断、soft 404 或 canonical 冲突。
- 至少开始出现 impressions，或 Search Console 明确给出尚未索引的可诊断原因。
- Cloudflare Web Analytics 能区分自然搜索 referral 与 direct/internal 流量。

若 7–14 天后仍为零索引，先根据 URL Inspection 原因修复，不用增加博客数量掩盖技术问题。
