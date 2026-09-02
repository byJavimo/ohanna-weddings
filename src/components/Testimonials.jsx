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
