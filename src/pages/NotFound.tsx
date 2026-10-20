import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NotFound.css';

const knownRoutes = [
  { hash: '/astrov', label: 'AstroV' },
  { hash: '/optiscan', label: 'Optiscan AI' },
  { hash: '/ag', label: 'AG' },
  { hash: '/lifetrack', label: 'LifeTrack AI' },
] as const;

const FLUFFY_MESSAGES = [
  'You are searching for a world that does not exist.',
  'This chunk was never generated.',
  'Looks like this portal links to nowhere.',
  'No page here. Just missing blocks.',
  'The blocks have crumbled. Nothing here.',
];

const hashSeed = (raw: string) => {
  let seed = 0;
  for (let i = 0; i < raw.length; i++) seed += raw.charCodeAt(i);
  return seed;
};

const playAchievementChime = () => {
  const AudioContextClass =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const ctx = new AudioContextClass();
  const master = ctx.createGain();
  master.gain.value = 0.08;
  master.connect(ctx.destination);

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const start = ctx.currentTime + 0.03;
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    const t = start + idx * 0.09;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.18);
  });

  window.setTimeout(() => ctx.close().catch(() => {}), 900);
};

const NotFound = () => {
  const location = useLocation();
  const requestedPath = useMemo(() => {
    // HashRouter uses /#/route. Strip the leading "#" and any trailing slash.
    const raw = (location.hash || location.pathname || '').replace(/^#/, '').replace(/\/+$/, '');
    return raw || '/';
  }, [location.hash, location.pathname]);

  const funMessage = useMemo(
    () => FLUFFY_MESSAGES[hashSeed(requestedPath) % FLUFFY_MESSAGES.length],
    [requestedPath],
  );

  // Pick a non-current route as the suggestion so we never self-reference.
  const suggestion = useMemo(() => {
    const offset = (hashSeed(requestedPath) % knownRoutes.length) + 1;
    return knownRoutes[(hashSeed(requestedPath) + offset) % knownRoutes.length];
  }, [requestedPath]);

  const [achievementVisible, setAchievementVisible] = useState(false);
  const [hasPlayedChime, setHasPlayedChime] = useState(false);
  const chimePlayedRef = useRef(false);

  // Try to play the chime after a small delay so the user has a chance to
  // interact (most browsers block autoplay on cold loads). One play per visit.
  useEffect(() => {
    const tryPlay = () => {
      if (chimePlayedRef.current) return;
      chimePlayedRef.current = true;
      try {
        playAchievementChime();
        setHasPlayedChime(true);
      } catch {
        // Browser blocked audio — fall back to user gesture.
        chimePlayedRef.current = false;
      }
    };

    const timer = window.setTimeout(tryPlay, 250);

    const triggerOnGesture = () => {
      if (chimePlayedRef.current) return;
      chimePlayedRef.current = true;
      try {
        playAchievementChime();
        setHasPlayedChime(true);
      } catch {
        chimePlayedRef.current = false;
      }
      window.removeEventListener('pointerdown', triggerOnGesture);
      window.removeEventListener('keydown', triggerOnGesture);
    };
    window.addEventListener('pointerdown', triggerOnGesture, { passive: true });
    window.addEventListener('keydown', triggerOnGesture);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', triggerOnGesture);
      window.removeEventListener('keydown', triggerOnGesture);
    };
  }, []);

  // Pop the achievement toaster shortly after the page renders.
  useEffect(() => {
    const enter = window.setTimeout(() => setAchievementVisible(true), 350);
    const exit = window.setTimeout(() => setAchievementVisible(false), 4600);
    return () => {
      window.clearTimeout(enter);
      window.clearTimeout(exit);
    };
  }, []);

  return (
    <div className="mc-404">
      <div className="mc-404-clouds" aria-hidden="true">
        <span className="mc-cloud mc-cloud--a" />
        <span className="mc-cloud mc-cloud--b" />
        <span className="mc-cloud mc-cloud--c" />
      </div>

      <aside
        className={`mc-achievement ${achievementVisible ? 'mc-achievement--show' : ''}`}
        aria-live="polite"
      >
        <div className="mc-achievement-icon" aria-hidden="true">
          <span className="mc-achievement-icon-block" />
          <span className="mc-achievement-icon-sparkle" />
        </div>
        <div className="mc-achievement-text">
          <p className="mc-achievement-label">Advancement made!</p>
          <p className="mc-achievement-title">Searching for a page that doesn&apos;t exist</p>
          <p className="mc-achievement-hint">
            {hasPlayedChime ? '' : 'Tap anywhere to hear the chime'}
          </p>
        </div>
      </aside>

      <main className="mc-card">
        <p className="mc-code">404</p>
        <h1 className="mc-title">Searching for a world that does not exist</h1>
        <p className="mc-message">{funMessage}</p>
        <p className="mc-path">
          Requested path:
          <br />
          <code>{requestedPath}</code>
        </p>
        <div className="mc-actions">
          <Link to="/" className="mc-btn mc-btn--primary">Return to spawn</Link>
          <Link to={suggestion.hash} className="mc-btn">
            Open {suggestion.label}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
