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
/** Backing-store multiplier so the game stays crisp on hi-dpi screens */
const CANVAS_SCALE = 2;
const GROUND_HEIGHT = 30;

const SKY_TOP = '#0b1428';
const SKY_MID = '#101d38';
const SKY_LOW = '#16294d';

/* ─────────────── Drawing ─────────────── */

const drawBackground = (ctx: CanvasRenderingContext2D, scroll: number): void => {
  const sky = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  sky.addColorStop(0, SKY_TOP);
  sky.addColorStop(0.6, SKY_MID);
  sky.addColorStop(1, SKY_LOW);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Stars drift slowly for depth
  ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
  for (let i = 0; i < 20; i++) {
    const sx = (((i * 97 + 11 - scroll * 0.18) % (GAME_WIDTH + 40)) + GAME_WIDTH + 40) % (GAME_WIDTH + 40) - 20;
    const sy = 6 + ((i * 41) % 78);
    ctx.fillRect(sx, sy, 1.4, 1.4);
  }

  // Parallax hills
  ctx.fillStyle = '#0d1a33';
  ctx.beginPath();
  ctx.moveTo(0, GAME_HEIGHT);
  for (let x = 0; x <= GAME_WIDTH; x += 8) {
    const h = 24 + Math.sin((x + scroll * 0.35) / 30) * 8;
    ctx.lineTo(x, GAME_HEIGHT - GROUND_HEIGHT - h);
  }
  ctx.lineTo(GAME_WIDTH, GAME_HEIGHT);
  ctx.closePath();
  ctx.fill();

  // Ground strip with scrolling ticks
  ctx.fillStyle = '#101d3a';
  ctx.fillRect(0, GAME_HEIGHT - GROUND_HEIGHT, GAME_WIDTH, GROUND_HEIGHT);
  ctx.fillStyle = 'rgba(77, 159, 216, 0.22)';
  for (let x = -((scroll % 14) + 14) % 14; x < GAME_WIDTH; x += 14) {
    ctx.fillRect(x, GAME_HEIGHT - GROUND_HEIGHT, 7, 2);
  }
  ctx.fillStyle = 'rgba(77, 159, 216, 0.35)';
  ctx.fillRect(0, GAME_HEIGHT - GROUND_HEIGHT, GAME_WIDTH, 1);
};

const drawPipe = (
  ctx: CanvasRenderingContext2D,
  x: number,
  gapY: number,
  capHeight: number,
): void => {
  const body = ctx.createLinearGradient(x, 0, x + PIPE_WIDTH, 0);
  body.addColorStop(0, '#15803d');
  body.addColorStop(0.35, '#4ade80');
  body.addColorStop(1, '#166534');

  const cap = ctx.createLinearGradient(x - 4, 0, x + PIPE_WIDTH + 4, 0);
  cap.addColorStop(0, '#166534');
  cap.addColorStop(0.35, '#86efac');
  cap.addColorStop(1, '#14532d');

  ctx.fillStyle = body;
  ctx.fillRect(x, 0, PIPE_WIDTH, gapY - capHeight);
  ctx.fillRect(x, gapY + PIPE_GAP, PIPE_WIDTH, GAME_HEIGHT - gapY - PIPE_GAP);

  ctx.fillStyle = cap;
  ctx.fillRect(x - 4, gapY - capHeight, PIPE_WIDTH + 8, capHeight);
  ctx.fillRect(x - 4, gapY + PIPE_GAP, PIPE_WIDTH + 8, capHeight);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.fillRect(x + 5, 0, 3, gapY - capHeight);
  ctx.fillRect(x + 5, gapY + PIPE_GAP, 3, GAME_HEIGHT - gapY - PIPE_GAP);
};

const drawPipes = (ctx: CanvasRenderingContext2D, pipes: Pipe[]): void => {
  for (const pipe of pipes) {
    drawPipe(ctx, pipe.x, pipe.gapY, 15);
  }
};

const drawBird = (
  ctx: CanvasRenderingContext2D,
  y: number,
  velocity: number,
): void => {
  const cx = 30 + BIRD_SIZE / 2;
  const cy = y + BIRD_SIZE / 2;
  const tilt = Math.max(-0.45, Math.min(1.05, velocity * 0.22));

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);

  // Wing
  ctx.fillStyle = '#1b5e91';
  ctx.beginPath();
  ctx.ellipse(-1.5, 2.5, 6, 3.2, -0.45, 0, Math.PI * 2);
  ctx.fill();

  // Body
  const body = ctx.createRadialGradient(-2.5, -2.5, 0.5, 0, 0, 10);
  body.addColorStop(0, '#cfe6f7');
  body.addColorStop(0.55, '#4d9fd8');
  body.addColorStop(1, '#1b5e91');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 6.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly
  ctx.fillStyle = 'rgba(207, 230, 247, 0.75)';
  ctx.beginPath();
  ctx.ellipse(0.5, 2.6, 5, 2.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(6.5, -1);
  ctx.lineTo(12, 1.4);
  ctx.lineTo(6.5, 3);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(2.8, -2.2, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(3.4, -2, 1.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

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
    scroll: 0,
  });

  const resetGame = useCallback(() => {
    gameRef.current = {
      birdY: GAME_HEIGHT / 2,
      birdVelocity: 0,
      pipes: [],
      animationId: 0,
      score: 0,
      scroll: 0,
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
    ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0);

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
      game.scroll += PIPE_SPEED;
      drawBackground(ctx, game.scroll);
      drawPipes(ctx, game.pipes);
      drawBird(ctx, game.birdY, game.birdVelocity);

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
    ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0);

    drawBackground(ctx, 0);
    drawPipes(ctx, [
      { x: 140, gapY: 62, passed: true },
      { x: 205, gapY: 88, passed: false },
    ]);
    drawBird(ctx, GAME_HEIGHT / 2 - 6, 0);
  }, [gameState]);

  return (
    <div
      className="flappy-game"
      onClick={jump}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          jump();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Flappy Dev game"
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH * CANVAS_SCALE}
        height={GAME_HEIGHT * CANVAS_SCALE}
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
