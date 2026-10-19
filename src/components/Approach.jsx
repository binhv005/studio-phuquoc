import React from 'react';
import ScrollReveal from './common/ScrollReveal';
import Slideshow from './common/Slideshow';
import { photoById } from '../data/portfolio';
import { useLang } from '../i18n/LanguageContext';

// Thứ tự khớp với translations.approach.items
const PHOTOS = [
  ['family-father-lift-boy', 'wedding-beach-joy', 'family-first-steps', 'wedding-beach-playful'],
  ['island-sunset-rocks', 'island-cliff-sunset', 'island-resort-bikes', 'portrait-sunset-rock-seated'],
  ['island-beach-trio', 'family-sunset-three', 'couple-pier-sunset', 'family-beach-birthday'],
];

/** Ba điểm khác biệt: mỗi điểm một ảnh, một tiêu đề, một câu ngắn. */
export default function Approach() {
  const { t } = useLang();
  return (
    <section className="bg-sand-tint px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <ScrollReveal variant="blur" className="mx-auto text-center">
          <p className="eyebrow">{t.approach.eyebrow}</p>
          <h2 className="mt-4 whitespace-nowrap text-[clamp(1.4rem,6.4vw,3.25rem)] leading-[1.1]">{t.approach.title}</h2>
        </ScrollReveal>

        <ul className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
          {t.approach.items.map((item, i) => (
            <li key={item.title}>
              <ScrollReveal delay={i * 150} variant={i === 1 ? 'zoom' : 'up'}>
                <Slideshow slides={PHOTOS[i].map((id) => photoById[id])} delay={i * 700} sizes="(min-width: 768px) 30vw, 100vw" className="aspect-[4/5] w-full" />
                <p className="mt-6 font-serif text-xl italic text-gold-deep">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 text-[1.75rem] leading-tight">{item.title}</h3>
                <p className="mt-3 leading-[1.75] text-warm-gray">{item.text}</p>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
