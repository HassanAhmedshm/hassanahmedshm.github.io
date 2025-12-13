import React from 'react';
import { motion } from 'framer-motion';
import { Code, Globe, User, Zap } from 'lucide-react';

const BentoBox = ({ children, className = "", title, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors group relative overflow-hidden ${className}`}
  >
    {/* Subtle Glow Effect on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative z-10 h-full flex flex-col">
        {title && <h3 className="text-gray-400 text-sm font-mono mb-2 uppercase tracking-wider">{title}</h3>}
        {children}
    </div>
  </motion.div>
);

const About = () => {
  return (
    <section id="about" className="py-24 bg-dark relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About Me</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:grid-rows-2 h-auto md:h-[500px]">
            {/* Box 1: Age & Role */}
            <BentoBox className="md:col-span-2 md:row-span-1" delay={0.1}>
                <div className="flex items-start justify-between h-full">
                    <div>
                        <div className="text-5xl font-bold text-white mb-2">16</div>
                        <div className="text-xl text-gray-300">Years Old</div>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <User className="w-8 h-8 text-blue-400" />
                    </div>
                </div>
                <div className="mt-auto pt-4">
                    <p className="text-gray-400">Full Stack Developer crafting digital experiences with a fresh perspective.</p>
                </div>
            </BentoBox>

            {/* Box 2: Location */}
            <BentoBox className="md:col-span-1 md:row-span-1" delay={0.2}>
                <div className="flex flex-col h-full justify-between items-center text-center">
                    <div className="p-4 bg-green-500/10 rounded-full mb-4">
                        <Globe className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">Egypt 🇪🇬</div>
                        <div className="text-sm text-gray-400">Global Mindset</div>
                    </div>
                </div>
            </BentoBox>

            {/* Box 3: Achievement */}
            <BentoBox className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-surface to-[#0f0f0f]" delay={0.3} title="Recognition">
                 <div className="flex flex-col h-full items-center justify-center text-center gap-6">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg" 
                        alt="NASA Logo" 
                        className="w-20 h-20 opacity-80"
                    />
                    <div>
                        <div className="text-lg font-bold text-white">NASA Space Apps</div>
                        <div className="text-primary font-mono text-sm">Participant 2024</div>
                    </div>
                    <p className="text-xs text-gray-500">
                        Contributed to innovative problem solving in the global hackathon.
                    </p>
                 </div>
            </BentoBox>

            {/* Box 4: Tech Stack */}
            <BentoBox className="md:col-span-3 md:row-span-1" delay={0.4} title="Tech Stack">
                <div className="flex flex-wrap items-center gap-4 mt-2">
                    {['React', 'Laravel', 'Python', 'Tailwind', 'Git','Postman', 'MySQL', 'Framer Motion'].map((tech) => (
                        <span 
                            key={tech} 
                            className="px-4 py-2 bg-[#1a1a1a] border border-border rounded-lg text-gray-300 text-sm font-medium hover:text-white hover:border-primary transition-all cursor-default"
                        >
                            {tech}
                        </span>
                    ))}
                    <div className="ml-auto">
                        <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
                    </div>
                </div>
            </BentoBox>
        </div>
      </div>
    </section>
  );
};

export default About;