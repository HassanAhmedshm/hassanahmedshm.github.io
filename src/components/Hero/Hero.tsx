import { useRef, useMemo } from 'react';
import useLetterExplosion from '../../hooks/useLetterExplosion';
import StarField from '../StarField/StarField';
import './Hero.css';

/**
 * Hero - Main landing section with scroll-driven letter explosion
 */
const Hero = () => {
  const nameRef = useRef(null);
  
  // Split name into individual characters with data-char-index
  const name = 'Hassan Ahmed';
  const letters = useMemo(() => {
    return name.split('').map((char, index) => ({
      char,
      index,
      isSpace: char === ' '
    }));
  }, []);
  
  // Apply scroll-driven letter explosion
  useLetterExplosion({
    containerRef: nameRef,
    triggerSelector: '#hero',
    charSelector: '[data-char-index]'
  });

  return (
    <section className="hero" id="hero">
      <StarField density={80} speed={1} deferred />
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
          Full-stack Dev | Prompt Engineer
        </p>
      </div>
    </section>
  );
};

export default Hero;