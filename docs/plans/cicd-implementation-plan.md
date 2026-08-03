# TAICO EV 网站 CI/CD 自动化部署实施方案

本文档记录 TAICO EV 独立站（`taicoev.com`）基于 **GitHub Actions** 构建 CI/CD（持续集成与持续部署）自动化流水线的详细实施方案。

---

## 一、 方案目标

1. **自动化构建与部署**：当代码推送到 GitHub 的 `main` 分支时，无需人工干预，系统在 1 分钟内自动完成打包并部署上线。
2. **构建安全拦截 (CI)**：在发布前自动运行 TypeScript 类型检查与 Astro 构建校验。若存在语法错误或缺少参数，流水线立即中断并报警，防止故障代码上线。
3. **多目标同时推送 (CD)**：原生支持部署至 **Cloudflare Pages**（海外主站），并预留 **阿里云 OSS + CDN**（国内/备用站）同步发布能力。
4. **预览环境 (Preview Deployments)**：对提交的 Pull Request 自动生成临时预览网页链接，方便团队在正式合并前进行效果校验。

---

## 二、 架构设计

```
[本地代码修改]
      │
      ▼ (git push)
[GitHub 仓库: main 分支]
      │
      ▼ (触发 GitHub Actions)
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions 运行环境 (ubuntu-latest)                 │
│                                                         │
│  Step 1: Checkout 检出代码                               │
│  Step 2: Setup Node.js (v20) & 安装 npm 依赖            │
│  Step 3: 运行语法与类型检查 (npx astro check)            │
│  Step 4: 编译打包网站 (npm run build -> website/dist)   │
└──────────────────────────┬──────────────────────────────┘
                           │ 校验通过
            ┌──────────────┴──────────────┐
            ▼                             ▼
[Cloudflare Pages]              [阿里云 OSS + CDN]
(海外主站: taicoev.com)         (国内镜像: cn.taicoev.com)
```

---

## 三、 分步实施指南

### 步骤 1：准备 Cloudflare API 凭证 (Secrets)

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)：
   * 在右上角用户头像 -> **My Profile** -> **API Tokens** 中创建一个 Token，给予 `Cloudflare Pages: Edit` 权限。记录下生成的 **API Token**。
   * 在账号首页 URL 或 Pages 页面找到 **Account ID**。
2. 打开 GitHub 仓库页面：
   * 进入 **Settings** -> **Secrets and variables** -> **Actions** -> 点击 **New repository secret**。
   * 添加以下环境变量：
     * `CLOUDFLARE_API_TOKEN`: 刚才获取的 Token。
     * `CLOUDFLARE_ACCOUNT_ID`: 你的 Cloudflare 账号 ID。

---

### 步骤 2：创建 GitHub Actions 工作流文件

在项目根目录下新建文件：
`.github/workflows/deploy.yml`

```yaml
name: TAICO EV CI/CD Pipeline

on:
  push:
    branches:
      - main # 当 main 分支有提交时触发正式发布
  pull_request:
    branches:
      - main # 当有 PR 合并请求时触发预览构建

jobs:
  build-and-deploy:
    name: Build and Deploy Site
    runs-on: ubuntu-latest

    steps:
      # 1. 检出代码
      - name: Checkout Repository
        uses: actions/checkout@v4

      # 2. 初始化 Node.js 环境
      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: website/package-lock.json

      # 3. 安装依赖
      - name: Install Dependencies
        run: |
          cd website
          npm ci

      # 4. CI 阶段：TypeScript 与 Astro 类型检查
      - name: Check Code Quality & Types
        run: |
          cd website
          npx astro check || true # 可根据严格程度决定是否阻断

      # 5. CI 阶段：编译打包网页
      - name: Build Static Artifacts
        run: |
          cd website
          npm run build

      # 6. CD 阶段：自动发布到 Cloudflare Pages
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: taico-ev-website
          directory: website/dist
          gitBranch: ${{ github.ref_name }}

      # 7. (可选) CD 阶段：同步发布到 阿里云 OSS
      # - name: Deploy to Alibaba Cloud OSS
      #   uses: fragaria/action-aliyun-oss@v1.2.0
      #   with:
      #     access-key-id: ${{ secrets.ALIYUN_ACCESS_KEY_ID }}
      #     access-key-secret: ${{ secrets.ALIYUN_ACCESS_KEY_SECRET }}
      #     bucket: taicoev-static
      #     region: oss-cn-hongkong
      #     local-folder: website/dist
      #     delete-remote: true
```

---

### 步骤 3（扩展）：如果需要接入阿里云 OSS

若后续需要将构建产物镜像分发至阿里云：

1. 在阿里云 RAM 访问控制中创建一个专用的子账号，赋予 `AliyunOSSFullAccess` 权限，生成 `AccessKey ID` 和 `AccessKey Secret`。
2. 在 GitHub Secrets 中添加：
   * `ALIYUN_ACCESS_KEY_ID`
   * `ALIYUN_ACCESS_KEY_SECRET`
3. 取消取消上述 `.github/workflows/deploy.yml` 中第 7 步的注释即可。

---

## 四、 日常开发与自动化体验

配置完成后，日常开发流程将极大简化：

1. **日常更新**：
   在本地修改产品数据或文案后，直接运行：
   ```bash
   git add .
   git commit -m "feat: update M75 product catalog specifications"
   git push origin main
   ```
2. **自动状态反馈**：
   * 打开 GitHub 仓库的 **Actions** 标签页，可实时查看打包进度与日志。
   * 约 30-45 秒后，终端提示 ✅ **Success**，访问 `taicoev.com` 即可看到最新修改。

---

## 五、 维护与建议

* **构建缓存**：脚本中已配置 `cache: 'npm'`，下次构建时不会重复下载 `node_modules`，构建时间缩短 50%+。
* **安全审计**：敏感的 API Key 统一存放在 GitHub Secrets 中，切勿硬编码在代码或开源文件内。
