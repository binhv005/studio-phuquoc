import React, { useEffect, useRef, useState } from 'react';
import Photo from './common/Photo';
import { photoById } from '../data/portfolio';
import { useLang } from '../i18n/LanguageContext';

// Ba khung dọc: video Phú Quốc hai bên, ảnh cưới hoàng hôn ở giữa. Video nén bằng `npm run videos`.
// Mobile chỉ hiện khung đầu tiên.
const CLIPS = [
  { video: '/videos/hero/clip1.mp4', poster: '/videos/hero/clip1.jpg' },
  { photo: 'prewedding-sunset-dip' },
  { video: '/videos/hero/clip2.mp4', poster: '/videos/hero/clip2.jpg' },
];

function useMedia(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Theo dõi phần tử có đang nằm trong khung nhìn không (dùng để chỉ phát video khi đang xem hero). */
function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

/** Tách chuỗi thành từng từ, mỗi từ hiện dần lần lượt (word-reveal). */
function Words({ text, start = 0, step = 110 }) {
  return text.split(' ').map((word, i, arr) => (
    <React.Fragment key={`${word}-${i}`}>
      <span aria-hidden="true" className="word-in" style={{ animationDelay: `${start + i * step}ms` }}>{word}</span>
      {i < arr.length - 1 && ' '}
    </React.Fragment>
  ));
}

/** Hero: 3 khung dọc (video/ảnh) đặt cạnh nhau, phủ kín chiều ngang, chữ đặt lên trên. */
export default function Hero() {
  const { t, lang } = useLang();
  const wide = useMedia('(min-width: 768px)');
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)');
  // Mobile chỉ tải 1 video để nhẹ; reduced-motion chỉ hiện ảnh poster tĩnh.
  const clips = wide ? CLIPS : CLIPS.slice(0, 1);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);
  const videos = useRef([]);

  // Chỉ phát khi hero đang trong khung nhìn, lướt qua thì dừng để tiết kiệm CPU và băng thông.
  useEffect(() => {
    videos.current.forEach((v) => {
      if (!v) return;
      if (inView) v.play?.().catch(() => {});
      else v.pause();
    });
  }, [inView, clips.length, reduceMotion]);

  return (
    <section ref={sectionRef} id="home" data-header="dark" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-charcoal text-white">
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${clips.length}, minmax(0, 1fr))` }}>
        {clips.map((clip, i) => (
          <div key={clip.video ?? clip.photo} className="relative overflow-hidden border-l border-black/40 first:border-l-0">
            {clip.photo ? (
              <Photo photo={photoById[clip.photo]} priority sizes="34vw" alt="" className="hero-img h-full w-full object-cover" />
            ) : reduceMotion ? (
              <img src={clip.poster} alt="" className="h-full w-full object-cover" />
            ) : (
              <video
                ref={(node) => { videos.current[i] = node; }}
                className="hero-img h-full w-full object-cover"
                src={clip.video}
                poster={clip.poster}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                tabIndex={-1}
              />
            )}
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/35" />
      {/* Vùng tối mờ phía sau khối chữ để dòng tiêu đề luôn rõ trên cả ảnh sáng */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_55%_38%_at_50%_52%,rgba(0,0,0,0.38),transparent)]" />

      <div className="relative mx-auto flex h-full max-w-[1500px] flex-col items-center justify-center px-6 pt-20 text-center">
        <h1 key={lang} aria-label={t.hero.title} className="max-w-5xl">
          <span className="hero-kicker block text-2xl leading-tight sm:text-3xl lg:text-4xl">
            <Words text={t.hero.titleScript} />
          </span>
          <span className="title-display mt-1 block text-[2.3rem] leading-[1.05] sm:text-6xl lg:text-7xl">
            <Words text={t.hero.titleMain} start={t.hero.titleScript.split(' ').length * 110 + 150} step={150} />
          </span>
        </h1>
        {t.hero.text && <p key={`text-${lang}`} className="hero-text mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-white/85 md:text-base">{t.hero.text}</p>}
        <div className="hero-actions mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <a href="#portfolio" className="btn btn-white">{t.hero.primary}</a>
          <a href="#contact" className="btn btn-light">{t.hero.secondary}</a>
        </div>
      </div>
    </section>
  );
}
