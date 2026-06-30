import React, { useState, useEffect, useRef } from 'react'

interface SnakeGameDemoProps {
  isOpen: boolean
  onClose: () => void
}

const SnakeGameDemo: React.FC<SnakeGameDemoProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const gameStateRef = useRef({
    snake: [{ x: 6, y: 6 }],
    direction: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: Math.floor(Math.random() * 12), y: Math.floor(Math.random() * 12) },
    score: 0,
    gameOver: false,
    width: 12,
    height: 12,
    cellSize: 30,
  })

  useEffect(() => {
    if (!isOpen || !gameStarted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current
      const key = e.key

      if (key === 'ArrowUp' && state.direction.y === 0) {
        state.nextDir = { x: 0, y: -1 }
        e.preventDefault()
      } else if (key === 'ArrowDown' && state.direction.y === 0) {
        state.nextDir = { x: 0, y: 1 }
        e.preventDefault()
      } else if (key === 'ArrowLeft' && state.direction.x === 0) {
        state.nextDir = { x: -1, y: 0 }
        e.preventDefault()
      } else if (key === 'ArrowRight' && state.direction.x === 0) {
        state.nextDir = { x: 1, y: 0 }
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, gameStarted])

  useEffect(() => {
    if (!isOpen || !gameStarted || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current

    const gameLoop = setInterval(() => {
      // Update
      state.direction = state.nextDir
      const head = {
        x: state.snake[0].x + state.direction.x,
        y: state.snake[0].y + state.direction.y,
      }

      // Check collisions
      if (head.x < 0 || head.x >= state.width || head.y < 0 || head.y >= state.height) {
        setGameOver(true)
        clearInterval(gameLoop)
        return
      }

      if (state.snake.some((s) => s.x === head.x && s.y === head.y)) {
        setGameOver(true)
        clearInterval(gameLoop)
        return
      }

      state.snake.unshift(head)

      if (head.x === state.food.x && head.y === state.food.y) {
        state.score += 10
        setScore(state.score)
        state.food = {
          x: Math.floor(Math.random() * state.width),
          y: Math.floor(Math.random() * state.height),
        }
      } else {
        state.snake.pop()
      }

      // Draw
      ctx.fillStyle = '#0a0e27'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#00d9ff'
      state.snake.forEach((s) => {
        ctx.fillRect(s.x * state.cellSize, s.y * state.cellSize, state.cellSize - 1, state.cellSize - 1)
      })

      ctx.fillStyle = '#ff006e'
      ctx.fillRect(state.food.x * state.cellSize, state.food.y * state.cellSize, state.cellSize - 1, state.cellSize - 1)
    }, 150)

    return () => clearInterval(gameLoop)
  }, [isOpen, gameStarted, gameOver])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    gameStateRef.current = {
      snake: [{ x: 6, y: 6 }],
      direction: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: { x: Math.floor(Math.random() * 12), y: Math.floor(Math.random() * 12) },
      score: 0,
      gameOver: false,
      width: 12,
      height: 12,
      cellSize: 30,
    }
  }

  return (
    <div className={`demo-modal ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="demo-modal-content">
        <button className="demo-close" onClick={onClose}>
          &times;
        </button>

        <div className="demo-container">
          <header className="demo-header">
            <h1>🐍 Snake Game - Démo Interactive</h1>
            <p>Utilisez les flèches pour contrôler le serpent!</p>
          </header>

          <main className="demo-main" style={{ textAlign: 'center', padding: '20px' }}>
            {!gameStarted ? (
              <button
                onClick={startGame}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #ff006e 0%, #00d9ff 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '20px',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = 'translateY(0)')}
              >
                🎮 Démarrer le jeu
              </button>
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  width={12 * 30}
                  height={12 * 30}
                  style={{
                    border: '2px solid #ff006e',
                    backgroundColor: '#0a0e27',
                    marginBottom: '20px',
                    borderRadius: '12px',
                  }}
                />
                <div style={{ color: '#ff006e', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }}>
                  {gameOver ? `🎮 Game Over! Score: ${score}` : `Score: ${score}`}
                </div>
                {gameOver && (
                  <button
                    onClick={startGame}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #ff006e 0%, #00d9ff 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    🔄 Rejouer
                  </button>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default SnakeGameDemo
