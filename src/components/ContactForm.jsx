import { useState } from 'react';
import { useTranslations } from '../i18n/utils';

const initialState = {
  name: '', email: '', phone: '', date: '', guests: '', budget: '', language: '',
};

export default function ContactForm({ lang }) {
  const t = useTranslations(lang);
  const formId = import.meta.env.PUBLIC_FORMSPREE_ID;
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
    if (!values.date.trim()) next.date = t('contact.errors.required');
    if (values.guests && Number.isNaN(Number(values.guests))) next.guests = t('contact.errors.number');
    if (values.budget && Number.isNaN(Number(values.budget))) next.budget = t('contact.errors.number');
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!formId) {
      console.warn('PUBLIC_FORMSPREE_ID is not set — the contact form cannot submit yet.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Request failed');
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
    { name: 'date', type: 'date' },
    { name: 'guests', type: 'number' },
    { name: 'budget', type: 'number' },
  ];

  if (!formId) {
    return (
      <section id="contact" className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-sepia">{t('contact.title')}</h2>
        <p className="mt-6 rounded-2xl border border-border bg-white p-6 text-sm text-taupe">
          {t('contact.notConfigured')}
        </p>
      </section>
    );
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-24">
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-sepia">{t('contact.title')}</h2>
        <p className="mt-4 text-taupe">{t('contact.subtitle')}</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="mt-10 grid gap-5 sm:grid-cols-2">
        {fields.map(({ name, type }) => (
          <div key={name} className={name === 'name' || name === 'email' ? 'sm:col-span-2' : ''}>
            <label htmlFor={name} className="block text-sm text-sepia mb-1.5">
              {t(`contact.fields.${name}`)}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={values[name]}
              onChange={handleChange}
              placeholder={type !== 'date' ? t(`contact.placeholders.${name}`) : undefined}
              className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm text-sepia placeholder:text-taupe/60 focus:outline-none focus:border-taupe"
            />
            {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor="language" className="block text-sm text-sepia mb-1.5">
            {t('contact.fields.language')}
          </label>
          <select
            id="language"
            name="language"
            value={values.language}
            onChange={handleChange}
            className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm text-sepia focus:outline-none focus:border-taupe"
          >
            <option value="">—</option>
            <option value="es">{t('contact.languageOptions.es')}</option>
            <option value="en">{t('contact.languageOptions.en')}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full rounded-2xl bg-sepia text-ivory px-6 py-3 text-sm tracking-wide hover:bg-taupe transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? t('contact.submitting') : t('contact.submit')}
          </button>
          {status === 'success' && <p className="mt-3 text-sm text-green-700">{t('contact.success')}</p>}
          {status === 'error' && <p className="mt-3 text-sm text-red-600">{t('contact.error')}</p>}
        </div>
      </form>
    </section>
  );
}
