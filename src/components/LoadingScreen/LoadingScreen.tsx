/* ============================================
   LoadingScreen.jsx — Loading sequence orchestrator
   ============================================
   Timeline:
     0–3s:     Tesseract with glitch intensity 0→1
     3–3.8s:   Particle explosion
     3.8–4.4s: Overlay fades out
     4.4s:     onComplete → main site renders
   ============================================ */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import Tesseract from './Tesseract';
import ExplosionParticles from './ExplosionParticles';
import './LoadingScreen.css';

export default function LoadingScreen({ onComplete }) {
  // Phase state machine: loading → exploding → fading → done
  const [phase, setPhase] = useState('loading');
  const overlayRef = useRef(null);
  const timelineRef = useRef(null);

  // Shared refs — GSAP tweens these, R3F components read them in useFrame
  const progressRef = useRef({ glitchIntensity: 0 });
  const vertexDataRef = useRef({ positions: null });

  // Feature detection (computed once)
  const supportsWebGL = useRef(true);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    // --- WebGL support check with fallback ---
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('webgl2');
      supportsWebGL.current = !!gl;
      
      // Check for required extensions
      if (gl) {
        const hasFloatTextures = gl.getExtension('OES_texture_float');
        const hasDerivatives = gl.getExtension('OES_standard_derivatives');
        // Graceful degradation if extensions missing
        if (!hasFloatTextures || !hasDerivatives) {
          console.warn('WebGL extensions limited, using simplified rendering');
        }
      }
    } catch {
      supportsWebGL.current = false;
    }

    // --- Reduced motion check ---
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // --- Fallback: skip 3D animation ---
    if (!supportsWebGL.current || prefersReducedMotion.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: prefersReducedMotion.current ? 0.8 : 0,
        delay: 0.3,
        onComplete: () => {
          setPhase('done');
          onComplete?.();
        },
      });
      return;
    }

    // --- Main GSAP Timeline: Normal → Glitch → Explode ---
    const tl = gsap.timeline();

    // Phase 1 (0–2s): Normal tesseract, no glitch
    tl.to({}, { duration: 2 });

    // Phase 2 (2–4s): Glitch ramps up
    tl.to(progressRef.current, {
      glitchIntensity: 1,
      duration: 2,
      ease: 'power2.in',
    });

    // Phase 3 (4s): Explosion
    tl.call(() => setPhase('exploding'));
    tl.to({}, { duration: 1.28 }); // Match TOTAL_DURATION from ExplosionParticles

    // Phase 4: Fade out
    tl.call(() => setPhase('fading'));
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    });

    // Complete
    tl.call(() => {
      setPhase('done');
      onComplete?.();
    });

    timelineRef.current = tl;
    return () => tl.kill();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Skip handler — immediately fade out and complete
  const handleSkip = useCallback(() => {
    timelineRef.current?.kill();
    setPhase('fading');

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        setPhase('done');
        onComplete?.();
      },
    });
  }, [onComplete]);

  // Unmount entirely when done
  if (phase === 'done') return null;

  const showCanvas =
    supportsWebGL.current && !prefersReducedMotion.current;

  return (
    <div
      className="loading-screen"
      ref={overlayRef}
      data-phase={phase}
      role="status"
      aria-label="Loading site"
      aria-live="polite"
    >
      {/* Three.js scene */}
      {showCanvas && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          className="loading-screen__canvas"
          gl={{ antialias: true, alpha: true }}
        >
          {phase === 'loading' && (
            <Tesseract
              progressRef={progressRef}
              vertexDataRef={vertexDataRef}
            />
          )}

          {phase === 'exploding' && (
            <ExplosionParticles
              sourcePositions={vertexDataRef.current.positions}
            />
          )}
        </Canvas>
      )}

      {/* Skip button — bottom right, subtle */}
      {phase !== 'fading' && (
        <button
          className="loading-screen__skip"
          onClick={handleSkip}
          aria-label="Skip loading animation"
        >
          Skip
        </button>
      )}

      {/* Screen reader status updates */}
      <p className="sr-only">
        {phase === 'loading' && 'Loading site content...'}
        {phase === 'exploding' && 'Almost ready...'}
        {phase === 'fading' && 'Site ready'}
      </p>
    </div>
  );
}
