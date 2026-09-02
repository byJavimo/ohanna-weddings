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
