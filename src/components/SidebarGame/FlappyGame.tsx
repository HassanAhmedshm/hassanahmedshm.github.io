import { useRef, useState, useEffect, useCallback } from 'react';
import './FlappyGame.css';

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

const GAME_WIDTH = 260;
const GAME_HEIGHT = 180;
const BIRD_SIZE = 14;
const PIPE_WIDTH = 28;
const PIPE_GAP = 65;
const GRAVITY = 0.18;
const JUMP_FORCE = -2.8;
const PIPE_SPEED = 1;

const FlappyGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappy-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const gameRef = useRef({
    birdY: GAME_HEIGHT / 2,
    birdVelocity: 0,
    pipes: [] as Pipe[],
    animationId: 0,
    score: 0,
  });

  const resetGame = useCallback(() => {
    gameRef.current = {
      birdY: GAME_HEIGHT / 2,
      birdVelocity: 0,
      pipes: [],
      animationId: 0,
      score: 0,
    };
    setScore(0);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'idle') {
      resetGame();
      setGameState('playing');
    } else if (gameState === 'playing') {
      gameRef.current.birdVelocity = JUMP_FORCE;
    } else if (gameState === 'gameover') {
      resetGame();
      setGameState('playing');
    }
  }, [gameState, resetGame]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const game = gameRef.current;
    let lastPipeSpawn = 0;

    const gameLoop = () => {
      // Update bird
      game.birdVelocity += GRAVITY;
      game.birdY += game.birdVelocity;

      // Spawn pipes
      if (game.pipes.length === 0 || game.pipes[game.pipes.length - 1].x < GAME_WIDTH - 120) {
        const gapY = Math.random() * (GAME_HEIGHT - PIPE_GAP - 40) + 20;
        game.pipes.push({ x: GAME_WIDTH, gapY, passed: false });
      }

      // Update pipes
      game.pipes = game.pipes.filter(pipe => {
        pipe.x -= PIPE_SPEED;
        
        // Score
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 40) {
          pipe.passed = true;
          game.score++;
          setScore(game.score);
        }
        
        return pipe.x > -PIPE_WIDTH;
      });

      // Collision detection
      const birdLeft = 30;
      const birdRight = birdLeft + BIRD_SIZE;
      const birdTop = game.birdY;
      const birdBottom = game.birdY + BIRD_SIZE;

      // Floor/ceiling collision
      if (birdTop < 0 || birdBottom > GAME_HEIGHT) {
        setGameState('gameover');
        if (game.score > highScore) {
          setHighScore(game.score);
          localStorage.setItem('flappy-highscore', game.score.toString());
        }
        return;
      }

      // Pipe collision
      for (const pipe of game.pipes) {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;
        
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          if (birdTop < pipe.gapY || birdBottom > pipe.gapY + PIPE_GAP) {
            setGameState('gameover');
            if (game.score > highScore) {
              setHighScore(game.score);
              localStorage.setItem('flappy-highscore', game.score.toString());
            }
            return;
          }
        }
      }

      // Draw
      ctx.fillStyle = '#0c1222';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw pipes
      ctx.fillStyle = '#3b82f6';
      for (const pipe of game.pipes) {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, GAME_HEIGHT - pipe.gapY - PIPE_GAP);
        
        // Pipe edges
        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(pipe.x - 3, pipe.gapY - 15, PIPE_WIDTH + 6, 15);
        ctx.fillRect(pipe.x - 3, pipe.gapY + PIPE_GAP, PIPE_WIDTH + 6, 15);
        ctx.fillStyle = '#3b82f6';
      }

      // Draw bird
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(birdLeft + BIRD_SIZE/2, game.birdY + BIRD_SIZE/2, BIRD_SIZE/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(birdLeft + BIRD_SIZE/2 + 4, game.birdY + BIRD_SIZE/2 - 2, 3, 0, Math.PI * 2);
      ctx.fill();

      game.animationId = requestAnimationFrame(gameLoop);
    };

    game.animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(game.animationId);
    };
  }, [gameState, highScore]);

  // Draw idle/gameover state
  useEffect(() => {
    if (gameState === 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0c1222';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw static bird
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(40 + BIRD_SIZE/2, GAME_HEIGHT/2, BIRD_SIZE/2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(40 + BIRD_SIZE/2 + 4, GAME_HEIGHT/2 - 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw sample pipes
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(150, 0, PIPE_WIDTH, 60);
    ctx.fillRect(150, 130, PIPE_WIDTH, GAME_HEIGHT - 130);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(147, 45, PIPE_WIDTH + 6, 15);
    ctx.fillRect(147, 130, PIPE_WIDTH + 6, 15);
  }, [gameState]);

  return (
    <div className="flappy-game" onClick={jump} onKeyDown={(e) => e.key === ' ' && jump()} tabIndex={0}>
      <canvas 
        ref={canvasRef} 
        width={GAME_WIDTH} 
        height={GAME_HEIGHT}
        className="flappy-canvas"
      />
      
      {gameState === 'idle' && (
        <div className="flappy-overlay">
          <span className="flappy-title">Flappy Dev</span>
          <span className="flappy-hint">Click or tap to play!</span>
        </div>
      )}
      
      {gameState === 'gameover' && (
        <div className="flappy-overlay">
          <span className="flappy-title">Game Over!</span>
          <span className="flappy-score">Score: {score}</span>
          <span className="flappy-hint">Click to retry</span>
        </div>
      )}
      
      {gameState === 'playing' && (
        <div className="flappy-score-display">{score}</div>
      )}
      
      <div className="flappy-highscore">Best: {highScore}</div>
    </div>
  );
};

export default FlappyGame;
