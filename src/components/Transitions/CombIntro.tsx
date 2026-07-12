import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CombIntroProps {
  onComplete?: () => void;
}

const CombIntro = ({ onComplete }: CombIntroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep the latest onComplete without retriggering the GSAP timeline.
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onCompleteRef.current?.()
    });

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      delay: 1.5,
      ease: 'power2.inOut'
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="comb-intro">
      <div className="comb-intro-content">
        <h1>Hassan Ahmed</h1>
        <p>Full Stack Developer</p>
      </div>
    </div>
  );
};

export default CombIntro;
