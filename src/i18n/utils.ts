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
