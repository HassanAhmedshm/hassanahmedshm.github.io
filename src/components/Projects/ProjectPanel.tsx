import { useState } from 'react';

/**
 * ProjectPanel - Individual project panel with hover effects
 */
const ProjectPanel = ({ project, columnIndex, onMouseEnter, onMouseMove, onMouseLeave, isMobile }) => {
  const [imageError, setImageError] = useState(false);

  const handleMouseEnter = (e) => {
    if (!isMobile) {
      onMouseEnter(e);
    }
  };

  const handleMouseMove = (e) => {
    if (!isMobile) {
      onMouseMove(e);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      onMouseLeave();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // If clicking on the link itself, let it handle navigation
    if ((e.target as HTMLElement).tagName === 'A') {
      return;
    }
    // Otherwise, navigate to the project link
    if (project.link.startsWith('#')) {
      e.preventDefault();
    } else {
      window.location.href = project.link;
    }
  };

  return (
    <article 
      className={`project-panel ${isMobile ? 'mobile' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-column={columnIndex}
      style={{ cursor: project.link.startsWith('#') ? 'default' : 'pointer' }}
    >
      <div className="project-image-wrapper">
        {!imageError ? (
          <img 
            src={project.image} 
            alt={project.title}
            className="project-image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="project-image-fallback">
            <span>{project.title.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="project-overlay">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-brief">{project.brief}</p>
        <a href={project.link} className="project-link">
          View Project →
        </a>
      </div>
    </article>
  );
};

export default ProjectPanel;