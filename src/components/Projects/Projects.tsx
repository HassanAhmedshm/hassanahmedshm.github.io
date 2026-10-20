import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomCursor from "./CustomCursor";
import { useDeviceCapabilities } from "../../hooks/useDeviceCapabilities";
import { useScrollTriggerCleanup } from "../../hooks/useScrollTriggerCleanup";
import "./Projects.css";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  brief: string;
  image: string;
  fit?: "cover" | "contain";
  scrim?: boolean;
  link: string;
  metrics: string[];
}

const projects: Project[] = [
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
    image: "/ag-cover.png",
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
    image: "/lifetrack-logo.svg",
    fit: "contain",
    scrim: false,
    link: "/lifetrack",
    metrics: ["AI coaching", "Habit tracking", "Smart insights"],
  },
];

const lerp = (start: number, end: number, t: number): number =>
  start + (end - start) * t;

interface ProjectsProps {
  reducedMotion?: boolean;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface LetterState {
  el: HTMLDivElement;
  lineIndex: number;
  index: number;
  currentX: number;
  currentY: number;
  currentScale: number;
  targetX: number;
  targetY: number;
  targetScale: number;
  ready: boolean;
}

const LETTERS_PER_LINE = 12;
const LINE_SPEED_MULTIPLIERS = [0.8, 1, 0.7, 0.9] as const;
const LETTER_LABELS = ["W", "O", "R", "K"] as const;
const CAMERA_Z = 20;
const CAMERA_FOV_DEG = 50;

/** Sample a point on the letter path (same geometry as the reference demo). */
const pathPoint = (t: number, yPos: number, amplitude: number): Vec3 => {
  // Clamp/wrap t into [0, 1]
  let u = t % 1;
  if (u < 0) u += 1;
  return {
    x: -25 + 50 * u,
    y: yPos + Math.sin(u * Math.PI) * -amplitude,
    z: (1 - Math.pow(Math.abs(u - 0.5) * 2, 2)) * -5,
  };
};

/**
 * Perspective project world → screen (matches THREE.PerspectiveCamera fov=50 at z=20).
 * X is flipped like the reference so letters stream right→left as scroll advances.
 */
const projectToScreen = (
  p: Vec3,
  width: number,
  height: number,
): { x: number; y: number; scale: number } => {
  const depth = CAMERA_Z - p.z;
  if (depth <= 0.01) {
    return { x: width / 2, y: height / 2, scale: 0.3 };
  }
  const fl = height / 2 / Math.tan((CAMERA_FOV_DEG * Math.PI) / 360);
  // X flipped (reference): world -X → screen right
  const x = width / 2 - (p.x * fl) / depth;
  const y = height / 2 - (p.y * fl) / depth;
  const scale = Math.min(1.1, Math.max(0.5, CAMERA_Z / depth));
  return { x, y, scale };
};

const ROW_CONFIG = [
  { yPos: 7.6, amplitude: 2 },
  { yPos: 2.6, amplitude: 1 },
  { yPos: -2.6, amplitude: -1 },
  { yPos: -7.6, amplitude: -2 },
] as const;

const Projects = ({ reducedMotion = false }: ProjectsProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const mobileCardsRef = useRef<HTMLDivElement>(null);

  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  // Pointer position lives in a ref: mouse movement must not re-render the
  // pinned section (it owns a rAF loop and a ScrollTrigger).
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const { isMobile } = useDeviceCapabilities();
  const { registerInstance } = useScrollTriggerCleanup();

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  // Mobile entrance animations
  useEffect(() => {
    if (reducedMotion || !isMobile || !mobileCardsRef.current) return;
    const cards = Array.from(
      mobileCardsRef.current.querySelectorAll<HTMLElement>(".mobile-card"),
    );
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
      const fromX = index % 2 === 0 ? "-100%" : "100%";
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

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger && cards.includes(st.vars.trigger as HTMLElement)) {
          st.kill();
        }
      });
    };
  }, [isMobile, reducedMotion]);

  // Desktop showcase: letters + horizontal cards (no Three.js — pure math projection)
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    if (
      !sectionRef.current ||
      !cardsContainerRef.current ||
      !gridCanvasRef.current ||
      !textContainerRef.current
    ) {
      return;
    }

    let isActive = true;
    let animationFrameId = 0;
    let currentXPosition = 0;
    let moveDistance = window.innerWidth * 2.5;
    let scrollProgress = 0;

    const gridCanvas = gridCanvasRef.current;
    const gridCtx = gridCanvas.getContext("2d");
    if (!gridCtx) return;

    const textContainer = textContainerRef.current;
    textContainer.innerHTML = "";

    // --- Dot grid ---
    const resizeGridCanvas = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      gridCanvas.width = w * dpr;
      gridCanvas.height = h * dpr;
      gridCanvas.style.width = `${w}px`;
      gridCanvas.style.height = `${h}px`;
      gridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeGridCanvas();

    const drawGrid = (progress = 0): void => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      gridCtx.fillStyle = "#0a0a0a";
      gridCtx.fillRect(0, 0, w, h);
      gridCtx.fillStyle = "rgba(47, 128, 196, 0.45)";
      const spacing = 30;
      const rows = Math.ceil(h / spacing) + 1;
      const cols = Math.ceil(w / spacing) + 15;
      const offset = (progress * spacing * 10) % spacing;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          gridCtx.beginPath();
          gridCtx.arc(x * spacing - offset, y * spacing, 1, 0, Math.PI * 2);
          gridCtx.fill();
        }
      }
    };

    // --- Letters: create DOM nodes with positions already applied (no top-left flash) ---
    const letters: LetterState[] = [];
    const vw0 = window.innerWidth;
    const vh0 = window.innerHeight;

    ROW_CONFIG.forEach((row, lineIndex) => {
      for (let i = 0; i < LETTERS_PER_LINE; i++) {
        const t = i / (LETTERS_PER_LINE - 1);
        const world = pathPoint(t, row.yPos, row.amplitude);
        const screen = projectToScreen(world, vw0, vh0);

        const el = document.createElement("div");
        el.className = "letter-3d";
        el.textContent = LETTER_LABELS[lineIndex];
        el.setAttribute("aria-hidden", "true");
        // Position BEFORE insert so nothing paints at (0,0)
        el.style.transform = `translate3d(${screen.x}px, ${screen.y}px, 0) translate(-50%, -50%) scale(${screen.scale})`;
        el.style.opacity = "0.75";
        textContainer.appendChild(el);

        letters.push({
          el,
          lineIndex,
          index: i,
          currentX: screen.x,
          currentY: screen.y,
          currentScale: screen.scale,
          targetX: screen.x,
          targetY: screen.y,
          targetScale: screen.scale,
          ready: true,
        });
      }
    });

    const updateLetterTargets = (progress: number): void => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (const letter of letters) {
        const row = ROW_CONFIG[letter.lineIndex];
        const t =
          (letter.index / (LETTERS_PER_LINE - 1) +
            progress * LINE_SPEED_MULTIPLIERS[letter.lineIndex]) %
          1;
        const world = pathPoint(t, row.yPos, row.amplitude);
        const screen = projectToScreen(world, w, h);
        letter.targetX = screen.x;
        letter.targetY = screen.y;
        letter.targetScale = screen.scale;
      }
    };

    const updateLetterElements = (): void => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const fade = Math.min(200, w * 0.13);
      const baseOp = 0.75;

      for (const letter of letters) {
        const dx = letter.targetX - letter.currentX;
        // Snap on wrap-around so letters don't slide across the whole screen
        if (Math.abs(dx) > w * 0.5) {
          letter.currentX = letter.targetX;
          letter.currentY = letter.targetY;
          letter.currentScale = letter.targetScale;
        } else {
          letter.currentX = lerp(letter.currentX, letter.targetX, 0.12);
          letter.currentY = lerp(letter.currentY, letter.targetY, 0.12);
          letter.currentScale = lerp(
            letter.currentScale,
            letter.targetScale,
            0.12,
          );
        }

        let op = baseOp;
        if (letter.currentX < fade) op *= Math.max(0, letter.currentX / fade);
        else if (letter.currentX > w - fade)
          op *= Math.max(0, (w - letter.currentX) / fade);
        if (letter.currentY < fade * 0.5)
          op *= Math.max(0, letter.currentY / (fade * 0.5));
        else if (letter.currentY > h - fade * 0.5)
          op *= Math.max(0, (h - letter.currentY) / (fade * 0.5));

        const off =
          letter.currentX < -200 ||
          letter.currentX > w + 200 ||
          letter.currentY < -200 ||
          letter.currentY > h + 200;

        letter.el.style.opacity = off ? "0" : String(op);
        letter.el.style.transform = `translate3d(${letter.currentX}px, ${letter.currentY}px, 0) translate(-50%, -50%) scale(${letter.currentScale})`;
      }
    };

    // --- Cards ---
    const measureMoveDistance = (): number => {
      const container = cardsContainerRef.current;
      if (!container) return window.innerWidth * 2.5;
      const cards = container.querySelectorAll<HTMLElement>(".showcase-card");
      const last = cards[cards.length - 1];
      if (!last) return window.innerWidth * 2.5;
      gsap.set(container, { x: 0 });
      const rect = last.getBoundingClientRect();
      const dist = rect.left + rect.width / 2 - window.innerWidth / 2;
      gsap.set(container, { x: -dist * scrollProgress });
      return Math.max(dist, window.innerWidth * 1.5);
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=600%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress = self.progress;
        updateLetterTargets(self.progress);
        drawGrid(self.progress);
      },
    });
    registerInstance(st);

    requestAnimationFrame(() => {
      if (!isActive) return;
      moveDistance = measureMoveDistance();
      ScrollTrigger.refresh();
    });

    const updateCards = (): void => {
      const targetX = -moveDistance * scrollProgress;
      currentXPosition = lerp(currentXPosition, targetX, 0.1);
      if (!cardsContainerRef.current) return;
      gsap.set(cardsContainerRef.current, { x: currentXPosition });

      const cards =
        cardsContainerRef.current.querySelectorAll<HTMLElement>(".showcase-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distNorm =
          (cardCenter - window.innerWidth / 2) / (window.innerWidth / 2);
        const clamped = Math.max(-1.2, Math.min(1.2, distNorm));
        card.style.transform = `rotateY(${-clamped * 8}deg) translateZ(${-Math.abs(clamped) * 40}px)`;
        card.style.transformStyle = "preserve-3d";
      });
    };

    const animate = (): void => {
      if (!isActive) return;
      // Keep targets in sync even if ScrollTrigger onUpdate is quiet
      updateLetterTargets(scrollProgress);
      updateLetterElements();
      updateCards();
      animationFrameId = requestAnimationFrame(animate);
    };

    drawGrid(0);
    updateLetterTargets(0);
    updateLetterElements();
    animate();

    const handleResize = (): void => {
      resizeGridCanvas();
      drawGrid(scrollProgress);
      moveDistance = measureMoveDistance();
      currentXPosition = -moveDistance * scrollProgress;
      if (cardsContainerRef.current) {
        gsap.set(cardsContainerRef.current, { x: currentXPosition });
      }
      // Snap letters to new projection on resize (no long lerp from old coords)
      updateLetterTargets(scrollProgress);
      for (const letter of letters) {
        letter.currentX = letter.targetX;
        letter.currentY = letter.targetY;
        letter.currentScale = letter.targetScale;
      }
      updateLetterElements();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (sectionRef.current) {
        gsap.set(sectionRef.current, { opacity: 1, clearProps: "opacity" });
      }
      textContainer.innerHTML = "";
    };
  }, [isMobile, reducedMotion, registerInstance]);

  // Fade showcase as contact approaches
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const contactSection = document.getElementById("contact");
    if (!contactSection) return;
    const fadeOnVerticalTrigger = ScrollTrigger.create({
      trigger: contactSection,
      start: "top bottom",
      end: "top 30%",
      scrub: 1,
      onUpdate: (self) => {
        if (!sectionRef.current) return;
        gsap.set(sectionRef.current, { opacity: 1 - self.progress * 0.9 });
      },
    });
    registerInstance(fadeOnVerticalTrigger);
  }, [isMobile, reducedMotion, registerInstance]);

  const handleMouseEnter = (
    project: Project,
    e: MouseEvent<HTMLDivElement>,
  ): void => {
    if (isMobile) return;
    cursorPosRef.current = { x: e.clientX, y: e.clientY };
    setHoveredProject(project);
    document.body.style.cursor = "none";
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    if (isMobile) return;
    cursorPosRef.current.x = e.clientX;
    cursorPosRef.current.y = e.clientY;
  };

  const handleMouseLeave = (): void => {
    setHoveredProject(null);
    document.body.style.cursor = "auto";
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>, link: string): void => {
    if (link === "#wip") {
      e.preventDefault();
      return;
    }
    if (link.startsWith("/")) {
      e.preventDefault();
      window.location.hash = link;
    }
  };

  const renderProjectCard = (
    project: Project,
    index: number,
    variant: "mobile" | "static",
  ) => (
    <div
      key={project.id}
      className={variant === "mobile" ? "mobile-card" : "static-card"}
      style={{ "--card-index": index } as CSSProperties}
      onClick={(e) => handleClick(e, project.link)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(
            e as unknown as MouseEvent<HTMLDivElement>,
            project.link,
          );
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View project: ${project.title}`}
    >
      <div
        className={
          variant === "mobile" ? "mobile-card-visual" : "static-card-visual"
        }
      >
        {failedImages.has(project.id) ? (
          <div className="mobile-card-fallback">
            <span className="mobile-card-fallback-icon">{project.title[0]}</span>
          </div>
        ) : (
          <img
            src={project.image}
            alt={project.title}
            style={{ objectFit: project.fit ?? "cover" }}
            loading="lazy"
            onError={() =>
              setFailedImages((prev) => new Set(prev).add(project.id))
            }
          />
        )}
        {variant === "mobile" && <div className="mobile-card-accent" />}
      </div>
      <div
        className={variant === "mobile" ? "mobile-card-body" : "static-card-body"}
      >
        <div className="mobile-card-header">
          <span className="mobile-card-number">0{project.id}</span>
          <h3 className="mobile-card-title">{project.title}</h3>
        </div>
        <p className="mobile-card-brief">{project.brief}</p>
        <div className="mobile-card-footer">
          <div className="mobile-card-metrics">
            {project.metrics.map((metric, i) => (
              <span key={i} className="mobile-card-metric">
                {metric}
              </span>
            ))}
          </div>
          <span className="mobile-card-arrow" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <section
        className="projects mobile-projects"
        id="projects"
        ref={sectionRef}
      >
        <div className="projects-header">
          <div className="projects-label">What I've Built</div>
          <h2 className="projects-title">Selected Works</h2>
          <p className="projects-subtitle">
            Each project solves a real problem — tap to explore
          </p>
        </div>
        <div className="mobile-cards" ref={mobileCardsRef}>
          {projects.map((project, index) =>
            renderProjectCard(project, index, "mobile"),
          )}
        </div>
      </section>
    );
  }

  if (reducedMotion) {
    return (
      <section
        className="projects static-projects"
        id="projects"
        ref={sectionRef}
      >
        <div className="projects-header">
          <div className="projects-label">What I've Built</div>
          <h2 className="projects-title">Selected Works</h2>
          <p className="projects-subtitle">
            Each project solves a real problem — click to explore
          </p>
        </div>
        <div className="static-cards">
          {projects.map((project, index) =>
            renderProjectCard(project, index, "static"),
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="showcase-work" id="projects" ref={sectionRef}>
      <canvas id="grid-canvas" ref={gridCanvasRef} aria-hidden="true" />
      <div className="text-container" ref={textContainerRef} aria-hidden="true" />

      <p className="scroll-explore-text" aria-hidden="true">
        Scroll to explore
      </p>

      <div className="cards-wrapper">
        <div className="cards-container" ref={cardsContainerRef}>
          {projects.map((project) => (
            <div
              key={project.id}
              className={`showcase-card${project.scrim === false ? " showcase-card--no-scrim" : ""}`}
              onClick={(e) => handleClick(e, project.link)}
              onMouseEnter={(e) => handleMouseEnter(project, e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick(
                    e as unknown as MouseEvent<HTMLDivElement>,
                    project.link,
                  );
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View project: ${project.title} — ${project.brief}`}
            >
              <div className="card-content">
                <div className="card-img">
                  {failedImages.has(project.id) ? (
                    <div className="card-img-fallback">
                      <span className="card-img-fallback-icon" aria-hidden="true">
                        {project.title[0]}
                      </span>
                      <span>{project.title}</span>
                    </div>
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{ objectFit: project.fit ?? "cover" }}
                      onError={() =>
                        setFailedImages((prev) =>
                          new Set(prev).add(project.id),
                        )
                      }
                    />
                  )}
                </div>
                <div className="card-info">
                  <h3 className="card-title">{project.title}</h3>
                  <p className="card-brief">{project.brief}</p>
                  <div className="card-metrics">
                    {project.metrics.map((metric, i) => (
                      <span key={i} className="card-metric">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hoveredProject && (
        <CustomCursor project={hoveredProject} positionRef={cursorPosRef} />
      )}
    </section>
  );
};

export default Projects;
