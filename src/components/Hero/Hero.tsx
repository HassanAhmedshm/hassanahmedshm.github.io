import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLetterExplosion from '../../hooks/useLetterExplosion';
import { useScrollTriggerCleanup } from '../../hooks/useScrollTriggerCleanup';
import StarField from '../StarField/StarField';
import './Hero.css';

interface HeroProps {
  reducedMotion?: boolean;
}

const Hero = ({ reducedMotion = false }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef(null);
  const starFieldRef = useRef<HTMLDivElement>(null);
  const { registerInstance } = useScrollTriggerCleanup();
  
  // Split name into individual characters with data-char-index
  const name = 'Hassan Ahmed';
  const letters = useMemo(() => {
    return name.split('').map((char, index) => ({
      char,
      index,
      isSpace: char === ' '
    }));
  }, []);
  
  useLetterExplosion({
    containerRef: nameRef,
    triggerSelector: '#hero',
    charSelector: '[data-char-index]',
    disabled: reducedMotion
  });

  useEffect(() => {
    if (reducedMotion) return;
    if (!sectionRef.current) return;

    const fadeStart = 0.7;
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const fadeProgress = self.progress <= fadeStart
          ? 0
          : (self.progress - fadeStart) / (1 - fadeStart);
        const easedFade = 1 - Math.pow(Math.min(1, fadeProgress), 1.5);
        gsap.set(sectionRef.current, { opacity: Math.max(0.05, easedFade) });
      }
    });

    registerInstance(st);

    return () => {
      if (sectionRef.current) {
        gsap.set(sectionRef.current, { opacity: 1 });
      }
    };
  }, [registerInstance]);

  // StarField entrance fade-in after page load
  useEffect(() => {
    if (reducedMotion) return;
    if (!starFieldRef.current) return;

    gsap.fromTo(starFieldRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, delay: 0.3, ease: 'power2.out' }
    );
  }, []);

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      <div ref={starFieldRef} style={{ opacity: 0 }}>
        <StarField density={80} speed={1} deferred />
      </div>
      <div className="hero-content">
        <h1 className="hero-title" ref={nameRef}>
          {letters.map(({ char, index, isSpace }) => (
            <span
              key={index}
              data-char-index={index}
              className={`hero-letter ${isSpace ? 'hero-letter--space' : ''}`}
            >
              {char}
            </span>
          ))}
        </h1>
        <p className="hero-subtitle">
          Full-Stack Dev
        </p>
      </div>
    </section>
  );
};

export default Hero;
