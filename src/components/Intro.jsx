import React, { useState } from 'react';
import ScrollReveal from './common/ScrollReveal';
import Photo from './common/Photo';
import { photoById } from '../data/portfolio';
import { useLang } from '../i18n/LanguageContext';
import { site } from '../data/site';

// Mỗi tab (theo thứ tự intro.points: cặp đôi, gia đình, du khách, chân dung) hiển thị một bộ ảnh trong khung "trình duyệt".
const TAB_PHOTOS = [
  ['couple-sunset-kiss-waves', 'wedding-beach-walk', 'couple-pier-sunset', 'wedding-kiss-bouquet', 'wedding-beach-embrace', 'prewedding-sunset-dip', 'couple-roses-kiss', 'wedding-beach-open-arms'],
  ['family-sunset-three', 'family-lawn-run', 'family-mother-lift-baby', 'family-bed-laughing', 'family-first-steps', 'family-lawn-portrait', 'family-father-lift-boy', 'family-beach-walk'],
  ['island-sunset-rocks', 'island-beach-trio', 'island-cliff-sunset', 'island-resort-bikes', 'island-beach-stroll', 'island-beach-waves', 'island-shore-golden', 'island-rock-reclining'],
  ['lookbook-library-hat', 'lookbook-window-seat', 'portrait-rock-sunset', 'portrait-beach-palm', 'lookbook-lobby-front', 'portrait-sunset-white-shirt', 'lookbook-window-glance', 'portrait-sunset-rock-seated'],
];

export default function Intro() {
  const { t } = useLang();
  const [tab, setTab] = useState(0);
  const photos = TAB_PHOTOS[tab].map((id) => photoById[id]).filter(Boolean);

  return (
    <section id="about" className="relative overflow-hidden bg-ivory px-5 pb-12 pt-20 md:px-10 md:pb-16 md:pt-28">
      <div className="relative mx-auto max-w-[1240px]">
        <ScrollReveal variant="blur" className="mx-auto max-w-[64rem] text-center">
          <p className="eyebrow">{t.intro.eyebrow}</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl leading-[1.1] md:text-[3.25rem]">{t.intro.title}</h2>
        </ScrollReveal>

        <div role="tablist" aria-label={t.intro.eyebrow} className="mt-10 flex flex-wrap justify-center gap-2.5">
          {t.intro.points.map((point, i) => (
            <button
              key={point}
              type="button"
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={`rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors ${
                tab === i ? 'border-charcoal bg-charcoal text-ivory' : 'border-line bg-transparent text-charcoal hover:border-charcoal'
              }`}
            >
              {point}
            </button>
          ))}
        </div>

        <ScrollReveal variant="tilt" duration={1200} className="mt-10">
          {/* Chiều cao theo nội dung (không cố định) để mọi ảnh hiện đầy đủ, không bị cắt */}
          <div className="relative isolate mx-auto overflow-hidden bg-navy px-4 py-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] md:px-[8%] md:py-10">
            {/* Ảnh hoàng hôn làm nền mờ phía sau khung */}
            <img src="/images/intro-bg.webp" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-10 h-full w-full scale-110 object-cover opacity-80 blur-[18px]" />
            <div className="rounded-xl bg-soft-white p-2 shadow-xl md:p-3">
              <div className="mb-2 flex items-center justify-between px-1 text-[8px] font-semibold uppercase tracking-wider text-charcoal md:mb-3 md:text-[10px]">
                <span>{site.fullName}</span>
                <span className="text-warm-gray">{t.intro.points[tab]}</span>
              </div>
              <div key={tab} className="lb-fade columns-3 gap-1.5 md:columns-4 md:gap-2">
                {photos.map((p, i) => (
                  <Photo key={`${p.id}-${i}`} photo={p} sizes="(min-width: 768px) 15vw, 30vw" className="mb-1.5 h-auto w-full md:mb-2" />
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-10 text-center">
          <a href="#portfolio" className="btn btn-outline">{t.intro.cta}</a>
        </div>
      </div>
    </section>
  );
}
