import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * About - Split layout section with line animation
 */
const About = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    const image = imageRef.current;
    const text = textRef.current;

    if (!section || !line || !image || !text) return;

    // Set initial states - hide everything
    gsap.set(line, { scaleY: 0, transformOrigin: 'center center' });
    gsap.set(image, { x: -100, opacity: 0 }); // starts at line, moves right
    gsap.set(text, { x: 100, opacity: 0 }); // starts at line, moves left

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=800',
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    // 1. Line expands from center dot upward and downward
    tl.to(line, {
      scaleY: 1,
      ease: 'power2.out'
    });

    // 2. Image slides from line to left, text slides from line to right (simultaneously)
    tl.to(image, {
      x: 0,
      opacity: 1,
      ease: 'power2.out'
    }, '-=0.3');

    tl.to(text, {
      x: 0,
      opacity: 1,
      ease: 'power2.out'
    }, '<');

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-grid">
        {/* Left column - Text */}
        <div className="about-content" ref={textRef}>
          <h2 className="about-title">About Me</h2>
          <p className="about-text">
            Hey. I'm Hassan, a 17-year-old developer and prompt engineer from Egypt.
            I build anything from full websites to mobile and desktop applications.
                      </p>
          <p className="about-text">
            Look with me into the future, I see a journey that has just started with
            AI accelerating every step of it and with CREATIVITY and SPEED we find GREATNESS

          </p>
        </div>

        {/* Center decorative line */}
        <div className="about-line" ref={lineRef} />

        {/* Right column - Image */}
        <div className="about-image-wrapper" ref={imageRef}>
          <img 
            src="/images/school.jpg" 
            alt="Hassan Ahmed" 
            className="about-image"
          />
        </div>
      </div>
    </section>
  );
};

export default About;