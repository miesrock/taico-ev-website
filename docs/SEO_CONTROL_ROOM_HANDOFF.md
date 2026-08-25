# TAICO SEO Control Room v1 Handoff

更新时间：2026-08-25（Asia/Shanghai）

把本文件交给下一次 Codex 继续维护。不要从头重建，也不要触碰未跟踪的 `SEOBlog/`。

## 当前结论

SEO Control Room v1 已完成实现、部署、首次同步和 Access 保护。

- 生产地址：<https://taicoev.com/preview/seo/>
- 页面标题：`TAICO SEO CONTROL ROOM`
- 未认证访问由 Cloudflare Access 拦截（HTTP 302）。
- 应用登录方式已限制为 One-time PIN；无 Cookie 读取登录页已出现 `Send login code`。
- 认证后可读取 GSC、URL Inspection、Sitemap 和文章结构数据。
- 未新增框架、Blog/CMS 或一级导航。

## Git 与本地位置

| 项目 | 值 |
|---|---|
| 仓库 | `miesrock/taico-ev-website` |
| 工作目录 | `/Users/zaoyi/TAICO/移动充电桩` |
| 站点目录 | `/Users/zaoyi/TAICO/移动充电桩/website` |
| 当前分支 | `main` |
| Control Room 提交 | `78be3bd feat: add SEO control room` |
| Worker 修复提交 | `01f654f fix: use runtime fetch in SEO sync` |
| 当前工作树 | 只有用户未跟踪的 `SEOBlog/`，不要删除、添加或格式化 |

继续前先运行：

```sh
cd "/Users/zaoyi/TAICO/移动充电桩"
git status --short
git log --oneline -5
```

## 代码结构

- `website/src/pages/preview/seo.astro`：Control Room 页面和 noindex/no-follow。
- `website/src/lib/seo-control-room.ts`：数据模型、确定性机会规则、覆盖统计。
- `website/functions/api/seo/control-room.ts`：认证后的 `GET /api/seo/control-room`。
- `website/seo-migrations/0001_create_seo_control_room.sql`：SEO D1 schema。
- `website/seo-sync/src/index.ts`：GSC、URL Inspection、Sitemap 同步。
- `website/seo-sync/wrangler.jsonc`：Worker 配置和 Cron。
- `website/tests/seo-control-room.test.ts`：Control Room 单元测试。

Worker 曾出现一次默认 `fetch` 被导出 Worker handler 遮蔽的问题，已在 `01f654f` 修复；不要把默认参数改回裸写 `fetch`。

## Cloudflare Pages 与 Access

### Pages

- Pages 项目：`taico-ev`
- GitHub 构建根目录：`website`
- 构建命令：`npm run build`
- 输出目录：`dist`
- 生产域名：`taicoev.com`

### Access

- Zero Trust team：`polished-voice-6653`
- 应用：`TAICO SEO Control Room`
- 应用 ID：`7a8c5b38-28af-40b4-9005-ea0a40b76a04`
- 保护路径：`taicoev.com/preview/*`、`taicoev.com/api/seo/*`
- Allow policy：`TAICO SEO owner only`
- 允许邮箱：`hezaoyi@gmail.com`
- 应用登录方式：只选 `onetimepin`，`Accept all available identity providers = false`

Cloudflare 新 Zero Trust 账号的内置 Cloudflare 登录方式是默认登录方式，不是 Identity Providers 列表中可删除的普通对象。本次没有删除它，而是新增 One-time PIN 并让本应用只允许它。不要再尝试删除一个不存在的全局 Cloudflare IdP。

## D1 与同步 Worker

- D1：`taico-ev-seo`
- D1 ID：`4b6cd678-ac2c-4aba-bd48-032987a64069`
- Pages / Worker 绑定名：`SEO_DB`
- Leads 数据库保持独立，不要复用。
- Worker：`taico-ev-seo-sync`
- Worker URL：<https://taico-ev-seo-sync.hezaoyi.workers.dev>
- GSC property：`sc-domain:taicoev.com`
- Sitemap：`https://taicoev.com/sitemap-index.xml`
- Cron：`0 1 * * mon`（中国时间周一 09:00）

Worker secrets 只有以下名称，值不得写入 Git、handoff 或聊天：

- `GSC_CLIENT_EMAIL`
- `GSC_PRIVATE_KEY`
- `SEO_SYNC_TOKEN`

手动同步时从安全存储读取 token，不要把真实 token 粘贴进终端历史：

```sh
curl -i -X POST \
  https://taico-ev-seo-sync.hezaoyi.workers.dev/run \
  -H 'Authorization: Bearer <configured SEO_SYNC_TOKEN>'
```

## 已同步数据基线

首次同步成功日期：`2026-08-22`；状态：`complete`。

| 指标 | 当前值 |
|---|---:|
| 当前 28 天 clicks | 0 |
| 当前 28 天 impressions | 30 |
| 当前 CTR | 0.0% |
| 当前平均位置 | 38.5 |
| Query/page rows | 2 |
| URL Inspection checked | 8 |
| Sitemap rows | 1 |

重复执行 `/run` 已验证幂等：仍只有 1 个 snapshot、2 个 metric rows、8 个 inspection rows 和 1 个 sitemap row。

Control Room 显示 `6 / 8` indexed、`8 checked` 是预期结果：两个重点页面为 `NEUTRAL / Not crawled`，不应计入 Indexed。

## 已完成验证

- `npm test`：56/56 通过。
- `npm run build`：37 个静态页面构建成功，Pages Functions 构建成功。
- Worker dry-run/build 成功。
- 生产未认证访问返回 Access 302。
- 生产 API 未认证访问返回 Access 302。
- `https://taico-ev.pages.dev/api/seo/control-room` 未认证返回 401，不绕过泄漏指标。
- 生产无 Cookie 登录页包含 `Log in to TAICO SEO Control Room` 和 `Send login code`。
- 认证后的页面已显示 Control Room、GSC 指标、8 个重点 URL、文章统计和查询明细。

## 下一次优先事项

1. 若用户收不到验证码，检查 `hezaoyi@gmail.com` 收件箱、垃圾邮件和 Cloudflare 邮件允许列表；不要代填验证码。
2. 每周 Cron 后检查 D1 是否新增一条完整 snapshot；GSC 延迟数日是正常的。
3. impressions 达到规则阈值后，检查机会建议是否按确定性规则出现；不要伪造 impressions、position 或 CTR。
4. 改 Access、D1、Worker secrets 或 GSC 权限前，说明影响并取得用户确认。
5. 代码改动后运行：

```sh
cd "/Users/zaoyi/TAICO/移动充电桩/website"
npm test
npm run build
```

6. 检查 Worker 部署：

```sh
npx wrangler deployments list --config seo-sync/wrangler.jsonc
```

## 安全与清理

- 不要在聊天、Git 或 handoff 中写入 GSC private key、Worker token、Access JWT、Cookies 或验证码。
- Downloads 中曾保存过 Google service-account JSON；确认 Worker secrets 已存在后，应将该文件移入 macOS 废纸篓（可恢复），再清理临时响应文件。
- 不要复制 Access redirect 的 `meta` JWT 或 Cookie。
- 不要删除 D1、Worker、Access 应用或生产域名来重做。
- 不要触碰 `SEOBlog/`。

## 尚未自动化

- Cloudflare 实际线上 301 和长期 Cron 仍需持续观察；本地/build 验证不能替代长期监控。
- URL Inspection 只反映 Google 已索引版本，不会自动请求收录。
- v1 不接入 GA4、Cloudflare Analytics、leads、Bing，也不会自动创建页面、文章或任务。
- 当前 Search Console 数据量较低，`0 opportunities` 不是错误，不应填充示例数据。
