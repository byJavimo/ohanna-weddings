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
