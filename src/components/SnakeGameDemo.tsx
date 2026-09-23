import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SnakeGameDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const SnakeGameDemo: React.FC<SnakeGameDemoProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const gameStateRef = useRef({
    snake: [{ x: 6, y: 6 }],
    direction: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 8, y: 8 },
    score: 0,
    gameOver: false,
    width: 12,
    height: 12,
    cellSize: 25, // Taille ajustée pour un meilleur rendu mobile/PC
  });

  const setDirection = useCallback((dx: number, dy: number) => {
    const state = gameStateRef.current;
    if (dx !== 0 && state.direction.x === 0) state.nextDir = { x: dx, y: 0 };
    if (dy !== 0 && state.direction.y === 0) state.nextDir = { x: 0, y: dy };
  }, []);

  useEffect(() => {
    if (!isOpen || !gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Empêche le scroll de la page
      }
      if (e.key === 'ArrowUp') setDirection(0, -1);
      else if (e.key === 'ArrowDown') setDirection(0, 1);
      else if (e.key === 'ArrowLeft') setDirection(-1, 0);
      else if (e.key === 'ArrowRight') setDirection(1, 0);
    };

    document.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, gameStarted, setDirection]);

  useEffect(() => {
    if (!isOpen || !gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const state = gameStateRef.current;

    const gameLoop = setInterval(() => {
      // Mise à jour de la position
      state.direction = state.nextDir;
      const head = {
        x: state.snake[0].x + state.direction.x,
        y: state.snake[0].y + state.direction.y,
      };

      // Collisions (Murs)
      if (head.x < 0 || head.x >= state.width || head.y < 0 || head.y >= state.height) {
        setGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      // Collisions (Soi-même)
      if (state.snake.some((s) => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      state.snake.unshift(head);

      // Nourriture
      if (head.x === state.food.x && head.y === state.food.y) {
        state.score += 10;
        setScore(state.score);
        state.food = {
          x: Math.floor(Math.random() * state.width),
          y: Math.floor(Math.random() * state.height),
        };
      } else {
        state.snake.pop();
      }

      // Dessin
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Fond transparent géré par le CSS

      // Dessiner la pomme (Néon Rose)
      ctx.fillStyle = '#ff006e';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff006e';
      ctx.fillRect(state.food.x * state.cellSize, state.food.y * state.cellSize, state.cellSize - 1, state.cellSize - 1);

      // Dessiner le serpent (Néon Cyan)
      ctx.fillStyle = '#00d9ff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00d9ff';
      state.snake.forEach((s) => {
        ctx.fillRect(s.x * state.cellSize, s.y * state.cellSize, state.cellSize - 1, state.cellSize - 1);
      });
      
      ctx.shadowBlur = 0; // Reset pour le prochain rendu

    }, 150);

    return () => clearInterval(gameLoop);
  }, [isOpen, gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    gameStateRef.current = {
      snake: [{ x: 6, y: 6 }],
      direction: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: { x: Math.floor(Math.random() * 12), y: Math.floor(Math.random() * 12) },
      score: 0,
      gameOver: false,
      width: 12,
      height: 12,
      cellSize: 25,
    };
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .sg-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.4)'};
          backdrop-filter: blur(8px);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000; opacity: 0; animation: fadeIn 0.3s forwards;
        }

        .sg-wrapper {
          background: ${isDarkMode ? 'rgba(22, 21, 43, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          border: 1px solid ${isDarkMode ? 'rgba(0, 217, 255, 0.3)' : 'rgba(255, 0, 110, 0.3)'};
          box-shadow: 0 25px 50px -12px ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0, 217, 255, 0.15)'};
          border-radius: 24px;
          padding: 0 0 24px 0;
          width: 90%; max-width: 400px;
          transform: translateY(20px);
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          color: ${isDarkMode ? '#ffffff' : '#1e1e1e'};
          overflow: hidden;
        }

        /* En-tête standardisé (Calculatrice, FlowNote, Snake) */
        .sg-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 24px 10px 24px;
          background: transparent !important;
          border: none !important;
        }
        .sg-title-container {
          text-align: center; flex-grow: 1;
        }
        .sg-header h2 {
          margin: 0; font-size: 1.4rem; font-weight: 700;
          background: linear-gradient(90deg, #ff006e, #00d9ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .sg-header p {
          margin: 4px 0 0 0; font-size: 0.85rem;
          color: ${isDarkMode ? '#a0a0b5' : '#555'};
        }
        .sg-close, .sg-theme-btn {
          background: transparent; border: none; font-size: 1.2rem;
          cursor: pointer; color: inherit; transition: transform 0.2s;
          width: 40px; display: flex; justify-content: center;
        }
        .sg-close:hover, .sg-theme-btn:hover { transform: scale(1.1); }

        /* Contenu du jeu */
        .sg-main {
          display: flex; flex-direction: column; align-items: center;
          padding: 10px 24px;
        }

        .sg-score {
          font-size: 1.2rem; font-weight: 800; margin-bottom: 15px;
          color: ${isDarkMode ? '#00d9ff' : '#007a99'};
        }
        .sg-score.over { color: #ff006e; }

        .sg-canvas-container {
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.05)'};
          border: 2px solid ${isDarkMode ? 'rgba(0, 217, 255, 0.4)' : 'rgba(255, 0, 110, 0.4)'};
          border-radius: 12px;
          box-shadow: inset 0 0 15px rgba(0,0,0,0.5);
          overflow: hidden;
        }

        .sg-btn-primary {
          padding: 14px 28px; margin-top: 15px;
          background: linear-gradient(135deg, #ff006e, #8800c5);
          color: white; border: none; border-radius: 12px;
          font-weight: 700; font-size: 1.1rem;
          cursor: pointer; transition: 0.3s;
          box-shadow: 0 4px 15px rgba(255, 0, 110, 0.3);
        }
        .sg-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 0, 110, 0.5); }

        /* D-PAD (Contrôles Mobiles) */
        .sg-dpad {
          display: flex; flex-direction: column; align-items: center;
          gap: 8px; margin-top: 20px;
        }
        .sg-dpad-row {
          display: flex; gap: 40px; /* Espace au centre pour la flèche bas */
        }
        .sg-dpad-btn {
          width: 50px; height: 50px;
          background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border-radius: 12px; font-size: 1.5rem;
          display: flex; justify-content: center; align-items: center;
          cursor: pointer; color: ${isDarkMode ? 'white' : 'black'};
          transition: 0.2s;
        }
        .sg-dpad-btn:active {
          background: ${isDarkMode ? 'rgba(0, 217, 255, 0.3)' : 'rgba(255, 0, 110, 0.2)'};
          transform: scale(0.95);
        }

        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div className="sg-overlay" onClick={onClose}>
        <div className="sg-wrapper" onClick={(e) => e.stopPropagation()}>
          
          <div className="sg-header">
            <button className="sg-theme-btn" onClick={() => setIsDarkMode(!isDarkMode)} title="Changer de thème">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className="sg-title-container">
              <h2>🐍 Snake Game</h2>
              <p>Jouable au clavier ou tactile</p>
            </div>
            <button className="sg-close" onClick={onClose} title="Fermer">✖</button>
          </div>

          <div className="sg-main">
            {gameStarted && (
              <div className={`sg-score ${gameOver ? 'over' : ''}`}>
                {gameOver ? `💀 Game Over ! Score: ${score}` : `🏆 Score: ${score}`}
              </div>
            )}

            {!gameStarted ? (
              <button className="sg-btn-primary" onClick={startGame}>
                🎮 Démarrer le jeu
              </button>
            ) : (
              <>
                <div className="sg-canvas-container">
                  <canvas ref={canvasRef} width={300} height={300} />
                </div>
                
                {gameOver && (
                  <button className="sg-btn-primary" onClick={startGame}>
                     Rejouer
                  </button>
                )}

                {/* Contrôles tactiles (D-Pad) visibles uniquement si le jeu est en cours */}
                {!gameOver && (
                  <div className="sg-dpad">
                    <button className="sg-dpad-btn" onClick={() => setDirection(0, -1)}>⬆️</button>
                    <div className="sg-dpad-row">
                      <button className="sg-dpad-btn" onClick={() => setDirection(-1, 0)}>⬅️</button>
                      <button className="sg-dpad-btn" onClick={() => setDirection(1, 0)}>➡️</button>
                    </div>
                    <button className="sg-dpad-btn" onClick={() => setDirection(0, 1)}>⬇️</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SnakeGameDemo;