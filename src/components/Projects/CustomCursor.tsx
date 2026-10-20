import { useEffect, useRef, type RefObject } from 'react';
import { lerp, clamp } from '../../utils/math';

interface CustomCursorProps {
  project: {
    title: string;
    brief: string;
    link: string;
    metrics: string[];
  };
  /** Live mouse position. Read from a ref so mouse movement never re-renders React. */
  positionRef: RefObject<{ x: number; y: number }>;
}

const PANEL_WIDTH = 220;
const PANEL_HEIGHT = 160;
const EDGE_MARGIN = 16;
/** How fast the panel catches up to the pointer (0-1, lower = more lag). */
const FOLLOW = 0.14;
/** Float the panel above the pointer so it never hides what you are pointing at. */
const Y_OFFSET = -96;

/** Keeps the panel fully inside the viewport. */
const panelTransform = (x: number, y: number): string => {
  const halfW = PANEL_WIDTH / 2;
  const halfH = PANEL_HEIGHT / 2;
  const maxX = window.innerWidth - halfW - EDGE_MARGIN;
  const maxY = window.innerHeight - halfH - EDGE_MARGIN;

  const clampedX = clamp(x, halfW + EDGE_MARGIN, maxX);
  const clampedY = clamp(y, halfH + EDGE_MARGIN, maxY);

  return `translate3d(${clampedX}px, ${clampedY}px, 0) translate(-50%, -50%)`;
};

/**
 * CustomCursor - Floating panel that trails the pointer with a soft lag.
 *
 * The follow transform is written straight to `style.transform` on every frame.
 * Nothing may set `transform` in CSS for this element — a stylesheet rule wins
 * over the inline value and pins the panel at the top-left corner.
 */
const CustomCursor = ({ project, positionRef }: CustomCursorProps) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const currentPos = useRef({
    x: positionRef.current?.x ?? 0,
    y: (positionRef.current?.y ?? 0) + Y_OFFSET,
  });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let rafId = 0;

    const animate = () => {
      const target = positionRef.current;

      if (target) {
        currentPos.current.x = lerp(currentPos.current.x, target.x, FOLLOW);
        currentPos.current.y = lerp(
          currentPos.current.y,
          target.y + Y_OFFSET,
          FOLLOW,
        );
      }

      cursor.style.transform = panelTransform(
        currentPos.current.x,
        currentPos.current.y,
      );

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [positionRef]);

  // Keyboard users get the native cursor back.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.style.cursor = 'auto';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 100,
        willChange: 'transform',
        // Placed before the first paint — never render a frame at (0,0).
        transform: panelTransform(
          currentPos.current.x,
          currentPos.current.y,
        ),
      }}
    >
      <div className="cursor-glow" />
      <div className="custom-cursor-content">
        <h4 className="cursor-title">{project.title}</h4>
        <p className="cursor-brief">{project.brief}</p>
        <div className="cursor-metrics">
          {project.metrics.slice(0, 2).map((m, i) => (
            <span key={i} className="cursor-metric">
              {m}
            </span>
          ))}
        </div>
        {/* Decorative duplicate of the card's own content — the card itself
            is the accessible control, so this stays out of the a11y tree. */}
        <span className="cursor-link">View project →</span>
      </div>
    </div>
  );
};

export default CustomCursor;
