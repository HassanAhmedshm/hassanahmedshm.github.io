import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Play } from 'lucide-react';

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50); // Typing speed
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

const Hero = () => {
  return (
    <section className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden bg-dark">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Hi, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              Hassan Ahmed.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 font-mono h-16">
            <span className="text-primary">{'>'}</span> <TypewriterText text="Full Stack Developer & Prompt Engineer" delay={500} />
            <span className="animate-pulse">_</span>
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-primary text-white font-medium rounded hover:bg-primary-dark transition-all flex items-center gap-2 group"
            >
              View Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://drive.google.com/file/d/1I4ZAJ4AnQ0LI9CQF46GJgAuCXZwaZBKf/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-surface border border-border text-gray-300 font-medium rounded hover:bg-border transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View CV
            </a>
          </div>
        </motion.div>

        {/* Right Visual (Mock Terminal) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-lg bg-[#1e1e1e] border border-border shadow-2xl overflow-hidden font-mono text-sm leading-relaxed">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2d2d] border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="ml-4 text-xs text-gray-500">agent_runner.py</div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 text-gray-300 space-y-2">
              <div className="flex gap-2">
                <span className="text-green-500">➜</span>
                <span className="text-blue-400">~</span>
                <span>python3 initiate_agent.py</span>
              </div>
              <div className="text-gray-500 italic">Initializing autonomous systems...</div>
              
              <div className="grid gap-1 pl-4 border-l-2 border-gray-700 my-4">
                 <div className="flex justify-between">
                    <span>Loading modules</span>
                    <span className="text-green-400">[OK]</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Connecting to LLM</span>
                    <span className="text-green-400">[OK]</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Vision Pipeline</span>
                    <span className="text-yellow-400">[Loading...]</span>
                 </div>
              </div>

              <div className="flex gap-2">
                 <span className="text-green-500">➜</span>
                 <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;