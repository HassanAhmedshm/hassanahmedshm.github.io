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
      // The line draws from dead center (expands upward AND downward)
      // first; only when it's complete do the text and image "open out" of it.
      // Initial X offsets push each column out from behind the divider — both
      // columns are clipped at the line, so neither ever crosses to the other
      // side, they only ever slide *out* from behind it.
      gsap.set(line, { scaleY: 0, transformOrigin: 'center center' });
      gsap.set(image, { x: -260, opacity: 0 });
      gsap.set(text, { x: 260, opacity: 0 });

      // The stage is held from 'top top' to 'bottom bottom', so the whole
      // reveal is watched happen on screen with the content framed and still.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 1) The stripe grows out of the middle of the screen, up and down,
      //    until the whole stripe is done.
      tl.fromTo(
        line,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.42, ease: 'expo.out' },
        0,
      );

      // 2) Only once the stripe is complete do the columns slide out from
      //    behind it — text to the left, image to the right.
      tl.fromTo(
        text,
        { x: 260, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power4.out' },
        0.45,
      );

      tl.fromTo(
        image,
        { x: -260, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        0.5,
      );

      if (tl.scrollTrigger) {
        registerInstance(tl.scrollTrigger);
      }
    });

    mm.add('(max-width: 767px)', () => {
      // Mobile has no visible center line, so the same idea translates to:
      // image reveals first from above its own center, then text reveals
      // rising upward — together reading like a divider drawing + opening.
      gsap.set(line, { scaleY: 0, transformOrigin: 'center center' });
      gsap.set(image, { y: 60, opacity: 0 });
      gsap.set(text, { y: 60, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });

      tl.to(line, {
        scaleY: 1,
        duration: 0.9,
        ease: 'expo.out',
      }, 0);

      tl.to(image, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      }, 0.7);

      tl.to(text, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
      }, 0.85);

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
        {/* Left column - Text (clipped at the stripe) */}
        <div className="about-content">
          <div className="about-content-inner" ref={textRef}>
            <h2 className="about-title">About Me</h2>
            <p className="about-text">
              Hey. I'm Hassan, a 17-year-old developer from Egypt. I build anything from full websites to mobile and desktop applications.
            </p>
            <p className="about-text">
              Look with me into the future, I see a journey that has just started with AI accelerating every step of it and with CREATIVITY and SPEED we find GREATNESS
            </p>
          </div>
        </div>

        {/* Center decorative line */}
        <div className="about-line" ref={lineRef} />

        {/* Right column - Image (clipped at the stripe) */}
        <div className="about-image-column">
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
      </div>
    </section>
  );
};

export default About;
