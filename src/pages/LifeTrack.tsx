import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Zap, Activity, Brain, Smartphone, CheckCircle2, ArrowRight, Mail, Sparkles, Copy, Check, Shield, TrendingUp, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const COLORS = {
  bg: '#0F0F10',
  surface: '#1C1C1E',
  border: '#2A2A2D',
  primary: '#FF7A00',
  secondaryText: 'rgba(255, 255, 255, 0.6)',
  microcopy: 'rgba(255, 255, 255, 0.4)',
  energyGradient: 'linear-gradient(90deg, #FF7A00 0%, #FFB02E 100%)',
  perfGradient: 'linear-gradient(180deg, #1C1C1E 0%, #0F0F10 100%)',
};

function GlowParticles() {
  const count = 80;
  const meshRef = useRef(null);
  const positions = useRef(new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 3));

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#FF7A00" transparent opacity={0.15} sizeAttenuation />
    </points>
  );
}

const ThreeBackground = () => (
  <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
    <Canvas
      camera={{ position: [0, 0, 2], fov: 60, near: 0.1, far: 10 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <GlowParticles />
    </Canvas>
  </div>
);

const HeroRings = () => {
  const rings = [
    { size: 300, opacity: 0.1, speed: 20, color: '#FF7A00' },
    { size: 450, opacity: 0.07, speed: 25, color: '#FFB02E' },
    { size: 600, opacity: 0.05, speed: 30, color: '#FF7A00' },
  ];
  const ringRefs = useRef([]);

  useEffect(() => {
    ringRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, { rotation: 360, duration: rings[i].speed, repeat: -1, ease: 'none' });
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {rings.map((ring, i) => (
        <div
          key={i}
          ref={(el) => (ringRefs.current[i] = el)}
          className="absolute rounded-full border-2"
          style={{
            width: ring.size,
            height: ring.size,
            borderColor: ring.color,
            opacity: ring.opacity,
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: ring.color }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: ring.color }} />
        </div>
      ))}
    </div>
  );
};

const MagneticButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  const ref = useRef(null);
  const glowRef = useRef(null);

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    gsap.to(ref.current, {
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.25,
      duration: 0.4, ease: 'power2.out', overwrite: 'auto',
    });
  };

  const handleLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={(e) => { handleLeave(); }}
      onClick={onClick}
      onMouseEnter={() => gsap.to(ref.current, { scale: 1.03, duration: 0.2, overwrite: 'auto' })}
      onMouseDown={() => gsap.to(ref.current, { scale: 0.97, duration: 0.1, overwrite: 'auto' })}
      onMouseUp={() => gsap.to(ref.current, { scale: 1.03, duration: 0.1, overwrite: 'auto' })}
      className={`relative overflow-hidden font-medium transition-colors duration-200 ${variant === 'primary' ? 'text-white' : 'text-white'} ${className}`}
      style={{
        padding: '16px 32px',
        backgroundColor: variant === 'primary' ? COLORS.primary : 'transparent',
        border: variant === 'primary' ? 'none' : `1px solid ${COLORS.border}`,
        borderRadius: variant === 'pill' ? '9999px' : '8px',
        cursor: 'pointer',
      }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div
          ref={glowRef}
          className="absolute inset-0"
          style={{ background: COLORS.energyGradient, opacity: 0 }}
          onMouseEnter={() => gsap.to(glowRef.current, { opacity: 0.15, duration: 0.2 })}
          onMouseLeave={() => gsap.to(glowRef.current, { opacity: 0, duration: 0.2 })}
        />
      )}
    </button>
  );
};

const GlowCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [mPos, setMPos] = useState({ x: 0, y: 0 });
  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div ref={ref} onMouseMove={handleMouse} className={`relative rounded-xl overflow-hidden ${className}`} style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, padding: '24px' }}>
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-300" style={{ background: `radial-gradient(400px circle at ${mPos.x}px ${mPos.y}px, rgba(255,122,0,0.15), transparent 70%)`, opacity: 0.5 }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const CopyEmailButton = () => {
  const [copied, setCopied] = useState(false);
  const iconRef = useRef(null);
  const email = 'hassanahmedshm@gmail.com';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (iconRef.current) {
        gsap.fromTo(iconRef.current, { scale: 1 }, { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 });
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.border}` }}>
      <div ref={iconRef}>
        {copied ? <Check size={16} color="#FF7A00" /> : <Copy size={16} color="rgba(255,255,255,0.6)" />}
      </div>
      <span className="text-xs font-medium" style={{ color: copied ? '#FF7A00' : COLORS.secondaryText }}>
        {copied ? 'Copied!' : 'Copy email'}
      </span>
    </button>
  );
};

const FloatingStat = ({ icon: Icon, label, value, delay = 0 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay,
          duration: 0.6,
          ease: 'power2.out',
        }
      );
    });
    return () => ctx.revert();
  }, [delay]);
  return (
    <div ref={ref} className="absolute hidden md:flex flex-col items-center gap-2 p-4 rounded-xl backdrop-blur-sm" style={{ backgroundColor: 'rgba(28,28,30,0.8)', border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,122,0,0.1)' }}>
        <Icon size={16} color="#FF7A00" strokeWidth={2} />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-white font-['Inter']">{value}</p>
        <p className="text-xs" style={{ color: COLORS.microcopy }}>{label}</p>
      </div>
    </div>
  );
};

export default function App() {
  const refs = {
    nav: useRef(null),
    hero: useRef(null),
    heroOuter: useRef(null),
    heroContent: useRef(null),
    heroUnderline: useRef(null),
    scrollIndicator: useRef(null),
    scrollDot: useRef(null),
    solutionLeft: useRef(null),
    progressSection: useRef(null),
    phoneContainer: useRef(null),
    phoneCard: useRef(null),
    phoneSection: useRef(null),
    featuresTitle: useRef(null),
    featuresContainer: useRef(null),
    beta: useRef(null),
    betaLeft: useRef(null),
    betaRight: useRef(null),
    footerLogo: useRef(null),
  };

  const mouseGlowRef = useRef(null);

  const scrollToBeta = () => document.getElementById('beta')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToSolution = () => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const handler = (e) => {
      if (mouseGlowRef.current) {
        mouseGlowRef.current.style.left = `${e.clientX - 250}px`;
        mouseGlowRef.current.style.top = `${e.clientY - 250}px`;
      }
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const { nav, hero, heroOuter, heroContent, heroUnderline, scrollIndicator, scrollDot,
        solutionLeft, phoneContainer, phoneCard, featuresTitle, featuresContainer,
        beta, betaLeft, betaRight, footerLogo } = refs;

      if (nav.current) {
        gsap.fromTo(nav.current, { y: -100 }, { y: 0, duration: 0.6, ease: 'power2.out' });
      }

      if (heroOuter.current && hero.current) {
        gsap.fromTo(heroOuter.current,
          { opacity: 1, scale: 1 },
          {
            scrollTrigger: {
              trigger: hero.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
            opacity: 0,
            scale: 0.95,
          }
        );
      }

      if (heroContent.current?.children) {
        gsap.fromTo(heroContent.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            stagger: 0.12,
            delay: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: hero.current,
              start: 'top 85%',
              toggleActions: 'play once none none',
            },
          }
        );
      }

      if (heroUnderline.current) {
        gsap.fromTo(heroUnderline.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            delay: 1.2,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: hero.current,
              start: 'top 85%',
              toggleActions: 'play once none none',
            },
          }
        );
      }

      if (scrollIndicator.current) {
        gsap.to(scrollIndicator.current, {
          y: -8,
          duration: 1,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      if (scrollDot.current) {
        gsap.to(scrollDot.current, {
          y: 10,
          duration: 0.75,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
        });
      }

      if (solutionLeft.current) {
        gsap.fromTo(solutionLeft.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1, x: 0,
            scrollTrigger: {
              trigger: solutionLeft.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            duration: 0.8,
            ease: 'power2.out',
          }
        );
      }

      document.querySelectorAll('[data-progress-bar]').forEach((bar, idx) => {
        const value = bar.getAttribute('data-value');
        gsap.fromTo(bar,
          { width: '0%' },
          {
            width: value,
            scrollTrigger: {
              trigger: refs.progressSection.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            duration: 1.2,
            delay: idx * 0.15,
            ease: 'power2.out',
          }
        );
      });

      if (phoneContainer.current) {
        gsap.fromTo(phoneContainer.current,
          { opacity: 0, rotateX: 10, scale: 0.95 },
          {
            opacity: 1, rotateX: 0, scale: 1,
            scrollTrigger: {
              trigger: phoneContainer.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            duration: 0.9,
            ease: 'power2.out',
          }
        );
      }

      if (phoneCard.current) {
        gsap.to(phoneCard.current, {
          y: -12,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      const circles = document.querySelectorAll('[data-progress-ring]');
      circles.forEach((circle, i) => {
        const pct = parseFloat(circle.getAttribute('data-pct')) / 100;
        const c = 2 * Math.PI * 40;
        gsap.to(circle, {
          strokeDashoffset: c * (1 - pct),
          scrollTrigger: {
            trigger: refs.phoneSection.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
          duration: 1.2,
          delay: 0.4 + i * 0.15,
          ease: 'power2.out',
        });
      });

      document.querySelectorAll('[data-check-item]').forEach((item, i) => {
        gsap.fromTo(item,
          { scale: 0.8 },
          {
            scale: 1,
            scrollTrigger: {
              trigger: refs.phoneSection.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
            delay: 0.8 + i * 0.1,
            duration: 0.4,
            ease: 'back.out(1.7)',
          }
        );
      });

      if (featuresTitle.current) {
        gsap.fromTo(featuresTitle.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            scrollTrigger: {
              trigger: featuresTitle.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            duration: 0.6,
            ease: 'power2.out',
          }
        );
      }

      if (featuresContainer.current?.children) {
        gsap.fromTo(featuresContainer.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: featuresContainer.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (beta.current) {
        gsap.fromTo(beta.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            scrollTrigger: {
              trigger: beta.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            duration: 0.8,
            ease: 'power2.out',
          }
        );
      }

      if (betaLeft.current) {
        gsap.fromTo(betaLeft.current,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            scrollTrigger: {
              trigger: beta.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            duration: 0.7,
            delay: 0.2,
            ease: 'power2.out',
          }
        );
      }

      if (betaRight.current) {
        gsap.fromTo(betaRight.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            scrollTrigger: {
              trigger: beta.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            duration: 0.7,
            delay: 0.4,
            ease: 'power2.out',
          }
        );
      }

      if (footerLogo.current) {
        gsap.fromTo(footerLogo.current,
          { opacity: 0 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: footerLogo.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            duration: 0.5,
            ease: 'power2.out',
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handlePhoneMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    gsap.to(refs.phoneCard.current, {
      rotateX: (y * 20) - 10,
      rotateY: (x * -20) + 10,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handlePhoneMouseLeave = () => {
    gsap.to(refs.phoneCard.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  return (
    <div className="min-h-screen text-white font-['Inter'] selection:bg-[#FF7A00] selection:text-white" style={{ backgroundColor: COLORS.bg, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
      `}</style>

      {/* Ambient Cursor Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${COLORS.border} 1px, transparent 0)`, backgroundSize: '48px 48px', opacity: 0.2 }} />
        <div ref={mouseGlowRef} className="absolute w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,122,0,0.12), transparent 65%)', filter: 'blur(40px)' }} />
      </div>

      {/* Nav */}
      <nav ref={refs.nav} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ backgroundColor: 'rgba(15,15,16,0.85)', borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onMouseEnter={() => gsap.to(refs.nav.current?.querySelector('[data-nav-logo]'), { scale: 1.02, duration: 0.2 })}
              onMouseLeave={() => gsap.to(refs.nav.current?.querySelector('[data-nav-logo]'), { scale: 1, duration: 0.2 })}
            >
              <div data-nav-logo style={{ color: COLORS.primary }}><Zap size={22} fill="#FF7A00" /></div>
              <span className="text-xl sm:text-2xl font-bold font-['Poppins'] tracking-tight">Lifetrack AI</span>
            </div>
            <MagneticButton onClick={scrollToBeta} variant="primary" className="rounded-full text-sm">Join Beta</MagneticButton>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={refs.hero} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden" style={{ background: COLORS.perfGradient }}>
        <ThreeBackground />
        <HeroRings />

        <div ref={refs.heroOuter} className="relative z-10 max-w-6xl mx-auto text-center w-full">
          <div ref={refs.heroContent} className="flex flex-col items-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,122,0,0.1)', border: `1px solid rgba(255,122,0,0.2)` }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
              <span className="text-xs font-medium text-[#FF7A00] tracking-wide uppercase">Early Access Now Open</span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter mb-8 font-['Poppins']">
              <span className="block text-white">Track.</span>
              <span className="block text-white">Optimize.</span>
              <span
                className="block relative"
                style={{ background: COLORS.energyGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                onMouseEnter={() => gsap.to(refs.heroContent.current?.querySelector('[data-evolve]'), { scale: 1.02, duration: 0.2 })}
                onMouseLeave={() => gsap.to(refs.heroContent.current?.querySelector('[data-evolve]'), { scale: 1, duration: 0.2 })}
              >
                <span data-evolve style={{ display: 'inline-block' }}>Evolve.</span>
                <div ref={refs.heroUnderline} className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1.5 rounded-full origin-left" style={{ background: COLORS.energyGradient, opacity: 0.5 }} />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: COLORS.secondaryText }}>
              Building healthy habits is essential, but knowing where to start is the tricky part. Let AI guide your transformation step by step.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg">
              <MagneticButton onClick={scrollToBeta} variant="primary" className="rounded-lg text-base w-full sm:w-auto">
                Join the Beta
                <ArrowRight size={18} />
              </MagneticButton>
              <MagneticButton onClick={scrollToSolution} variant="secondary" className="rounded-lg text-base w-full sm:w-auto">
                Learn More
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div ref={refs.scrollIndicator} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: COLORS.microcopy }}>
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 flex justify-center pt-1.5" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            <div ref={refs.scrollDot} className="w-1 h-2 rounded-full bg-[#FF7A00]" />
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="solution" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div ref={refs.solutionLeft}>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-[#FF7A00]" />
                <span className="text-xs font-medium text-[#FF7A00] tracking-wide uppercase">The Solution</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium mb-6 font-['Poppins'] leading-[1.1]">
                Meet Your Personal AI Life Coach
              </h2>
              <p className="text-lg leading-relaxed mb-10" style={{ color: COLORS.secondaryText }}>
                Lifetrack AI is a mobile app that helps you keep track of your day and daily habits, with an AI life coach that's with you step-by-step along the way.
              </p>

              <div ref={refs.progressSection} className="flex flex-col gap-6">
                {[
                  { label: 'Daily Habits', value: '85%', icon: CheckCircle2 },
                  { label: 'Workout Routine', value: '72%', icon: Activity },
                  { label: 'Sleep Quality', value: '90%', icon: Clock },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2.5 items-center">
                      <div className="flex items-center gap-2">
                        <item.icon size={14} color="#FF7A00" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: COLORS.primary }}>{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
                      <div className="h-full rounded-full" style={{ background: COLORS.energyGradient }} data-progress-bar data-value={item.value} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={refs.phoneContainer}
              style={{ perspective: 1200 }}
              className="relative max-w-sm mx-auto"
            >
              <div
                ref={refs.phoneCard}
                className="relative rounded-[2rem] overflow-hidden p-6"
                style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: '0 40px 80px -15px rgba(0,0,0,0.6)' }}
                onMouseMove={handlePhoneMouseMove}
                onMouseLeave={handlePhoneMouseLeave}
              >
                <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,122,0,0.4), transparent 60%)' }} />

                <div ref={refs.phoneSection} className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-medium" style={{ color: COLORS.microcopy }}>9:41</span>
                    <div className="flex gap-1.5"><div className="w-4 h-2 rounded-sm bg-white" /><div className="w-1 h-2 rounded-sm bg-white" /></div>
                  </div>

                  <div className="mb-8">
                    <p className="text-xs font-medium mb-1.5" style={{ color: COLORS.microcopy }}>GOOD MORNING</p>
                    <h3 className="text-xl font-bold font-['Poppins']">Today's Progress</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[{ label: 'Habit', pct: 75, color: '#FF7A00' }, { label: 'Sleep', pct: 90, color: '#FFB02E' }, { label: 'Exercise', pct: 60, color: '#FF7A00' }].map((ring, i) => {
                      const circumference = 2 * Math.PI * 40;
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div className="relative w-16 h-16">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="none" stroke={COLORS.border} strokeWidth="8" />
                              <circle cx="50" cy="50" r="40" fill="none" stroke={ring.color} strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={circumference} strokeDashoffset={circumference}
                                data-progress-ring data-pct={ring.pct} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-bold">{ring.pct}%</span></div>
                          </div>
                          <span className="text-xs mt-2 font-medium" style={{ color: COLORS.secondaryText }}>{ring.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.border }}>
                    <p className="text-xs font-medium mb-3" style={{ color: COLORS.microcopy }}>TODAY'S CHECKLIST</p>
                    <div className="space-y-3">
                      {[{ text: 'Morning Workout', done: true }, { text: 'Meditation - 10 min', done: true }, { text: 'Drink 2L Water', done: false }, { text: 'Read 30 pages', done: false }].map((t, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div data-check-item className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ border: t.done ? 'none' : `2px solid ${COLORS.border}`, backgroundColor: t.done ? COLORS.primary : 'transparent' }}>
                            {t.done && <CheckCircle2 size={14} color="#FFF" />}
                          </div>
                          <span className="text-sm" style={{ color: t.done ? COLORS.secondaryText : '#FFFFFF', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div ref={refs.featuresTitle}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-[#FF7A00]" />
                <span className="text-xs font-medium text-[#FF7A00] tracking-wide uppercase">Why Us</span>
                <div className="w-8 h-px bg-[#FF7A00]" />
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium mb-4 font-['Poppins']">What Makes Us Unique?</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.secondaryText }}>Everything you need to transform your daily routine in one intelligent platform.</p>
            </div>
          </div>

          <div ref={refs.featuresContainer} className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Activity, title: 'Habit & Routine Tracking', desc: 'Tracks your daily routine, habits, exercises, food, and sleep to help you build healthier habits.' },
              { icon: Brain, title: 'AI Analysis', desc: 'Constant reminders and data analysis make sure you are on the right track to a healthier lifestyle.' },
              { icon: Smartphone, title: 'All-in-One Companion', desc: 'Replaces 5 different apps. Your nutrition, lifting PRs, and sleep schedule connected by one intelligence.' },
            ].map((f, i) => (
              <div key={i}>
                <GlowCard className="h-full group cursor-pointer">
                  <div className="relative z-10">
                    <div className="mb-5 transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,122,0,0.1)' }}>
                        <f.icon size={24} color="#FF7A00" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 font-['Poppins']">{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: COLORS.secondaryText }}>{f.desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </GlowCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BETA SECTION */}
      <section id="beta" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,122,0,0.3), transparent 60%)', filter: 'blur(80px)' }} />
        </div>

        <div ref={refs.beta} className="max-w-5xl mx-auto relative z-10">
          {/* Animated Border */}
          <div className="absolute -inset-px rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] via-[#FFB02E] to-[#FF7A00] opacity-40 blur-sm" style={{ backgroundSize: '200% 100%', animation: 'shimmer 4s linear infinite' }} />
            <div className="absolute inset-[1px] rounded-3xl" style={{ backgroundColor: COLORS.surface }} />
          </div>

          <div className="relative p-8 sm:p-12 md:p-16 rounded-3xl">
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
              {/* Left: Content */}
              <div ref={refs.betaLeft} className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,122,0,0.1)', border: '1px solid rgba(255,122,0,0.2)' }}>
                  <Sparkles size={14} color="#FF7A00" />
                  <span className="text-xs font-medium text-[#FF7A00] tracking-wide uppercase">Exclusive Access</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-6 font-['Poppins'] leading-tight">
                  Help Shape the Future of Lifetrack AI
                </h2>
                <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: COLORS.secondaryText }}>
                  We are currently in active development. Join our exclusive beta program to get early access and help us build the ultimate tracking tool. Tell us why you'll use it, how you'll use it, and what features you need most.
                </p>

                {/* Feature Pills */}
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: Shield, text: 'Early Access' },
                    { icon: TrendingUp, text: 'Direct Input' },
                    { icon: Clock, text: 'Priority Features' },
                    { icon: Zap, text: 'Free Lifetime' },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.border}` }}>
                      <p.icon size={16} color="#FF7A00" />
                      <span className="text-sm font-medium">{p.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Contact Block */}
              <div ref={refs.betaRight} className="lg:col-span-2">
                <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(15,15,16,0.5)', border: `1px solid ${COLORS.border}` }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,122,0,0.1)' }}>
                      <Mail size={20} color="#FF7A00" />
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: COLORS.microcopy }}>Contact Directly</p>
                      <p className="text-sm font-medium">We reply within 24h</p>
                    </div>
                  </div>

                  {/* Email Display */}
                  <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                    <p className="text-base font-medium break-all" style={{ color: '#FFFFFF' }}>hassanahmedshm@gmail.com</p>
                  </div>

                  {/* Copy Button */}
                  <div className="flex justify-center mb-6">
                    <CopyEmailButton />
                  </div>

                  {/* CTA */}
                  <a
                    href="mailto:hassanahmedshm@gmail.com?subject=Lifetrack%20AI%20Beta%20Application"
                    className="block w-full"
                  >
                    <MagneticButton variant="primary" className="w-full rounded-xl text-base">
                      <Mail size={18} />
                      Drop us an email
                    </MagneticButton>
                  </a>

                  <p className="text-center text-xs mt-4" style={{ color: COLORS.microcopy }}>Subject pre-filled for beta application</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-px w-full mb-8" style={{ backgroundColor: COLORS.border }} />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div
              ref={refs.footerLogo}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onMouseEnter={() => gsap.to(refs.footerLogo.current, { scale: 1.02, duration: 0.2 })}
              onMouseLeave={() => gsap.to(refs.footerLogo.current, { scale: 1, duration: 0.2 })}
            >
              <Zap size={20} color="#FF7A00" fill="#FF7A00" />
              <span className="text-lg font-bold font-['Poppins'] tracking-tight">Lifetrack AI</span>
            </div>
            <p className="text-sm" style={{ color: COLORS.microcopy }}>© {new Date().getFullYear()} Lifetrack AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
    </div>
  );
}
