# Ohana Weddings

Sitio corporativo bilingüe (ES/EN) para Ohana Weddings, construido con Astro, React y Tailwind CSS v4.

## Requisitos

- Node.js 18+
- npm

## Puesta en marcha

```bash
npm install
npm run generate:placeholders   # genera las imágenes SVG de muestra (ya generadas en el repo, solo hace falta si se borran)
npm run dev
```

El sitio queda disponible en `http://localhost:4321`. La raíz `/` redirige a `/es/`; el inglés vive en `/en/`.

## Configurar el formulario de contacto

El formulario envía las solicitudes a [Formspree](https://formspree.io):

1. Crea una cuenta gratuita en Formspree y un nuevo formulario.
2. Copia el ID del formulario (el segmento tras `/f/` en la URL del endpoint).
3. Crea un archivo `.env` en la raíz del proyecto (no se versiona) con:

```
PUBLIC_FORMSPREE_ID=tu_id_aqui
```

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
