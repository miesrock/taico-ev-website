# TAICO EV Content Architecture Refactor v1.1 — 修改指令

## 目标

基于当前 commit：

`f12adb2ec1b967fb1d5a4f0a6e966c39b549b956`

继续完成 `TAICO_EV_Content_Architecture_Refactor_v1.md` 中尚未完全收口的部分。

本轮只解决三个问题：

1. 明确 `Application` 为 Application / Solution 关系的 canonical source of truth
2. 完善 Knowledge → Product → Family 的派生关联
3. 将 Content Architecture Tests 接入 CI

不要重新设计视觉。

不要重写 ProductFamily。

不要大规模改 URL。

不要新增 CMS。

不要新增新的一级 Content Entity。

---

# 1. 当前状态

当前架构已经完成：

```text
ProductFamily
→ Product

Product
→ Application

Application
→ Solution public URL

Knowledge
→ ProductFamily / Product / Application
```

目前遗留问题主要在：

```text
applications.ts
+
solutions.ts
```

仍然存在两套部分重叠的业务内容。

同时 Knowledge 与 Family 之间目前主要依赖：

```yaml
relatedFamilies
```

没有充分利用：

```text
Knowledge
→ Product
→ ProductFamily
```

的派生关系。

---

# 2. 本轮目标架构

目标关系：

```text
ProductFamily
    │
    ▼
 Product
    │
    ▼
Application
    │
    ▼
Solution Page
```

其中：

```text
Application
```

负责业务语义：

```text
是什么场景
适合什么产品
属于什么 buyer intent
名称是什么
基本描述是什么
```

而：

```text
Solution Page
```

只是 Application 的公共页面表现形式。

长期目标：

```text
Application Entity
→ Solution Page Factory
```

不要继续让：

```text
Application
Solution
```

成为两套平行业务实体。

---

# 3. P0 — 明确 Application 为 canonical entity

## 3.1 审查 `applications.ts` 和 `solutions.ts`

重点检查：

```text
website/src/data/applications.ts
website/src/data/solutions.ts
```

列出两者重复的字段和语义。

例如重点检查：

```text
title
summary
headline
intro
application name
use case description
recommended products
FAQ
SEO title
SEO description
```

区分两类数据：

### A. Application business facts

应该属于：

```text
applications.ts
```

例如：

```ts
slug
title
summary
solutionSlug
```

以及未来确实需要的：

```ts
buyerIntent?
familySlugs?
```

### B. Solution presentation content

可以暂时保留在：

```text
solutions.ts
```

例如：

```ts
seo
headline
intro
pains
approach
capabilities
faq
relatedLinks
featuredProductSlugs
```

但要明确：

```text
solutions.ts
```

不是另一套 Application source of truth。

---

# 4. 修改 Solution 数据模型

当前 Solution 如果保存：

```ts
title
summary
```

等和 Application 重叠的字段，应优先改为：

```ts
applicationSlug
```

然后通过：

```ts
getApplication()
```

获取 canonical：

```text
title
summary
public application identity
```

推荐目标结构类似：

```ts
export type SolutionPresentation = {
  applicationSlug: ApplicationSlug;

  seo?: {
    title: string;
    description: string;
  };

  h1?: string;

  headline: string;

  intro?: string;

  pains: string[];

  approach: string[];

  capabilities?: string[];

  faq?: SolutionFaq[];

  featuredProductSlugs?: string[];

  relatedLinks?: {
    label: string;
    href: string;
    description?: string;
  }[];
};
```

允许根据现有代码约定调整字段名。

重点不是完全照抄字段名。

重点是：

```text
Solution Presentation
必须引用 Application
```

而不是重新定义 Application。

---

# 5. Solution slug 的处理

目前：

```text
Application.slug
```

与：

```text
solutionSlug
```

不同。

例如：

```text
Application:
roadside-ev-rescue

Solution URL:
/solutions/mobile-ev-charger-roadside-rescue/
```

暂时不要强行统一 URL。

保留：

```ts
application.solutionSlug
```

作为公开 URL 映射。

目标：

```text
Application
├── slug = internal canonical identity
└── solutionSlug = public route identity
```

允许两个 slug 不同。

---

# 6. 修改 Solution Page Factory

文件：

```text
website/src/pages/solutions/[slug].astro
```

目前逻辑类似：

```ts
const solution = getSolution(...)
```

修改为：

```text
Solution Presentation
+
Application Entity
```

推荐：

```ts
const presentation = getSolution(...)
const application = getApplication(presentation.applicationSlug)
```

或者：

```ts
const application = getApplicationBySolutionSlug(Astro.params.slug)
const presentation = getSolutionByApplication(application.slug)
```

选择最干净的一种。

页面中：

```text
Application title
Application summary
Application canonical identity
```

必须来自：

```text
applications.ts
```

例如 Hero 默认标题优先：

```ts
application.title
```

不要再次从 Solution 保存另一份同义 title。

页面可以保留：

```ts
presentation.h1
```

作为 SEO / Landing Page 专用 override。

规则：

```text
business identity
→ Application

presentation copy
→ Solution Presentation
```

---

# 7. 修改 Product → Solution 派生逻辑

目前 Product 已经正确使用：

```ts
applicationSlugs
```

不要重新引入：

```ts
solutionSlugs
```

禁止在 Product 中出现：

```ts
solutionSlugs
```

产品公开 Solution URL 必须继续通过：

```text
Product
→ applicationSlugs
→ Application
→ solutionSlug
```

派生。

保留：

```ts
getApplicationsForProduct()
getSolutionsForProduct()
```

但建议逐步减少：

```text
Solution entity
```

作为关系节点。

更理想的 helper：

```ts
getSolutionPresentationsForProduct(product)
```

也可以暂时保留旧函数名以减少 diff。

---

# 8. Application → Products 必须从 Product 反向派生

不要在 Application 里维护：

```ts
recommendedProductSlugs
```

作为 canonical relation。

继续使用：

```ts
getApplicationProducts(applicationSlug)
```

其来源必须是：

```text
Product.applicationSlugs
```

即：

```text
Product used_for Application
```

是唯一 Product ↔ Application 事实源。

---

# 9. ProductFamily → Application 关系的处理

目前：

```ts
family.useCases[].applicationSlug
```

不要删除。

但明确它不是 canonical membership relation。

它的语义应改成：

```text
Family Page selector scenario
```

建议将：

```ts
useCases
```

根据实际工作量考虑改名：

```ts
selectorScenarios
```

或：

```ts
recommendationScenarios
```

如果改名会导致 diff 太大，可以暂时不改。

但至少增加注释：

```ts
/**
 * Editorial scenarios used by the Family Page selector.
 * This is not the canonical Product → Application relation.
 */
```

避免后续开发者把：

```text
family.useCases
```

当作 Application membership source。

---

# 10. P1 — Knowledge relation propagation

当前：

```text
Knowledge → Family
```

主要只认：

```yaml
relatedFamilies
```

需要完善派生规则。

目标：

```text
Knowledge explicitly relates to Product
        ↓
Product belongs to Family
        ↓
Knowledge also relates to Family
```

---

# 11. 修改 `knowledgeRelatesToFamily()`

文件：

```text
website/src/lib/content.ts
```

当前类似：

```ts
export function knowledgeRelatesToFamily(
  data,
  familySlug
) {
  return data.relatedFamilies.includes(familySlug);
}
```

修改为：

```text
Explicit Family Relation
OR
Related Product belongs to Family
```

建议实现：

```ts
export function knowledgeRelatesToFamily(
  data: KnowledgeRelations,
  familySlug: string
) {
  if ((data.relatedFamilies ?? []).includes(familySlug)) {
    return true;
  }

  const relatedProductSlugs = new Set(
    data.relatedProducts ?? []
  );

  return getFamilyProducts(
    familySlug as ProductCategory
  ).some((product) =>
    relatedProductSlugs.has(product.slug)
  );
}
```

可以根据类型系统写得更严格。

不要做文本关键词匹配。

不要根据文章正文自动猜。

---

# 12. Knowledge → Application 的派生

本轮建议实现一个有限、安全的派生：

```text
Knowledge → Product
→ Product.applicationSlugs
→ Application
```

也就是说：

如果：

```yaml
relatedProducts:
  - tkmc-800
```

而：

```text
TKMC-800
→ roadside-ev-rescue
```

则该文章可视为与：

```text
roadside-ev-rescue
```

相关。

修改：

```ts
knowledgeRelatesToApplication()
```

目标逻辑：

```text
Explicit relatedApplications
OR
relatedProducts contains a Product used for Application
```

推荐逻辑：

```ts
export function knowledgeRelatesToApplication(
  data: KnowledgeRelations,
  applicationSlug: string
) {
  if (
    (data.relatedApplications ?? [])
      .includes(applicationSlug)
  ) {
    return true;
  }

  const products = (data.relatedProducts ?? [])
    .map(getProduct)
    .filter(Boolean);

  return products.some((product) =>
    product.applicationSlugs.includes(
      applicationSlug as ApplicationSlug
    )
  );
}
```

如果类型转换不安全，改成正规的 type guard。

---

# 13. Knowledge → Solution 派生

不要单独设计一套 Solution relation。

继续：

```text
Knowledge
→ Application
→ solutionSlug
→ Solution Page
```

因此：

```ts
knowledgeRelatesToSolution()
```

应尽量复用：

```ts
knowledgeRelatesToApplication()
```

推荐：

```ts
export function knowledgeRelatesToSolution(
  data: KnowledgeRelations,
  solutionSlug: string
) {
  const application =
    getApplicationBySolutionSlug(solutionSlug);

  return application
    ? knowledgeRelatesToApplication(
        data,
        application.slug
      )
    : false;
}
```

不要直接再次写一套 article → solution logic。

---

# 14. Knowledge relation 的原则

允许：

```text
显式关系
+
结构派生关系
```

例如：

```yaml
relatedProducts:
  - tkmc-800
```

可以派生：

```text
Knowledge
→ TKMC-800
→ Mobile Charging Family
→ Roadside EV Rescue Application
```

但不要无限传播。

V1.1 建议最大传播深度：

```text
Knowledge
→ Product
→ Family

Knowledge
→ Product
→ Application
```

不要自动：

```text
Knowledge
→ Product
→ Application
→ all Application products
```

否则文章会突然出现在过多商品页面。

---

# 15. 避免过度关联

例如文章：

```text
kW vs kWh
```

关联：

```text
TKMC-800
```

可以自动成为：

```text
Mobile Charging Family
```

相关文章。

但不要因此自动显示到：

```text
所有 Roadside Rescue 产品
```

除非：

```yaml
relatedApplications:
  - roadside-ev-rescue
```

有明确声明。

也就是说：

```text
Knowledge → Product → Application
```

可以帮助 Application 页面发现 Knowledge。

但不能自动扩展成：

```text
Knowledge → every product under Application
```

---

# 16. 检查 Knowledge Page 本身的商业内链

文件：

```text
website/src/pages/resources/articles/[slug].astro
```

确保 Article Detail 页面能够根据：

```yaml
relatedFamilies
relatedApplications
relatedProducts
```

输出明确可爬取内链。

建议页面至少包含：

```text
Related products
Related product families
Related solutions
```

没有数据则不显示。

关系来源：

```text
Product
ProductFamily
Application → Solution URL
```

禁止：

```text
text matching
tag matching
random articles
```

---

# 17. Article 页链接规则

Article → Product：

```text
/resources/articles/...
→ /products/[slug]/
```

Article → Family：

```text
/resources/articles/...
→ /products/category/[slug]/
```

Article → Application：

公共 URL 必须使用：

```text
/solutions/[application.solutionSlug]/
```

不要出现：

```text
/applications/
```

---

# 18. P1 — 架构完整性测试

文件：

```text
website/tests/content-architecture.test.ts
```

扩充现有测试。

新增以下检查。

---

# 19. Test A — Product 只能维护 Application relation

检查：

```text
products.ts
```

不能重新出现：

```ts
solutionSlugs
relatedSolutionSlugs
```

等并行关系字段。

测试可以检查 Product type / source text。

目标：

```text
Product → applicationSlugs
```

是唯一 canonical Application relation。

---

# 20. Test B — 每个 Product 必须存在 Family

对于每个：

```ts
published Product
```

检查：

```ts
getFamilyForProduct(product)
```

成功。

禁止：

```text
orphan Product
```

---

# 21. Test C — 每个 Application 必须存在 Solution route

对于每个：

```ts
Application
```

检查：

```text
solutionSlug
```

存在于 Solution Presentation 配置。

并且最终：

```text
/solutions/{solutionSlug}/
```

存在静态生成路径。

---

# 22. Test D — 每个 Solution Presentation 必须属于 Application

禁止：

```text
orphan Solution
```

每个：

```ts
SolutionPresentation
```

必须有合法：

```ts
applicationSlug
```

或可以通过：

```text
solutionSlug
```

反查到 Application。

目标：

```text
Application ↔ Solution Presentation
```

必须一一对应。

如果设计允许一个 Application 多页面，需要明确测试规则。

当前建议：

```text
1 Application
=
1 Solution public page
```

---

# 23. Test E — 不允许重复 Solution identity

检查：

```text
solutionSlug
```

唯一。

同时检查：

```text
Application.slug
```

唯一。

---

# 24. Test F — Legacy Application Redirect

继续保留已有测试：

```text
/applications/*
→ /solutions/*
```

检查：

```text
public/_redirects
astro.config.mjs
```

都存在。

---

# 25. Test G — Knowledge 必须有关联

继续保持 schema constraint：

```text
relatedFamilies
OR
relatedApplications
OR
relatedProducts
```

至少一个非空。

---

# 26. Test H — Knowledge relations 必须有效

对于每篇 Knowledge：

检查：

```yaml
relatedFamilies
```

都存在对应 ProductFamily。

检查：

```yaml
relatedApplications
```

都存在 Application。

检查：

```yaml
relatedProducts
```

都存在 published Product。

禁止 silent broken link。

---

# 27. Test I — Knowledge Product → Family propagation

创建或使用 fixture：

```text
Knowledge relatedProducts = [tkmc-800]
relatedFamilies = []
```

断言：

```ts
knowledgeRelatesToFamily(
  article,
  "mobile-charging"
)
=== true
```

同时：

```ts
knowledgeRelatesToFamily(
  article,
  "stationary-charging"
)
=== false
```

---

# 28. Test J — Knowledge Product → Application propagation

fixture：

```text
Knowledge relatedProducts = [tkmc-800]
relatedApplications = []
```

断言：

```ts
knowledgeRelatesToApplication(
  article,
  "roadside-ev-rescue"
)
=== true
```

---

# 29. Test K — Knowledge Solution relation 使用 Application

断言：

```ts
knowledgeRelatesToSolution(
  article,
  "mobile-ev-charger-roadside-rescue"
)
=== true
```

来源必须是：

```text
Product
→ Application
→ Solution
```

---

# 30. Test L — Family Page 不允许产品硬编码

继续保留已有规则。

检查：

```text
src/pages/products/category/[slug].astro
```

不得出现：

```text
TKMC-800
TKMC-1500
Roadside EV Rescue
```

等 Family-specific business copy。

Page Factory 必须保持通用。

---

# 31. Test M — Solution Page 不允许重复 Application title 数据

如果完成结构调整后：

```text
solutions.ts
```

不应再维护：

```ts
title
summary
```

等 canonical Application identity。

可以使用 source-text assertion 防回归。

---

# 32. CI 集成

检查：

```text
.github/workflows/
```

如果已有 CI，加入：

```text
content architecture tests
```

如果没有，创建最小 CI。

推荐：

```yaml
name: Website CI

on:
  push:
  pull_request:

jobs:
  website:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: website

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: website/package-lock.json

      - run: npm ci

      - run: npm test

      - run: npm run build
```

根据当前 package scripts 调整。

不要盲目新增不存在的：

```text
npm test
```

如果现有项目使用：

```text
npm run test
node --test
tsx --test
```

则使用已有机制。

---

# 33. CI Acceptance Criteria

CI 至少保证：

```text
TypeScript / Astro build passes

Content Architecture tests pass

No broken canonical entity relationships

No orphan Product

No orphan Application

No orphan Solution Presentation

No invalid Knowledge relation
```

---

# 34. 不要做的修改

本轮明确禁止：

```text
不要改 ProductFamily URL
不要改 Product URL
不要重新设计页面视觉
不要修改 CSS Design System
不要添加 CMS
不要引入数据库
不要加入 tag system
不要加入自动关键词内链
不要创建新的 Blog entity
不要添加 Industries
不要添加 Markets
不要添加 Compatibility 一级内容类型
不要重新增加 Applications 公共导航
```

---

# 35. 保持现有 Public IA

继续保持：

```text
Home
Products
Solutions
Resources
Company
Contact
```

禁止恢复：

```text
Applications
```

作为一级 public concept。

---

# 36. Resources 保持当前结构

继续保持：

```text
Resources
├─ Buyer Guides
├─ Technical Knowledge
├─ Product Comparison
└─ Documentation
```

Knowledge 应服务于：

```text
Product
ProductFamily
Application
```

而不是演化成独立博客系统。

---

# 37. 推荐最终数据关系

完成后应接近：

```text
ProductFamily
    │
    │ belongs_to
    ▲
 Product
    │
    │ used_for
    ▼
Application
    │
    │ presented_as
    ▼
Solution Presentation
    │
    ▼
/solutions/[slug]/
```

Knowledge：

```text
                  Knowledge
                 /    |     \
                /     |      \
               ▼      ▼       ▼
        ProductFamily Product Application
                         │
                         ├─→ Family
                         └─→ Application
```

---

# 38. Source of Truth 规则

严格执行：

## Product facts

唯一来源：

```text
products.ts
```

例如：

```text
capacity
output
connector
dimensions
weight
catalog applications
catalog source
```

---

## ProductFamily facts

唯一来源：

```text
families.ts
```

例如：

```text
overview
selection guide
comparison fields
selector scenarios
family SEO
family FAQ
```

---

## Application identity

唯一来源：

```text
applications.ts
```

例如：

```text
slug
title
summary
solutionSlug
```

---

## Solution landing-page copy

唯一来源：

```text
solutions.ts
```

但其角色是：

```text
Application presentation
```

不是另一套 Application entity。

---

## Knowledge relationships

唯一来源：

```text
article frontmatter
```

只存显式关系：

```yaml
relatedFamilies
relatedApplications
relatedProducts
```

派生关系不要重复写入 frontmatter。

---

# 39. Derived Data 优先

例如：

不要保存：

```text
Family.productSlugs
```

因为可以：

```text
Product.category
→ derive
```

不要保存：

```text
Application.productSlugs
```

因为可以：

```text
Product.applicationSlugs
→ derive
```

不要保存：

```text
Product.solutionSlugs
```

因为可以：

```text
Product.applicationSlugs
→ Application.solutionSlug
```

不要要求每篇文章同时写：

```yaml
relatedProducts:
relatedFamilies:
relatedApplications:
```

如果关系可由 Product 派生，则允许只写 Product。

---

# 40. 最终验收

完成后执行：

```bash
npm test
npm run build
```

或项目实际对应命令。

必须确保：

```text
0 test failures
0 build errors
0 broken relation issues
```

另外人工检查以下页面：

```text
/products/category/mobile-charging/

/products/tkmc-800/

/solutions/mobile-ev-charger-roadside-rescue/

/resources/articles/mobile-ev-charging-guide/
```

确认：

### Family Page

```text
Family
→ Product
→ Knowledge
→ Solution
```

都正常。

### Product Page

```text
Product
→ Family
→ sibling Product
→ Solution
→ Knowledge
```

都正常。

### Solution Page

```text
Application identity
→ Product recommendations
→ Knowledge
```

都正常。

### Knowledge Page

```text
Knowledge
→ Product
→ Family
→ Solution
```

都有可爬取链接。

---

# 41. 最终输出要求

完成代码修改后，不要只报告“完成”。

输出以下内容：

## 1. Changed Files

列出所有修改文件。

## 2. Architecture Changes

说明：

```text
Application / Solution source of truth
Knowledge relation propagation
CI architecture guardrails
```

分别发生了什么。

## 3. Before / After

给出：

```text
Before

Product
→ Application
→ Solution Entity
→ Page
```

和：

```text
After

Product
→ Application
→ Solution Presentation
→ Page
```

的区别。

## 4. Source of Truth Matrix

输出表格：

| Fact | Canonical Source |
|---|---|
| Product specs | products.ts |
| Family buying guide | families.ts |
| Application identity | applications.ts |
| Solution presentation copy | solutions.ts |
| Knowledge relations | article frontmatter |

## 5. Test Results

报告实际执行结果：

```text
tests:
build:
```

不得声称通过没有实际运行的命令。

## 6. Remaining Debt

如果 `solutions.ts` 仍然存在无法本轮消除的重复字段，明确列出来。

不要隐藏技术债。

---

# 42. 本轮 Definition of Done

只有同时满足以下条件才算完成：

```text
[ ] ProductFamily 架构保持不回退

[ ] Product 仍只有 applicationSlugs 一套商业关系

[ ] Application 成为 canonical application identity

[ ] Solution 被明确降级为 presentation layer

[ ] 所有旧 /applications/* URL 保留 301

[ ] Knowledge → Product → Family 可以派生

[ ] Knowledge → Product → Application 可以派生

[ ] Knowledge → Solution 通过 Application 派生

[ ] Article Detail 有明确商业实体内链

[ ] Content architecture tests 覆盖上述规则

[ ] CI 执行 architecture tests

[ ] npm build 成功

[ ] 没有新增平行 Content Entity
```

核心原则：

> 不增加更多数据，而是减少重复事实。

完成本轮以后，TAICO EV 的内容系统应该可以稳定遵循：

```text
Entity
→ Relationship
→ Page Factory
→ Internal Links
→ SEO Watch
```

而不是继续依赖开发者在不同页面中手工维护关联。
