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
