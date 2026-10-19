import React from 'react';
import { Phone } from 'lucide-react';
import ScrollReveal from './common/ScrollReveal';
import Photo from './common/Photo';
import Slideshow from './common/Slideshow';
import { photoById } from '../data/portfolio';
import { useLang } from '../i18n/LanguageContext';
import { site } from '../data/site';

const ids = (list) => list.map((id) => photoById[id]);

/** CTA đặt lịch: tiêu đề + hai nút + số điện thoại/Facebook, bên dưới là bộ khung điện thoại / máy tính / máy tính bảng bị cắt ở đáy. */
export default function Cta() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden bg-sand-tint px-5 pt-20 md:px-10 md:pt-28">
      <ScrollReveal variant="blur" className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-[clamp(2rem,6vw,3.5rem)] leading-[1.1]">{t.cta.title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-[0.95rem] leading-[1.8] text-warm-gray">{t.cta.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={site.phoneTel} className="btn btn-outline"><Phone size={15} strokeWidth={1.6} />{t.cta.primary}</a>
          <a href="#contact" className="btn btn-solid">{t.cta.button}</a>
        </div>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-warm-gray">
          <a href={site.phoneTel} className="hover:text-charcoal">{site.phoneDisplay}</a>
          <span aria-hidden="true" className="text-sand">•</span>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-charcoal">facebook.com/PhotographerPhuQuocs</a>
        </p>
      </ScrollReveal>

      <div className="relative mx-auto mt-12 aspect-[1083/405] w-full max-w-[1083px]">
        {/* Máy tính: ảnh lớn + menu + tên studio */}
        <ScrollReveal variant="tilt" duration={1200} className="absolute bottom-0 left-[23.1%] top-0 w-[63%] overflow-hidden border border-black/10 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]">
          <Slideshow slides={ids(['prewedding-sunset-lift', 'wedding-beach-open-arms', 'island-sunset-rocks', 'wedding-beach-walk'])} sizes="(min-width: 1024px) 760px, 90vw" className="h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[7px] font-medium uppercase tracking-[0.2em] text-white md:px-10 md:py-5 md:text-[10px]">
            <span className="flex gap-3 md:gap-8"><span className="whitespace-nowrap">{t.nav.home}</span><span className="whitespace-nowrap">{t.nav.about}</span><span className="whitespace-nowrap">{t.nav.services}</span></span>
            <span className="font-serif text-[10px] italic tracking-[0.1em] md:text-xl">{site.brand}</span>
            <span className="flex gap-3 md:gap-8"><span className="whitespace-nowrap">{t.nav.portfolio}</span><span className="whitespace-nowrap">{t.nav.contact}</span></span>
          </div>
          <div className="absolute inset-x-0 top-[48%] text-center text-white">
            <p className="font-serif text-xl tracking-[0.06em] md:text-5xl">{site.brand}</p>
            <p className="mt-2 text-[6px] uppercase tracking-[0.3em] text-white/75 md:text-[10px]">{t.footer.tagline}</p>
          </div>
        </ScrollReveal>

        {/* Điện thoại: ảnh trên, thẻ thông tin bên dưới */}
        <ScrollReveal variant="left" delay={350} duration={1100} className="absolute bottom-0 left-[11.3%] z-10 h-[69%] w-[14.1%] overflow-hidden border-2 border-white bg-ivory shadow-[0_20px_50px_-10px_rgba(0,0,0,0.35)] md:border-4">
          <div className="relative h-[52%]">
            <Slideshow slides={ids(['couple-sunset-kiss-waves', 'family-sunset-three', 'portrait-rock-sunset'])} delay={500} sizes="220px" className="h-full w-full" />
            <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
            <p className="absolute inset-x-2 bottom-2 text-center font-serif text-[7px] italic leading-snug text-white md:text-[12px]">{t.hero.titleScript}</p>
          </div>
          <div className="relative -mt-1 mx-1.5 bg-soft-white p-2 text-[6px] text-warm-gray md:mx-2.5 md:p-3 md:text-[9px]">
            <p className="flex items-center gap-1.5 text-[8px] font-semibold text-charcoal md:text-xs">{t.nav.book}<span className="bg-sand-tint px-1.5 py-0.5 text-[5px] font-semibold text-gold-deep md:text-[7px]">{site.brand}</span></p>
            <div className="mt-2 space-y-1.5 md:mt-3 md:space-y-2.5">
              <div className="h-1 w-3/4 rounded bg-line" />
              <div className="h-1 w-1/2 rounded bg-line" />
              <div className="h-1 w-2/3 rounded bg-line" />
            </div>
          </div>
        </ScrollReveal>

        {/* Máy tính bảng: ảnh bìa + tên + lưới 3 ảnh */}
        <ScrollReveal variant="right" delay={500} duration={1100} className="absolute bottom-0 left-[68.2%] z-10 h-[75%] w-[28.7%] overflow-hidden border-2 border-white bg-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.35)] md:border-4">
          <div className="relative h-[58%]">
            <Slideshow slides={ids(['couple-pier-together', 'family-first-steps', 'island-cliff-sunset'])} delay={1000} sizes="340px" className="h-full w-full" />
            <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
            <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-serif text-[9px] tracking-[0.1em] text-white md:text-lg">{site.brand}</p>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 md:gap-2 md:p-2">
            {['wedding-kiss-bouquet', 'family-mother-lift-baby', 'lookbook-library-hat'].map((id) => (
              <Photo key={id} photo={photoById[id]} sizes="120px" className="aspect-[3/4] w-full object-cover" />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
