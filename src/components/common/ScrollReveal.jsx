import React, { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Trạng thái ẩn ban đầu của từng kiểu; trạng thái hiện luôn là "không biến đổi".
const hiddenState = (variant, d) => {
  switch (variant) {
    case 'down': return { transform: `translate3d(0, ${-d}px, 0)` };
    case 'left': return { transform: `translate3d(${-d * 3}px, 0, 0)` };
    case 'right': return { transform: `translate3d(${d * 3}px, 0, 0)` };
    case 'zoom': return { transform: 'scale(0.9)' };
    case 'blur': return { transform: `translate3d(0, ${d / 2}px, 0) scale(1.03)`, filter: 'blur(14px)' };
    case 'tilt': return { transform: `perspective(1200px) translate3d(0, ${d * 2}px, 0) rotateX(10deg) scale(0.96)`, transformOrigin: '50% 100%' };
    case 'wipe': return { transform: 'scale(1.06)', clipPath: 'inset(0 0 100% 0)' };
    default: return { transform: `translate3d(0, ${d}px, 0)` };
  }
};

/**
 * ScrollReveal - hiện dần khi cuộn tới, nhiều kiểu qua prop `variant`:
 * up | down | left | right | zoom | blur | tilt | wipe. Chỉ chạy một lần,
 * và hiển thị ngay nếu người dùng bật prefers-reduced-motion hoặc trình duyệt không có IntersectionObserver.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 900,
  distance = 24,
  variant = 'up',
  className = '',
  as: Component = 'div',
  style = {},
  ...rest
}) {
  const [shown, setShown] = useState(() => prefersReducedMotion() || typeof IntersectionObserver === 'undefined');
  const ref = useRef(null);

  useEffect(() => {
    if (shown) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        ...(shown ? { transform: 'none', filter: 'none', clipPath: variant === 'wipe' ? 'inset(-50% -50% -50% -50%)' : 'none' } : hiddenState(variant, distance)),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms ease ${delay}ms, clip-path ${duration + 300}ms cubic-bezier(0.65, 0, 0.35, 1) ${delay}ms`,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
