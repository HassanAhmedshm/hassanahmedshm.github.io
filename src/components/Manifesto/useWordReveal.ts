import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTriggerCleanup } from '../../hooks/useScrollTriggerCleanup';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for scroll-pinned word reveal animation (desktop only)
 * Mobile uses typewriter effect handled in component
 * @param {Object} options
 * @param {React.RefObject} options.sectionRef - Reference to the section element
 * @param {string[]} options.words - Array of words to reveal
 * @param {number} options.scrollDistance - How far to scroll through (default: 3000)
 * @param {boolean} options.disabled - Skip animation when true
 */
export const useWordReveal = ({ sectionRef, words, scrollDistance = 3000, disabled = false } = {}) => {
  const timelineRef = useRef(null);
  const { registerInstance } = useScrollTriggerCleanup();

  useEffect(() => {
    if (disabled) return;
    const section = sectionRef?.current;
    if (!section || !words?.length) return;

    const wordElements = section.querySelectorAll('.manifesto-word');

    if (wordElements.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(wordElements, { opacity: 1, scale: 1, autoAlpha: 1 });
      return;
    }

    // Kill any existing ScrollTrigger for this section (React Strict Mode safety)
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === section) {
        st.kill();
      }
    });

    const ctx = gsap.matchMedia();

    // Desktop only - word-by-word reveal with ScrollTrigger
    ctx.add('(min-width: 768px)', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(wordElements, { opacity: 1, scale: 1, autoAlpha: 1, x: '-50%', y: '-50%' });
        return;
      }

      // Create timeline with scrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scrub: 0.5,
          start: 'top bottom',
          end: `+=${scrollDistance}`,
        }
      });

      // Register the ScrollTrigger instance for cleanup
      if (tl.scrollTrigger) {
        registerInstance(tl.scrollTrigger);
      }

      // Calculate timing for each word
      // Total progress = 1, divide among words with fade in/out for each
      const wordCount = words.length;
      const baseProgress = 1 / wordCount;
      const holdProgress = baseProgress * 0.2; // 20% hold time
      const fadeProgress = baseProgress * 0.3; // 30% for fade in/out
      const wordBlockDuration = fadeProgress + holdProgress + fadeProgress;
      const overlapAmount = fadeProgress * 0.7; // Overlap next word's fade-in with current fade-out

      wordElements.forEach((word, index) => {
        // Set initial state
        gsap.set(word, { opacity: 0, scale: 1.3, autoAlpha: 0, x: '-50%', y: '-50%' });

        const startPos = Math.max(0, index * wordBlockDuration - (index > 0 ? overlapAmount : 0));

        // Fade in
        tl.to(word, {
          opacity: 1,
          scale: 1,
          autoAlpha: 1,
          x: '-50%',
          y: '-50%',
          duration: fadeProgress,
          ease: 'power3.out'
        }, startPos);

        // Hold
        tl.to(word, {
          duration: holdProgress
        }, startPos + fadeProgress);

        // Fade out
        tl.to(word, {
          opacity: 0,
          scale: 0.8,
          autoAlpha: 0,
          x: '-50%',
          y: '-50%',
          duration: fadeProgress,
          ease: 'power3.in'
        }, startPos + fadeProgress + holdProgress);
      });

      timelineRef.current = tl;
    });

    // Mobile - no GSAP animations, just reset desktop word states
    ctx.add('(max-width: 767px)', () => {
      gsap.set(wordElements, { clearProps: 'all' });
    });

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, []);

  return timelineRef;
};

export default useWordReveal;
