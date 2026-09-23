import React, { useState } from 'react';

interface CalculatorDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculatorDemo: React.FC<CalculatorDemoProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [result, setResult] = useState(0);
  const [operator, setOperator] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true); // Thème sombre par défaut

  const handleInput = (val: string) => {
    if (val === '=') {
      if (operator && input) {
        const calcResult = evaluate(result, operator, parseFloat(input));
        // Limiter le nombre de décimales pour l'affichage propre
        const formattedResult = parseFloat(calcResult.toFixed(8)).toString();
        setDisplay(formattedResult);
        setResult(calcResult);
        setInput('');
        setOperator(null);
      }
    } else if (['+', '-', '*', '/'].includes(val)) {
      if (input) {
        setResult(parseFloat(input));
      } else {
        setResult(result);
      }
      setOperator(val);
      setInput('');
    } else {
      // Éviter les zéros multiples au début
      const newInput = input === '0' && val !== '.' ? val : input + val;
      setInput(newInput);
      setDisplay(newInput);
    }
  };

  const evaluate = (left: number, op: string, right: number): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right !== 0 ? left / right : 0;
      default: return right;
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setResult(0);
    setOperator(null);
    setInput('');
  };

  const buttons = [7, 8, 9, '/', 4, 5, 6, '*', 1, 2, 3, '-', 0, '.', '=', '+'];

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        /* Styles intégrés pour la calculatrice */
        .calc-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.4)'};
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }

        .calc-wrapper {
          background: ${isDarkMode ? 'rgba(22, 21, 43, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          border: 1px solid ${isDarkMode ? 'rgba(255, 0, 110, 0.3)' : 'rgba(0, 217, 255, 0.3)'};
          box-shadow: 0 25px 50px -12px ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0, 217, 255, 0.15)'}, 
                      0 0 20px ${isDarkMode ? 'rgba(255, 0, 110, 0.2)' : 'rgba(0, 217, 255, 0.2)'};
          border-radius: 24px;
          padding: 24px;
          width: 100%;
          max-width: 360px;
          transform: translateY(20px);
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          color: ${isDarkMode ? '#ffffff' : '#1e1e1e'};
        }

        .calc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          background: transparent !important;
          border: none !important;
        }

        .calc-header h2 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          flex-grow: 1;
          background: linear-gradient(90deg, #ff006e, #00d9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .theme-btn, .close-btn {
          background: transparent;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: inherit;
          transition: transform 0.2s;
          width: 40px; /* Assure le centrage du h2 */
          display: flex;
          justify-content: center;
        }

        .theme-btn:hover, .close-btn:hover {
          transform: scale(1.1);
        }

        .calc-display-container {
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.05)'};
          border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          text-align: right;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }

        .calc-operator-hint {
          font-size: 0.85rem;
          color: #ff006e;
          min-height: 1.2rem;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .calc-display {
          width: 100%;
          background: transparent;
          border: none;
          color: ${isDarkMode ? '#00d9ff' : '#00d9ff'};
          font-size: 2.5rem;
          font-weight: 800;
          text-align: right;
          outline: none;
          font-family: 'Courier New', monospace;
        }

        .calc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 12px;
        }

        .calc-btn {
          padding: 16px 0;
          border-radius: 12px;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Boutons Chiffres */
        .btn-num {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
          color: ${isDarkMode ? '#ffffff' : '#333333'};
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
        }
        .btn-num:hover {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'};
          transform: translateY(-2px);
        }

        /* Boutons Opérateurs */
        .btn-op {
          background: ${isDarkMode ? 'rgba(255, 0, 110, 0.15)' : 'rgba(0, 217, 255, 0.15)'};
          color: ${isDarkMode ? '#ff006e' : '#007a99'};
          border: 1px solid ${isDarkMode ? 'rgba(255, 0, 110, 0.3)' : 'rgba(0, 217, 255, 0.3)'};
        }
        .btn-op:hover {
          background: ${isDarkMode ? 'rgba(255, 0, 110, 0.3)' : 'rgba(0, 217, 255, 0.3)'};
          transform: translateY(-2px);
          box-shadow: 0 5px 15px ${isDarkMode ? 'rgba(255, 0, 110, 0.2)' : 'rgba(0, 217, 255, 0.2)'};
        }

        /* Bouton Égal */
        .btn-equal {
          background: linear-gradient(135deg, #ff006e, #8800c5);
          color: white;
          border: none;
        }
        .btn-equal:hover {
          box-shadow: 0 5px 15px rgba(255, 0, 110, 0.4);
          transform: translateY(-2px);
        }

        /* Bouton Clear */
        .btn-clear {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          transition: all 0.2s ease;
        }
        .btn-clear:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: translateY(-2px);
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Overlay modal */}
      <div className="calc-overlay" onClick={onClose}>
        
        {/* Conteneur principal (on stoppe la propagation pour ne pas fermer au clic sur la calc) */}
        <div className="calc-wrapper" onClick={(e) => e.stopPropagation()}>
          
          <div className="calc-header">
            <button className="theme-btn" onClick={() => setIsDarkMode(!isDarkMode)} title="Changer de thème">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            <h2>🧮 Calculatrice</h2>
            
            <button className="close-btn" onClick={onClose} title="Fermer">
              ✖
            </button>
          </div>

          {/* La croix est placée à la racine du wrapper */}
          

          <main>
            <div className="calc-display-container">
              {/* Petit affichage pour l'opérateur en cours */}
              <div className="calc-operator-hint">
                {operator ? `Opération en cours : ${operator}` : ''}
              </div>
              <input
                type="text"
                readOnly
                value={display}
                className="calc-display"
              />
            </div>

            <div className="calc-grid">
              {buttons.map((btn) => {
                const isOp = ['/', '+', '-', '*'].includes(btn.toString());
                const isEqual = btn === '=';
                let btnClass = 'calc-btn btn-num';
                
                if (isOp) btnClass = 'calc-btn btn-op';
                if (isEqual) btnClass = 'calc-btn btn-equal';

                return (
                  <button
                    key={btn}
                    onClick={() => handleInput(btn.toString())}
                    className={btnClass}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>

            <button onClick={handleClear} className="btn-clear">
              AC (Tout Effacer)
            </button>
          </main>

        </div>
      </div>
    </>
  );
};

export default CalculatorDemo;