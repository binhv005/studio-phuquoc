import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from './common/ScrollReveal';
import Photo from './common/Photo';
import Lightbox from './Lightbox';
import { photos, categories } from '../data/portfolio';
import { useLang } from '../i18n/LanguageContext';
import { site } from '../data/site';

// Chiều cao và độ lệch dọc lặp lại theo chu kỳ để các ảnh xếp so le như bảng ảnh lưu niệm.
const HEIGHTS = [
  'h-[215px] md:h-[320px]',
  'h-[165px] md:h-[235px]',
  'h-[255px] md:h-[370px]',
  'h-[180px] md:h-[270px]',
  'h-[230px] md:h-[340px]',
];
const OFFSETS = ['translate-y-0', 'translate-y-4 md:translate-y-8', '-translate-y-2', 'translate-y-3 md:translate-y-6', 'translate-y-1'];

/** Dải ảnh so le trượt ngang: cuộn, vuốt, kéo chuột hoặc dùng hai nút mũi tên. */
const AUTOPLAY_MS = 2000;

function Gallery({ items, onOpen, label, paused }) {
  const { lang, t } = useLang();
  const track = useRef(null);
  const cards = useRef([]);
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });
  const hovering = useRef(false);

  // Tự chuyển sang ảnh kế tiếp mỗi 2 giây; tạm dừng khi rê chuột/chạm/mở ảnh lớn, hết dải thì quay lại đầu.
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => {
      const el = track.current;
      if (!el || hovering.current || drag.current.down || document.hidden) return;
      const box = el.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      const next = cards.current.find((c) => c && c.getBoundingClientRect().left - box.left - pad > 8);
      const left = atEnd || !next ? 0 : el.scrollLeft + next.getBoundingClientRect().left - box.left - pad;
      el.scrollTo({ left, behavior: 'smooth' });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, items]);

  const step = (dir) => {
    const el = track.current;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.6, 280), behavior: 'smooth' });
  };

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    drag.current = { down: true, moved: false, x: e.clientX, left: track.current.scrollLeft };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => { drag.current.down = false; };

  return (
    <div className="relative mt-6">
      <div
        ref={track}
        role="list"
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') hovering.current = true; }}
        onFocus={() => { hovering.current = true; }}
        onBlur={() => { hovering.current = false; }}
        onTouchStart={() => { hovering.current = true; }}
        onTouchEnd={() => { setTimeout(() => { hovering.current = false; }, 4000); }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={() => { endDrag(); hovering.current = false; }}
        className="flex cursor-grab items-center gap-4 overflow-x-auto px-5 py-6 [scrollbar-width:none] active:cursor-grabbing md:gap-7 md:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p, i) => (
          <button
            key={p.id}
            ref={(node) => { cards.current[i] = node; }}
            role="listitem"
            type="button"
            onClick={(e) => { if (drag.current.moved) { e.preventDefault(); drag.current.moved = false; return; } onOpen(i); }}
            aria-label={`${t.portfolio.open}: ${p.alt[lang]}`}
            className={`group relative shrink-0 overflow-hidden bg-white/5 ${HEIGHTS[i % HEIGHTS.length]} ${OFFSETS[i % OFFSETS.length]}`}
            style={{ aspectRatio: `${p.w} / ${p.h}`, maxWidth: '82vw' }}
          >
            <Photo
              photo={p}
              sizes="(min-width: 768px) 50vw, 80vw"
              className="pointer-events-none h-full w-full select-none object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 text-left text-sm font-medium text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
              {t.portfolio.filters[p.cat]}
            </span>
          </button>
        ))}
      </div>

      <p aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 z-0 select-none text-center font-serif text-[22vw] italic leading-none text-white/[0.04] md:text-[12vw]">
        {t.portfolio.watermark}
      </p>

      <div className="relative mt-4 flex justify-center gap-3" aria-label={label}>
        <button type="button" onClick={() => step(-1)} aria-label={t.lightbox.prev} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-charcoal">
          <ChevronLeft size={20} strokeWidth={1.6} />
        </button>
        <button type="button" onClick={() => step(1)} aria-label={t.lightbox.next} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-charcoal">
          <ChevronRight size={20} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const { t } = useLang();
  const [cat, setCat] = useState('featured');
  const [openIndex, setOpenIndex] = useState(null);

  const items = useMemo(() => photos.filter((p) => (cat === 'featured' ? p.featured : p.cat === cat)), [cat]);

  return (
    <section id="portfolio" data-header="dark" className="relative overflow-hidden bg-charcoal px-0 pb-14 pt-16 text-white md:pb-16 md:pt-24">
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <ScrollReveal variant="blur" className="text-center">
          <p className="eyebrow !text-sand">{t.portfolio.eyebrow}</p>
          <h2 className="title-display title-gold mt-3 text-4xl leading-[1.1] sm:text-5xl md:text-6xl">{t.portfolio.title}</h2>
        </ScrollReveal>

        {/* Mobile: một hàng chip cuộn ngang (không xuống dòng lộn xộn); từ md trở lên xếp giữa, tự xuống dòng */}
        <div
          role="group"
          aria-label={t.portfolio.filterLabel}
          className="-mx-5 mt-7 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors md:px-5 ${
                cat === c ? 'border-gold bg-gold text-charcoal' : 'border-white/20 text-white hover:border-white/60'
              }`}
            >
              {t.portfolio.filters[c]}
            </button>
          ))}
        </div>
      </div>

      <ScrollReveal variant="zoom" duration={1200} className="relative">
        <Gallery key={cat} items={items} onOpen={setOpenIndex} label={t.portfolio.title} paused={openIndex !== null} />
      </ScrollReveal>

      <div className="relative mt-6 px-5 text-center">
        <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-light">
          {t.portfolio.full}
        </a>
      </div>

      <Lightbox items={items} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </section>
  );
}
