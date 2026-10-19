import React from 'react';
import { Phone } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { site } from '../data/site';

/** Nút gọi nhanh, chỉ hiện trên mobile để dễ thao tác. */
export default function FloatingCall() {
  const { t } = useLang();
  return (
    <a
      href={site.phoneTel}
      aria-label={`${t.floating.call}: ${site.phoneDisplay}`}
      className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-charcoal shadow-lg transition-colors hover:bg-gold-dark md:hidden"
    >
      <Phone size={20} strokeWidth={1.5} />
    </a>
  );
}
