# TAICO EV 网站国际化 (i18n) 详细实施方案

本文档记录 TAICO EV 独立站（`taicoev.com`）增加多语言（包含英语 `en`、中文 `zh`、德语 `de`、西班牙语 `es`、阿拉伯语 `ar`）支持的完整实施方案与技术规范。

---

## 一、 整体目标与语言规划

| 语言代码 (`locale`) | 语言名称 | 适用目标市场 / 客户群体 | 路由 URL 前缀 | 特殊排版需求 |
| :--- | :--- | :--- | :--- | :--- |
| **`en`** (默认) | English | 全球 B2B 采购、北美、澳洲、东南亚 | `taicoev.com/` | 标准 LTR (从左往右) |
| **`zh`** | 简体中文 | 国内展会客户、海外华商、供应链合作伙伴 | `taicoev.com/zh/` | 标准 LTR + 优化中文字体 |
| **`de`** | Deutsch | 欧洲核心区（德国、奥地利、瑞士） | `taicoev.com/de/` | 标准 LTR |
| **`es`** | Español | 西班牙、拉美工矿及商业充电市场 | `taicoev.com/es/` | 标准 LTR |
| **`ar`** | العربية | 中东 (GCC 地区：阿联酋、沙特等) | `taicoev.com/ar/` | **RTL (从右往左镜像排版)** |

---

## 二、 目录结构设计

采用 **“通用路由 + 语言前缀 + 模块化字典数据”** 架构：

```
website/src/
├── i18n/                        <-- 新增：i18n 核心模块
│   ├── ui.ts                    <-- 界面通用文案字典（导航、按钮、页脚）
│   ├── utils.ts                 <-- 语言助手函数（获取当前语言、翻译映射等）
│   └── locales/                 <-- 方案/产品/案例的多语言数据
│       ├── en.ts
│       ├── zh.ts
│       ├── de.ts
│       ├── es.ts
│       └── ar.ts
├── data/                        <-- 改造：统一暴露多语言接口
│   ├── solutions.ts
│   ├── products.ts
│   └── cases.ts
├── components/
│   ├── LanguagePicker.astro     <-- 新增：语言切换器组件
│   └── Header.astro             <-- 改造：集成语言切换器
└── layouts/
    └── Layout.astro             <-- 改造：支持 dir="rtl" 与 hreflang
```

---

## 三、 详细实施步骤

### 1. 修改 Astro 配置文件 (`website/astro.config.mjs`)

配置 Astro 5 原生 i18n 引擎：

```javascript
// website/astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'de', 'es', 'ar'],
    routing: {
      prefixDefaultLocale: false, // 英文保留根路径 taicoev.com/，中文使用 taicoev.com/zh/
      redirectToDefaultLocale: false,
    },
    fallback: {
      zh: 'en',
      de: 'en',
      es: 'en',
      ar: 'en',
    },
  },
});
```

---

### 2. 建立 UI 翻译字典 (`website/src/i18n/ui.ts`)

定义全局界面通用词条：

```typescript
export const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  zh: { name: '简体中文', flag: '🇨🇳' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  es: { name: 'Español', flag: '🇪🇸' },
  ar: { name: 'العربية', flag: '🇦🇪' },
};

export const defaultLang = 'en';

export const ui = {
  en: {
    'nav.solutions': 'Solutions',
    'nav.products': 'Products',
    'nav.cases': 'Cases',
    'nav.company': 'Company',
    'cta.contact': 'Talk to a Specialist',
    'cta.findSolution': 'Find Your Solution',
    'hero.tagline': 'Power Electric Mobility Beyond the Grid.',
  },
  zh: {
    'nav.solutions': '解决方案',
    'nav.products': '产品中心',
    'nav.cases': '应用案例',
    'nav.company': '关于我们',
    'cta.contact': '联系专家',
    'cta.findSolution': '选型匹配',
    'hero.tagline': '离网移动补能 · 赋能电动出行',
  },
  de: {
    'nav.solutions': 'Lösungen',
    'nav.products': 'Produkte',
    'nav.cases': 'Fälle',
    'nav.company': 'Unternehmen',
    'cta.contact': 'Experten sprechen',
    'cta.findSolution': 'Lösung finden',
    'hero.tagline': 'Mobile Ladeinfrastruktur jenseits des Netzes.',
  },
} as const;
```

---

### 3. 创建语言辅助工具 (`website/src/i18n/utils.ts`)

```typescript
import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang]?.[key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    return l === defaultLang ? path : `/${l}${path}`;
  };
}
```

---

### 4. 创建语言切换器组件 (`website/src/components/LanguagePicker.astro`)

在顶部导航栏右上角渲染语言切换下拉菜单：

```astro
---
import { languages } from '../i18n/ui';
import { getLangFromUrl } from '../i18n/utils';

const currentLang = getLangFromUrl(Astro.url);
const currentPath = Astro.url.pathname;

function getLanguageUrl(targetLang: string) {
  const parts = currentPath.split('/').filter(Boolean);
  if (Object.keys(languages).includes(parts[0])) {
    parts.shift();
  }
  return targetLang === 'en' ? `/${parts.join('/')}` : `/${targetLang}/${parts.join('/')}`;
}
---

<div class="relative inline-block text-left group">
  <button type="button" class="btn-ghost !px-3 !py-1.5 text-xs flex items-center gap-2">
    <span>{languages[currentLang].flag}</span>
    <span class="uppercase">{currentLang}</span>
    <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
    </svg>
  </button>
  
  <div class="absolute right-0 mt-2 w-36 rounded-2xl glass p-2 hidden group-hover:block z-50 shadow-2xl border border-line">
    {Object.entries(languages).map(([lang, { name, flag }]) => (
      <a
        href={getLanguageUrl(lang)}
        class:list={[
          "flex items-center gap-2 px-3 py-2 text-xs rounded-xl transition",
          currentLang === lang ? "bg-wave-cyan/20 text-wave-cyan font-semibold" : "text-muted hover:text-ink hover:bg-void/40"
        ]}
      >
        <span>{flag}</span>
        <span>{name}</span>
      </a>
    ))}
  </div>
</div>
```

---

### 5. 改造主布局 `Layout.astro` 兼容多语言与谷歌 SEO

在 `<head>` 中添加完整的 `hreflang` 元标签，并针对阿拉伯语启用 `dir="rtl"`：

```astro
---
import { getLangFromUrl } from '../i18n/utils';
const lang = getLangFromUrl(Astro.url);
const isRTL = lang === 'ar';
const canonicalURL = new URL(Astro.url.pathname, Astro.site || 'https://taicoev.com');
---

<!doctype html>
<html lang={lang} dir={isRTL ? 'rtl' : 'ltr'}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <!-- 谷歌 SEO 标准 hreflang 声明 -->
    <link rel="alternate" hreflang="x-default" href="https://taicoev.com/" />
    <link rel="alternate" hreflang="en" href="https://taicoev.com/" />
    <link rel="alternate" hreflang="zh" href="https://taicoev.com/zh/" />
    <link rel="alternate" hreflang="de" href="https://taicoev.com/de/" />
    <link rel="alternate" hreflang="es" href="https://taicoev.com/es/" />
    <link rel="alternate" hreflang="ar" href="https://taicoev.com/ar/" />
    
    <!-- 中文 / 阿拉伯语 字体补充加载 -->
    {lang === 'zh' && (
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
    )}
    {lang === 'ar' && (
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
    )}
  </head>
  <body class:list={[isRTL ? "font-arabic" : "font-sans"]}>
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

---

### 6. 多语言业务数据重构 (`website/src/data/`)

针对解决方案、产品中心和案例（例如 `products.ts`），按照 `locale` 返回不同语言的数据内容：

```typescript
// website/src/data/products.ts 示例
export function getProductsByLang(lang: string = 'en') {
  const data = {
    en: [
      { slug: 'g2v', model: 'G2V', title: 'G2V Portable Flexible Charging', headline: 'Move charging capacity across the lot...' },
      { slug: 'mobile-battery-station', model: 'M75', title: 'Mobile Battery Charging Station', headline: 'Bring 60 kW DC charging to the vehicle...' }
    ],
    zh: [
      { slug: 'g2v', model: 'G2V', title: 'G2V 便携式移动充电机', headline: '灵活随行，无需场地改造，即刻开展充电业务' },
      { slug: 'mobile-battery-station', model: 'M75', title: 'M75 移动储能充电站', headline: '搭载 75kWh 储能与 60kW 快充，为救援与客群提供应急补能' }
    ],
    de: [
      // 德语数据...
    ]
  };

  return data[lang] || data['en'];
}
```

---

## 四、 实施计划时间表 (Timeline)

| 阶段 | 核心任务 | 工时预估 | 产出物 |
| :--- | :--- | :--- | :--- |
| **Phase 1: 基础架构搭建** | 1. 配置 `astro.config.mjs`<br>2. 编写 `src/i18n` 字典与助手工具<br>3. 增加 `LanguagePicker` 导航组件 | 1 天 | 支持语言切换器与 URL 路由解析 |
| **Phase 2: 中文与英文双语上线** | 1. 翻译 `solutions.ts`、`products.ts`、`cases.ts` 至中文<br>2. 校对中文技术术语（如：*便携式DC快充*、*移动储能充电车*） | 1.5 天 | `taicoev.com/zh/` 全中文版上线 |
| **Phase 3: 德语与阿拉伯语扩展** | 1. 引入 德语 (`de`) 翻译数据<br>2. 阿拉伯语 (`ar`) RTL 排版与 Tailwind 兼容性验证 | 2 天 | 支持 `de` 与 `ar` 4 语/5 语出海全站点 |
| **Phase 4: 谷歌 SEO 验证** | 1. 验证 `hreflang` 标签配置<br>2. 提交站点地图到 Google Search Console | 0.5 天 | 确保多语言搜索引擎独立收录 |
