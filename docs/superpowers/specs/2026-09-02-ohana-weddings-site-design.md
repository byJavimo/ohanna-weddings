# Ohana Weddings — Corporate Site Design

## Purpose

Build the full Astro + React + Tailwind scaffold for the Ohana Weddings
corporate site: a bilingual (ES/EN), editorial, minimalist-luxury wedding
planning site with hero, storytelling, services, portfolio gallery,
testimonials, blog, and a contact form. This is a greenfield build in an
empty repository — no existing code to integrate with.

## Stack

- **Astro 4+** with `@astrojs/react` and `@astrojs/tailwind` integrations.
- **Output: `static`** — no server runtime needed. The contact form posts to
  Formspree via client-side `fetch`, so SSR/adapters are unnecessary.
- **TypeScript** throughout (`.astro` frontmatter, `.ts` data/i18n utils,
  `.tsx`/`.jsx` React islands — components below are written in `.jsx` per
  the requested file structure, but with typed props where practical).
- **Tailwind CSS** for styling, with a custom theme (colors, fonts, border
  radius) in `tailwind.config.mjs`.
- **lucide-react** for icons.
- **framer-motion** for micro-interactions (hero slider crossfade, portfolio
  lightbox, testimonial carousel, hover states).
- **Google Fonts**: Playfair Display (headings) + Inter (body), loaded via
  `<link>` in `Layout.astro` with `rel="preconnect"` for performance.

## i18n Routing

Astro's native i18n routing is used, not a custom middleware:

```js
// astro.config.mjs
i18n: {
  locales: ['es', 'en'],
  defaultLocale: 'es',
  routing: {
    prefixDefaultLocale: true,
    redirectToDefaultLocale: true,
  },
}
```

- `/src/pages/index.astro` — thin redirect page (Astro's i18n middleware
  handles `/` → `/es/` automatically via `redirectToDefaultLocale`; this
  file exists to satisfy the requested structure and as a fallback manual
  redirect if needed).
- `/src/pages/[lang]/index.astro` — the actual page, rendered for both
  `es` and `en` via `getStaticPaths()` returning `[{params: {lang: 'es'}},
  {params: {lang: 'en'}}]`. Reads `Astro.params.lang`, loads the matching
  dictionary, and composes all sections.
- Translation dictionaries: `/src/i18n/es.json`, `/src/i18n/en.json` — UI
  copy only (nav labels, section headings, form labels/placeholders/errors,
  buttons). Content data (portfolio items, testimonials, blog posts) is
  **not** stored here — see Data below.
- `/src/i18n/utils.ts` — `useTranslations(lang)` returns a `t(key)` getter
  with dot-path lookup into the dictionary and a safe fallback to the key
  itself (never throws on a missing key, so a typo shows visibly instead of
  crashing the build).

## Component Breakdown

| File | Type | Responsibility |
|---|---|---|
| `layouts/Layout.astro` | Astro | `<head>`, SEO metatags (title/description/OG per page), Google Fonts, `lang`/`dir` attrs on `<html>` |
| `components/Header.astro` | Astro | Fixed nav, `backdrop-blur`, anchor links, embeds `<LanguageSwitcher client:load />` |
| `components/Hero.astro` | Astro | Wraps `<HeroSlider client:load />`, headline/subhead/CTA text from dictionary |
| `components/HeroSlider.jsx` | React island | Crossfade slider over 3-4 placeholder images (Framer Motion `AnimatePresence`) |
| `components/About.astro` | Astro | Storytelling section, static content from dictionary |
| `components/Services.astro` | Astro | Grid of 3 service cards (Organización Integral, Coordinación del Día B, Diseño y Decoración) |
| `components/PortfolioGrid.jsx` | React island | Masonry (CSS columns), event-type filters, lightbox modal for image/video |
| `components/Testimonials.jsx` | React island | Autoplay carousel, couple photo + name + star rating |
| `components/BlogSection.astro` | Astro | Grid of article preview cards from mock blog data |
| `components/ContactForm.jsx` | React island | Controlled form, client validation, Formspree submit, loading/success/error states |
| `components/LanguageSwitcher.jsx` | React island | ES/EN dropdown, preserves current path when switching locale |
| `components/Footer.astro` | Astro | Links, contact summary, socials |

Astro components render static markup at build time; only the four `.jsx`
files above ship JS (`client:load` or `client:visible` where scroll-linked,
e.g. `PortfolioGrid` and `Testimonials` can use `client:visible` to defer
hydration until scrolled into view).

## Data

- `/src/data/portfolio.ts` — array of portfolio items, each with `{ id,
  type, media: {type: 'image'|'video', src}[], title: {es, en}, description:
  {es, en} }`. 6-8 mock entries across event types (boda íntima, boda de
  lujo, destino, etc.).
- `/src/data/testimonials.ts` — 4-6 mock entries `{ id, names, photo,
  rating, quote: {es, en} }`.
- `/src/data/blog.ts` — 4-6 mock posts `{ id, slug, cover, date, title:
  {es, en}, excerpt: {es, en} }`.

Bilingual content lives inline per item (not in the UI dictionaries) because
it's domain data, not interface copy — keeps `es.json`/`en.json` focused
and lets content grow independently of UI strings.

## Image Placeholders

No real photography exists yet. Placeholder assets are locally generated
flat-color/gradient SVGs in `/public/images/` (portfolio, hero, testimonial
avatars, blog covers), using the ivory/champagne/sepia palette, sized
correctly for their slot. All are wired through Astro's `<Image>` component
for automatic optimization, so swapping in real photos later is a drop-in
file replacement — no code changes required.

## Contact Form

Fields: Nombre, Email, Teléfono, Fecha estimada, N° de invitados,
Presupuesto estimado, Idioma preferido.

- Client-side validation: required (nombre, email, fecha), email format,
  invitados/presupuesto numeric. Error messages sourced from the i18n
  dictionary.
- Submission: `fetch('https://formspree.io/f/' + import.meta.env
  .PUBLIC_FORMSPREE_ID, ...)`. The ID is read from `PUBLIC_FORMSPREE_ID`,
  declared empty in `.env.example`.
- If the env var is unset/empty, the form renders a visible "not configured"
  notice instead of silently failing, and logs a console warning — this
  keeps the scaffold honest about what still needs setup versus pretending
  to work.
- States: idle → submitting (disabled button + spinner) → success (message)
  / error (message + retry).

## Design System (Tailwind theme)

```js
colors: {
  ivory: '#FDFBF7',
  white: '#FFFFFF',
  border: '#EAE3D9',
  taupe: '#8C7A6B',
  sepia: '#5A4D41',
  champagne: '#D4C5B9',
}
fontFamily: {
  serif: ['"Playfair Display"', 'serif'],
  sans: ['Inter', 'sans-serif'],
}
```

`rounded-2xl` as the default radius on cards/containers; soft high-blur
low-opacity shadows (`shadow-[0_8px_40px_rgba(140,122,107,0.12)]` style
utility) for the blurred-shadow look from the brief.

## File Structure

```
/src
├── /i18n
│   ├── es.json
│   ├── en.json
│   └── utils.ts
├── /data
│   ├── portfolio.ts
│   ├── testimonials.ts
│   └── blog.ts
├── /components
│   ├── Header.astro
│   ├── Hero.astro
│   ├── HeroSlider.jsx
│   ├── About.astro
│   ├── Services.astro
│   ├── PortfolioGrid.jsx
│   ├── Testimonials.jsx
│   ├── BlogSection.astro
│   ├── ContactForm.jsx
│   ├── LanguageSwitcher.jsx
│   └── Footer.astro
├── /layouts
│   └── Layout.astro
└── /pages
    ├── index.astro
    └── /[lang]
        └── index.astro
/public
└── /images
    └── ... placeholder SVGs
astro.config.mjs
tailwind.config.mjs
.env.example
```

## Tooling

- Package manager: **npm**.
- `output: 'static'` — deployable to any static host (Netlify, Vercel,
  GitHub Pages).

## Verification Plan

1. `npm run build` completes with no errors (Astro type-checks `.astro`
   frontmatter and TS files during build).
2. `npm run dev`, then browser-driven checks (Chrome tool) covering:
   - `/` redirects to `/es/`.
   - Language switcher toggles `/es/` ↔ `/en/` preserving scroll position
     context.
   - Hero slider crossfades between images automatically.
   - Portfolio filters narrow the grid correctly; lightbox opens/closes for
     both image and video items.
   - Testimonials carousel autoplays and responds to manual controls.
   - Contact form: submit with empty required fields shows validation
     errors; submit with valid data triggers the Formspree fetch (network
     tab confirms the request even though the ID is a placeholder).
3. Mobile viewport check (browser resize) confirming touch-friendly layout
   on Hero, Header nav, Services grid, and ContactForm.

## Out of Scope

- Real photography/video assets.
- A live Formspree account/ID (left as a documented placeholder env var).
- Blog article detail pages (only the listing/preview cards, per the
  requested structure).
- Automated test suite (no testing framework requested).
