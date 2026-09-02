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
