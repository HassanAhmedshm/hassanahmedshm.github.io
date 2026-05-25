import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { seededRandomRange } from '../utils/math';
import { useScrollTriggerCleanup } from './useScrollTriggerCleanup';

interface RandomValues {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface UseLetterExplosionOptions {
  containerRef?: React.RefObject<HTMLElement>;
  triggerSelector?: string;
  charSelector?: string;
  xRange?: number;
  yRange?: number;
  maxRotation?: number;
  minScale?: number;
  maxScale?: number;
  disabled?: boolean;
}

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
  maxScale = 1.5,
  disabled = false
}: UseLetterExplosionOptions = {}) => {
  const randomValuesRef = useRef<RandomValues[] | null>(null);
  const { registerInstance } = useScrollTriggerCleanup();

  useEffect(() => {
    if (disabled) return;
    if (!containerRef?.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

    // Guard: ensure the trigger element exists before creating ScrollTrigger
    const triggerEl = document.querySelector(triggerSelector);
    if (!triggerEl) return;

    // Set initial states
    gsap.set(charElements, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0
    });

    // Split letters into groups (first name, space, last name)
    const letters = Array.from(charElements) as Element[];
    const firstSpace = letters.findIndex(el => el.textContent === ' ');
    const splitAt = firstSpace >= 0 ? firstSpace : letters.length;

    // Staggered timeline: first name group starts, last name group follows
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerSelector,
        start: 'top top',
        end: 'center top',
        scrub: 1.5,
      }
    });

    if (tl.scrollTrigger) {
      registerInstance(tl.scrollTrigger);
    }

    tl.to(letters.slice(0, splitAt), {
      x: () => seededRandomRange(Math.random() * 1000, -300, 300),
      y: () => seededRandomRange(Math.random() * 1000, -200, 200),
      rotation: () => seededRandomRange(Math.random() * 1000, -120, 120),
      scale: 0.6,
      opacity: 0.1,
      duration: 1,
      ease: 'power3.out',
    }, 0);

    tl.to(letters.slice(splitAt), {
      x: () => seededRandomRange(Math.random() * 1000, -300, 300),
      y: () => seededRandomRange(Math.random() * 1000, -200, 200),
      rotation: () => seededRandomRange(Math.random() * 1000, -120, 120),
      scale: 0.6,
      opacity: 0.1,
      duration: 1,
      ease: 'power3.out',
    }, 0.15);
  }, [containerRef, triggerSelector, charSelector, xRange, yRange, maxRotation, minScale, maxScale]);
};

export default useLetterExplosion;