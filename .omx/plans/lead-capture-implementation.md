# TAICO EV 询盘与 ICP 分析闭环实施计划

## 目标

把现有询盘校验器和内部 ICP 匹配器接成可部署的最小闭环：客户从 `/contact/` 提交结构化询盘，Pages Function 在服务端校验并计算 ICP 匹配，将询盘、来源和匹配快照写入 Cloudflare D1，保存成功后再发送销售通知。

## 现状与边界

- 复用 `website/functions/lib/lead.ts:1-80` 的字段规范化与校验，不另建 service/repository/factory。
- 复用 `website/src/lib/icp/matcher.ts:148-170` 的纯函数匹配；浏览器不得提交或覆盖评分结果。
- `website/src/components/CtaBand.astro:10-39` 当前仍指向 `mailto:`，主要 CTA 尚未进入统一联系页。
- `website/wrangler.jsonc:1-6` 尚无 D1、邮件或 Turnstile 配置。
- 参考 `docs/plans/lead-capture-prd.md:491-678`，但按 Ponytail 原则只实现本次闭环。
- 不做 CRM、询盘后台、附件、自动分配、行为数据仓库或自由文本 AI 评分。
- ICP 输出为内部销售排序快照；不得自动提升证据等级，不得向访客展示“强/弱客户”判断。

## 数据流

1. CTA 带 `source`、`product`、`solution` 或 `application` 查询参数进入 `/contact/`。
2. 表单提交到 `POST /api/leads`，支持标准浏览器表单；需要时也可返回 JSON。
3. Function 检查请求方法、Content-Type、Origin、请求体大小、蜜罐和 Turnstile，再调用现有 `validateLead()`。
4. Function 只使用受控字段组装 `IcpMatchContext`，在服务端调用 `matchIcp()`。
5. 用 prepared statement 写入 D1；`submission_key` 唯一索引保证网络重试不产生第二条询盘。
6. D1 成功后才返回成功/303；邮件通知异步执行并把 `notification_status` 更新为 `sent` 或 `failed`。
7. 邮件失败不影响已保存询盘；数据库失败绝不显示成功，并提供现有销售邮箱兜底。

## 实施步骤

### 1. 对齐询盘字段和 ICP 上下文

- 扩展 `website/functions/lib/lead.ts`：加入受控 `companyType`、页面来源、product/application/solution slug、UTM/referrer、submission key 和蜜罐字段。
- 只把匹配器已支持的受控值传给 `matchIcp()`；未知 slug 返回字段错误，不静默进入数据库。
- 增加生成邮件正文和持久化记录所需的最小纯函数。
- 扩展 `website/tests/lead.test.ts`，覆盖规范化、枚举、来源字段、未知输入丢弃、header 注入和匹配上下文映射。

### 2. 建立 D1 最小数据模型

- 新增 `website/migrations/0001_create_leads.sql`。
- 单表 `leads` 保存：联系信息、需求、来源、UTM、`icp_decision`、首选 `icp_slug/fit_score/fit_band`、`rule_version`、完整 `match_json` 快照、通知状态和时间戳。
- `submission_key` 建唯一约束；不拆分 ICP、UTM、通知历史子表。
- 更新 `website/wrangler.jsonc`，声明 `LEADS_DB` binding；真实 database id、Turnstile secret 和邮件配置不得写死或提交。

### 3. 实现 Pages Function

- 新增 `website/functions/api/leads.ts`，完成服务端校验、Turnstile siteverify、ICP 计算、D1 幂等插入和状态响应。
- 仅记录 lead id、结果状态和 request id；日志不得包含姓名、邮箱、电话、token 或 requirements 正文。
- 数据库失败返回可恢复错误；重复 submission key 返回原成功语义但不重复通知。
- 使用 Cloudflare 当前官方支持且不新增 npm 依赖的邮件发送能力；若本地没有实际 binding/凭据，保留类型安全的部署配置和可测试失败路径，不伪造发送成功。

### 4. 建立可访问联系页

- 新增 `website/src/pages/contact.astro`、`website/src/pages/thank-you.astro` 和 `website/src/components/LeadForm.astro`。
- 使用原生表单控件、label、required、autocomplete、错误摘要、可见焦点和 `aria-live`；无 JavaScript仍可提交。
- 表单只收集销售可行动的最少字段：name、company、company type、business email、country、application、phone（可选）、timeline（可选）、requirements、privacy consent。
- 查询参数只用于预填受控来源字段；成功页不回显 PII。

### 5. 统一 CTA 与来源

- 修改 `website/src/components/CtaBand.astro` 和 `website/src/components/Header.astro`，默认进入 `/contact/`。
- 修改首页、产品、方案、应用页的主要 CTA，传入稳定的 source/product/solution/application slug。
- 保留直接销售邮箱为错误兜底，而不是主要提交路径。

### 6. 验证与运维说明

- 使用现有 Node `node:test`，不增加测试框架或新依赖。
- 增加最小 Function/D1 fake 集成检查，覆盖：正常写入、非法输入、重复提交、ICP 快照、D1 失败、通知失败。
- 运行 `npm test` 与 `npm run build`。
- 写一份简短部署清单：创建 D1、执行 migration、配置 preview/production binding、Turnstile、邮件地址/secret、查询 `failed` 通知及回滚方式。
- 不实际部署生产或写入生产 D1，除非当前环境已具备明确授权和凭据。

## 验收标准

- `/contact/` 和 `/thank-you/` 可在生产构建中生成。
- 所有主要 CTA 进入 `/contact/`，产品/方案/应用来源可验证地随表单提交。
- 合法请求只在 D1 写入成功后返回成功；非法请求和 D1 失败均不得进入成功页。
- 同一 `submission_key` 多次提交只有一条 D1 记录和最多一次成功通知。
- ICP 由服务端计算并存储规则版本与完整快照；客户端伪造的 score/icp 字段被忽略。
- 邮件失败时记录仍存在，`notification_status=failed`；日志不泄露 PII。
- Turnstile 在服务端校验；本地测试路径使用官方测试 key 或显式 fake，不绕过生产校验。
- 表单可用键盘完成，错误与状态可被辅助技术感知，无 JS 可提交。
- `npm test` 全部通过，`npm run build` 成功，未新增运行时依赖。

## 风险与控制

- Cloudflare 邮件 binding 在账户中不可用：代码保留失败状态和部署清单，D1 仍是事实来源；不得以 `mailto:` 冒充可靠通知。
- 垃圾询盘：Turnstile、蜜罐、大小/长度限制；速率限制留给 Cloudflare 边缘规则，不在应用里造限流器。
- PII：只收询盘必要信息，日志脱敏；保留期限由业务在部署前确认。
- 表单与 ICP 枚举漂移：测试断言映射，未知值拒绝而非猜测。
- 工作树已有用户修改：执行者必须保留并适配，禁止回退无关改动。

## 验收命令

```sh
cd website
npm test
npm run build
git diff --check
```

人工检查：移动/桌面表单、键盘提交、无 JS 303、重复提交、D1/邮件故障、来源预填、日志脱敏。
