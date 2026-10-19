import React, { useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { site } from '../data/site';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d][\d\s().-]{7,}$/;

const Field = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="eyebrow block !text-sand">{label}</label>
    {children}
    {error && <p id={`${id}-err`} className="mt-1 inline-block rounded bg-white px-2 py-0.5 text-sm font-medium text-[#9a3b2e]">{error}</p>}
  </div>
);

/**
 * Biểu mẫu tư vấn. Chỉ báo "đã gửi" khi endpoint (VITE_FORM_ENDPOINT) trả về phản hồi thành công.
 * Chưa cấu hình endpoint → hiển thị thông báo trung thực rằng yêu cầu chưa được gửi.
 */
export default function ContactForm() {
  const { t } = useLang();
  const f = t.form;
  const [values, setValues] = useState({ name: '', contact: '', date: '', service: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error | notConfigured

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = f.errRequired;
    const c = values.contact.trim();
    if (!c) next.contact = f.errRequired;
    else if (!EMAIL_RE.test(c) && !PHONE_RE.test(c)) next.contact = f.errContact;
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    if (!site.formEndpoint) {
      setStatus('notConfigured');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      setValues({ name: '', contact: '', date: '', service: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <h3 className="text-2xl text-ivory md:text-3xl">{f.title}</h3>

      <Field id="cf-name" label={f.name} error={errors.name}>
        <input id="cf-name" className="field" autoComplete="name" value={values.name} onChange={set('name')}
          aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cf-name-err' : undefined} />
      </Field>
      <Field id="cf-contact" label={f.contact} error={errors.contact}>
        <input id="cf-contact" className="field" autoComplete="email" value={values.contact} onChange={set('contact')}
          aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'cf-contact-err' : undefined} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="cf-date" label={f.date}>
          <input id="cf-date" type="date" className="field" value={values.date} onChange={set('date')} />
        </Field>
        <Field id="cf-service" label={f.service}>
          <select id="cf-service" className="field" value={values.service} onChange={set('service')}>
            <option value="">{f.selectService}</option>
            {t.services.items.map((s) => <option key={s.title} value={s.title}>{s.title}</option>)}
          </select>
        </Field>
      </div>
      <Field id="cf-message" label={f.message}>
        <textarea id="cf-message" rows={2} className="field resize-none" value={values.message} onChange={set('message')} />
      </Field>

      <button type="submit" disabled={status === 'sending'} className="btn btn-solid justify-self-center disabled:opacity-60">
        {status === 'sending' ? f.sending : f.submit}
      </button>

      <div role="status" aria-live="polite" className="min-h-5 text-sm leading-relaxed">
        {status === 'success' && <p className="font-medium text-white">{f.success}</p>}
        {status === 'error' && <p className="inline-block rounded bg-white px-2 py-1 font-medium text-[#9a3b2e]">{f.error}</p>}
        {status === 'notConfigured' && <p className="text-white/90">{f.notConfigured}</p>}
      </div>
    </form>
  );
}
