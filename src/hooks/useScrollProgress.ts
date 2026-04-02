import { useState, useEffect } from 'react';
import { useLenis } from './useLenis';

/**
 * Hook to track scroll progress (0 to 1)
 * @param {string} targetRef - Optional ref or selector to track specific element
 */
export const useScrollProgress = (targetRef = null) => {
  const [progress, setProgress] = useState(0);
  
  useLenis();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(Math.max(scrollProgress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
};

export default useScrollProgress;