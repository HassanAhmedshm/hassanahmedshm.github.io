import { useRef, useState, useEffect } from 'react';
import useWordReveal from './useWordReveal';
import './Manifesto.css';

interface ManifestoProps {
  reducedMotion?: boolean;
}

const Manifesto = ({ reducedMotion = false }: ManifestoProps) => {
  const sectionRef = useRef(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const words = ['AI', 'should', 'empower', 'not', 'replace.'];
  const fullText = 'AI should empower not replace.';
  
  useWordReveal({
    sectionRef,
    words,
    scrollDistance: 2000,
    disabled: reducedMotion
  });

  // Typewriter effect for mobile
  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window === 'undefined') return;
    
    // Only run on mobile viewports
    const isMobile = window.innerWidth <= 767;
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTyping) {
            setIsTyping(true);
            let currentIndex = 0;
            
            const typeInterval = setInterval(() => {
              if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex));
                currentIndex++;
              } else {
                clearInterval(typeInterval);
              }
            }, 50); // 50ms per character

            return () => clearInterval(typeInterval);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isTyping, fullText]);

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
      <div className="manifesto-mobile-typewriter" aria-label="Manifesto quote">
        <p className="manifesto-mobile-text">
          {displayedText}
          <span className="manifesto-cursor"></span>
        </p>
      </div>
      <div className="manifesto-glow" />
    </section>
  );
};

export default Manifesto;
