import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Manifesto from './components/Manifesto/Manifesto';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import './styles/index.css';

// Lazy load AstroV page for code splitting (Requirements 8.1, 8.2)
const AstroV = lazy(() => import('./pages/AstroV'));

gsap.registerPlugin(ScrollTrigger);

/**
 * App - Main application shell with Lenis smooth scroll
 */
function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  
  // Check prefers-reduced-motion on mount
  useEffect(() => {
    const checkReducedMotion = () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setReducedMotion(prefersReduced);
      
      if (prefersReduced) {
        setIsLoading(false);
        setContentVisible(true);
      }
    };
    
    checkReducedMotion();
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      const prefersReduced = e.matches;
      setReducedMotion(prefersReduced);
      if (prefersReduced && isLoading) {
        setIsLoading(false);
        setContentVisible(true);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    // Disable lag smoothing for frame-accurate scroll
    gsap.ticker.lagSmoothing(0);
    
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [reducedMotion]);
  
  // Handle loading complete
  const handleLoadingComplete = () => {
    setIsLoading(false);
    
    // Enable content visibility with fade-in
    setTimeout(() => {
      setContentVisible(true);
      
      // Refresh ScrollTrigger after content becomes visible
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, 50);
  };
  
  // Refresh ScrollTrigger on layout changes (e.g., sidebar toggle)
  const refreshScrollTrigger = () => {
    ScrollTrigger.refresh();
  };
  
  // Expose refresh function to children via ref if needed
  useEffect(() => {
    if (contentRef.current) {
      (contentRef.current as any).refreshScrollTrigger = refreshScrollTrigger;
    }
  }, [contentVisible]);

  return (
    <>
      {/* Sidebar - must be outside the push wrapper */}
      {contentVisible && <Navbar contentRef={contentRef} sidebarOnly />}
      
      {/* Push wrapper - this entire container gets scaled/pushed */}
      <div className="push-wrapper">
        {/* Loading Screen - only show if not reduced motion */}
        {!reducedMotion && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
        
        {/* Navigation - inside push wrapper so it transforms with content */}
        {contentVisible && <Navbar contentRef={contentRef} />}
        
        {/* Main content with opacity transition */}
        <main 
          ref={contentRef}
          className="main-content"
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: reducedMotion ? 'none' : 'opacity 0.6s ease'
          }}
        >
          <Hero />
          <Manifesto />
          <About />
          <Projects />
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
      </Routes>
    </Router>
  );
}

export default App;