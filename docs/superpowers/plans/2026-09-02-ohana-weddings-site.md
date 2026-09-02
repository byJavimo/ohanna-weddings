# Ohana Weddings Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full Astro + React + Tailwind scaffold for the bilingual (ES/EN) Ohana Weddings corporate site, from an empty repo to a fully wired, buildable, browser-verified static site.

**Architecture:** Astro (static output) with React islands for interactive pieces (language switcher, hero slider, portfolio grid, testimonials carousel, contact form). Astro's native i18n routing serves `/es/` and `/en/`. Tailwind CSS v4 (CSS-first `@theme`, via `@tailwindcss/vite`) provides the design system. Mock content lives in typed `.ts` data modules; UI copy lives in `es.json`/`en.json` dictionaries.

**Tech Stack:** Astro, `@astrojs/react`, Tailwind CSS v4 (`@tailwindcss/vite`), React 18/19, `framer-motion`, `lucide-react`, TypeScript, `@astrojs/check`, npm.

**Spec:** `docs/superpowers/specs/2026-09-02-ohana-weddings-site-design.md`

## Global Constraints

- Colors: ivory `#FDFBF7`, white `#FFFFFF` (Tailwind's built-in white), border `#EAE3D9`, taupe `#8C7A6B`, sepia `#5A4D41`, champagne `#D4C5B9`.
- Fonts: headings in `"Playfair Display", serif` (Tailwind token `font-serif`), body in `Inter, sans-serif` (Tailwind token `font-sans`).
- Locales: `es` (default) and `en`. Routing: `prefixDefaultLocale: true`, `redirectToDefaultLocale: false` (both locales prefixed, `/` redirects to `/es/` via a manual `src/pages/index.astro` — shipped as `false`, not the originally-specced `true`, per a post-implementation fix; see the design doc's correction note and the execution ledger).
- Package manager: npm. Astro `output: 'static'` — no server adapter.
- Tailwind CSS v4 via `@tailwindcss/vite` — no `tailwind.config.mjs`, no `@astrojs/tailwind` (deprecated for v4).
- Contact form posts to `https://formspree.io/f/{PUBLIC_FORMSPREE_ID}` via client-side `fetch`; `PUBLIC_FORMSPREE_ID` is an env var, empty in `.env.example`.
- `rounded-2xl` (Tailwind's built-in 1rem radius) is the default radius on cards/containers; `shadow-soft` is a custom theme shadow token for the blurred low-opacity look.
- No automated test framework is introduced. Verification per task is: `npm run build` (and/or `npm run check` for type-checking) plus, where the task changes visible/interactive behavior, a browser check via the dev server.

---

## File Structure Overview

```
package.json
astro.config.mjs
tsconfig.json
.env.example
.gitignore
scripts/generate-placeholders.mjs
public/
  favicon.svg
  images/hero-{1..4}.svg
  images/portfolio-{1..8}.svg
  images/testimonial-{1..6}.svg
src/
  styles/global.css
  i18n/{es,en}.json
  i18n/utils.ts
  data/{portfolio,testimonials,blog}.ts
  assets/images/blog-{1..6}.svg
  layouts/Layout.astro
  components/{Header,Hero,About,Services,BlogSection,Footer}.astro
  components/{HeroSlider,LanguageSwitcher,PortfolioGrid,Testimonials,ContactForm}.jsx
  pages/index.astro
  pages/[lang]/index.astro
README.md
```

---

### Task 1: Project scaffold, Tailwind v4 theme, base config

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `src/pages/index.astro` (temporary placeholder, replaced in Task 4)

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a buildable Astro project; `src/styles/global.css` exposes Tailwind utilities plus theme tokens `bg-ivory`, `text-sepia`, `text-taupe`, `border-border`, `bg-champagne`, `font-serif`, `font-sans`, `shadow-soft`, and built-in `rounded-2xl`. All later tasks import `../styles/global.css` (already wired once, from `Layout.astro` in Task 4) and rely on these class names existing.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "ohana-weddings",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "generate:placeholders": "node scripts/generate-placeholders.mjs"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install astro @astrojs/react react react-dom framer-motion lucide-react
npm install -D @astrojs/check tailwindcss @tailwindcss/vite typescript @types/react @types/react-dom
```

Expected: `package.json` gains `dependencies`/`devDependencies` entries and a `package-lock.json` is created, with no install errors.

- [ ] **Step 3: Write `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
});
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

- [ ] **Step 5: Write `src/styles/global.css`**

```css
@import "tailwindcss";

@theme {
  --color-ivory: #FDFBF7;
  --color-border: #EAE3D9;
  --color-taupe: #8C7A6B;
  --color-sepia: #5A4D41;
  --color-champagne: #D4C5B9;
  --font-serif: "Playfair Display", serif;
  --font-sans: Inter, sans-serif;
  --shadow-soft: 0 8px 40px rgba(140, 122, 107, 0.12);
}

@layer base {
  body {
    @apply bg-ivory text-sepia font-sans;
  }
}
```

- [ ] **Step 6: Write `public/favicon.svg`, `.env.example`, `.gitignore`**

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="15" fill="#D4C5B9" stroke="#8C7A6B" />
  <text x="16" y="21" text-anchor="middle" font-family="serif" font-size="16" fill="#5A4D41">O</text>
</svg>
```

`.env.example`:
```
PUBLIC_FORMSPREE_ID=
```

`.gitignore`:
```
node_modules/
dist/
.astro/
.env
.DS_Store
```

- [ ] **Step 7: Write a temporary `src/pages/index.astro`**

```astro
---
---
<h1>Ohana Weddings — scaffold OK</h1>
```

This is a throwaway smoke-test page, replaced entirely in Task 4.

- [ ] **Step 8: Verify the toolchain builds**

Run: `npm run build`
Expected: build completes with no errors, `dist/index.html` exists and contains `Ohana Weddings — scaffold OK`.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/styles/global.css public/favicon.svg .env.example .gitignore src/pages/index.astro
git commit -m "chore: scaffold Astro project with Tailwind v4 and React"
```

---

### Task 2: i18n dictionaries and translation utilities

**Files:**
- Create: `src/i18n/es.json`
- Create: `src/i18n/en.json`
- Create: `src/i18n/utils.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces:
  - `languages: Record<'es'|'en', string>`, `type Lang = 'es'|'en'`, `defaultLang: Lang` — used by every later `.astro`/`.jsx` file for the `lang` prop type and the language display names.
  - `useTranslations(lang: Lang): (key: string) => string` — dot-path lookup (e.g. `t('nav.about')`), returns the key itself if not found (never throws).
  - `getLangFromUrl(url: URL): Lang` — reads the locale from a pathname.
  - `getLocalizedPath(pathname: string, targetLang: Lang): string` — rewrites a pathname's locale segment, used by `LanguageSwitcher.jsx` (Task 5).

- [ ] **Step 1: Write `src/i18n/es.json`**

```json
{
  "meta": {
    "title": "Ohana Weddings — Bodas de lujo con alma",
    "description": "Organización integral, coordinación y diseño de bodas de lujo, con un enfoque cálido y exclusivo."
  },
  "nav": {
    "about": "Sobre Ohana",
    "services": "Servicios",
    "portfolio": "Portafolio",
    "testimonials": "Opiniones",
    "blog": "Blog",
    "cta": "Reserva tu Cita"
  },
  "hero": {
    "eyebrow": "Wedding Planning de Lujo",
    "title": "Bodas que se sienten como en casa",
    "subtitle": "Diseñamos y coordinamos celebraciones íntimas y de gran formato con una mirada editorial y un cuidado exquisito por cada detalle.",
    "cta": "Reserva tu Cita"
  },
  "about": {
    "title": "Sobre Ohana",
    "body1": "En Ohana creemos que una boda es la expresión más honesta de una historia de amor. Por eso trabajamos codo a codo con cada pareja, desde la primera conversación hasta el último brindis.",
    "body2": "Nuestro equipo combina años de experiencia en organización de eventos de lujo con una sensibilidad estética minimalista y cálida, siempre al servicio de vuestra visión.",
    "quote": "Ohana significa familia, y así es como tratamos cada proyecto."
  },
  "services": {
    "title": "Nuestros Servicios",
    "subtitle": "Tres formas de acompañaros, según lo que necesitéis.",
    "integral": {
      "title": "Organización Integral",
      "description": "Planificación completa de la boda, desde el concepto y presupuesto hasta la selección de proveedores y logística del gran día."
    },
    "diaB": {
      "title": "Coordinación del Día B",
      "description": "Coordinación profesional el día de la boda para que vosotros y vuestras familias disfrutéis sin preocuparos de nada."
    },
    "diseno": {
      "title": "Diseño y Decoración",
      "description": "Dirección de arte, ambientación floral y diseño de espacios que reflejan vuestra historia y estilo."
    }
  },
  "portfolio": {
    "title": "Portafolio y Multimedia"
  },
  "testimonials": {
    "title": "Opiniones de Nuestras Parejas"
  },
  "blog": {
    "title": "Blog",
    "subtitle": "Tendencias, consejos e inspiración para vuestra boda.",
    "readMore": "Leer más"
  },
  "contact": {
    "title": "Contacto",
    "subtitle": "Contadnos sobre vuestra boda y os responderemos en menos de 48 horas.",
    "fields": {
      "name": "Nombre",
      "email": "Email",
      "phone": "Teléfono",
      "date": "Fecha estimada",
      "guests": "N.º de invitados",
      "budget": "Presupuesto estimado (€)",
      "language": "Idioma preferido"
    },
    "placeholders": {
      "name": "Tu nombre completo",
      "email": "tu@email.com",
      "phone": "+34 600 000 000",
      "guests": "120",
      "budget": "25000"
    },
    "languageOptions": {
      "es": "Español",
      "en": "English"
    },
    "errors": {
      "required": "Este campo es obligatorio.",
      "email": "Introduce un email válido.",
      "number": "Introduce un número válido."
    },
    "submit": "Enviar solicitud",
    "submitting": "Enviando...",
    "success": "¡Gracias! Os contactaremos muy pronto.",
    "error": "Ha ocurrido un error. Inténtalo de nuevo.",
    "notConfigured": "El formulario aún no está configurado (falta la variable PUBLIC_FORMSPREE_ID)."
  },
  "footer": {
    "tagline": "Bodas de lujo con alma, en cualquier rincón del mundo.",
    "rights": "Todos los derechos reservados."
  }
}
```

- [ ] **Step 2: Write `src/i18n/en.json`**

```json
{
  "meta": {
    "title": "Ohana Weddings — Luxury weddings with soul",
    "description": "Full-service planning, day-of coordination, and design for luxury weddings, with a warm and exclusive approach."
  },
  "nav": {
    "about": "About Ohana",
    "services": "Services",
    "portfolio": "Portfolio",
    "testimonials": "Testimonials",
    "blog": "Blog",
    "cta": "Book Your Appointment"
  },
  "hero": {
    "eyebrow": "Luxury Wedding Planning",
    "title": "Weddings that feel like home",
    "subtitle": "We design and coordinate intimate and grand-scale celebrations with an editorial eye and exquisite care for every detail.",
    "cta": "Book Your Appointment"
  },
  "about": {
    "title": "About Ohana",
    "body1": "At Ohana we believe a wedding is the most honest expression of a love story. That's why we work side by side with every couple, from the first conversation to the last toast.",
    "body2": "Our team combines years of experience in luxury event planning with a warm, minimalist aesthetic sensibility, always in service of your vision.",
    "quote": "Ohana means family, and that's how we treat every project."
  },
  "services": {
    "title": "Our Services",
    "subtitle": "Three ways to support you, depending on what you need.",
    "integral": {
      "title": "Full-Service Planning",
      "description": "Complete wedding planning, from concept and budget to vendor selection and day-of logistics."
    },
    "diaB": {
      "title": "Day-Of Coordination",
      "description": "Professional coordination on your wedding day so you and your families can enjoy it without a single worry."
    },
    "diseno": {
      "title": "Design & Décor",
      "description": "Art direction, floral styling, and space design that reflect your story and style."
    }
  },
  "portfolio": {
    "title": "Portfolio & Multimedia"
  },
  "testimonials": {
    "title": "What Our Couples Say"
  },
  "blog": {
    "title": "Blog",
    "subtitle": "Trends, tips, and inspiration for your wedding.",
    "readMore": "Read more"
  },
  "contact": {
    "title": "Contact",
    "subtitle": "Tell us about your wedding and we'll get back to you within 48 hours.",
    "fields": {
      "name": "Name",
      "email": "Email",
      "phone": "Phone",
      "date": "Estimated date",
      "guests": "Number of guests",
      "budget": "Estimated budget (€)",
      "language": "Preferred language"
    },
    "placeholders": {
      "name": "Your full name",
      "email": "you@email.com",
      "phone": "+1 555 000 0000",
      "guests": "120",
      "budget": "25000"
    },
    "languageOptions": {
      "es": "Español",
      "en": "English"
    },
    "errors": {
      "required": "This field is required.",
      "email": "Enter a valid email.",
      "number": "Enter a valid number."
    },
    "submit": "Send request",
    "submitting": "Sending...",
    "success": "Thank you! We'll be in touch soon.",
    "error": "Something went wrong. Please try again.",
    "notConfigured": "The form isn't configured yet (missing PUBLIC_FORMSPREE_ID)."
  },
  "footer": {
    "tagline": "Luxury weddings with soul, anywhere in the world.",
    "rights": "All rights reserved."
  }
}
```

- [ ] **Step 3: Write `src/i18n/utils.ts`**

```ts
import es from './es.json';
import en from './en.json';

export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

const dictionaries = { es, en } as const;

export function useTranslations(lang: Lang) {
  const dict = dictionaries[lang] ?? dictionaries[defaultLang];
  return function t(key: string): string {
    const value = key.split('.').reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, dict);
    return typeof value === 'string' ? value : key;
  };
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'es' || lang === 'en') return lang;
  return defaultLang;
}

export function getLocalizedPath(pathname: string, targetLang: Lang): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'es' || parts[0] === 'en') {
    parts[0] = targetLang;
  } else {
    parts.unshift(targetLang);
  }
  return '/' + parts.join('/') + '/';
}
```

- [ ] **Step 4: Type-check**

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 5: Commit**

```bash
git add src/i18n
git commit -m "feat: add i18n dictionaries and translation utilities"
```

---

### Task 3: Mock data and placeholder image generation

**Files:**
- Create: `scripts/generate-placeholders.mjs`
- Create: `src/data/portfolio.ts`
- Create: `src/data/testimonials.ts`
- Create: `src/data/blog.ts`
- Generate (via script): `public/images/hero-{1..4}.svg`, `public/images/portfolio-{1..8}.svg`, `public/images/testimonial-{1..6}.svg`, `src/assets/images/blog-{1..6}.svg`

**Interfaces:**
- Consumes: nothing new.
- Produces:
  - `portfolioItems: PortfolioItem[]` where `PortfolioItem = { id: string; eventType: 'intima'|'lujo'|'destino'|'civil'; media: {type:'image'|'video'; src:string}[]; title:{es,en}; description:{es,en} }` — consumed by `PortfolioGrid.jsx` (Task 8).
  - `testimonials: Testimonial[]` where `Testimonial = { id:string; names:string; photo:string; rating:number; quote:{es,en} }` — consumed by `Testimonials.jsx` (Task 9).
  - `blogPosts: BlogPost[]` where `BlogPost = { id, slug, cover: ImageMetadata, date, title:{es,en}, excerpt:{es,en} }` — consumed by `BlogSection.astro` (Task 10).

- [ ] **Step 1: Write `scripts/generate-placeholders.mjs`**

```js
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const palette = {
  ivory: '#FDFBF7',
  champagne: '#D4C5B9',
  taupe: '#8C7A6B',
  sepia: '#5A4D41',
};

function svgPlaceholder({ width, height, label, seed }) {
  const angle = (seed * 37) % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g${seed}" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${palette.champagne}" />
      <stop offset="100%" stop-color="${palette.ivory}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g${seed})" />
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="${palette.taupe}" stroke-opacity="0.25" />
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="serif" font-size="${Math.round(Math.min(width, height) / 12)}" fill="${palette.sepia}" fill-opacity="0.55">${label}</text>
</svg>`;
}

function writeSet(dir, prefix, count, width, height, labelPrefix) {
  mkdirSync(dir, { recursive: true });
  for (let i = 1; i <= count; i++) {
    const svg = svgPlaceholder({ width, height, label: `${labelPrefix} ${i}`, seed: i });
    writeFileSync(join(dir, `${prefix}-${i}.svg`), svg, 'utf-8');
  }
}

writeSet(join(root, 'public/images'), 'hero', 4, 1600, 900, 'Ohana');
writeSet(join(root, 'public/images'), 'portfolio', 8, 800, 1000, 'Portfolio');
writeSet(join(root, 'public/images'), 'testimonial', 6, 200, 200, 'OW');
writeSet(join(root, 'src/assets/images'), 'blog', 6, 800, 500, 'Blog');

console.log('Placeholder images generated.');
```

- [ ] **Step 2: Run the generator and verify output**

Run: `npm run generate:placeholders`
Then: `ls public/images src/assets/images`
Expected: 4 `hero-*.svg`, 8 `portfolio-*.svg`, 6 `testimonial-*.svg` in `public/images`; 6 `blog-*.svg` in `src/assets/images`.

- [ ] **Step 3: Write `src/data/portfolio.ts`**

```ts
export type PortfolioMedia = { type: 'image' | 'video'; src: string };
export type EventType = 'intima' | 'lujo' | 'destino' | 'civil';

export type PortfolioItem = {
  id: string;
  eventType: EventType;
  media: PortfolioMedia[];
  title: { es: string; en: string };
  description: { es: string; en: string };
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'p1',
    eventType: 'intima',
    media: [{ type: 'image', src: '/images/portfolio-1.svg' }],
    title: { es: 'Boda íntima en el Empordà', en: 'Intimate wedding in Empordà' },
    description: {
      es: 'Una celebración de 40 invitados entre viñedos, con decoración floral en tonos champán.',
      en: 'A 40-guest celebration among vineyards, with floral decor in champagne tones.',
    },
  },
  {
    id: 'p2',
    eventType: 'lujo',
    media: [{ type: 'image', src: '/images/portfolio-2.svg' }],
    title: { es: 'Gala nupcial en Mallorca', en: 'Nuptial gala in Mallorca' },
    description: {
      es: 'Producción integral para 200 invitados en una finca señorial frente al mar.',
      en: 'Full production for 200 guests at a seaside manor estate.',
    },
  },
  {
    id: 'p3',
    eventType: 'destino',
    media: [{ type: 'image', src: '/images/portfolio-3.svg' }],
    title: { es: 'Boda destino en la Toscana', en: 'Destination wedding in Tuscany' },
    description: {
      es: 'Tres días de celebración entre olivares, con logística internacional para 90 invitados.',
      en: 'Three days of celebration among olive groves, with international logistics for 90 guests.',
    },
  },
  {
    id: 'p4',
    eventType: 'civil',
    media: [{ type: 'image', src: '/images/portfolio-4.svg' }],
    title: { es: 'Ceremonia civil en jardín botánico', en: 'Civil ceremony in a botanical garden' },
    description: {
      es: 'Una ceremonia laica rodeada de acuarelas botánicas y luz natural.',
      en: 'A secular ceremony surrounded by botanical watercolors and natural light.',
    },
  },
  {
    id: 'p5',
    eventType: 'lujo',
    media: [{ type: 'video', src: '/images/portfolio-5.svg' }],
    title: { es: 'Noche de gala en Madrid', en: 'Gala night in Madrid' },
    description: {
      es: 'Diseño escenográfico y coordinación en directo para una boda de 150 invitados.',
      en: 'Stage design and live coordination for a 150-guest wedding.',
    },
  },
  {
    id: 'p6',
    eventType: 'intima',
    media: [{ type: 'image', src: '/images/portfolio-6.svg' }],
    title: { es: 'Elopement en los Pirineos', en: 'Elopement in the Pyrenees' },
    description: {
      es: 'Una ceremonia privada de dos personas, con vistas a las montañas al amanecer.',
      en: 'A private two-person ceremony overlooking the mountains at dawn.',
    },
  },
  {
    id: 'p7',
    eventType: 'destino',
    media: [{ type: 'image', src: '/images/portfolio-7.svg' }],
    title: { es: 'Boda en la costa de Amalfi', en: 'Wedding on the Amalfi Coast' },
    description: {
      es: 'Cinco días de festejos con proveedores locales seleccionados a mano.',
      en: 'Five days of festivities with hand-picked local vendors.',
    },
  },
  {
    id: 'p8',
    eventType: 'civil',
    media: [{ type: 'image', src: '/images/portfolio-8.svg' }],
    title: { es: 'Rito simbólico en viñedo', en: 'Symbolic rite in a vineyard' },
    description: {
      es: 'Una tarde de otoño entre vides, con banquete de sobremesa al aire libre.',
      en: 'An autumn afternoon among vines, with an open-air feast.',
    },
  },
];
```

- [ ] **Step 4: Write `src/data/testimonials.ts`**

```ts
export type Testimonial = {
  id: string;
  names: string;
  photo: string;
  rating: number;
  quote: { es: string; en: string };
};

export const testimonials: Testimonial[] = [
  { id: 't1', names: 'Laura & Marc', photo: '/images/testimonial-1.svg', rating: 5, quote: { es: 'Ohana convirtió cada detalle en algo mágico. No cambiaríamos nada.', en: "Ohana turned every detail into something magical. We wouldn't change a thing." } },
  { id: 't2', names: 'Elena & Jordi', photo: '/images/testimonial-2.svg', rating: 5, quote: { es: 'Su equipo nos dio calma en cada paso, incluso el día de la boda.', en: 'Their team gave us calm at every step, even on the wedding day.' } },
  { id: 't3', names: 'Sara & Diego', photo: '/images/testimonial-3.svg', rating: 5, quote: { es: 'La atención al detalle fue impecable, desde el primer email hasta el último baile.', en: 'The attention to detail was impeccable, from the first email to the last dance.' } },
  { id: 't4', names: 'Ana & Pablo', photo: '/images/testimonial-4.svg', rating: 4, quote: { es: 'Profesionales, cercanos y muy organizados. Recomendados al 100%.', en: 'Professional, warm, and very organized. Highly recommended.' } },
  { id: 't5', names: 'Nuria & Carlos', photo: '/images/testimonial-5.svg', rating: 5, quote: { es: 'Entendieron nuestra visión desde el minuto uno y la hicieron realidad.', en: 'They understood our vision from minute one and made it real.' } },
  { id: 't6', names: 'Marta & Iván', photo: '/images/testimonial-6.svg', rating: 5, quote: { es: 'Cada proveedor que eligieron fue perfecto para nuestro estilo.', en: 'Every vendor they chose was perfect for our style.' } },
];
```

- [ ] **Step 5: Write `src/data/blog.ts`**

```ts
import type { ImageMetadata } from 'astro';
import blogCover1 from '../assets/images/blog-1.svg';
import blogCover2 from '../assets/images/blog-2.svg';
import blogCover3 from '../assets/images/blog-3.svg';
import blogCover4 from '../assets/images/blog-4.svg';
import blogCover5 from '../assets/images/blog-5.svg';
import blogCover6 from '../assets/images/blog-6.svg';

export type BlogPost = {
  id: string;
  slug: string;
  cover: ImageMetadata;
  date: string;
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
};

export const blogPosts: BlogPost[] = [
  { id: 'b1', slug: 'tendencias-2026', cover: blogCover1, date: '2026-01-12', title: { es: 'Tendencias para bodas en 2026', en: 'Wedding trends for 2026' }, excerpt: { es: 'Paletas cálidas, texturas naturales y ceremonias más íntimas marcan la temporada.', en: 'Warm palettes, natural textures, and more intimate ceremonies define the season.' } },
  { id: 'b2', slug: 'elegir-finca', cover: blogCover2, date: '2026-02-03', title: { es: 'Cómo elegir la finca perfecta', en: 'How to choose the perfect venue' }, excerpt: { es: 'Cinco preguntas clave antes de firmar el contrato con vuestro espacio.', en: 'Five key questions before signing your venue contract.' } },
  { id: 'b3', slug: 'presupuesto-realista', cover: blogCover3, date: '2026-02-20', title: { es: 'Cómo planificar un presupuesto realista', en: 'How to plan a realistic budget' }, excerpt: { es: 'Guía práctica para repartir el presupuesto sin sorpresas de última hora.', en: 'A practical guide to allocating your budget without last-minute surprises.' } },
  { id: 'b4', slug: 'boda-destino-checklist', cover: blogCover4, date: '2026-03-10', title: { es: 'Checklist para una boda destino', en: 'Checklist for a destination wedding' }, excerpt: { es: 'Todo lo que hay que coordinar cuando la boda es fuera de casa.', en: 'Everything to coordinate when the wedding is away from home.' } },
  { id: 'b5', slug: 'flores-de-temporada', cover: blogCover5, date: '2026-04-01', title: { es: 'Flores de temporada para tu ramo', en: 'Seasonal flowers for your bouquet' }, excerpt: { es: 'Cómo elegir flores que resistan bien y encajen con vuestra paleta.', en: 'How to choose flowers that hold up well and match your palette.' } },
  { id: 'b6', slug: 'dia-b-coordinacion', cover: blogCover6, date: '2026-04-18', title: { es: 'El valor de la coordinación del Día B', en: 'The value of day-of coordination' }, excerpt: { es: 'Por qué contar con un coordinador cambia por completo vuestra experiencia como invitados de vuestra propia boda.', en: 'Why having a coordinator completely changes your experience as guests at your own wedding.' } },
];
```

- [ ] **Step 6: Type-check**

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 7: Commit**

```bash
git add scripts src/data src/assets public/images
git commit -m "feat: add mock content data and placeholder image generator"
```

---

### Task 4: Layout, SEO head, and i18n page routing

**Files:**
- Create: `src/layouts/Layout.astro`
- Replace: `src/pages/index.astro`
- Create: `src/pages/[lang]/index.astro`

**Interfaces:**
- Consumes: `useTranslations`, `Lang`, `defaultLang` from `src/i18n/utils.ts` (Task 2).
- Produces: `Layout.astro` accepts `Props = { lang: Lang; title: string; description: string }` and renders `<slot />` between `<Header>`/`<Footer>` placeholders (added in Task 5 — until then, `Layout.astro` renders only the `<slot />`, no Header/Footer import, to avoid depending on files that don't exist yet). `[lang]/index.astro` is the page every later task adds a section import to.

- [ ] **Step 1: Write `src/layouts/Layout.astro`**

```astro
---
import '../styles/global.css';
import type { Lang } from '../i18n/utils';

interface Props {
  lang: Lang;
  title: string;
  description: string;
}

const { lang, title, description } = Astro.props;
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-ivory text-sepia font-sans">
    <main>
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 2: Replace `src/pages/index.astro`**

```astro
---
import { defaultLang } from '../i18n/utils';
return Astro.redirect(`/${defaultLang}/`);
---
```

- [ ] **Step 3: Write `src/pages/[lang]/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import { useTranslations, type Lang } from '../../i18n/utils';

export function getStaticPaths() {
  return [{ params: { lang: 'es' } }, { params: { lang: 'en' } }];
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);
---
<Layout lang={lang} title={t('meta.title')} description={t('meta.description')}>
  <p class="pt-32 text-center text-taupe">{t('hero.title')}</p>
</Layout>
```

- [ ] **Step 4: Verify build and routing**

Run: `npm run build`
Expected: no errors; `dist/es/index.html` and `dist/en/index.html` both exist; `dist/index.html` contains a redirect to `/es/`.

Run: `npm run dev`, then in a browser check `http://localhost:4321/` redirects to `/es/`, and `http://localhost:4321/en/` renders the English hero title.

- [ ] **Step 5: Commit**

```bash
git add src/layouts src/pages
git commit -m "feat: add base layout and i18n page routing"
```

---

### Task 5: Header, language switcher, footer

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/LanguageSwitcher.jsx`
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/Layout.astro`

**Interfaces:**
- Consumes: `useTranslations`, `Lang` (Task 2); `languages`, `getLocalizedPath` (Task 2, used by `LanguageSwitcher.jsx`).
- Produces: `Header.astro` and `Footer.astro` accept `Props = { lang: Lang }`. `Layout.astro` now renders `<Header lang={lang} />` before `<slot />` and `<Footer lang={lang} />` after it — every later section (Hero, About, etc.) therefore appears between a fixed header and the footer automatically.

- [ ] **Step 1: Write `src/components/LanguageSwitcher.jsx`**

```jsx
import { useState } from 'react';
import { Globe } from 'lucide-react';
import { languages, getLocalizedPath } from '../i18n/utils';

export default function LanguageSwitcher({ lang }) {
  const [open, setOpen] = useState(false);

  function handleSelect(targetLang) {
    setOpen(false);
    if (typeof window === 'undefined' || targetLang === lang) return;
    window.location.href = getLocalizedPath(window.location.pathname, targetLang);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-taupe hover:text-sepia transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        {languages[lang]}
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-32 rounded-2xl border border-border bg-white shadow-soft overflow-hidden"
        >
          {Object.entries(languages).map(([code, label]) => (
            <li key={code}>
              <button
                type="button"
                onClick={() => handleSelect(code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-champagne/30 ${code === lang ? 'text-sepia font-medium' : 'text-taupe'}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/Header.astro`**

```astro
---
import { Menu } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useTranslations, type Lang } from '../i18n/utils';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const prefix = `/${lang}`;

const links = [
  { href: `${prefix}/#about`, label: t('nav.about') },
  { href: `${prefix}/#services`, label: t('nav.services') },
  { href: `${prefix}/#portfolio`, label: t('nav.portfolio') },
  { href: `${prefix}/#testimonials`, label: t('nav.testimonials') },
  { href: `${prefix}/#blog`, label: t('nav.blog') },
];
---
<header class="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-ivory/80 border-b border-border">
  <div class="relative mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
    <a href={`${prefix}/`} class="font-serif text-xl text-sepia tracking-wide">Ohana Weddings</a>
    <input type="checkbox" id="menu-toggle" class="peer hidden" />
    <nav class="hidden md:flex items-center gap-8">
      {links.map((link) => (
        <a href={link.href} class="text-sm text-taupe hover:text-sepia transition-colors">{link.label}</a>
      ))}
    </nav>
    <div class="flex items-center gap-4">
      <LanguageSwitcher client:load lang={lang} />
      <a href={`${prefix}/#contact`} class="hidden sm:inline-block rounded-2xl bg-sepia text-ivory text-sm px-5 py-2.5 hover:bg-taupe transition-colors">
        {t('nav.cta')}
      </a>
      <label for="menu-toggle" class="md:hidden cursor-pointer text-sepia" aria-label="Menu">
        <Menu className="w-6 h-6" />
      </label>
    </div>
    <nav class="hidden peer-checked:flex flex-col gap-4 absolute top-full inset-x-0 bg-ivory border-b border-border px-6 py-6 md:hidden">
      {links.map((link) => (
        <a href={link.href} class="text-sm text-taupe hover:text-sepia transition-colors">{link.label}</a>
      ))}
    </nav>
  </div>
</header>
```

- [ ] **Step 3: Write `src/components/Footer.astro`**

```astro
---
import { useTranslations, type Lang } from '../i18n/utils';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const year = new Date().getFullYear();
---
<footer class="border-t border-border bg-white">
  <div class="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="text-center md:text-left">
      <p class="font-serif text-lg text-sepia">Ohana Weddings</p>
      <p class="text-sm text-taupe mt-1">{t('footer.tagline')}</p>
    </div>
    <p class="text-xs text-taupe">&copy; {year} Ohana Weddings. {t('footer.rights')}</p>
  </div>
</footer>
```

- [ ] **Step 4: Modify `src/layouts/Layout.astro` to wire Header/Footer**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import type { Lang } from '../i18n/utils';

interface Props {
  lang: Lang;
  title: string;
  description: string;
}

const { lang, title, description } = Astro.props;
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-ivory text-sepia font-sans">
    <Header lang={lang} />
    <main>
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 5: Verify in browser**

Run: `npm run build` (expect success), then `npm run dev`. In a browser, open `/es/`: confirm the fixed header has a blurred background, the language switcher dropdown opens and clicking "English" navigates to `/en/`, and the footer renders at the bottom. Resize to a mobile width and confirm the hamburger toggles the mobile nav open/closed.

- [ ] **Step 6: Commit**

```bash
git add src/components/Header.astro src/components/LanguageSwitcher.jsx src/components/Footer.astro src/layouts/Layout.astro
git commit -m "feat: add header, language switcher, and footer"
```

---

### Task 6: Hero section with image slider

**Files:**
- Create: `src/components/HeroSlider.jsx`
- Create: `src/components/Hero.astro`
- Modify: `src/pages/[lang]/index.astro`

**Interfaces:**
- Consumes: `useTranslations`, `Lang` (Task 2).
- Produces: `Hero.astro` accepts `Props = { lang: Lang }`, rendered as the first section on the page.

- [ ] **Step 1: Write `src/components/HeroSlider.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function HeroSlider({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="sync">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/Hero.astro`**

```astro
---
import HeroSlider from './HeroSlider.jsx';
import { useTranslations, type Lang } from '../i18n/utils';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const images = ['/images/hero-1.svg', '/images/hero-2.svg', '/images/hero-3.svg', '/images/hero-4.svg'];
---
<section class="relative h-[90vh] min-h-[560px] flex items-center justify-center overflow-hidden">
  <HeroSlider client:load images={images} />
  <div class="absolute inset-0 bg-sepia/40 z-[1]"></div>
  <div class="relative z-10 text-center px-6 max-w-2xl">
    <p class="font-sans text-sm tracking-[0.2em] uppercase text-ivory/90 mb-4">{t('hero.eyebrow')}</p>
    <h1 class="font-serif text-4xl md:text-6xl text-ivory leading-tight">{t('hero.title')}</h1>
    <p class="mt-6 text-ivory/90 text-lg">{t('hero.subtitle')}</p>
    <a href={`/${lang}/#contact`} class="inline-block mt-8 rounded-2xl bg-ivory text-sepia px-8 py-3 text-sm tracking-wide hover:bg-champagne transition-colors">
      {t('hero.cta')}
    </a>
  </div>
</section>
```

- [ ] **Step 3: Modify `src/pages/[lang]/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Hero from '../../components/Hero.astro';
import { useTranslations, type Lang } from '../../i18n/utils';

export function getStaticPaths() {
  return [{ params: { lang: 'es' } }, { params: { lang: 'en' } }];
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);
---
<Layout lang={lang} title={t('meta.title')} description={t('meta.description')}>
  <Hero lang={lang} />
</Layout>
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, open `/es/`. Confirm the hero fills the viewport, the background image crossfades to the next one after ~5 seconds, and the headline/CTA are legible over the dark overlay.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroSlider.jsx src/components/Hero.astro src/pages/[lang]/index.astro
git commit -m "feat: add hero section with crossfade image slider"
```

---

### Task 7: About and Services sections

**Files:**
- Create: `src/components/About.astro`
- Create: `src/components/Services.astro`
- Modify: `src/pages/[lang]/index.astro`

**Interfaces:**
- Consumes: `useTranslations`, `Lang` (Task 2). Reads dictionary keys `about.*` and `services.title`, `services.subtitle`, `services.{integral,diaB,diseno}.{title,description}` (defined in Task 2).
- Produces: `About.astro` and `Services.astro` accept `Props = { lang: Lang }`.

- [ ] **Step 1: Write `src/components/About.astro`**

```astro
---
import { useTranslations, type Lang } from '../i18n/utils';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<section id="about" class="mx-auto max-w-4xl px-6 py-24 text-center">
  <h2 class="font-serif text-3xl md:text-4xl text-sepia">{t('about.title')}</h2>
  <p class="mt-6 text-taupe leading-relaxed">{t('about.body1')}</p>
  <p class="mt-4 text-taupe leading-relaxed">{t('about.body2')}</p>
  <p class="mt-8 font-serif italic text-xl text-sepia">&ldquo;{t('about.quote')}&rdquo;</p>
</section>
```

- [ ] **Step 2: Write `src/components/Services.astro`**

```astro
---
import { useTranslations, type Lang } from '../i18n/utils';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const services = ['integral', 'diaB', 'diseno'] as const;
---
<section id="services" class="bg-white border-y border-border">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <div class="text-center max-w-xl mx-auto">
      <h2 class="font-serif text-3xl md:text-4xl text-sepia">{t('services.title')}</h2>
      <p class="mt-4 text-taupe">{t('services.subtitle')}</p>
    </div>
    <div class="mt-14 grid gap-8 md:grid-cols-3">
      {services.map((key) => (
        <div class="rounded-2xl border border-border p-8 shadow-soft hover:-translate-y-1 transition-transform bg-ivory">
          <h3 class="font-serif text-xl text-sepia">{t(`services.${key}.title`)}</h3>
          <p class="mt-3 text-sm text-taupe leading-relaxed">{t(`services.${key}.description`)}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Modify `src/pages/[lang]/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import Services from '../../components/Services.astro';
import { useTranslations, type Lang } from '../../i18n/utils';

export function getStaticPaths() {
  return [{ params: { lang: 'es' } }, { params: { lang: 'en' } }];
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);
---
<Layout lang={lang} title={t('meta.title')} description={t('meta.description')}>
  <Hero lang={lang} />
  <About lang={lang} />
  <Services lang={lang} />
</Layout>
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, open `/es/`, scroll past the hero. Confirm the About section text and the three service cards render with `rounded-2xl` cards and hover lift. Switch to `/en/` and confirm the English copy.

- [ ] **Step 5: Commit**

```bash
git add src/components/About.astro src/components/Services.astro src/pages/[lang]/index.astro
git commit -m "feat: add about and services sections"
```

---

### Task 8: Portfolio grid with filters and lightbox

**Files:**
- Create: `src/components/PortfolioGrid.jsx`
- Modify: `src/pages/[lang]/index.astro`

**Interfaces:**
- Consumes: `portfolioItems: PortfolioItem[]` (Task 3); dictionary key `portfolio.title` (Task 2, read via a local `TITLES` map mirroring it — see note below).
- Produces: `PortfolioGrid` accepts `Props = { lang: 'es'|'en'; items: PortfolioItem[] }`.

Note: `PortfolioGrid.jsx` is a React island and does not have access to Astro's `useTranslations` server helper across the props boundary for arbitrary future keys conveniently for small fixed label sets (filter labels), so filter labels and the section title are defined as local `TITLES`/`FILTER_LABELS` maps inside the component, keyed the same way as the dictionary content for `portfolio.title`, so the visible copy matches `es.json`/`en.json` even though it isn't re-fetched through `t()` at runtime in this file.

- [ ] **Step 1: Write `src/components/PortfolioGrid.jsx`**

```jsx
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Play } from 'lucide-react';

const FILTERS = ['all', 'intima', 'lujo', 'destino', 'civil'];

const TITLES = {
  es: 'Portafolio y Multimedia',
  en: 'Portfolio & Multimedia',
};

const FILTER_LABELS = {
  es: { all: 'Todos', intima: 'Íntimas', lujo: 'Lujo', destino: 'Destino', civil: 'Civiles' },
  en: { all: 'All', intima: 'Intimate', lujo: 'Luxury', destino: 'Destination', civil: 'Civil' },
};

export default function PortfolioGrid({ lang, items }) {
  const [filter, setFilter] = useState('all');
  const [activeItem, setActiveItem] = useState(null);
  const labels = FILTER_LABELS[lang];

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((item) => item.eventType === filter)),
    [filter, items]
  );

  return (
    <section id="portfolio" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-sepia">{TITLES[lang]}</h2>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-2xl px-4 py-2 text-sm border transition-colors ${
              filter === key
                ? 'bg-sepia text-ivory border-sepia'
                : 'bg-white text-taupe border-border hover:border-taupe'
            }`}
          >
            {labels[key]}
          </button>
        ))}
      </div>
      <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-6">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveItem(item)}
            className="relative mb-6 block w-full rounded-2xl overflow-hidden border border-border shadow-soft break-inside-avoid"
          >
            <img src={item.media[0].src} alt={item.title[lang]} className="w-full h-auto object-cover" />
            {item.media[0].type === 'video' && (
              <span className="absolute top-3 right-3 bg-ivory/90 text-sepia rounded-full p-2">
                <Play className="w-4 h-4" />
              </span>
            )}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-sepia/70 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-soft"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 text-sepia bg-ivory rounded-full p-2 z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={activeItem.media[0].src} alt={activeItem.title[lang]} className="w-full h-auto" />
              <div className="p-6">
                <h3 className="font-serif text-xl text-sepia">{activeItem.title[lang]}</h3>
                <p className="mt-2 text-sm text-taupe leading-relaxed">{activeItem.description[lang]}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
```

- [ ] **Step 2: Modify `src/pages/[lang]/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import Services from '../../components/Services.astro';
import PortfolioGrid from '../../components/PortfolioGrid.jsx';
import { useTranslations, type Lang } from '../../i18n/utils';
import { portfolioItems } from '../../data/portfolio';

export function getStaticPaths() {
  return [{ params: { lang: 'es' } }, { params: { lang: 'en' } }];
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);
---
<Layout lang={lang} title={t('meta.title')} description={t('meta.description')}>
  <Hero lang={lang} />
  <About lang={lang} />
  <Services lang={lang} />
  <PortfolioGrid client:visible lang={lang} items={portfolioItems} />
</Layout>
```

- [ ] **Step 3: Verify in browser**

Run: `npm run dev`, open `/es/`, scroll to Portfolio. Confirm the masonry grid renders, clicking a filter narrows the grid to that event type, clicking a card opens the lightbox with title/description, and the item marked as video shows a play badge. Close via the X button or clicking outside the card.

- [ ] **Step 4: Commit**

```bash
git add src/components/PortfolioGrid.jsx src/pages/[lang]/index.astro
git commit -m "feat: add filterable portfolio grid with lightbox"
```

---

### Task 9: Testimonials carousel

**Files:**
- Create: `src/components/Testimonials.jsx`
- Modify: `src/pages/[lang]/index.astro`

**Interfaces:**
- Consumes: `testimonials: Testimonial[]` (Task 3).
- Produces: `Testimonials` accepts `Props = { lang: 'es'|'en'; items: Testimonial[] }`.

- [ ] **Step 1: Write `src/components/Testimonials.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const TITLES = { es: 'Opiniones de Nuestras Parejas', en: 'What Our Couples Say' };

export default function Testimonials({ lang, items }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  function go(delta) {
    setIndex((i) => (i + delta + items.length) % items.length);
  }

  const current = items[index];

  return (
    <section id="testimonials" className="bg-white border-y border-border">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-sepia">{TITLES[lang]}</h2>
        <div className="mt-12 relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <img src={current.photo} alt={current.names} className="w-16 h-16 rounded-full object-cover border border-border" />
              <div className="flex gap-1 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < current.rating ? 'fill-champagne text-champagne' : 'text-border'}`} />
                ))}
              </div>
              <p className="mt-4 font-serif italic text-lg text-sepia max-w-xl">&ldquo;{current.quote[lang]}&rdquo;</p>
              <p className="mt-3 text-sm text-taupe">{current.names}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} className="rounded-full border border-border p-2 hover:border-taupe" aria-label="Previous">
            <ChevronLeft className="w-4 h-4 text-taupe" />
          </button>
          <button type="button" onClick={() => go(1)} className="rounded-full border border-border p-2 hover:border-taupe" aria-label="Next">
            <ChevronRight className="w-4 h-4 text-taupe" />
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Modify `src/pages/[lang]/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import Services from '../../components/Services.astro';
import PortfolioGrid from '../../components/PortfolioGrid.jsx';
import Testimonials from '../../components/Testimonials.jsx';
import { useTranslations, type Lang } from '../../i18n/utils';
import { portfolioItems } from '../../data/portfolio';
import { testimonials } from '../../data/testimonials';

export function getStaticPaths() {
  return [{ params: { lang: 'es' } }, { params: { lang: 'en' } }];
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);
---
<Layout lang={lang} title={t('meta.title')} description={t('meta.description')}>
  <Hero lang={lang} />
  <About lang={lang} />
  <Services lang={lang} />
  <PortfolioGrid client:visible lang={lang} items={portfolioItems} />
  <Testimonials client:visible lang={lang} items={testimonials} />
</Layout>
```

- [ ] **Step 3: Verify in browser**

Run: `npm run dev`, open `/es/`, scroll to Testimonials. Confirm the current testimonial autoplays forward every ~6 seconds with a fade/slide transition, and the prev/next buttons manually step through testimonials.

- [ ] **Step 4: Commit**

```bash
git add src/components/Testimonials.jsx src/pages/[lang]/index.astro
git commit -m "feat: add testimonials carousel"
```

---

### Task 10: Blog section

**Files:**
- Create: `src/components/BlogSection.astro`
- Modify: `src/pages/[lang]/index.astro`

**Interfaces:**
- Consumes: `blogPosts: BlogPost[]` (Task 3); `useTranslations`, `Lang` (Task 2).
- Produces: `BlogSection.astro` accepts `Props = { lang: Lang }`.

- [ ] **Step 1: Write `src/components/BlogSection.astro`**

```astro
---
import { Image } from 'astro:assets';
import { useTranslations, type Lang } from '../i18n/utils';
import { blogPosts } from '../data/blog';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<section id="blog" class="mx-auto max-w-6xl px-6 py-24">
  <div class="text-center max-w-xl mx-auto">
    <h2 class="font-serif text-3xl md:text-4xl text-sepia">{t('blog.title')}</h2>
    <p class="mt-4 text-taupe">{t('blog.subtitle')}</p>
  </div>
  <div class="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {blogPosts.map((post) => (
      <article class="rounded-2xl overflow-hidden border border-border bg-white shadow-soft">
        <Image src={post.cover} alt={post.title[lang]} width={800} height={500} class="w-full h-48 object-cover" />
        <div class="p-6">
          <p class="text-xs text-taupe uppercase tracking-wide">{post.date}</p>
          <h3 class="mt-2 font-serif text-lg text-sepia">{post.title[lang]}</h3>
          <p class="mt-2 text-sm text-taupe leading-relaxed">{post.excerpt[lang]}</p>
          <span class="mt-4 inline-block text-sm text-sepia underline underline-offset-4">{t('blog.readMore')}</span>
        </div>
      </article>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Modify `src/pages/[lang]/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import Services from '../../components/Services.astro';
import PortfolioGrid from '../../components/PortfolioGrid.jsx';
import Testimonials from '../../components/Testimonials.jsx';
import BlogSection from '../../components/BlogSection.astro';
import { useTranslations, type Lang } from '../../i18n/utils';
import { portfolioItems } from '../../data/portfolio';
import { testimonials } from '../../data/testimonials';

export function getStaticPaths() {
  return [{ params: { lang: 'es' } }, { params: { lang: 'en' } }];
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);
---
<Layout lang={lang} title={t('meta.title')} description={t('meta.description')}>
  <Hero lang={lang} />
  <About lang={lang} />
  <Services lang={lang} />
  <PortfolioGrid client:visible lang={lang} items={portfolioItems} />
  <Testimonials client:visible lang={lang} items={testimonials} />
  <BlogSection lang={lang} />
</Layout>
```

- [ ] **Step 3: Verify build and browser**

Run: `npm run build` — confirm no errors (this is the first task exercising Astro's `<Image>` pipeline on the generated SVGs; a failure here most likely means `src/assets/images/blog-*.svg` weren't generated — re-run `npm run generate:placeholders` from Task 3 if so).
Run: `npm run dev`, open `/es/`, scroll to Blog. Confirm 6 article cards render with cover image, date, title, and excerpt.

- [ ] **Step 4: Commit**

```bash
git add src/components/BlogSection.astro src/pages/[lang]/index.astro
git commit -m "feat: add blog section"
```

---

### Task 11: Contact form with validation and Formspree submission

**Files:**
- Create: `src/components/ContactForm.jsx`
- Modify: `src/pages/[lang]/index.astro`

**Interfaces:**
- Consumes: `useTranslations` (Task 2, imported directly inside the island since it has no server-only dependencies); reads `import.meta.env.PUBLIC_FORMSPREE_ID`.
- Produces: `ContactForm` accepts `Props = { lang: 'es'|'en' }`. Terminal task in the page-assembly chain — after this, `[lang]/index.astro` contains every section from the spec.

- [ ] **Step 1: Write `src/components/ContactForm.jsx`**

```jsx
import { useState } from 'react';
import { useTranslations } from '../i18n/utils';

const initialState = {
  name: '', email: '', phone: '', date: '', guests: '', budget: '', language: '',
};

export default function ContactForm({ lang }) {
  const t = useTranslations(lang);
  const formId = import.meta.env.PUBLIC_FORMSPREE_ID;
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = t('contact.errors.required');
    if (!values.email.trim()) next.email = t('contact.errors.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t('contact.errors.email');
    if (!values.date.trim()) next.date = t('contact.errors.required');
    if (values.guests && Number.isNaN(Number(values.guests))) next.guests = t('contact.errors.number');
    if (values.budget && Number.isNaN(Number(values.budget))) next.budget = t('contact.errors.number');
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!formId) {
      console.warn('PUBLIC_FORMSPREE_ID is not set — the contact form cannot submit yet.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setValues(initialState);
    } catch {
      setStatus('error');
    }
  }

  const fields = [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'tel' },
    { name: 'date', type: 'date' },
    { name: 'guests', type: 'number' },
    { name: 'budget', type: 'number' },
  ];

  if (!formId) {
    return (
      <section id="contact" className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-sepia">{t('contact.title')}</h2>
        <p className="mt-6 rounded-2xl border border-border bg-white p-6 text-sm text-taupe">
          {t('contact.notConfigured')}
        </p>
      </section>
    );
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-24">
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-sepia">{t('contact.title')}</h2>
        <p className="mt-4 text-taupe">{t('contact.subtitle')}</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="mt-10 grid gap-5 sm:grid-cols-2">
        {fields.map(({ name, type }) => (
          <div key={name} className={name === 'name' || name === 'email' ? 'sm:col-span-2' : ''}>
            <label htmlFor={name} className="block text-sm text-sepia mb-1.5">
              {t(`contact.fields.${name}`)}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={values[name]}
              onChange={handleChange}
              placeholder={type !== 'date' ? t(`contact.placeholders.${name}`) : undefined}
              className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm text-sepia placeholder:text-taupe/60 focus:outline-none focus:border-taupe"
            />
            {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor="language" className="block text-sm text-sepia mb-1.5">
            {t('contact.fields.language')}
          </label>
          <select
            id="language"
            name="language"
            value={values.language}
            onChange={handleChange}
            className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm text-sepia focus:outline-none focus:border-taupe"
          >
            <option value="">—</option>
            <option value="es">{t('contact.languageOptions.es')}</option>
            <option value="en">{t('contact.languageOptions.en')}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full rounded-2xl bg-sepia text-ivory px-6 py-3 text-sm tracking-wide hover:bg-taupe transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? t('contact.submitting') : t('contact.submit')}
          </button>
          {status === 'success' && <p className="mt-3 text-sm text-green-700">{t('contact.success')}</p>}
          {status === 'error' && <p className="mt-3 text-sm text-red-600">{t('contact.error')}</p>}
        </div>
      </form>
    </section>
  );
}
```

- [ ] **Step 2: Modify `src/pages/[lang]/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import Services from '../../components/Services.astro';
import PortfolioGrid from '../../components/PortfolioGrid.jsx';
import Testimonials from '../../components/Testimonials.jsx';
import BlogSection from '../../components/BlogSection.astro';
import ContactForm from '../../components/ContactForm.jsx';
import { useTranslations, type Lang } from '../../i18n/utils';
import { portfolioItems } from '../../data/portfolio';
import { testimonials } from '../../data/testimonials';

export function getStaticPaths() {
  return [{ params: { lang: 'es' } }, { params: { lang: 'en' } }];
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);
---
<Layout lang={lang} title={t('meta.title')} description={t('meta.description')}>
  <Hero lang={lang} />
  <About lang={lang} />
  <Services lang={lang} />
  <PortfolioGrid client:visible lang={lang} items={portfolioItems} />
  <Testimonials client:visible lang={lang} items={testimonials} />
  <BlogSection lang={lang} />
  <ContactForm client:visible lang={lang} />
</Layout>
```

- [ ] **Step 3: Verify in browser — unconfigured state**

Run: `npm run dev` (with `.env` absent or `PUBLIC_FORMSPREE_ID` unset). Open `/es/`, scroll to Contact. Confirm the "not configured" notice renders instead of the form.

- [ ] **Step 4: Verify in browser — configured state**

Create a local `.env` (not committed) with `PUBLIC_FORMSPREE_ID=test123`, restart `npm run dev`. Confirm the full form now renders. Submit empty: confirm required-field errors appear under Nombre, Email, Fecha estimada. Fill valid values and submit: open the browser's network panel and confirm a `POST` request fires to `https://formspree.io/f/test123` (it will fail with a real error response since `test123` isn't a real form ID — that's expected; confirm the UI shows the error state, not a crash). Remove the local `.env` afterward (it must stay untracked, matching `.gitignore` from Task 1).

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactForm.jsx src/pages/[lang]/index.astro
git commit -m "feat: add contact form with validation and Formspree submission"
```

---

### Task 12: README and final end-to-end verification

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: nothing new — this task documents and verifies the assembled site from Tasks 1-11.
- Produces: nothing consumed by other tasks (final task).

- [ ] **Step 1: Write `README.md`**

```markdown
# Ohana Weddings

Sitio corporativo bilingüe (ES/EN) para Ohana Weddings, construido con Astro, React y Tailwind CSS v4.

## Requisitos

- Node.js 18+
- npm

## Puesta en marcha

\`\`\`bash
npm install
npm run generate:placeholders   # genera las imágenes SVG de muestra (ya generadas en el repo, solo hace falta si se borran)
npm run dev
\`\`\`

El sitio queda disponible en `http://localhost:4321`. La raíz `/` redirige a `/es/`; el inglés vive en `/en/`.

## Configurar el formulario de contacto

El formulario envía las solicitudes a [Formspree](https://formspree.io):

1. Crea una cuenta gratuita en Formspree y un nuevo formulario.
2. Copia el ID del formulario (el segmento tras `/f/` en la URL del endpoint).
3. Crea un archivo `.env` en la raíz del proyecto (no se versiona) con:

\`\`\`
PUBLIC_FORMSPREE_ID=tu_id_aqui
\`\`\`

4. Reinicia `npm run dev`. Sin esta variable, la sección de contacto muestra un aviso de "formulario no configurado" en vez de fallar.

## Sustituir las imágenes de muestra

Todas las imágenes son SVG placeholder generados por `scripts/generate-placeholders.mjs`, en dos ubicaciones:

- `src/assets/images/blog-*.svg` — portadas del blog (usadas con el componente `<Image>` de Astro).
- `public/images/{hero,portfolio,testimonial}-*.svg` — imágenes usadas dentro de islas React.

Para usar fotografía real, sustituye cada archivo por una imagen con el mismo nombre (o actualiza las rutas en `src/data/*.ts`).

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción a `dist/`
- `npm run preview` — sirve el build de producción localmente
- `npm run check` — comprobación de tipos (Astro + TypeScript)

## Estructura

Ver `docs/superpowers/specs/2026-09-02-ohana-weddings-site-design.md` para la arquitectura completa.
```

- [ ] **Step 2: Full build verification**

Run: `npm run build`
Expected: no errors; `dist/es/index.html` and `dist/en/index.html` both exist and contain all sections (hero, about, services, portfolio, testimonials, blog, contact).

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 3: Full browser verification pass**

Run: `npm run dev`. Using the browser:

1. Open `/` — confirm redirect to `/es/`.
2. On `/es/`: scroll through every section top to bottom (Hero → About → Services → Portfolio → Testimonials → Blog → Contact) confirming no layout breakage, no console errors (check via the console-reading tool).
3. Switch to `/en/` via the language switcher — confirm every section's copy is now in English and the URL is `/en/`.
4. Resize the browser to a mobile viewport (e.g. 390px wide) and re-check: header hamburger menu opens/closes, Hero/About/Services/Contact remain readable and touch-friendly, Portfolio grid collapses to a single column.
5. Repeat the Portfolio filter/lightbox and Testimonials carousel checks from Tasks 8-9 at mobile width.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add project README with setup and configuration instructions"
```
