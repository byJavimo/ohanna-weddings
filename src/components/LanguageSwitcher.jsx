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
