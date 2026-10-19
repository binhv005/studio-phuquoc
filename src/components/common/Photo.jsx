import React from 'react';
import { srcSet, src } from '../../data/portfolio';
import { useLang } from '../../i18n/LanguageContext';

/** Ảnh responsive: srcset WebP, width/height để tránh layout shift, alt theo ngôn ngữ hiện tại. */
export default function Photo({ photo, sizes = '100vw', priority = false, className = '', style, alt }) {
  const { lang } = useLang();
  const fallbackWidth = photo.widths.includes(1200) ? 1200 : photo.widths[photo.widths.length - 1];
  return (
    <img
      src={src(photo.id, fallbackWidth)}
      srcSet={srcSet(photo)}
      sizes={sizes}
      width={photo.w}
      height={photo.h}
      alt={alt ?? photo.alt[lang]}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      className={className}
      // Ảnh dọc bị cắt khung thì giữ phần trên (khuôn mặt); ảnh có `pos` riêng dùng giá trị đó.
      style={{ objectPosition: photo.pos ?? (photo.h > photo.w ? '50% 30%' : '50% 50%'), ...style }}
    />
  );
}
