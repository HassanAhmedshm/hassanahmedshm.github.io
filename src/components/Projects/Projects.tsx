import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectPanel from './ProjectPanel';
import CustomCursor from './CustomCursor';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'AstroV',
    brief: 'Near-Earth asteroid tracking and impact simulation platform.',
    image: '/images/astrov_longg.png',
    link: '/astrov',
  },
  {
    id: 2,
    title: 'AG (Autonomous Agent)',
    brief: 'Python-based autonomous agent for developer workflow automation.',
    image: '/images/ag-cover.jpg',
    link: '#wip',
  },
  {
    id: 3,
    title: 'Optiscan AI',
    brief: 'Mobile CV app for early ocular disease detection.',
    image: '/images/optiscan-cover.jpg',
    link: '#wip',
  },
  {
    id: 4,
    title: 'LifeTrack AI',
    brief: 'Health dashboard with wearable data visualization.',
    image: '/images/lifetrack.jpg',
    link: '#wip',
  },
];

/**
 * Projects - Portfolio showcase section with diagonal scroll animations
 */
const Projects = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<any>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!gridRef.current || isMobile) return;

    const panels = gridRef.current.querySelectorAll('.project-panel');
    
    panels.forEach((panel, index) => {
      const isLeftColumn = index % 2 === 0;
      const startX = isLeftColumn ? -150 : 150;
      
      gsap.fromTo(panel, 
        { x: startX, y: 100, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        const triggerElement = trigger.vars.trigger;
        if (triggerElement && typeof triggerElement !== 'string' && 'closest' in triggerElement) {
          if ((triggerElement as Element).closest('.project-panel')) {
            trigger.kill();
          }
        }
      });
    };
  }, [isMobile]);

  const handleMouseEnter = (project: any) => {
    if (isMobile) return;
    setHoveredProject(project);
    document.body.style.cursor = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !hoveredProject) return;
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredProject(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <section className="projects" id="projects">
      <div className="projects-header">
        <h2 className="projects-title">My Works</h2>
      </div>
      <div className="projects-grid" ref={gridRef}>
        {projects.map((project, index) => (
          <ProjectPanel
            key={project.id}
            project={project}
            columnIndex={index % 2}
            onMouseEnter={() => handleMouseEnter(project)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            isMobile={isMobile}
          />
        ))}
      </div>
      {!isMobile && hoveredProject && (
        <CustomCursor 
          project={hoveredProject} 
          position={cursorPos} 
        />
      )}
    </section>
  );
};

export default Projects;