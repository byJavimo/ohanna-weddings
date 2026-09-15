import { useState } from 'react';
import { useTranslations } from '../i18n/utils';

const initialState = {
  name: '', email: '', phone: '', language: '',
};

export default function ContactForm({ lang }) {
  const t = useTranslations(lang);
  const accessKey = import.meta.env.PUBLIC_WEB3FORMS_KEY?.trim();
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = t('contact.errors.required');
    if (!values.email.trim()) next.email = t('contact.errors.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t('contact.errors.email');
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!accessKey) {
      console.warn('PUBLIC_WEB3FORMS_KEY is not set — the contact form cannot submit yet.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, access_key: accessKey }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error('Request failed');
      setStatus('success');
      setValues(initialState);
    } catch {
      setStatus('error');
    }
  }

  const fields = [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'tel' },
  ];

  const inputClass =
    'peer w-full bg-transparent border-0 border-b border-ivory/25 pt-2 pb-3 text-2xl md:text-3xl font-serif text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-ivory transition-colors';

  if (!accessKey) {
    return (
      <section id="contact" className="bg-ink text-ivory">
        <div className="mx-auto max-w-2xl px-6 py-24 md:py-32 text-center">
          <h2 className="font-serif text-4xl md:text-5xl" data-reveal>{t('contact.title')}</h2>
          <p className="mt-6 rounded-2xl border border-ivory/20 p-6 text-sm text-ivory/70" data-reveal style={{ transitionDelay: '0.08s' }}>
            {t('contact.notConfigured')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-ink text-ivory overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-36">
        <div className="text-center">
          <h2 className="font-serif text-5xl md:text-7xl" data-reveal>{t('contact.title')}</h2>
          <p className="mt-6 text-ivory/60 text-lg" data-reveal style={{ transitionDelay: '0.08s' }}>{t('contact.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="mt-20 grid gap-12 sm:grid-cols-2" data-reveal-group>
          {fields.map(({ name, type }) => (
            <div key={name} className="sm:col-span-2" data-reveal>
              <label htmlFor={name} className="block text-xs tracking-[0.25em] uppercase text-ivory/50 mb-2">
                {t(`contact.fields.${name}`)}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={values[name]}
                onChange={handleChange}
                placeholder={t(`contact.placeholders.${name}`)}
                className={inputClass}
              />
              {errors[name] && <p className="mt-2 text-xs text-red-300">{errors[name]}</p>}
            </div>
          ))}
          <div className="sm:col-span-2" data-reveal>
            <label htmlFor="language" className="block text-xs tracking-[0.25em] uppercase text-ivory/50 mb-2">
              {t('contact.fields.language')}
            </label>
            <select
              id="language"
              name="language"
              value={values.language}
              onChange={handleChange}
              className="w-full bg-transparent border-0 border-b border-ivory/25 pt-2 pb-3 text-2xl md:text-3xl font-serif text-ivory focus:outline-none focus:border-ivory transition-colors [&>option]:text-ink"
            >
              <option value="">—</option>
              <option value="es">{t('contact.languageOptions.es')}</option>
              <option value="en">{t('contact.languageOptions.en')}</option>
            </select>
          </div>
          <div className="sm:col-span-2 mt-6 flex flex-col items-center" data-reveal>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="group inline-flex items-center gap-3 rounded-full border border-ivory px-10 py-4 text-sm tracking-[0.2em] uppercase text-ivory transition-colors hover:bg-ivory hover:text-ink disabled:opacity-50"
            >
              {status === 'submitting' ? t('contact.submitting') : t('contact.submit')}
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </button>
            {status === 'success' && <p className="mt-4 text-sm text-emerald-300">{t('contact.success')}</p>}
            {status === 'error' && <p className="mt-4 text-sm text-red-300">{t('contact.error')}</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
