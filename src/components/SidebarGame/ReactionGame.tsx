import { useState, useRef, useCallback } from 'react';
import './ReactionGame.css';

type GameState = 'idle' | 'waiting' | 'ready' | 'clicked' | 'toosoon';

const ReactionGame = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('reaction-best');
    return saved ? parseInt(saved, 10) : null;
  });
  
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number>(0);

  const startGame = useCallback(() => {
    if (gameState === 'waiting') {
      // Clicked too soon
      clearTimeout(timeoutRef.current);
      setGameState('toosoon');
      return;
    }
    
    if (gameState === 'ready') {
      // Calculate reaction time
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setGameState('clicked');
      
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('reaction-best', time.toString());
      }
      return;
    }

    // Start new game
    setGameState('waiting');
    setReactionTime(null);
    
    // Random delay between 1.5 and 4 seconds
    const delay = 1500 + Math.random() * 2500;
    
    timeoutRef.current = window.setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('ready');
    }, delay);
  }, [gameState, bestTime]);

  const getStateMessage = () => {
    switch (gameState) {
      case 'idle':
        return { title: 'Reaction Test', subtitle: 'Click to start', color: '#8b5cf6' };
      case 'waiting':
        return { title: 'Wait...', subtitle: 'Click when green!', color: '#ef4444' };
      case 'ready':
        return { title: 'CLICK!', subtitle: 'Now!', color: '#22c55e' };
      case 'clicked':
        return { 
          title: `${reactionTime}ms`, 
          subtitle: reactionTime! < 250 ? 'Great!' : reactionTime! < 350 ? 'Good' : 'Try again',
          color: '#8b5cf6'
        };
      case 'toosoon':
        return { title: 'Too soon!', subtitle: 'Click to retry', color: '#ef4444' };
      default:
        return { title: '', subtitle: '', color: '#8b5cf6' };
    }
  };

  const state = getStateMessage();

  return (
    <div 
      className="reaction-game" 
      onClick={startGame}
      style={{ 
        '--game-color': state.color,
        backgroundColor: gameState === 'ready' ? '#22c55e' : 
                         gameState === 'waiting' ? '#ef4444' : '#0c1222'
      } as React.CSSProperties}
      tabIndex={0}
    >
      <div className="reaction-content">
        <span className="reaction-title" style={{ color: gameState === 'ready' || gameState === 'waiting' ? '#fff' : state.color }}>
          {state.title}
        </span>
        <span className="reaction-subtitle" style={{ color: gameState === 'ready' || gameState === 'waiting' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
          {state.subtitle}
        </span>
      </div>
      
      {bestTime !== null && (
        <div className="reaction-best">Best: {bestTime}ms</div>
      )}
    </div>
  );
};

export default ReactionGame;
