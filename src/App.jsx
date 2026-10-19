import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Portfolio from './components/Portfolio';
import Approach from './components/Approach';
import Services from './components/Services';
import Process from './components/Process';
import Contact from './components/Contact';
import Cta from './components/Cta';
import Footer from './components/Footer';
import FloatingCall from './components/FloatingCall';

export default function App() {
  // Luôn bắt đầu từ đầu trang khi tải lại
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-ivory text-charcoal">
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Services />
        <Portfolio />
        <Approach />
        <Process />
        <Cta />
        <Contact />
      </main>
      <Footer />
      <FloatingCall />
    </div>
  );
}
