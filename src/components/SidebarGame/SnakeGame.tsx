import { useRef, useState, useEffect, useCallback } from 'react';
import './SnakeGame.css';

const GAME_WIDTH = 260;
const GAME_HEIGHT = 180;
const CELL_SIZE = 10;
const COLS = GAME_WIDTH / CELL_SIZE;
const ROWS = GAME_HEIGHT / CELL_SIZE;
/** Backing-store multiplier so the game stays crisp on hi-dpi screens */
const CANVAS_SCALE = 2;

/* ─────────────── Drawing ─────────────── */

const roundedBox = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void => {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
};

const drawGrid = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = "#0c1222";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.strokeStyle = "rgba(148, 163, 184, 0.07)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= GAME_WIDTH; x += CELL_SIZE) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, GAME_HEIGHT);
  }
  for (let y = 0; y <= GAME_HEIGHT; y += CELL_SIZE) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(GAME_WIDTH, y + 0.5);
  }
  ctx.stroke();
};

const drawFood = (
  ctx: CanvasRenderingContext2D,
  food: Point,
  time: number,
): void => {
  const cx = food.x * CELL_SIZE + CELL_SIZE / 2;
  const cy = food.y * CELL_SIZE + CELL_SIZE / 2;
  const pulse = 1 + Math.sin(time / 260) * 0.12;

  ctx.save();
  ctx.shadowColor = "rgba(239, 68, 68, 0.85)";
  ctx.shadowBlur = 9;
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(cx, cy, (CELL_SIZE / 2 - 1) * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.beginPath();
  ctx.arc(cx - 1.4, cy - 1.6, 1.1, 0, Math.PI * 2);
  ctx.fill();
};

const drawSnake = (
  ctx: CanvasRenderingContext2D,
  snake: Point[],
  direction: Point,
): void => {
  const total = Math.max(1, snake.length - 1);

  // Body: bright head fading into a dark tail
  snake.forEach((segment, i) => {
    const t = i / total;
    const inset = 1 + t * 1.6;
    const size = CELL_SIZE - inset * 2;
    const green = Math.round(58 + (1 - t) * 104);
    ctx.fillStyle = `rgb(${Math.round(22 + (1 - t) * 48)}, ${green}, ${Math.round(32 + (1 - t) * 62)})`;
    roundedBox(ctx, segment.x * CELL_SIZE + inset, segment.y * CELL_SIZE + inset, size, size, 2.5);
    ctx.fill();
  });

  // Head details
  const head = snake[0];
  const hx = head.x * CELL_SIZE + CELL_SIZE / 2;
  const hy = head.y * CELL_SIZE + CELL_SIZE / 2;
  const eyeOffset = 2.4;
  const perpX = -direction.y;
  const perpY = direction.x;

  ctx.fillStyle = "#ffffff";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(
      hx + direction.x * 1.4 + perpX * side * eyeOffset,
      hy + direction.y * 1.4 + perpY * side * eyeOffset,
      1.5,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  ctx.fillStyle = "#0f172a";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(
      hx + direction.x * 1.9 + perpX * side * eyeOffset,
      hy + direction.y * 1.9 + perpY * side * eyeOffset,
      0.8,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
};

interface Point {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const gameRef = useRef({
    snake: [{ x: 10, y: 7 }] as Point[],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 7 } as Point,
    score: 0,
    intervalId: 0,
  });

  const spawnFood = useCallback(() => {
    const game = gameRef.current;
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (game.snake.some(s => s.x === newFood.x && s.y === newFood.y));
    game.food = newFood;
  }, []);

  const resetGame = useCallback(() => {
    gameRef.current = {
      snake: [{ x: 10, y: 7 }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      food: { x: 15, y: 7 },
      score: 0,
      intervalId: 0,
    };
    setScore(0);
  }, []);

  const startGame = useCallback(() => {
    if (gameState === 'playing') return;
    resetGame();
    setGameState('playing');
  }, [gameState, resetGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      const game = gameRef.current;
      const { direction } = game;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) game.nextDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) game.nextDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) game.nextDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) game.nextDirection = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0);

    const game = gameRef.current;

    const tick = () => {
      // Update direction
      game.direction = game.nextDirection;

      // Move snake
      const head = game.snake[0];
      const newHead = {
        x: head.x + game.direction.x,
        y: head.y + game.direction.y,
      };

      // Wall collision (wrap around)
      if (newHead.x < 0) newHead.x = COLS - 1;
      if (newHead.x >= COLS) newHead.x = 0;
      if (newHead.y < 0) newHead.y = ROWS - 1;
      if (newHead.y >= ROWS) newHead.y = 0;

      // Self collision
      if (game.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
        clearInterval(game.intervalId);
        setGameState('gameover');
        if (game.score > highScore) {
          setHighScore(game.score);
          localStorage.setItem('snake-highscore', game.score.toString());
        }
        return;
      }

      game.snake.unshift(newHead);

      // Food collision
      if (newHead.x === game.food.x && newHead.y === game.food.y) {
        game.score++;
        setScore(game.score);
        spawnFood();
      } else {
        game.snake.pop();
      }

      // Draw
      drawGrid(ctx);
      drawFood(ctx, game.food, Date.now());
      drawSnake(ctx, game.snake, game.direction);
    };

    game.intervalId = window.setInterval(tick, 220);

    return () => {
      clearInterval(game.intervalId);
    };
  }, [gameState, highScore, spawnFood]);

  // Draw idle/gameover state
  useEffect(() => {
    if (gameState === 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0);

    drawGrid(ctx);
    drawFood(ctx, { x: 15, y: 7 }, Date.now());
    drawSnake(
      ctx,
      [
        { x: 10, y: 7 },
        { x: 9, y: 7 },
        { x: 8, y: 7 },
        { x: 7, y: 7 },
      ],
      { x: 1, y: 0 },
    );
  }, [gameState]);

  return (
    <div
      className="snake-game"
      onClick={startGame}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          startGame();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Snake game"
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH * CANVAS_SCALE}
        height={GAME_HEIGHT * CANVAS_SCALE}
        className="snake-canvas"
      />

      {gameState === 'idle' && (
        <div className="snake-overlay">
          <span className="snake-title">Snake</span>
          <span className="snake-hint">Click to play, WASD to move</span>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="snake-overlay">
          <span className="snake-title">Game Over!</span>
          <span className="snake-score">Score: {score}</span>
          <span className="snake-hint">Click to retry</span>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="snake-score-display">{score}</div>
      )}

      <div className="snake-highscore">Best: {highScore}</div>
    </div>
  );
};

export default SnakeGame;
