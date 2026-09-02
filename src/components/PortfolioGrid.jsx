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
              className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-soft"
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
              {activeItem.media[0].type === 'video' ? (
                <video src={activeItem.media[0].src} controls className="w-full h-auto" />
              ) : (
                <img src={activeItem.media[0].src} alt={activeItem.title[lang]} className="w-full h-auto" />
              )}
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
