import React, { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { src, srcSet } from '../data/portfolio';

/** Lightbox tái sử dụng: Esc để đóng, ←/→ để chuyển ảnh, vuốt ngang trên cảm ứng. */
export default function Lightbox({ items, index, onClose, onChange }) {
  const { lang, t } = useLang();
  const open = index !== null && index >= 0;
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const total = items.length;

  const go = useCallback((dir) => onChange((index + dir + total) % total), [index, total, onChange]);

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, go, onClose]);

  if (!open) return null;
  const photo = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.lightbox.dialog}
      className="lb-fade fixed inset-0 z-50 flex flex-col bg-charcoal/97 text-white"
      onClick={onClose}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 text-xs tracking-[0.2em] text-white/70" onClick={(e) => e.stopPropagation()}>
        <span aria-live="polite">{t.lightbox.counter.replace('{n}', index + 1).replace('{total}', total)}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t.lightbox.close} className="p-2 text-white hover:text-sand">
          <X size={26} strokeWidth={1.3} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 md:px-16">
        <button type="button" aria-label={t.lightbox.prev} onClick={(e) => { e.stopPropagation(); go(-1); }}
          className="absolute left-1 z-10 p-3 text-white/80 hover:text-white md:left-5">
          <ChevronLeft size={34} strokeWidth={1.2} />
        </button>
        <img
          key={photo.id}
          src={src(photo.id, photo.widths[photo.widths.length - 1])}
          srcSet={srcSet(photo)}
          sizes="100vw"
          alt={photo.alt[lang]}
          onClick={(e) => e.stopPropagation()}
          className="lb-fade max-h-full max-w-full object-contain"
        />
        <button type="button" aria-label={t.lightbox.next} onClick={(e) => { e.stopPropagation(); go(1); }}
          className="absolute right-1 z-10 p-3 text-white/80 hover:text-white md:right-5">
          <ChevronRight size={34} strokeWidth={1.2} />
        </button>
      </div>
    </div>
  );
}
