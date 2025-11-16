import { useEffect, useRef, useState } from 'react';

const TopScrollProgress: React.FC = () => {
  const [percent, setPercent] = useState(0);
  const raf = useRef<number | null>(null);
  const recalcTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const calculateScroll = () => {
      if (raf.current !== null) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;
        setPercent(pct);
      });
    };

    const onScroll = () => calculateScroll();

    const onResize = () => {
      // Recalculate on resize as content height may change
      if (recalcTimeout.current) clearTimeout(recalcTimeout.current);
      recalcTimeout.current = setTimeout(calculateScroll, 100);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial calculation with multiple delays to ensure content is fully rendered
    setTimeout(calculateScroll, 100);
    setTimeout(calculateScroll, 300);
    setTimeout(calculateScroll, 500);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf.current) cancelAnimationFrame(raf.current);
      if (recalcTimeout.current) clearTimeout(recalcTimeout.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex items-start justify-between px-4 pt-2">
      {/* Minimal percentage indicator */}
      <div className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md border border-white/10 transition-all duration-300">
        {percent}% Read
      </div>

      {/* Progress bar */}
      <div className="absolute left-0 right-0 top-0 h-1 w-full bg-transparent">
        <div
          className="h-full rounded-b-lg bg-gradient-to-r from-glow-lime via-glow-amber to-glow-orange shadow-lg shadow-glow-amber/20 transition-[width] duration-150"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default TopScrollProgress;
