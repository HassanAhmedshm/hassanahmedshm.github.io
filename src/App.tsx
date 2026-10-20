import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CombIntro from './components/Transitions/CombIntro';
import Navbar from './components/Navbar/Navbar';
import Contact from './components/Contact/Contact';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import SectionSkeleton from './components/Skeleton/SectionSkeleton';
import SectionError from './components/SectionError/SectionError';
import NotFound from './pages/NotFound';
import { useScrollProgress } from './hooks/useScrollProgress';
import './styles/index.css';

// Lazy load portfolio sections for code splitting
const Hero = lazy(() => import('./components/Hero/Hero'));
const Manifesto = lazy(() => import('./components/Manifesto/Manifesto'));
const About = lazy(() => import('./components/About/About'));
const Projects = lazy(() => import('./components/Projects/Projects'));

// Lazy load sub-pages for code splitting
const AstroV = lazy(() => import('./pages/AstroV'));
const Optiscan = lazy(() => import('./pages/Optiscan'));
const AG = lazy(() => import('./pages/AG'));
const LifeTrack = lazy(() => import('./pages/LifeTrack'));


gsap.registerPlugin(ScrollTrigger);

/**
 * App - Main application shell with Lenis smooth scroll
 */
/**
 * `?intro=1` replays the intro even for returning visitors.
 * With HashRouter the query can land before the hash (`/?intro=1`) or after it
 * (`#/?intro=1`) — check both so it works however the URL was typed.
 */
const wantsIntro = (): boolean => {
  try {
    const { search, hash } = window.location;
    if (new URLSearchParams(search).has('intro')) return true;
    const hashQuery = hash.includes('?') ? hash.slice(hash.indexOf('?')) : '';
    if (new URLSearchParams(hashQuery).has('intro')) return true;
  } catch {
    return false;
  }
  return false;
};

/**
 * Did the user do a hard refresh (cache-bypassing reload)?
 *
 * A normal reload revalidates the document and gets a 304 back, so only the
 * response headers travel — `transferSize` stays below the body size. A hard
 * refresh skips the cache and refetches the document, so the whole body is
 * transferred and `transferSize` outgrows `encodedBodySize`.
 */
const isHardReload = (): boolean => {
  try {
    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (!nav || nav.type !== 'reload') return false;
    return nav.transferSize > (nav.encodedBodySize || 0);
  } catch {
    return false;
  }
};

function Portfolio() {
  const introSeen = (() => {
    try {
      if (wantsIntro()) return false;
      if (isHardReload()) return false;
      return localStorage.getItem('intro-seen') === 'true';
    } catch {
      return false;
    }
  })();

  const [isLoading, setIsLoading] = useState(true);
  // The site fades up behind the intro overlay — kept separate from
  // `isLoading` so the overlay can dissolve *over* the revealed content.
  const [contentReady, setContentReady] = useState(introSeen);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const scrollProgress = useScrollProgress();
  
  // Check prefers-reduced-motion and localStorage motion toggle
  useEffect(() => {
    const checkReducedMotion = () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const stored = localStorage.getItem('motion-enabled');
      const userDisabled = stored === 'false';
      const isReduced = prefersReduced || userDisabled;
      setReducedMotion(isReduced);
      
      if (isReduced) {
        setIsLoading(false);
        setContentReady(true);
      }
    };
    
    checkReducedMotion();
    
    const handleStorageChange = () => {
      checkReducedMotion();
    };
    window.addEventListener('storage', handleStorageChange);
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      checkReducedMotion();
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (reducedMotion) return;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false
    });
    
    lenisRef.current = lenis;
    
    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    
    // Connect Lenis to GSAP ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    
    // Disable lag smoothing for frame-accurate scroll
    gsap.ticker.lagSmoothing(0);
    
    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, [reducedMotion]);
  
  // Handle loading complete — stable identity so child effects don't restart on every App render
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);

    try {
      localStorage.setItem('intro-seen', 'true');
    } catch {}

    // Refresh ScrollTrigger after intro overlay exits
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
  }, []);

  // The site starts fading up behind the overlay, before it dissolves
  const handleContentReveal = useCallback(() => {
    setContentReady(true);
  }, []);

  // Refresh ScrollTrigger on layout changes (e.g., sidebar toggle)
  const refreshScrollTrigger = () => {
    ScrollTrigger.refresh();
  };
  
  // Expose refresh function to children via ref if needed
  useEffect(() => {
    if (contentRef.current) {
      (contentRef.current as any).refreshScrollTrigger = refreshScrollTrigger;
    }
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="skip-to-content"
      >
        Skip to content
      </a>

      {!reducedMotion && isLoading && !introSeen && (
        <CombIntro
          onReveal={handleContentReveal}
          onComplete={handleLoadingComplete}
        />
      )}

      <div
        className="content-area"
        data-loading={!contentReady}
      >
        <Navbar contentRef={contentRef} />

        <div className="global-scroll-progress" style={{ width: `${scrollProgress * 100}%` }} />

        <main
          ref={contentRef}
          id="main-content"
          className="main-content"
        >
          <Suspense fallback={<SectionSkeleton type="hero" />}>
            <ErrorBoundary fallback={<SectionError section="hero" />}>
              <Hero reducedMotion={reducedMotion} />
            </ErrorBoundary>
          </Suspense>
          <Suspense fallback={<SectionSkeleton type="about" />}>
            <ErrorBoundary fallback={<SectionError section="about" />}>
              <About reducedMotion={reducedMotion} />
            </ErrorBoundary>
          </Suspense>
          <Suspense fallback={<SectionSkeleton type="manifesto" />}>
            <ErrorBoundary fallback={<SectionError section="manifesto" />}>
              <Manifesto reducedMotion={reducedMotion} />
            </ErrorBoundary>
          </Suspense>
          <Suspense fallback={<SectionSkeleton type="projects" />}>
            <ErrorBoundary fallback={<SectionError section="projects" />}>
              <Projects reducedMotion={reducedMotion} />
            </ErrorBoundary>
          </Suspense>
          <Contact />
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route
          path="/astrov"
          element={
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <AstroV />
            </Suspense>
          }
        />
        <Route
          path="/optiscan"
          element={
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <Optiscan />
            </Suspense>
          }
        />
        <Route
          path="/ag"
          element={
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <AG />
            </Suspense>
          }
        />
        <Route
          path="/lifetrack"
          element={
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <LifeTrack />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
