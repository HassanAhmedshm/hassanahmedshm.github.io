import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTriggerCleanup } from '../../hooks/useScrollTriggerCleanup';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * About - Split layout section with line animation
 * Validates: Requirements 9.3, 9.4
 */
const About = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const { registerInstance } = useScrollTriggerCleanup();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    const image = imageRef.current;
    const text = textRef.current;

    if (!section || !line || !image || !text) return;

    // Kill any existing ScrollTrigger for this section (React Strict Mode safety)
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === section) {
        st.kill();
      }
    });

    // Set initial states - hide everything
    gsap.set(line, { scaleY: 0, transformOrigin: 'center center' });
    gsap.set(image, { x: -100, opacity: 0 }); // starts at line, moves right
    gsap.set(text, { x: 100, opacity: 0 }); // starts at line, moves left

    // Create timeline with pin
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=800',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        pinSpacing: true,
      }
    });

    // Register the ScrollTrigger instance for cleanup
    if (tl.scrollTrigger) {
      registerInstance(tl.scrollTrigger);
    }

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
    // Cleanup handled by useScrollTriggerCleanup hook
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
          {imageError ? (
            <div className="about-image-error">
              <span>!</span>
            </div>
          ) : (
            <>
              {imageLoading && (
                <div className="about-image-placeholder" />
              )}
              <img 
                src="/images/school.jpg" 
                alt="Hassan Ahmed" 
                className="about-image"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
                style={{ opacity: imageLoading ? 0 : 1 }}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;