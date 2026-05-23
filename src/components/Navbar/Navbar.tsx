import { useRef, useState, useEffect, useCallback, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IsometricH } from '../Logo/StylizedH';
import './Navbar.css';

// Lazy load the games
const FlappyGame = lazy(() => import('../SidebarGame/FlappyGame'));
const SnakeGame = lazy(() => import('../SidebarGame/SnakeGame'));
const ReactionGame = lazy(() => import('../SidebarGame/ReactionGame'));

gsap.registerPlugin(ScrollTrigger);

// Dev quotes for terminal
const devQuotes = [
  "Code is poetry written in logic.",
  "First, solve the problem. Then, write the code.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "The best error message is the one that never shows up.",
  "Clean code always looks like it was written by someone who cares.",
  "Programs must be written for people to read.",
  "Talk is cheap. Show me the code.",
  "Any fool can write code that a computer can understand.",
  "Debugging is twice as hard as writing the code.",
];

// Inline SVG icons
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

/**
 * Navbar - Simple top navigation with push sidebar
 * When sidebarOnly=true, only renders the sidebar (for placement outside push wrapper)
 */
const Navbar = ({ contentRef, sidebarOnly = false }) => {
  const navbarRef = useRef(null);
  const sidebarRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [currentQuote, setCurrentQuote] = useState(devQuotes[0]);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showArcadeHint, setShowArcadeHint] = useState(false);

  // Typing effect for quotes
  useEffect(() => {
    if (!menuOpen) return;
    
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);
    
    const typeInterval = setInterval(() => {
      if (charIndex < currentQuote.length) {
        setDisplayedText(currentQuote.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 40);
    
    return () => clearInterval(typeInterval);
  }, [currentQuote, menuOpen]);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    if (!menuOpen) return;
    
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => {
        const currentIndex = devQuotes.indexOf(prev);
        return devQuotes[(currentIndex + 1) % devQuotes.length];
      });
    }, 8000);
    
    return () => clearInterval(quoteInterval);
  }, [menuOpen]);

  // Sync menuOpen state across instances via body class
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isOpen = document.body.classList.contains('sidebar-open');
      if (isOpen !== menuOpen) {
        setMenuOpen(isOpen);
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [menuOpen]);

  // Toggle body class for push effect with scroll position preservation
  const toggleSidebar = useCallback((open: boolean) => {
    setMenuOpen(open);
    if (open) {
      // Save scroll position before locking
      const scrollY = window.scrollY;
      document.documentElement.style.setProperty('--scroll-position', `-${scrollY}px`);
      document.body.style.top = `-${scrollY}px`;
      document.body.classList.add('sidebar-open');
      document.documentElement.classList.add('sidebar-open');
      
      // Set scroll position on push-wrapper for minimized preview
      const pushWrapper = document.querySelector('.push-wrapper') as HTMLElement;
      if (pushWrapper) {
        pushWrapper.scrollTop = scrollY;
      }
      
      setTimeout(() => ScrollTrigger.refresh(), 350);
    } else {
      // Restore scroll position after unlocking
      const scrollY = document.body.style.top;
      document.body.classList.remove('sidebar-open');
      document.documentElement.classList.remove('sidebar-open');
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      setTimeout(() => ScrollTrigger.refresh(), 350);
    }
  }, []);

  // Track scroll for backdrop blur
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Setup ScrollTrigger for active section tracking
  useEffect(() => {
    // Track active section
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id)
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [contentRef]);

  const scrollTo = (id) => {
    // Close sidebar first, which restores scroll position
    toggleSidebar(false);
    // Wait for scroll position to be restored, then scroll to section
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        toggleSidebar(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [menuOpen, toggleSidebar]);

  // Show arcade hint when user scrolls to bottom
  useEffect(() => {
    if (menuOpen) return; // Don't show if sidebar is already open
    
    const handleScroll = () => {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (scrolledToBottom && !showArcadeHint) {
        setShowArcadeHint(true);
        // Auto-hide after 5 seconds
        setTimeout(() => setShowArcadeHint(false), 5000);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen, showArcadeHint]);

  // If sidebarOnly, only render the sidebar and overlay
  if (sidebarOnly) {
    return (
      <>
        {/* Game arcade - positioned in empty space above content */}
        <div className={`sidebar-game-area ${menuOpen ? 'visible' : ''}`}>
          <div className="arcade-header">
            <span className="arcade-title">🕹️ Mini Arcade</span>
            <span className="arcade-subtitle">Take a break!</span>
          </div>
          <div className="arcade-games">
            <Suspense fallback={<div className="game-loading">Loading...</div>}>
              {menuOpen && (
                <>
                  <FlappyGame />
                  <SnakeGame />
                  <ReactionGame />
                </>
              )}
            </Suspense>
          </div>
        </div>

        {/* Push Sidebar */}
        <aside 
          ref={sidebarRef}
          className={`toc-sidebar ${menuOpen ? 'open' : ''}`}
          aria-hidden={!menuOpen}
        >
          {/* Logo + Terminal Quote */}
          <div className="toc-sidebar-easter">
            <div className="rotating-logo-container">
              <div className="rotating-logo">
                <IsometricH size={48} className="text-blue-400" />
              </div>
            </div>
            <div className="terminal-quote">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="terminal-dot"></span>
                  <span className="terminal-dot"></span>
                  <span className="terminal-dot"></span>
                </div>
                <span className="terminal-title">quote.sh</span>
              </div>
              <div className="terminal-content">
                <span className="terminal-prefix">$ </span>
                <span className="terminal-text">{displayedText}</span>
                <span className="terminal-cursor"></span>
              </div>
            </div>
          </div>
          <p className="toc-sidebar-tagline">full stack developer</p>

          <div className="toc-sidebar-header">
            <span className="toc-sidebar-title">Navigation</span>
            <button 
              className="toc-sidebar-close" 
              onClick={() => toggleSidebar(false)}
              aria-label="Close navigation"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="toc-sidebar-nav">
            {sections.map(({ id, label }) => (
              <button 
                key={id} 
                className={`toc-link ${activeSection === id ? 'active' : ''}`}
                onClick={() => scrollTo(id)}
              >
                <span className="toc-link-indicator"></span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for closing sidebar on click outside */}
        {menuOpen && (
          <div 
            className="sidebar-overlay" 
            onClick={() => toggleSidebar(false)}
            aria-hidden="true"
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* Top Navbar */}
      <nav 
        ref={navbarRef} 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      >
        <div className="navbar-container">
          <button className="navbar-logo" onClick={() => scrollTo('hero')}>
            <IsometricH size={56} className="text-blue-400" />
          </button>
          <div className="navbar-center">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="navbar-social">
              <GitHubIcon />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="navbar-social">
              <LinkedInIcon />
            </a>
          </div>
          <div className="navbar-right">
            <button className="navbar-contact" onClick={() => scrollTo('contact')}>
              Contact
            </button>
            <div className="navbar-menu-wrapper">
              <button 
                className="navbar-menu" 
                onClick={() => {
                  toggleSidebar(!menuOpen);
                  setShowArcadeHint(false);
                }}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                ☰
              </button>
              {showArcadeHint && (
                <div className="arcade-hint">
                  <span>🕹️ Psst... there's an arcade in here!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;