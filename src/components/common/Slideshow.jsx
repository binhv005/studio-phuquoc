import React, { useEffect, useState } from 'react';
import Photo from './Photo';

/**
 * Ảnh tự đổi sau mỗi `interval` ms bằng hiệu ứng mờ chéo (crossfade).
 * `slides`: mảng photo của portfolio (có id) hoặc { src, alt } cho ảnh tĩnh.
 * `delay` so le thời điểm bắt đầu giữa các khung để chúng không đổi cùng lúc.
 * Wrapper là `relative overflow-hidden`; kích thước do className của nơi dùng quyết định.
 */
export default function Slideshow({ slides: input, interval = 2000, delay = 0, className = '', sizes = '50vw' }) {
  // Bỏ qua phần tử rỗng (vd. id ảnh không còn trong portfolio.js) để không làm hỏng cả trang.
  const slides = input.filter(Boolean);
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        if (!document.hidden) setIndex((i) => (i + 1) % count);
      }, interval);
    }, delay);
    return () => { clearTimeout(start); clearInterval(timer); };
  }, [count, interval, delay]);

  const cls = (i) =>
    `absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {slides.map((s, i) =>
        s.id ? (
          <Photo key={s.id} photo={s} sizes={sizes} alt={i === index ? undefined : ''} className={cls(i)} />
        ) : (
          <img key={s.src} src={s.src} alt={s.alt ?? ''} width={s.w} height={s.h} loading="lazy" decoding="async" className={cls(i)} />
        )
      )}
    </div>
  );
}
