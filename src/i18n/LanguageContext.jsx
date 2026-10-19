import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';

const STORAGE_KEY = 'studiobin-lang';
const LanguageContext = createContext(null);

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'vi' || saved === 'en') return saved;
  } catch {
    /* localStorage không khả dụng */
  }
  // Lần đầu truy cập: khách nước ngoài (trình duyệt không dùng tiếng Việt) thấy bản tiếng Anh.
  const browser = typeof navigator !== 'undefined' ? navigator.language || '' : '';
  return browser && !browser.toLowerCase().startsWith('vi') ? 'en' : 'vi';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* bỏ qua */
    }
  }, []);

  useEffect(() => {
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.meta.description);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'vi' ? 'vi_VN' : 'en_US');
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: translations[lang] }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
