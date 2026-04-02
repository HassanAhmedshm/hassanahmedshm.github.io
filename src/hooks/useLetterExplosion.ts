import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { seededRandomRange } from '../utils/math';

/**
 * Custom hook for scroll-driven letter explosion animation
 */
export const useLetterExplosion = ({
  containerRef,
  triggerSelector = '#hero',
  charSelector = '[data-char-index]',
  xRange = 400,
  yRange = 300,
  maxRotation = 180,
  minScale = 0.5,
  maxScale = 1.5
} = {}) => {
  const randomValuesRef = useRef(null);

  useEffect(() => {
    if (!containerRef?.current) return;

    const container = containerRef.current;
    const charElements = container.querySelectorAll(charSelector);

    if (charElements.length === 0) return;

    // Generate deterministic random values once
    if (!randomValuesRef.current) {
      randomValuesRef.current = Array.from(charElements).map((_, index) => ({
        x: seededRandomRange(index, -xRange, xRange),
        y: seededRandomRange(index + 1000, -yRange, yRange),
        rotation: seededRandomRange(index + 2000, -maxRotation, maxRotation),
        scale: seededRandomRange(index + 3000, minScale, maxScale)
      }));
    }

    // Set initial states
    gsap.set(charElements, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0
    });

    // Create scroll-triggered animation
    const timeline = gsap.to(charElements, {
      scrollTrigger: {
        trigger: triggerSelector,
        start: 'top top',
        end: 'center top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          charElements.forEach((el, index) => {
            const rand = randomValuesRef.current[index];
            gsap.set(el, {
              x: rand.x * progress,
              y: rand.y * progress,
              rotation: rand.rotation * progress,
              scale: 1 - (1 - rand.scale) * progress,
              opacity: 1 - progress * 0.9
            });
          });
        }
      }
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === triggerSelector) {
          st.kill();
        }
      });
    };
  }, [containerRef, triggerSelector, charSelector, xRange, yRange, maxRotation, minScale, maxScale]);
};

export default useLetterExplosion;