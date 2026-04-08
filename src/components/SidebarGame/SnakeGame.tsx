import { useRef, useState, useEffect, useCallback } from 'react';
import './SnakeGame.css';

const GAME_WIDTH = 260;
const GAME_HEIGHT = 180;
const CELL_SIZE = 10;
const COLS = GAME_WIDTH / CELL_SIZE;
const ROWS = GAME_HEIGHT / CELL_SIZE;

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
      ctx.fillStyle = '#0c1222';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw food
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(
        game.food.x * CELL_SIZE + CELL_SIZE / 2,
        game.food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 1,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw snake
      game.snake.forEach((segment, i) => {
        ctx.fillStyle = i === 0 ? '#22c55e' : '#16a34a';
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      });
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

    ctx.fillStyle = '#0c1222';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw sample snake
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(101, 71, CELL_SIZE - 2, CELL_SIZE - 2);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(91, 71, CELL_SIZE - 2, CELL_SIZE - 2);
    ctx.fillRect(81, 71, CELL_SIZE - 2, CELL_SIZE - 2);

    // Draw sample food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(145, 75, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.fill();
  }, [gameState]);

  return (
    <div className="snake-game" onClick={startGame} tabIndex={0}>
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
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
