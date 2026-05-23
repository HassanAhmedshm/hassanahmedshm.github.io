import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for scroll-pinned word reveal animation
 * @param {Object} options
 * @param {React.RefObject} options.sectionRef - Reference to the section element
 * @param {string[]} options.words - Array of words to reveal
 * @param {number} options.scrollDistance - How far to scroll through (default: 3000)
 */
export const useWordReveal = ({ sectionRef, words, scrollDistance = 3000 } = {}) => {
  const timelineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef?.current;
    if (!section || !words?.length) return;

    const wordElements = section.querySelectorAll('.manifesto-word');

    if (wordElements.length === 0) return;

    // Create timeline with scrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 0.5,
        start: 'top top',
        end: `+=${scrollDistance}`,
        anticipatePin: 1
      }
    });

    // Calculate timing for each word
    // Total progress = 1, divide among words with fade in/out for each
    const wordCount = words.length;
    const baseProgress = 1 / wordCount;
    const holdProgress = baseProgress * 0.2; // 20% hold time
    const fadeProgress = baseProgress * 0.3; // 30% for fade in/out

    wordElements.forEach((word, index) => {
      // Set initial state
      gsap.set(word, { opacity: 0, scale: 1.3, autoAlpha: 0, x: '-50%', y: '-50%' });

      // Fade in
      tl.to(word, {
        opacity: 1,
        scale: 1,
        autoAlpha: 1,
        x: '-50%',
        y: '-50%',
        duration: fadeProgress,
        ease: 'power2.out'
      });

      // Hold
      tl.to(word, {
        duration: holdProgress
      });

      // Fade out
      tl.to(word, {
        opacity: 0,
        scale: 0.8,
        autoAlpha: 0,
        x: '-50%',
        y: '-50%',
        duration: fadeProgress,
        ease: 'power2.in'
      });

      // Small gap between words
      if (index < wordCount - 1) {
        tl.to({}, { duration: baseProgress * 0.1 });
      }
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) {
          st.kill();
        }
      });
    };
  }, [sectionRef, words, scrollDistance]);

  return timelineRef;
};

export default useWordReveal;