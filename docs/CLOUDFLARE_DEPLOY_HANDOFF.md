# Handoff: Cloudflare Pages Deploy 失败排查

把本文件直接交给 **Codex / 新对话 / 工程师**。目标：查出为什么 Cloudflare Deploy 不了，并修到可上线。

---

## 0. 任务一句话

**GitHub 已推送，Cloudflare Pages Deploy 失败或无法完成。**  
请检查 Cloudflare 构建配置 + 仓库 monorepo 结构 + Node/Astro 构建兼容性，修到：

1. Cloudflare 构建成功  
2. 出现 `*.pages.dev` 预览 URL  
3. （可选）绑定 `taicoev.com` 的步骤文档可执行  

**不要**重写整站业务文案。只做部署相关修复。

---

## 1. 项目位置与远程

| 项 | 值 |
|----|-----|
| 本机路径 | `/Users/zaoyi/Desktop/移动充电桩` |
| GitHub | https://github.com/miesrock/taico-ev-website （**private**） |
| 默认分支 | `main` |
| 最近 commit | `4186d51` docs deploy status；`35d0e6b` 首版 scaffold |
| 远程 | `origin` → `https://github.com/miesrock/taico-ev-website.git` |
| 账号 | GitHub: `miesrock`（本机 `gh` 已登录） |
| Cloudflare CLI | **未登录**（`wrangler whoami` → not authenticated） |

站点代码在 monorepo 子目录：

```text
/Users/zaoyi/Desktop/移动充电桩/
├── docs/                 # 战略/handoff（PDF gitignore）
├── website/              # ★ Astro 站点（Cloudflare Root directory）
│   ├── package.json
│   ├── .nvmrc            # 22
│   ├── astro.config.mjs
│   ├── public/
│   └── src/
├── DEPLOY.md
├── README.md
└── AGENTS.md
```

---

## 2. 正确的 Cloudflare Pages 设置（预期）

| 配置项 | 必须值 | 常见错误 |
|--------|--------|----------|
| Source | GitHub `miesrock/taico-ev-website` | 连错仓库 / 未授权 private repo |
| Production branch | `main` | 写成 master |
| **Root directory** | **`website`** | 留空 → 在 monorepo 根目录找不到 package.json / 构建路径错 |
| Build command | `npm run build` | 写成 `npm run build --prefix website` 且 Root 又填了 website（双重） |
| Build output directory | `dist` | 写成 `website/dist`（Root 已是 website 时会错） |
| Framework preset | Astro 或 None | — |
| Env `NODE_VERSION` | `22` | 未设 → 默认 Node 偏旧，Astro 7 可能挂 |

官方预期流程：

```text
Checkout repo
→ cd website   (Root directory)
→ npm install
→ npm run build   → 生成 website/dist
→ 发布 dist 内容
```

---

## 3. 本地技术栈（构建相关）

`website/package.json`：

```json
{
  "name": "taico-ev-website",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.2",
    "astro": "^7.0.9",
    "tailwindcss": "^4.3.2"
  }
}
```

`website/.nvmrc`：`22`

`website/astro.config.mjs`：

```js
export default defineConfig({
  site: 'https://taicoev.com',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
    // ...
  },
});
```

**高嫌疑点（请优先验证）：**

1. **`engines.node: ">=22.12.0"` 过严**  
   Cloudflare 的 Node 22 镜像未必 ≥ 22.12.0。若启用 `engine-strict` 或 npm 强制 engines，会导致 `npm install` / build 失败。  
   **建议修复：** 改为 `">=22"` 或 `">=20.0.0"`，并确认 Pages 环境变量 `NODE_VERSION=22`。

2. **Root directory 未设为 `website`**  
   monorepo 根没有可构建的站点 package（只有 `website/package.json`）。

3. **Output directory 填了 `website/dist`**  
   Root 已是 `website` 时，输出应是相对路径 `dist`。

4. **Private repo 未给 Cloudflare GitHub App 权限**  
   Deploy 按钮灰 / 无法连仓库 / 首次 clone 失败。

5. **本机 `astro build` 曾卡住/被杀**  
   本机 Desktop 路径 + 同步盘环境可能慢；**不能**作为 Cloudflare 必失败的证据。请在干净环境复现：

   ```sh
   cd /Users/zaoyi/Desktop/移动充电桩/website
   rm -rf node_modules dist .astro
   npm ci   # 或 npm install
   npm run build
   ls dist/index.html
   ```

---

## 4. 用户现象（已知）

- 用户反馈：**Cloudflare 这步 Deploy 不了**（具体错误文案未贴出）。  
- 本机 **未** `wrangler login`，因此不能靠 CLI 直传，走的是 **Dashboard → Connect to Git**。  
- GitHub 推送成功；代码在 `main`。

**Codex 第一件事：向用户或从截图/日志确认失败阶段**

| 阶段 | 表现 | 排查方向 |
|------|------|----------|
| A. 连不上 GitHub | 看不到 private 仓库 | GitHub App 授权 / org 权限 |
| B. 点了 Deploy，Build 红 | Logs 里有 npm/astro 错误 | Root / Node / engines / 依赖 |
| C. Build 绿但访问 404 | 路径错 | output directory 不是 dist |
| D. Deploy 按钮灰 | 配额/支付/权限 | 账户与套餐 |

请用户提供（若还没有）：

1. Cloudflare 构建日志全文（Build log）  
2. Pages 项目的 Build configuration 截图  
3. 失败是 “Create project” 还是 “Retry deployment”

---

## 5. Codex 建议执行清单（按顺序）

### 5.1 本地验证构建（必做）

```sh
cd "/Users/zaoyi/Desktop/移动充电桩/website"
node -v
npm -v
rm -rf node_modules dist .astro
npm install
npm run build
test -f dist/index.html && echo BUILD_OK
find dist -name '*.html' | head
```

若本地 build 失败：先修 Astro/依赖，再谈 Cloudflare。  
若本地 build 成功：问题几乎一定在 **Pages 配置 / Node 版本 / Git 授权**。

### 5.2 放宽 engines（强烈建议先改再 push）

把 `website/package.json` 的 engines 改为例如：

```json
"engines": {
  "node": ">=22"
}
```

或：

```json
"engines": {
  "node": ">=20"
}
```

可选：在 `website/` 增加 `.node-version` 内容 `22`（已有 `.nvmrc`）。

### 5.3 核对 Cloudflare 配置并 redeploy

Root = `website`  
Build = `npm run build`  
Output = `dist`  
Env: `NODE_VERSION=22`  
可选 Env: `NPM_FLAGS=--legacy-peer-deps`（仅当 peer 依赖冲突时）

### 5.4 若 Dashboard 搞不定：用 Wrangler 直传（备选）

```sh
# 需用户在本机交互登录一次
npx wrangler login

cd "/Users/zaoyi/Desktop/移动充电桩/website"
npm run build
npx wrangler pages project create taico-ev --production-branch=main
npx wrangler pages deploy dist --project-name=taico-ev
```

然后仍建议改回 Git 集成，方便以后 `git push` 自动发布。

### 5.5 域名 `taicoev.com`（构建成功后再做）

Pages → Custom domains → `taicoev.com` / `www`  
DNS：CNAME → `<project>.pages.dev`（橙云代理）

---

## 6. 明确不要做的事

- 不要把 `docs/*.pdf`（几十 MB 画册）提交进 Git。  
- 不要把 Root directory 设成仓库根又期望直接 `astro build`（根目录没有 Astro 项目）。  
- 不要用 WordPress/Webflow 替换栈（业务已定 Astro）。  
- 不要为了过构建而删除 `public/products` / `public/cases` 图片（站点需要）。  
- 不要 force-push 除非用户明确同意。

---

## 7. 验收标准

- [ ] `npm run build` 在 `website/` 本地成功，`dist/index.html` 存在  
- [ ] Cloudflare 最新 Deployment = **Success**  
- [ ] 打开 `https://<project>.pages.dev/` 能看到 TAICO EV 首页  
- [ ] `/products/`、`/cases/`、`/solutions/ev-dealership-charging/` 可打开  
- [ ] （可选）`taicoev.com` CNAME 已挂上且 HTTPS 正常  
- [ ] 若改了 package.json engines 等：已 commit + push 到 `main`

---

## 8. 相关文件

| 文件 | 用途 |
|------|------|
| `DEPLOY.md` | 给人看的上线步骤 |
| `docs/CLOUDFLARE_DEPLOY_HANDOFF.md` | 本文件（给 Codex 排查） |
| `docs/handoff.md` | 整站产品/SEO/信息架构 brief |
| `website/package.json` | 脚本与 engines |
| `website/.nvmrc` | Node 22 |
| `website/astro.config.mjs` | site + trailingSlash |
| `website/public/_headers` | CF Pages 安全头 |

---

## 9. 给 Codex 的回复格式建议

排查结束后请输出：

1. **失败根因**（一句话）  
2. **已做修改**（文件列表）  
3. **Cloudflare 应使用的最终配置表**  
4. **用户下一步点哪里**（3 步以内，小白可执行）  
5. 若仍失败：需要用户粘贴的 **Build log 关键词**

---

## 10. 上下文备忘

- 品牌站：`taicoev.com`，英文 B2B，OEM 小夫技术 / TAICO 品牌。  
- 栈：Astro 7 + Tailwind 4 + TypeScript。  
- 本机有时 `astro build` 很慢或被中断；以干净 `npm install && npm run build` 为准。  
- 用户是小白：指令要短、可复制粘贴。
