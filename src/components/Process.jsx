import React from 'react';
import ScrollReveal from './common/ScrollReveal';
import Photo from './common/Photo';
import { photoById } from '../data/portfolio';
import { useLang } from '../i18n/LanguageContext';

const SIDE_PHOTOS = ['couple-sunset-kiss-waves', 'portrait-rock-sunset'];

/** Quy trình đặt lịch: bốn bước đánh số ở giữa, hai ảnh dọc hai bên (màn hình nhỏ xếp ngang bên dưới). */
export default function Process() {
  const { t, lang } = useLang();
  const [left, right] = SIDE_PHOTOS.map((id) => photoById[id]);

  return (
    <section id="process" className="bg-ivory px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1300px] items-center gap-10 lg:grid-cols-[1fr_minmax(0,44rem)_1fr] lg:gap-12">
        <ScrollReveal variant="left" duration={1100} className="hidden w-[17rem] justify-self-end lg:block lg:-mt-16">
          <Photo photo={left} sizes="272px" alt="" className="aspect-[3/4] w-full object-cover" />
        </ScrollReveal>

        <div>
          <ScrollReveal variant="blur" className="text-center">
            <p className="eyebrow">{t.process.eyebrow}</p>
            <h2 className="mt-4 whitespace-nowrap text-[clamp(1.4rem,6.4vw,3rem)] leading-[1.1]">{t.process.title}</h2>
          </ScrollReveal>

          <ScrollReveal delay={120} as="ol" className="mt-12 divide-y divide-line border-y border-line">
            {t.process.items.map((item, i) => (
              <li key={item.title} className="grid grid-cols-[3rem_1fr] gap-4 py-6 md:grid-cols-[4rem_1fr]">
                <span className="font-serif text-3xl italic leading-none text-gold-deep md:text-4xl">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-2xl leading-tight">{item.title}</h3>
                  <p className="mt-2 leading-[1.75] text-warm-gray">{item.text}</p>
                </div>
              </li>
            ))}
          </ScrollReveal>

          {/* Màn hình nhỏ: hai ảnh xếp ngang bên dưới danh sách */}
          <div className="mt-10 grid grid-cols-2 gap-3 lg:hidden">
            {[left, right].map((p) => (
              <Photo key={p.id} photo={p} sizes="50vw" alt={p.alt[lang]} className="aspect-[3/4] w-full object-cover" />
            ))}
          </div>
        </div>

        <ScrollReveal variant="right" duration={1100} delay={150} className="hidden w-[17rem] justify-self-start lg:block lg:mt-16">
          <Photo photo={right} sizes="272px" alt="" className="aspect-[3/4] w-full object-cover" />
        </ScrollReveal>
      </div>
    </section>
  );
}
