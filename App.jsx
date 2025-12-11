import React from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Timeline from './components/Timeline.jsx';
import Contact from './components/Contact.jsx';

const App = () => {
  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30 selection:text-primary-light">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Timeline />
        <Contact />
      </main>
    </div>
  );
};

export default App;