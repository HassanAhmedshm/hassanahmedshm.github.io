import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import CustomCursor from "./CustomCursor";
import { useDeviceCapabilities } from "../../hooks/useDeviceCapabilities";
import { useScrollTriggerCleanup } from "../../hooks/useScrollTriggerCleanup";
import "./Projects.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "AstroV",
    brief: "Near-Earth asteroid tracking and impact simulation platform.",
    image: "/images/astrov_longg.png",
    link: "/astrov",
    metrics: ["2,000+ asteroids", "Real-time tracking", "3D visualization"],
  },
  {
    id: 2,
    title: "AG (Autonomous Agent)",
    brief: "Python-based autonomous agent for developer workflow automation.",
    image: "/images/astrov_long.png",
    link: "/ag",
    metrics: ["50x retry", "Multi-provider", "Local-first"],
  },
  {
    id: 3,
    title: "Optiscan AI",
    brief: "Mobile CV app for early ocular disease detection.",
    image: "/optiscan_logo.png",
    link: "/optiscan",
    metrics: ["93% accuracy", "3,400 images", "4 disease classes"],
  },
  {
    id: 4,
    title: "LifeTrack AI",
    brief: "Health dashboard with AI life coach and data visualization.",
    image: "/lifetrack.png",
    link: "/lifetrack",
    metrics: ["AI coaching", "Habit tracking", "Smart insights"],
  },
];

const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t;

interface ProjectsProps {
  reducedMotion?: boolean;
}

const Projects = ({ reducedMotion = false }: ProjectsProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const webglContainerRef = useRef<HTMLDivElement>(null);
  const mobileCardsRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [hoveredProject, setHoveredProject] = useState<any>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const { isMobile, recommendedParticleCount } = useDeviceCapabilities();
  const { registerInstance } = useScrollTriggerCleanup();
  const cardMicroRef = useRef<Map<number, gsap.core.Tween>>(new Map());

  const handleMobileCardEnter = (id: number, e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    if (cardMicroRef.current.has(id)) cardMicroRef.current.get(id)?.kill();
    const tl = gsap.to(card.querySelector('.mobile-card-arrow'), {
      x: 4,
      color: 'var(--accent-blue)',
      duration: 0.3,
      ease: 'back.out(1.7)',
      overwrite: 'auto',
    });
    cardMicroRef.current.set(id, tl);
  };

  const handleMobileCardLeave = (id: number, e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    if (cardMicroRef.current.has(id)) cardMicroRef.current.get(id)?.kill();
    const tl = gsap.to(card.querySelector('.mobile-card-arrow'), {
      x: 0,
      color: 'var(--text-tertiary)',
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    cardMicroRef.current.set(id, tl);
  };

  const handleMobileCardDown = (_id: number, e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    gsap.to(card, {
      scale: 0.97,
      duration: 0.1,
      ease: 'power2.in',
      overwrite: 'auto',
    });
  };

  const handleMobileCardUp = (_id: number, e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    gsap.to(card, {
      scale: 1,
      duration: 0.3,
      ease: 'back.out(2)',
      overwrite: 'auto',
    });
  };

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  // Mobile entrance animations - cards appear from alternating sides
  useEffect(() => {
    if (reducedMotion) return;
    // Only run on mobile
    if (!isMobile) return;
    if (!mobileCardsRef.current) return;

    const cards = mobileCardsRef.current.querySelectorAll('.mobile-card');
    if (cards.length === 0) return;

    const cardsArray = Array.from(cards);

    // Kill any existing ScrollTriggers for mobile cards
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger && cardsArray.includes(st.vars.trigger as Element)) {
        st.kill();
      }
    });

    cards.forEach((card, index) => {
      // Use viewport width for more dramatic slide-in
      const fromX = index % 2 === 0 ? '-100%' : '100%';

      gsap.from(card, {
        x: fromX,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger && cardsArray.includes(st.vars.trigger as Element)) {
          st.kill();
        }
      });
    };
  }, [isMobile, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    if (!isMobile || !sectionRef.current) return;

    const fadeStart = 0.72;
    const fadeTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const fadeProgress = self.progress <= fadeStart
          ? 0
          : (self.progress - fadeStart) / (1 - fadeStart);
        const clampedProgress = Math.min(1, fadeProgress);
        const opacity = 1 - clampedProgress * 0.9;
        gsap.set(sectionRef.current, { opacity });
      }
    });

    registerInstance(fadeTrigger);

    return () => {
      if (sectionRef.current) {
        gsap.set(sectionRef.current, { opacity: 1 });
      }
    };
  }, [isMobile, registerInstance]);

  // Desktop animations - W O R K letters and horizontal scroll
  useEffect(() => {
    if (reducedMotion) {
      if (cardsContainerRef.current) {
        gsap.set(cardsContainerRef.current, { opacity: 1 });
      }
      return;
    }

    // Only run on desktop
    if (isMobile) return;
    
    if (
      !sectionRef.current ||
      !cardsContainerRef.current ||
      !gridCanvasRef.current ||
      !textContainerRef.current ||
      !webglContainerRef.current
    )
      return;

    let isActive = true;
    let animationFrameId: number;
    let currentXPosition = 0;

    const moveDistance = window.innerWidth * 2;

    // 1. Grid Canvas Setup
    const gridCtx = gridCanvasRef.current.getContext("2d")!;
    const resizeGridCanvas = () => {
      if (!gridCanvasRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      gridCanvasRef.current.width = window.innerWidth * dpr;
      gridCanvasRef.current.height = window.innerHeight * dpr;
      gridCtx.scale(dpr, dpr);
    };
    resizeGridCanvas();

    const drawGrid = (scrollProgress = 0) => {
      if (!gridCanvasRef.current) return;

      gridCtx.clearRect(
        0,
        0,
        gridCanvasRef.current.width,
        gridCanvasRef.current.height,
      );
      const dotSize = 1;
      const spacing = 40;

      const rows = Math.ceil(window.innerHeight / spacing);
      const cols = Math.ceil(window.innerWidth / spacing) + 15;

      const offset = (scrollProgress * spacing * 10) % spacing;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const useAmber = (x + y + Math.floor(scrollProgress * 10)) % 3 === 0;
          gridCtx.fillStyle = useAmber ? '#FF7A00' : '#3b82f6';
          gridCtx.beginPath();
          gridCtx.arc(
            x * spacing - offset,
            y * spacing,
            dotSize,
            0,
            Math.PI * 2,
          );
          gridCtx.fill();
        }
      }
    };

    // 2. Three.js Letters Setup
    const lettersScene = new THREE.Scene();
    const lettersCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    lettersCamera.position.z = 20;

    const lettersRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    lettersRenderer.setSize(window.innerWidth, window.innerHeight);
    lettersRenderer.setClearColor(0x000000, 0);
    lettersRenderer.setPixelRatio(window.devicePixelRatio);
    webglContainerRef.current.appendChild(lettersRenderer.domElement);

    const createTextAnimationPath = (yPos: number, amplitude: number) => {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        points.push(
          new THREE.Vector3(
            -25 + 50 * t,
            yPos + Math.sin(t * Math.PI) * -amplitude,
            0,
          ),
        );
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
        new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.15 }),
      );
      (line as any).curve = curve;

      // Secondary line with amber offset
      const offsetPoints = points.map(p => new THREE.Vector3(p.x, p.y + 0.3, p.z));
      const offsetCurve = new THREE.CatmullRomCurve3(offsetPoints);
      const line2 = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(offsetCurve.getPoints(100)),
        new THREE.LineBasicMaterial({ color: 0xFF7A00, transparent: true, opacity: 0.08 }),
      );
      (line as any).secondaryLine = line2;

      return line;
    };

    const paths = [
      createTextAnimationPath(10, 2),
      createTextAnimationPath(3.5, 1),
      createTextAnimationPath(-3.5, -1),
      createTextAnimationPath(-10, -2),
    ];
    paths.forEach((line) => {
      lettersScene.add(line);
      if ((line as any).secondaryLine) {
        lettersScene.add((line as any).secondaryLine);
      }
    });

    const letters = ["W", "O", "R", "K"];
    const letterPositions = new Map();

    // Cap letter count based on device capabilities
    const lettersPerLine = Math.min(15, Math.max(4, Math.floor(recommendedParticleCount / 25)));

    textContainerRef.current.innerHTML = "";

    paths.forEach((line, i) => {
      const lineElements: HTMLDivElement[] = [];
      for (let j = 0; j < lettersPerLine; j++) {
        const el = document.createElement("div");
        el.className = "letter-3d";
        el.textContent = letters[i];

        // Calculate initial position immediately based on the path
        let tRaw = (j / 14) % 1;
        const point = line.curve.getPoint(tRaw);
        const vector = point.clone().project(lettersCamera);
        const initialX = (-vector.x * 0.5 + 0.5) * window.innerWidth;
        const initialY = (-vector.y * 0.5 + 0.5) * window.innerHeight;

        // Set transform BEFORE appending to DOM
        el.style.transform = `translate(-50%, -50%) translate3d(${initialX}px, ${initialY}px, 0px)`;

        textContainerRef.current!.appendChild(el);

        letterPositions.set(el, {
          current: { x: initialX, y: initialY },
          target: { x: initialX, y: initialY },
        });
        lineElements.push(el);
      }
      (line as any).letterElements = lineElements;
    });

    const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];

    const updateTargetPositions = (scrollProgress = 0) => {
      paths.forEach((line: any, lineIndex) => {
        line.letterElements.forEach((element: HTMLDivElement, i: number) => {
          let tRaw =
            (i / (lettersPerLine - 1) + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1;
          const t = tRaw < 0 ? tRaw + 1 : tRaw;
          const point = line.curve.getPoint(t);
          const vector = point.clone().project(lettersCamera);
          const positions = letterPositions.get(element);

          positions.target = {
            x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
            y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
          };
        });
      });
    };

    const updateLetterPositions = () => {
      letterPositions.forEach((positions, element) => {
        // Instant position update - no animation/lerp
        positions.current.x = positions.target.x;
        positions.current.y = positions.target.y;
        element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
      });
    };

    // Simple fade-in animation for containers
    requestAnimationFrame(() => {
      const targets = [
        gridCanvasRef.current,
        webglContainerRef.current,
      ].filter(Boolean);
      if (targets.length > 0) {
        gsap.fromTo(
          targets,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" }
        );
      }
    });

    // Main scroll trigger
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=400%",
      scrub: 1,
      onEnter: () => {
        // Fade in letters when section enters
        gsap.fromTo(
          textContainerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      },
      onUpdate: (self) => {
        updateTargetPositions(self.progress);
        drawGrid(self.progress);
        const targetX = -moveDistance * self.progress;
        currentXPosition = lerp(currentXPosition, targetX, 1);
        gsap.set(cardsContainerRef.current, { x: currentXPosition });

        // Fade scroll hint
        if (scrollHintRef.current) {
          const hintOpacity = Math.max(0, 1 - self.progress * 5);
          gsap.set(scrollHintRef.current, { opacity: hintOpacity });
        }

        // Update progress bar
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${self.progress * 100}%`;
        }
      },
    });

    registerInstance(st);

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const fadeOnVerticalTrigger = ScrollTrigger.create({
        trigger: contactSection,
        start: 'top bottom',
        end: 'top 30%',
        scrub: 1,
        onUpdate: (self) => {
          if (!sectionRef.current) return;
          const opacity = 1 - self.progress * 0.9;
          gsap.set(sectionRef.current, { opacity });
        }
      });
      registerInstance(fadeOnVerticalTrigger);
    }

    drawGrid(0);

    const renderLoop = () => {
      if (!isActive) return;

      if (st) {
        const targetX = -moveDistance * st.progress;
        currentXPosition = lerp(currentXPosition, targetX, 0.07);
        if (cardsContainerRef.current) {
          gsap.set(cardsContainerRef.current, { x: currentXPosition });

          const cards = cardsContainerRef.current.children;
          const centerX = window.innerWidth / 2;

          for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;

            const distance = (cardCenterX - centerX) / (window.innerWidth * 0.5);
            const curve = Math.sign(distance) * Math.pow(Math.abs(distance), 1.5);
            const clampedDistance = Math.max(-1.5, Math.min(1.5, curve));
            
            let rotateY;
            if (distance > 1.5) {
              rotateY = clampedDistance * -8;
            } else if (distance > 0.8) {
              rotateY = clampedDistance * -15;
            } else {
              rotateY = clampedDistance * -20;
            }
            
            const z = -Math.abs(clampedDistance) * 80;
            const scale = 1 + Math.max(0, 1 - Math.abs(distance)) * 0.08;

            // Lerp tilt toward target
            cardTiltCurrent.current.rx = lerp(cardTiltCurrent.current.rx, cardTiltTarget.current.rx, 0.08);
            cardTiltCurrent.current.ry = lerp(cardTiltCurrent.current.ry, cardTiltTarget.current.ry, 0.08);
            
            card.style.transform = `translateZ(${z}px) rotateY(${rotateY}deg) rotateX(${cardTiltCurrent.current.rx}deg) scale(${scale})`;
          }
        }
      }

      updateLetterPositions();
      lettersRenderer.render(lettersScene, lettersCamera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    const handleResize = () => {
      resizeGridCanvas();
      const progress = st ? st.progress : 0;
      drawGrid(progress);
      lettersCamera.aspect = window.innerWidth / window.innerHeight;
      lettersCamera.updateProjectionMatrix();
      lettersRenderer.setSize(window.innerWidth, window.innerHeight);
      updateTargetPositions(progress);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (sectionRef.current) {
        gsap.set(sectionRef.current, { opacity: 1 });
      }
      if (webglContainerRef.current && lettersRenderer.domElement.parentNode) {
        webglContainerRef.current.removeChild(lettersRenderer.domElement);
      }
      if (textContainerRef.current) {
        textContainerRef.current.innerHTML = '';
      }
      lettersRenderer.dispose();
      lettersScene.clear();
    };
  }, [isMobile, reducedMotion, registerInstance]);

  useEffect(() => {
    if (reducedMotion) return;
    if (isMobile) return;

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const projects = document.getElementById('projects');
        if (!projects) return;
        const rect = projects.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          window.scrollBy({
            top: e.key === 'ArrowRight' ? window.innerHeight * 0.1 : -window.innerHeight * 0.1,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('keydown', handleArrowKeys);
    return () => window.removeEventListener('keydown', handleArrowKeys);
  }, [isMobile]);

  const cardTiltTarget = useRef<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const cardTiltCurrent = useRef<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  // GSAP FLIP: animate cards into view on mount
  useEffect(() => {
    if (isMobile) return;
    if (!cardsContainerRef.current) return;

    const cards = cardsContainerRef.current.querySelectorAll('.showcase-card');
    const tl = gsap.timeline({ delay: 0.3 });

    cards.forEach((card, i) => {
      const flipState = {
        x: -100 + (i * 30),
        y: 50 - (i * 20),
        opacity: 0,
        scale: 0.85,
        rotation: -3 + (i * 2),
      };

      gsap.set(card, flipState);

      tl.to(card, {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.7,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
      }, i * 0.12);
    });

    return () => {
      tl.kill();
    };
  }, [isMobile]);

  const handleMouseEnter = (project: any) => {
    if (isMobile) return;
    setHoveredProject(project);
    document.body.style.cursor = "none";

    // Animate border and shadow with spring-like GSAP
    const card = document.querySelector(`.showcase-card[data-project-id="${project.id}"]`) as HTMLElement;
    if (!card) return;
    gsap.to(card, {
      borderColor: 'var(--accent-blue)',
      boxShadow: '0 0 30px rgba(59, 130, 246, 0.2), 0 15px 40px rgba(0, 0, 0, 0.6)',
      duration: 0.4,
      ease: 'back.out(1.7)',
      overwrite: 'auto',
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !hoveredProject) return;
    setCursorPos({ x: e.clientX, y: e.clientY });

    // Card tilt effect - store in ref for render loop to apply
    const card = (e.currentTarget as HTMLElement).closest('.showcase-card') as HTMLElement;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardTiltTarget.current = { rx: -y * 8, ry: x * 8 };
  };

  const handleMouseLeave = () => {
    setHoveredProject(null);
    document.body.style.cursor = "auto";
    cardTiltTarget.current = { rx: 0, ry: 0 };

    // Reset card border/shadow with spring
    const cards = document.querySelectorAll('.showcase-card');
    gsap.to(cards, {
      borderColor: 'var(--border)',
      boxShadow: 'none',
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleClick = (e: React.MouseEvent, link: string) => {
    if (link === "#wip") {
      e.preventDefault();
      return;
    }
    if (link.startsWith("/")) {
      e.preventDefault();
      // FLIP-out animation before navigating
      const card = (e.currentTarget as HTMLElement).closest('.showcase-card') as HTMLElement;
      if (card) {
        gsap.to(card, {
          scale: 0.95,
          opacity: 0.5,
          duration: 0.15,
          ease: 'power2.in',
          onComplete: () => {
            window.location.hash = link;
          },
        });
      } else {
        window.location.hash = link;
      }
    }
  };

  // Add data-project-id to cards for micro-interaction targeting
  useEffect(() => {
    if (isMobile || !cardsContainerRef.current) return;
    const cards = cardsContainerRef.current.querySelectorAll('.showcase-card');
    cards.forEach((card, i) => {
      card.setAttribute('data-project-id', String(i + 1));
    });
  }, [isMobile]);

  if (isMobile) {
    return (
      <section className="projects mobile-projects" id="projects" ref={sectionRef}>
        <div className="projects-header">
          <div className="projects-label">What I've Built</div>
          <h2 className="projects-title">Selected Works</h2>
          <p className="projects-subtitle">Each project solves a real problem — tap to explore</p>
        </div>
        <div className="mobile-cards" ref={mobileCardsRef}>
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="mobile-card"
              style={{ '--card-index': index } as React.CSSProperties}
              onClick={(e) => handleClick(e, project.link)}
              onMouseEnter={(e) => handleMobileCardEnter(project.id, e)}
              onMouseLeave={(e) => handleMobileCardLeave(project.id, e)}
              onMouseDown={(e) => handleMobileCardDown(project.id, e)}
              onMouseUp={(e) => handleMobileCardUp(project.id, e)}
              onTouchStart={() => {}}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(e as any, project.link);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View project: ${project.title}`}
            >
              <div className="mobile-card-visual">
                {failedImages.has(project.id) ? (
                  <div className="mobile-card-fallback">
                    <span className="mobile-card-fallback-icon">{project.title[0]}</span>
                  </div>
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    onError={() => setFailedImages(prev => new Set(prev).add(project.id))}
                  />
                )}
                <div className="mobile-card-accent" />
              </div>
              <div className="mobile-card-body">
                <div className="mobile-card-header">
                  <span className="mobile-card-number">0{project.id}</span>
                  <h3 className="mobile-card-title">{project.title}</h3>
                </div>
                <p className="mobile-card-brief">{project.brief}</p>
                <div className="mobile-card-footer">
                  <div className="mobile-card-metrics">
                    {project.metrics.map((metric, i) => (
                      <span key={i} className="mobile-card-metric">{metric}</span>
                    ))}
                  </div>
                  <span className="mobile-card-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="showcase-work" id="projects" ref={sectionRef}>
      <canvas id="grid-canvas" ref={gridCanvasRef} aria-hidden="true" />
      <div
        id="webgl-container"
        ref={webglContainerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: "none",
          width: "100%",
          height: "100%",
        }}
      />
      <div className="text-container" ref={textContainerRef} />

      <div className="cards-wrapper">
        <div className="cards-container" ref={cardsContainerRef}>
          {projects.map((project) => (
            <div
              key={project.id}
              className="showcase-card"
              onClick={(e) => handleClick(e, project.link)}
              onMouseEnter={() => handleMouseEnter(project)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(e as any, project.link);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View project: ${project.title} — ${project.brief}`}
            >
              <div className="card-content">
                <div className="card-img">
                  {failedImages.has(project.id) ? (
                    <div className="card-img-fallback" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
                      <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{project.title}</span>
                    </div>
                  ) : (
                    <img src={project.image} alt={project.title} className="contents" onError={() => setFailedImages(prev => new Set(prev).add(project.id))} />
                  )}
                </div>
                <div className="card-info">
                  <h3 className="card-title">{project.title}</h3>
                  <p className="card-brief">{project.brief}</p>
                  <div className="card-metrics">
                    {project.metrics.map((metric, i) => (
                      <span key={i} className="card-metric">{metric}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hoveredProject && (
        <CustomCursor project={hoveredProject} position={cursorPos} />
      )}

      {/* Horizontal scroll progress bar */}
      <div className="scroll-progress">
        <div
          className="scroll-progress-bar"
          ref={progressBarRef}
          style={{ width: '0%' }}
        />
      </div>
    </section>
  );
};

export default Projects;
