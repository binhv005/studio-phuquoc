import React, { useState } from 'react';
import ScrollReveal from './common/ScrollReveal';
import Photo from './common/Photo';
import Slideshow from './common/Slideshow';
import Lightbox from './Lightbox';
import { photoById } from '../data/portfolio';
import { albums } from '../data/albums';
import { useLang } from '../i18n/LanguageContext';
import { site } from '../data/site';

// Nền nhạt cho từng thẻ album, xoay vòng giữa màu cát, kem và xanh biển nhạt.
const CARD_BG = ['bg-sand-tint', 'bg-soft-white', 'bg-navy/[0.06]'];

/** Mỗi dịch vụ là một album: bấm vào ảnh bìa để xem toàn bộ ảnh của album. */
export default function Services() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState({ album: null, index: null });

  const items = open.album === null ? [] : albums[open.album].map((id) => photoById[id]).filter(Boolean);

  return (
    <section id="services" className="relative overflow-hidden bg-ivory px-5 py-20 md:px-10 md:py-28">
      <div className="relative mx-auto max-w-[1240px]">
        <ScrollReveal variant="blur" className="text-center">
          <p className="eyebrow">{t.services.eyebrow}</p>
          <h2 className="mt-4 text-4xl md:text-6xl">{t.services.title}</h2>
        </ScrollReveal>

        <ul className="mt-14 grid gap-8">
          {t.services.items.map((item, i) => {
            const list = (albums[i] ?? []).map((id) => photoById[id]).filter(Boolean);
            const thumbs = list.slice(1, 7);
            const flip = i % 2 === 1;
            return (
              <li key={item.title}>
                <ScrollReveal variant={flip ? 'right' : 'left'} duration={1100} className="h-full">
                  <article className={`grid md:grid-cols-5 ${CARD_BG[i % CARD_BG.length]}`}>
                    {/* Ảnh bìa với tiêu đề album */}
                    <button
                      type="button"
                      onClick={() => setOpen({ album: i, index: 0 })}
                      aria-label={`${t.services.view}: ${item.title}`}
                      className={`group relative block aspect-[16/10] w-full overflow-hidden bg-charcoal md:col-span-2 md:aspect-auto md:min-h-full ${flip ? 'md:order-2' : ''}`}
                    >
                      <Slideshow
                        slides={list}
                        delay={i * 500}
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="!absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                        <p className="font-serif text-lg italic text-gold">{String(i + 1).padStart(2, '0')}</p>
                        <h3 className="mt-1 text-[1.7rem] leading-tight md:text-[2.1rem]">{item.title}</h3>
                        <p className="mt-3 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-white/90">{t.services.place}</p>
                      </div>
                    </button>

                    <div className="flex flex-col justify-center md:col-span-3">
                      <div className="flex items-center justify-between px-4 pt-4 text-xs md:px-5 md:pt-5">
                        <span className="font-medium uppercase tracking-[0.18em]">{site.brand}</span>
                        <span className="text-warm-gray">{t.services.count.replace('{n}', list.length)}</span>
                      </div>
                      <p className="px-4 pb-4 pt-3 text-[0.95rem] leading-[1.75] text-warm-gray md:px-5">{item.text}</p>

                      {/* Lưới 3 × 2 ảnh nhỏ, bấm để mở đúng ảnh trong album */}
                      <div className="grid grid-cols-3 gap-1.5 px-3 pb-3 md:px-4 md:pb-4">
                        {thumbs.map((p, k) => (
                          <button
                            key={`${p.id}-${k}`}
                            type="button"
                            onClick={() => setOpen({ album: i, index: k + 1 })}
                            aria-label={p.alt[lang]}
                            className="group relative block aspect-[4/3] overflow-hidden bg-line"
                          >
                            <Photo photo={p} sizes="(min-width: 640px) 15vw, 30vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 text-center">
          <a href="#contact" className="btn btn-solid">{t.services.cta}</a>
        </div>
      </div>

      <Lightbox
        items={items}
        index={open.index}
        onChange={(index) => setOpen((o) => ({ ...o, index }))}
        onClose={() => setOpen({ album: null, index: null })}
      />
    </section>
  );
}
