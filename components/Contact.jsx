import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-surface border-t border-border relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Ready to build something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                impossible?
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg">
            I'm currently available for freelance work and collaborations.
          </p>

          <div className="py-8">
            <a 
              href="mailto:hassanahmedshm@gmail.com"
              className="inline-flex items-center gap-3 text-2xl md:text-3xl font-mono text-white hover:text-primary transition-colors border-b-2 border-primary/30 hover:border-primary pb-2"
            >
              <Mail className="w-6 h-6 md:w-8 md:h-8" />
              hassanahmedshm@gmail.com
            </a>
          </div>

          <div className="flex justify-center gap-8">
            <a href="https://github.com/HassanAhmedshm" className="p-4 bg-dark border border-border rounded-full hover:border-primary hover:text-primary transition-all group">
                <Github className="w-8 h-8" />
            </a>
            <a href="https://www.linkedin.com/in/hassan-ahmed-36842a336/" className="p-4 bg-dark border border-border rounded-full hover:border-primary hover:text-primary transition-all group">
                <Linkedin className="w-8 h-8" />
            </a>
          </div>
        </motion.div>
        
        <footer className="mt-24 text-gray-500 text-sm font-mono">
            <p>&copy; {new Date().getFullYear()} Hassan Ahmed. Built with React & Tailwind.</p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;