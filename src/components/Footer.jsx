import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { site } from '../data/site';

const LINKS = [
  ['home', '#home'],
  ['about', '#about'],
  ['services', '#services'],
  ['portfolio', '#portfolio'],
  ['contact', '#contact'],
];

function Column({ title, children }) {
  return (
    <div>
      <p className="font-semibold text-white">{title}</p>
      <ul className="mt-5 grid gap-4 text-[0.95rem] leading-relaxed text-white/65 [&_a:hover]:text-white">{children}</ul>
    </div>
  );
}

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.8c-.3 0-1.3-.2-2.4-.2-2.5 0-4.1 1.5-4.1 4.2v2.7H7.7v3.3h2.7V22h3.1z" />
  </svg>
);

/** Footer: trái là thương hiệu + giới thiệu + mạng xã hội, phải là ba cột liên kết, dưới cùng là bản quyền và ngôn ngữ. */
export default function Footer() {
  const { t, lang, setLang } = useLang();
  return (
    <footer className="relative isolate overflow-hidden bg-navy-dark px-5 pb-8 pt-16 text-ivory md:px-10 md:pt-20">
      {/* Hoàng hôn trên biển Phú Quốc làm nền mờ, bám đáy footer và phủ ngược lên sau nội dung */}
      <img
        src="/images/footer-sunset.webp"
        alt=""
        aria-hidden="true"
        width="1800"
        height="1198"
        loading="lazy"
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 w-full max-w-[1800px] -translate-x-1/2 select-none opacity-[0.22] [mask-image:linear-gradient(to_top,black_45%,transparent)]"
      />
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div>
          <a href="#home" aria-label={site.fullName} className="inline-block">
            <img src="/images/brand/logo-light.webp" alt={site.fullName} width="691" height="165" loading="lazy" className="h-14 w-auto md:h-16" />
          </a>
          <p className="mt-6 font-serif text-xl italic text-sand">{t.footer.tagline}</p>
          <p className="mt-4 max-w-md text-[0.95rem] leading-[1.9] text-white/65">{t.footer.about}</p>
          <div className="mt-10 flex items-center gap-6 text-white/80">
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-colors hover:text-gold"><FacebookIcon className="h-5 w-5" /></a>
            <a href={site.phoneTel} aria-label={t.contact.call} className="transition-colors hover:text-gold"><Phone size={20} strokeWidth={1.6} /></a>
            <a href={site.maps} target="_blank" rel="noopener noreferrer" aria-label={t.contact.directions} className="transition-colors hover:text-gold"><MapPin size={20} strokeWidth={1.6} /></a>
          </div>
        </div>

        <nav aria-label={t.footer.navLabel} className="grid gap-10 sm:grid-cols-2">
          <Column title={t.footer.navLabel}>
            {LINKS.map(([key, href]) => (
              <li key={key}><a href={href}>{t.nav[key]}</a></li>
            ))}
          </Column>
          <Column title={t.footer.servicesLabel}>
            {t.services.items.map((item) => (
              <li key={item.title}><a href="#services">{item.title}</a></li>
            ))}
          </Column>
        </nav>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1400px] flex-col gap-4 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between md:mt-24">
        <p>© {new Date().getFullYear()} {site.fullName}. {t.footer.rights}</p>
        <label className="flex items-center gap-4">
          <span>{t.footer.language}</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="cursor-pointer border-b border-white bg-transparent py-1 pr-6 text-white focus:outline-none"
          >
            <option value="vi" className="text-charcoal">Tiếng Việt</option>
            <option value="en" className="text-charcoal">English</option>
          </select>
        </label>
      </div>
    </footer>
  );
}
