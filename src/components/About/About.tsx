import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTriggerCleanup } from '../../hooks/useScrollTriggerCleanup';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  reducedMotion?: boolean;
}

const About = ({ reducedMotion = false }: AboutProps) => {
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

    if (reducedMotion) {
      gsap.set(line, { scaleY: 1 });
      gsap.set(image, { x: 0, opacity: 1 });
      gsap.set(text, { x: 0, opacity: 1 });
      return;
    }

    // Kill any existing ScrollTrigger for this section (React Strict Mode safety)
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === section) {
        st.kill();
      }
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      gsap.set(line, { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(image, { x: -100, opacity: 0 });
      gsap.set(text, { x: 100, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top top',
          scrub: 1,
        }
      });

      if (tl.scrollTrigger) {
        registerInstance(tl.scrollTrigger);
      }

      tl.to(line, {
        scaleY: 1,
        duration: 0.6,
        ease: 'expo.out'
      }, 0);

      tl.to(image, {
        x: 0,
        opacity: 1,
        ease: 'power3.out'
      }, 0.75);

      tl.to(text, {
        x: 0,
        opacity: 1,
        ease: 'power4.out'
      }, 0.8);
    });

    mm.add('(max-width: 767px)', () => {
      gsap.set(line, { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(image, { x: 72, y: 0, opacity: 0 });
      gsap.set(text, { x: -72, y: 0, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none none',
        }
      });

      tl.to(line, {
        scaleY: 1,
        duration: 0.42,
        ease: 'expo.out'
      });

      tl.to(image, {
        x: 0,
        opacity: 1,
        duration: 0.46,
        ease: 'power3.out'
      }, '+=0.1');

      tl.to(text, {
        x: 0,
        opacity: 1,
        duration: 0.46,
        ease: 'power4.out'
      }, '-=0.3');

      if (tl.scrollTrigger) {
        registerInstance(tl.scrollTrigger);
      }
    });

    return () => {
      mm.revert();
    };
  }, [reducedMotion]);

  // Refresh ScrollTrigger after component mounts (helps with mobile)
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-grid">
        {/* Left column - Text */}
        <div className="about-content" ref={textRef}>
          <h2 className="about-title">About Me</h2>
          <p className="about-text">
            Hey. I'm Hassan, a 17-year-old developer from Egypt. I build anything from full websites to mobile and desktop applications.
          </p>
          <p className="about-text">
            Look with me into the future, I see a journey that has just started with AI accelerating every step of it and with CREATIVITY and SPEED we find GREATNESS
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
