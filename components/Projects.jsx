import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Play } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "AG (Autonomous Agent)",
    description: "A Python-based autonomous agent capable of executing complex terminal commands, file manipulation, and reasoning using Large Language Models. Designed to automate developer workflows.",
    badges: ["Python", "LLM", "Automation", "LangChain"],
    image: "/AG.png",
    links: {
      github: "https://github.com/HassanAhmedshm/AG",
      demo: "#"
    }
  },
  {
    id: 2,
    title: "Optiscan AI",
    description: "Mobile application leveraging computer vision to detect early signs of ocular diseases. Built with React Native and custom Python backend for image processing.",
    badges: ["Capacitor JS", "Python", "TensorFlow"],
    image: "/optiscan_logo.png",
    links: {
      github: "https://github.com/HassanAhmedshm/optiscan",
      demo: "#"
    }
  },
  {
    id: 3,
    title: "LifeTrack AI",
    description: "Comprehensive health dashboard providing personalized insights based on wearable data. Features real-time visualization and predictive health analytics.",
    badges: ["flutter"],
    image: "/lifetrack.png",
    links: {
      github: "https://github.com/HassanAhmedshm/Life-track",
      demo: "#"
    }
  }
];

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-surface/50 border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all p-6 md:p-8"
    >
      <div className="relative overflow-hidden rounded-xl h-64 md:h-80 w-full bg-dark">
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
             <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full border border-white/20">
                 <ExternalLink className="w-6 h-6 text-white" />
             </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 leading-relaxed">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 py-2">
          {project.badges.map((badge) => (
            <span key={badge} className="px-3 py-1 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
              {badge}
            </span>
          ))}
        </div>

        <div className="flex gap-4 pt-2">
            <a href={project.links.github} className="flex items-center gap-2 text-sm font-medium text-white hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
                View Code
            </a>
            <a href={project.links.demo} className="flex items-center gap-2 text-sm font-medium text-white hover:text-primary transition-colors">
                <Play className="w-5 h-5" />
                Watch Demo
            </a>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-24 bg-dark relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Projects</h2>
          <p className="text-gray-400">Engineering intelligent solutions for complex problems.</p>
        </motion.div>

        <div className="flex flex-col gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;