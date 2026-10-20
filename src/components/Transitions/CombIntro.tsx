import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { IsometricH } from '../Logo/StylizedH';
import './CombIntro.css';

interface CombIntroProps {
  /** Fired when the site behind should start fading up. */
  onReveal?: () => void;
  /** Fired once the overlay has finished and can be removed. */
  onComplete?: () => void;
}

/** The mark's glow while it draws, and while it flies past the camera. */
const GLOW = 'drop-shadow(0 0 14px rgba(47, 128, 196, 0.45))';
const GLOW_HOT = 'drop-shadow(0 0 34px rgba(47, 128, 196, 0.65))';

const CombIntro = ({ onReveal, onComplete }: CombIntroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  // Keep the latest callbacks without retriggering the GSAP timeline.
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onRevealRef.current = onReveal;
    onCompleteRef.current = onComplete;
  }, [onReveal, onComplete]);

  useEffect(() => {
    const container = containerRef.current;
    const bg = bgRef.current;
    const mark = markRef.current;
    if (!container || !bg || !mark) return;

    const path = mark.querySelector('path');
    const length = path ? path.getTotalLength() : 0;

    if (path && length > 0) {
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    }

    const tl = gsap.timeline({
      onComplete: () => onCompleteRef.current?.(),
    });

    // 1) The mark draws itself, stroke by stroke.
    if (path && length > 0) {
      tl.to(
        path,
        { strokeDashoffset: 0, duration: 1.3, ease: 'power1.inOut' },
        0.15,
      );
    }

    // 2) A beat to sit with the finished mark, then the site fades up behind
    //    it and the mark flies past the camera.
    tl.call(() => onRevealRef.current?.(), [], 1.75);
    tl.to(
      mark,
      {
        scale: 5.5,
        opacity: 0,
        filter: `${GLOW_HOT} blur(26px)`,
        duration: 0.85,
        ease: 'expo.in',
      },
      1.75,
    );
    tl.to(bg, { opacity: 0, duration: 0.85, ease: 'power2.inOut' }, 1.8);

    // The mark is drawn with the glow already applied.
    gsap.set(mark, { filter: GLOW });

    // Skippable: any key or click jumps straight to the end of the timeline,
    // which still fires onReveal and onComplete in order.
    const skip = () => {
      tl.progress(1);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') return;
      skip();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', skip);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', skip);
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="intro" aria-hidden="true">
      <div className="intro-bg" ref={bgRef} />
      <div className="intro-stage">
        <div className="intro-mark" ref={markRef}>
          <IsometricH size={340} strokeWidth={10} />
        </div>
      </div>
    </div>
  );
};

export default CombIntro;
