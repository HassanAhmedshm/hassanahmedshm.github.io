import {
  useState,
  useEffect,
  useCallback,
  useRef,
  lazy,
  Suspense,
  type RefObject,
} from "react"; 
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { IsometricH } from "../Logo/StylizedH";
import useScrollDirection from "../../hooks/useScrollDirection";
import ThemeToggle from "../Theme/ThemeToggle";
import { useButtonMicroInteraction } from "../../hooks/useButtonMicroInteraction";
import "./Navbar.css";

const FlappyGame = lazy(() => import("../SidebarGame/FlappyGame"));
const SnakeGame = lazy(() => import("../SidebarGame/SnakeGame"));
const ReactionGame = lazy(() => import("../SidebarGame/ReactionGame"));

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

const GitHubIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="GitHub"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="LinkedIn"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "manifesto", label: "Manifesto" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

type NavbarProps = {
  contentRef?: RefObject<HTMLElement | null>;
};

const Navbar = ({ contentRef }: NavbarProps) => {
  const lockedScrollYRef = useRef(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const microButton = useButtonMicroInteraction();
  const microContact = useButtonMicroInteraction();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [currentQuote, setCurrentQuote] = useState(devQuotes[0]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollDirection = useScrollDirection();
  const shouldHideNavbar =
    scrollDirection === "down" && !menuOpen && !isAtBottom;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    let charIndex = 0;
    setDisplayedText("");
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

  useEffect(() => {
    if (!menuOpen) return;

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => {
        const currentIndex = devQuotes.indexOf(prev);
        return devQuotes[(currentIndex + 1) % devQuotes.length];
      });
    }, 8000);

    return () => clearInterval(quoteInterval);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const overlay = overlayRef.current;
    if (!overlay) return;
    const isMobile = window.innerWidth <= 767;

    const tocLinks = overlay.querySelectorAll<HTMLElement>('.toc-link');
    const firstTocLink = tocLinks[0];
    const focusableElements = overlay.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const allFocusable = Array.from(focusableElements);

    const firstFocusable = isMobile ? (firstTocLink || allFocusable[0]) : (firstTocLink || allFocusable[0]);
    const lastFocusable = allFocusable[allFocusable.length - 1];

    setTimeout(() => firstFocusable?.focus(), 50);

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    };

    overlay.addEventListener('keydown', handleTabKey);

    return () => {
      overlay.removeEventListener('keydown', handleTabKey);
      hamburgerRef.current?.focus();
    };
  }, [menuOpen]);

  const toggleSidebar = useCallback((open: boolean) => {
    setMenuOpen(open);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsAtBottom(
        Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.scrollHeight - 100
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    let raf = 0;
    let mounted = true;

    // The four lazy-loaded sections (Hero/About/Manifesto/Projects) aren't in
    // the DOM on the first commit. Keep retrying via rAF until every section
    // is mounted, then wire the triggers. Without this only Contact's trigger
    // ever gets created and "Contact" ends up permanently highlighted.
    const setup = () => {
      if (!mounted) return;
      const missing = sections.some(({ id }) => !document.getElementById(id));
      if (missing) {
        raf = requestAnimationFrame(setup);
        return;
      }
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        // When a section is pinned by another ScrollTrigger (e.g. Manifesto),
        // GSAP wraps it in a `.pin-spacer`. Using the section as the trigger
        // would lock its viewport top to 0 during the pin, so "top center"
        // never fires. Use the pin-spacer (which still scrolls naturally) as
        // the trigger instead.
        const triggerEl = el.parentElement?.classList.contains('pin-spacer')
          ? el.parentElement
          : el;
        const trigger = ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        });
        triggers.push(trigger);
      });
    };

    setup();

    return () => {
      mounted = false;
      if (raf) cancelAnimationFrame(raf);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [contentRef]);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      setMenuOpen(false);
      return;
    }

    const animateScroll = () => {
      gsap.to(window, {
        duration: 1,
        ease: "power2.inOut",
        scrollTo: {
          y: target,
          autoKill: false,
        },
      });
    };

    if (menuOpen) {
      setMenuOpen(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          animateScroll();
        });
      });
      return;
    }

    animateScroll();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        toggleSidebar(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, toggleSidebar]);

  useEffect(() => {
    const unlockScroll = () => {
      const lockedTop = document.body.style.top;
      const restoreY = lockedTop
        ? parseInt(lockedTop, 10) * -1
        : lockedScrollYRef.current;

      document.documentElement.classList.remove("command-center-open");
      document.body.classList.remove("command-center-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, restoreY);
    };

    if (menuOpen) {
      lockedScrollYRef.current = window.scrollY;
      document.documentElement.classList.add("command-center-open");
      document.body.classList.add("command-center-open");
      document.body.style.position = "fixed";
      document.body.style.top = `-${lockedScrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      return;
    }

    if (document.body.classList.contains("command-center-open")) {
      unlockScroll();
    }

    return () => {
      if (document.body.classList.contains("command-center-open")) {
        unlockScroll();
      }
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`navbar fixed top-0 w-full z-50 transition-transform duration-300 ease-in-out ${
          shouldHideNavbar ? "-translate-y-full" : "translate-y-0"
        } ${isScrolled ? "scrolled" : ""} ${!mounted ? "navbar-invisible" : ""}`}
        aria-label="Main navigation"
      >
        <div className="navbar-container">
          <button className="navbar-logo" onClick={() => scrollTo("hero")}>
            <IsometricH size={80} className="text-blue-400" />
          </button>
          <div className="navbar-center">
            <a
              href="https://github.com/HassanAhmedshm"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-social"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/hassan-ahmed-shm/"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-social"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://drive.google.com/file/d/1ynx2KU9vZnzFneyujUu6o50EVEJ2reeO/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-social"
              aria-label="CV"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </a>
          </div>
          <div className="navbar-right">
            <ThemeToggle />
            <button
              className="navbar-contact"
              onClick={() => scrollTo("contact")}
              {...microContact}
            >
              Contact
            </button>
            <div className="navbar-menu-wrapper">
              <button
                ref={hamburgerRef}
                className="navbar-menu"
                onClick={() => {
                  toggleSidebar(!menuOpen);
                }}
                aria-expanded={menuOpen}
                {...microButton}
              >
                <span className="hamburger-icon" aria-hidden="true">☰</span>
                <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        ref={overlayRef}
        className={`command-center-overlay ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
        role={menuOpen ? "dialog" : undefined}
        aria-modal={menuOpen ? "true" : undefined}
        aria-label="Command center navigation"
        onClick={() => toggleSidebar(false)}
      >
        <div
          className="command-center-shell"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="command-center-grid">
            <div className="command-center-arcade">
              <div className="arcade-header">
                <span className="arcade-title">Arcade</span>
                <span className="arcade-subtitle">Pick a game</span>
              </div>
              <div className="arcade-games">
                <Suspense fallback={<div className="game-loading">Loading...</div>}>
                  <FlappyGame />
                </Suspense>
                <Suspense fallback={<div className="game-loading">Loading...</div>}>
                  <SnakeGame />
                </Suspense>
                <Suspense fallback={<div className="game-loading">Loading...</div>}>
                  <ReactionGame />
                </Suspense>
              </div>
            </div>
            <aside className="toc-sidebar">
              <div className="toc-sidebar-easter">
                <div className="rotating-logo-container" aria-hidden="true">
                  <div className="rotating-logo">
                    <IsometricH size={48} className="text-blue-400" />
                  </div>
                </div>
                <div className="terminal-quote">
                  <div className="terminal-header">
                    <div className="terminal-dots">
                      <span className="terminal-dot" />
                      <span className="terminal-dot" />
                      <span className="terminal-dot" />
                    </div>
                    <span className="terminal-title">quote.sh</span>
                  </div>
                  <div className="terminal-content" aria-live="polite" aria-atomic="true">
                    <span className="terminal-prefix">$ </span>
                    <span className="terminal-text">{displayedText}</span>
                    {isTyping && <span className="terminal-cursor" />}
                  </div>
                </div>
              </div>
              <p className="toc-sidebar-tagline">full stack developer</p>

              <div className="toc-sidebar-header">
                <span className="toc-sidebar-title">Navigation</span>
                <div className="toc-sidebar-actions">
                   <ThemeToggle />
                  <button
                    className="toc-sidebar-close"
                    onClick={() => toggleSidebar(false)}
                    aria-label="Close navigation"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
              <nav className="toc-sidebar-nav">
                {sections.map(({ id, label }) => (
                  <button
                    key={id}
                    className={`toc-link ${activeSection === id ? "active" : ""}`}
                    aria-current={activeSection === id ? "true" : undefined}
                    onClick={() => scrollTo(id)}
                  >
                    <span className="toc-link-indicator" />
                    {label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        </div>
      </div>


    </>
  );
};

export default Navbar;
