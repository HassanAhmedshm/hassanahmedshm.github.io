import { useState, useEffect, useRef } from 'react';

type ScrollDirection = 'up' | 'down';

const useScrollDirection = (): ScrollDirection => {
  const [direction, setDirection] = useState<ScrollDirection>('up');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setDirection(currentY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return direction;
};

export default useScrollDirection;
