import React, { useState } from 'react'

interface CalculatorDemoProps {
  isOpen: boolean
  onClose: () => void
}

const CalculatorDemo: React.FC<CalculatorDemoProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0')
  const [result, setResult] = useState(0)
  const [operator, setOperator] = useState<string | null>(null)
  const [input, setInput] = useState('')

  const handleInput = (val: string) => {
    if (val === '=') {
      if (operator && input) {
        const calcResult = evaluate(result, operator, parseFloat(input))
        setDisplay(calcResult.toString())
        setResult(calcResult)
        setInput('')
        setOperator(null)
      }
    } else if (['+', '-', '*', '/'].includes(val)) {
      if (input) {
        setResult(parseFloat(input))
      } else {
        setResult(result)
      }
      setOperator(val)
      setInput('')
    } else {
      setInput(input + val)
      setDisplay(input + val)
    }
  }

  const evaluate = (left: number, op: string, right: number): number => {
    switch (op) {
      case '+':
        return left + right
      case '-':
        return left - right
      case '*':
        return left * right
      case '/':
        return right !== 0 ? left / right : 0
      default:
        return right
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setResult(0)
    setOperator(null)
    setInput('')
  }

  const buttons = [7, 8, 9, '/', 4, 5, 6, '*', 1, 2, 3, '-', 0, '.', '=', '+']

  return (
    <div className={`demo-modal ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="demo-modal-content">
        <button className="demo-close" onClick={onClose}>
          &times;
        </button>

        <div className="demo-container">
          <header className="demo-header">
            <h1>🧮 Calculatrice Scientifique</h1>
            <p>Opérations avancées intégrées</p>
          </header>

          <main className="demo-main" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,0,110,0.2)', borderRadius: '15px', padding: '15px' }}>
              <input
                type="text"
                readOnly
                value={display}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,0,110,0.3)',
                  borderRadius: '8px',
                  color: '#ff006e',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  textAlign: 'right',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                {buttons.map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleInput(btn.toString())}
                    style={{
                      padding: '14px',
                      background: ['/', '+', '-', '*', '='].includes(btn.toString())
                        ? 'rgba(255,0,110,0.2)'
                        : 'rgba(99,102,241,0.2)',
                      border: '1px solid rgba(255,0,110,0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(255,0,110,0.3)'
                      ;(e.target as HTMLElement).style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = ['/', '+', '-', '*', '='].includes(btn.toString())
                        ? 'rgba(255,0,110,0.2)'
                        : 'rgba(99,102,241,0.2)'
                      ;(e.target as HTMLElement).style.transform = 'scale(1)'
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>
              <button
                onClick={handleClear}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'rgba(239,68,68,0.2)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                }}
              >
                C
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default CalculatorDemo
