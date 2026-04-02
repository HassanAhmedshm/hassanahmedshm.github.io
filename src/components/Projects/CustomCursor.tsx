import { useEffect, useRef, useState } from 'react';
import { lerp } from '../../utils/math';

/**
 * CustomCursor - Floating cursor that follows mouse with lerp delay
 */
const CustomCursor = ({ project, position }) => {
  const cursorRef = useRef(null);
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (project) {
      setIsVisible(true);
      currentPos.current = { x: position.x, y: position.y };
    } else {
      setIsVisible(false);
    }
  }, [project, position]);

  useEffect(() => {
    if (!isVisible || !cursorRef.current) return;

    const cursor = cursorRef.current;
    
    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, position.x, 0.15);
      currentPos.current.y = lerp(currentPos.current.y, position.y, 0.15);
      
      cursor.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
      
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [position, isVisible]);

  if (!isVisible || !project) return null;

  return (
    <div 
      ref={cursorRef}
      className="custom-cursor"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 100,
        willChange: 'transform',
      }}
    >
      <div className="custom-cursor-content">
        <h4 className="cursor-title">{project.title}</h4>
        <p className="cursor-brief">{project.brief}</p>
        <a href={project.link} className="cursor-link">
          View Project →
        </a>
      </div>
    </div>
  );
};

export default CustomCursor;