import { useRef } from 'react';
import useWordReveal from './useWordReveal';
import './Manifesto.css';

/**
 * Manifesto - Scroll-pinned word reveal section
 * Reveals "AI should empower not replace" one word at a time
 */
const Manifesto = () => {
  const sectionRef = useRef(null);
  
  const words = ['AI', 'should', 'empower', 'not', 'replace'];
  
  useWordReveal({
    sectionRef,
    words,
    scrollDistance: 2000
  });

  return (
    <section className="manifesto" id="manifesto" ref={sectionRef}>
      <div className="manifesto-words">
        {words.map((word, index) => (
          <span 
            key={index} 
            className="manifesto-word"
            data-word={word}
          >
            {word}
          </span>
        ))}
      </div>
      <div className="manifesto-glow" />
    </section>
  );
};

export default Manifesto;