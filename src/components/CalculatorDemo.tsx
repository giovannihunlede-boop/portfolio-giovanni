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
        /* =========================================================
          CALCULATRICE — BASE
        ========================================================= */

        .calc-overlay {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100dvh;

          display: flex;
          justify-content: center;
          align-items: center;

          padding: 20px;

          background: ${
            isDarkMode
              ? 'rgba(0, 0, 0, 0.72)'
              : 'rgba(255, 255, 255, 0.48)'
          };

          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);

          z-index: 9999;

          overflow-y: auto;

          opacity: 0;
          animation: calcFadeIn 0.3s ease forwards;

          box-sizing: border-box;
        }


        /* =========================================================
          WRAPPER PRINCIPAL
        ========================================================= */

        .calc-wrapper {
          position: relative;

          width: 100%;
          max-width: 380px;

          max-height: calc(100dvh - 40px);

          padding: 22px;

          box-sizing: border-box;

          overflow-y: auto;
          overflow-x: hidden;

          background: ${
            isDarkMode
              ? 'rgba(22, 21, 43, 0.96)'
              : 'rgba(255, 255, 255, 0.96)'
          };

          border: 1px solid ${
            isDarkMode
              ? 'rgba(255, 0, 110, 0.3)'
              : 'rgba(0, 217, 255, 0.3)'
          };

          border-radius: 24px;

          box-shadow:
            0 25px 50px -12px ${
              isDarkMode
                ? 'rgba(0, 0, 0, 0.55)'
                : 'rgba(0, 217, 255, 0.15)'
            },
            0 0 20px ${
              isDarkMode
                ? 'rgba(255, 0, 110, 0.2)'
                : 'rgba(0, 217, 255, 0.2)'
            };

          color: ${isDarkMode ? '#ffffff' : '#1e1e1e'};

          transform: translateY(20px) scale(0.96);

          animation:
            calcSlideUp
            0.4s
            cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;

          scrollbar-width: thin;
          scrollbar-color: ${
            isDarkMode
              ? 'rgba(255, 0, 110, 0.5) transparent'
              : 'rgba(0, 217, 255, 0.5) transparent'
          };
        }


        /* =========================================================
          RESET DU MAIN GLOBAL
          
          Important car ton portfolio possède probablement déjà
          un style global pour "main".
        ========================================================= */

        .calc-wrapper main {
          width: 100%;
          max-width: none;

          margin: 0;
          padding: 0;

          box-sizing: border-box;

          display: block;
        }


        /* =========================================================
          HEADER
        ========================================================= */

        .calc-header {
          width: 100%;

          display: grid;

          grid-template-columns: 42px minmax(0, 1fr) 42px;

          align-items: center;

          gap: 8px;

          margin-bottom: 20px;

          padding: 0;

          background: transparent !important;
          border: none !important;

          box-sizing: border-box;
        }


        .calc-header h2 {
          min-width: 0;

          margin: 0;

          padding: 0;

          text-align: center;

          font-size: clamp(1rem, 4vw, 1.2rem);

          line-height: 1.2;

          font-weight: 700;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;

          background: linear-gradient(
            90deg,
            #ff006e,
            #00d9ff
          );

          -webkit-background-clip: text;
          background-clip: text;

          -webkit-text-fill-color: transparent;
        }


        /* =========================================================
          BOUTONS HEADER
        ========================================================= */

        .theme-btn,
        .close-btn {
          width: 42px;
          height: 42px;

          padding: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          background: transparent;

          border: 1px solid ${
            isDarkMode
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.08)'
          };

          border-radius: 12px;

          color: inherit;

          font-size: 1.1rem;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;

          touch-action: manipulation;

          -webkit-tap-highlight-color: transparent;
        }


        .theme-btn:hover,
        .close-btn:hover {
          transform: scale(1.06);

          background: ${
            isDarkMode
              ? 'rgba(255,255,255,0.07)'
              : 'rgba(0,0,0,0.05)'
          };

          border-color: ${
            isDarkMode
              ? 'rgba(255,0,110,0.3)'
              : 'rgba(0,217,255,0.3)'
          };
        }


        .theme-btn:active,
        .close-btn:active {
          transform: scale(0.94);
        }


        /* =========================================================
          ÉCRAN DE LA CALCULATRICE
        ========================================================= */

        .calc-display-container {
          width: 100%;

          box-sizing: border-box;

          background: ${
            isDarkMode
              ? 'rgba(0, 0, 0, 0.42)'
              : 'rgba(0, 0, 0, 0.05)'
          };

          border: 1px solid ${
            isDarkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)'
          };

          border-radius: 16px;

          padding: 14px 16px;

          margin-bottom: 18px;

          text-align: right;

          box-shadow:
            inset 0 2px 5px rgba(0,0,0,0.1);

          overflow: hidden;
        }


        /* =========================================================
          INDICATION OPÉRATEUR
        ========================================================= */

        .calc-operator-hint {
          width: 100%;

          min-height: 1.2rem;

          margin-bottom: 4px;

          font-size: 0.78rem;

          line-height: 1.4;

          font-weight: 600;

          color: #ff006e;

          text-align: right;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }


        /* =========================================================
          ÉCRAN PRINCIPAL
        ========================================================= */

        .calc-display {
          display: block;

          width: 100%;

          min-width: 0;

          margin: 0;
          padding: 0;

          box-sizing: border-box;

          background: transparent;

          border: none;

          outline: none;

          color: #00d9ff;

          font-family:
            'Courier New',
            Courier,
            monospace;

          font-size: clamp(
            2rem,
            10vw,
            2.7rem
          );

          line-height: 1.1;

          font-weight: 800;

          text-align: right;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;

          appearance: none;
          -webkit-appearance: none;
        }


        /* =========================================================
          GRILLE DES BOUTONS
        ========================================================= */

        .calc-grid {
          width: 100%;

          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 10px;

          margin-bottom: 12px;

          box-sizing: border-box;
        }


        /* =========================================================
          BOUTON COMMUN
        ========================================================= */

        .calc-btn {
          width: 100%;

          min-width: 0;

          aspect-ratio: 1 / 0.82;

          padding: 0;

          box-sizing: border-box;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 12px;

          font-size: clamp(
            1rem,
            5vw,
            1.25rem
          );

          line-height: 1;

          font-weight: 700;

          cursor: pointer;

          border: 1px solid transparent;

          transition:
            transform 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;

          touch-action: manipulation;

          -webkit-tap-highlight-color: transparent;

          user-select: none;
        }


        .calc-btn:active {
          transform: scale(0.94);
        }


        /* =========================================================
          BOUTONS CHIFFRES
        ========================================================= */

        .btn-num {
          background: ${
            isDarkMode
              ? 'rgba(255, 255, 255, 0.055)'
              : 'rgba(0, 0, 0, 0.035)'
          };

          color: ${
            isDarkMode
              ? '#ffffff'
              : '#333333'
          };

          border-color: ${
            isDarkMode
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(0,0,0,0.06)'
          };
        }


        .btn-num:hover {
          background: ${
            isDarkMode
              ? 'rgba(255, 255, 255, 0.14)'
              : 'rgba(0, 0, 0, 0.08)'
          };

          transform: translateY(-2px);
        }


        /* =========================================================
          BOUTONS OPÉRATEURS
        ========================================================= */

        .btn-op {
          background: ${
            isDarkMode
              ? 'rgba(255, 0, 110, 0.15)'
              : 'rgba(0, 217, 255, 0.15)'
          };

          color: ${
            isDarkMode
              ? '#ff006e'
              : '#007a99'
          };

          border-color: ${
            isDarkMode
              ? 'rgba(255, 0, 110, 0.3)'
              : 'rgba(0, 217, 255, 0.3)'
          };
        }


        .btn-op:hover {
          background: ${
            isDarkMode
              ? 'rgba(255, 0, 110, 0.3)'
              : 'rgba(0, 217, 255, 0.3)'
          };

          transform: translateY(-2px);

          box-shadow:
            0 5px 15px ${
              isDarkMode
                ? 'rgba(255, 0, 110, 0.2)'
                : 'rgba(0, 217, 255, 0.2)'
            };
        }


        /* =========================================================
          BOUTON ÉGAL
        ========================================================= */

        .btn-equal {
          background:
            linear-gradient(
              135deg,
              #ff006e,
              #8800c5
            );

          color: #ffffff;

          border: none;

          box-shadow:
            0 4px 12px rgba(255, 0, 110, 0.15);
        }


        .btn-equal:hover {
          box-shadow:
            0 6px 18px rgba(255, 0, 110, 0.4);

          transform: translateY(-2px);
        }


        /* =========================================================
          BOUTON CLEAR
        ========================================================= */

        .btn-clear {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 100%;

          min-height: 52px;

          box-sizing: border-box;

          padding: 14px 16px;

          border-radius: 12px;

          font-size: clamp(
            0.9rem,
            4vw,
            1.05rem
          );

          line-height: 1.2;

          font-weight: 700;

          cursor: pointer;

          background:
            rgba(239, 68, 68, 0.15);

          color: #ef4444;

          border:
            1px solid
            rgba(239, 68, 68, 0.3);

          transition:
            transform 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;

          touch-action: manipulation;

          -webkit-tap-highlight-color: transparent;
        }


        .btn-clear:hover {
          background:
            rgba(239, 68, 68, 0.3);

          transform: translateY(-2px);
        }


        .btn-clear:active {
          transform: scale(0.97);
        }


        /* =========================================================
          FOCUS ACCESSIBLE
        ========================================================= */

        .theme-btn:focus-visible,
        .close-btn:focus-visible,
        .calc-btn:focus-visible,
        .btn-clear:focus-visible {
          outline: 2px solid #00d9ff;

          outline-offset: 2px;
        }


        /* =========================================================
          TABLETTE
          769px → 1024px
        ========================================================= */

        @media (min-width: 769px) and (max-width: 1024px) {

          .calc-overlay {
            padding: 24px;
          }

          .calc-wrapper {
            max-width: 380px;
            padding: 22px;
          }
        }


        /* =========================================================
          MOBILE
          max-width: 768px
        ========================================================= */

        @media (max-width: 768px) {

          .calc-overlay {
            align-items: center;

            padding:
              16px
              max(16px, env(safe-area-inset-right))
              16px
              max(16px, env(safe-area-inset-left));

            overflow-y: auto;
          }


          .calc-wrapper {
            width: 100%;

            max-width: 390px;

            max-height:
              calc(
                100dvh
                - 32px
                - env(safe-area-inset-top)
                - env(safe-area-inset-bottom)
              );

            padding: 18px;

            border-radius: 20px;
          }


          .calc-header {
            grid-template-columns:
              40px minmax(0, 1fr) 40px;

            gap: 6px;

            margin-bottom: 16px;
          }


          .theme-btn,
          .close-btn {
            width: 40px;
            height: 40px;

            border-radius: 11px;

            font-size: 1rem;
          }


          .calc-header h2 {
            font-size: 1.05rem;
          }


          .calc-display-container {
            padding: 13px 14px;

            margin-bottom: 15px;

            border-radius: 14px;
          }


          .calc-operator-hint {
            font-size: 0.72rem;

            min-height: 1.05rem;
          }


          .calc-display {
            font-size: clamp(
              1.8rem,
              9vw,
              2.4rem
            );
          }


          .calc-grid {
            gap: 8px;

            margin-bottom: 10px;
          }


          .calc-btn {
            aspect-ratio: 1 / 0.86;

            border-radius: 10px;

            font-size: 1.08rem;
          }


          .btn-clear {
            min-height: 50px;

            padding: 13px 14px;

            border-radius: 10px;
          }
        }


        /* =========================================================
          PETIT MOBILE
          max-width: 480px
        ========================================================= */

        @media (max-width: 480px) {

          .calc-overlay {
            padding: 12px;
          }


          .calc-wrapper {
            max-width: 100%;

            max-height:
              calc(
                100dvh
                - 24px
              );

            padding: 16px;

            border-radius: 18px;
          }


          .calc-header {
            grid-template-columns:
              38px minmax(0, 1fr) 38px;

            margin-bottom: 14px;
          }


          .theme-btn,
          .close-btn {
            width: 38px;
            height: 38px;

            border-radius: 10px;
          }


          .calc-header h2 {
            font-size: 1rem;
          }


          .calc-display-container {
            padding: 12px;

            margin-bottom: 13px;

            border-radius: 13px;
          }


          .calc-display {
            font-size: clamp(
              1.7rem,
              10vw,
              2.2rem
            );
          }


          .calc-grid {
            gap: 7px;
          }


          .calc-btn {
            aspect-ratio: 1 / 0.88;

            border-radius: 9px;

            font-size: 1rem;
          }


          .btn-clear {
            min-height: 48px;

            font-size: 0.92rem;

            border-radius: 9px;
          }
        }


        /* =========================================================
          iPHONE / 375px
        ========================================================= */

        @media (max-width: 390px) {

          .calc-overlay {
            padding: 8px;
          }


          .calc-wrapper {
            padding: 14px;

            border-radius: 17px;
          }


          .calc-header {
            grid-template-columns:
              36px minmax(0, 1fr) 36px;

            gap: 5px;

            margin-bottom: 12px;
          }


          .theme-btn,
          .close-btn {
            width: 36px;
            height: 36px;

            font-size: 0.9rem;
          }


          .calc-header h2 {
            font-size: 0.95rem;
          }


          .calc-display-container {
            padding: 10px;

            margin-bottom: 11px;
          }


          .calc-operator-hint {
            font-size: 0.67rem;
          }


          .calc-display {
            font-size: clamp(
              1.55rem,
              10vw,
              2rem
            );
          }


          .calc-grid {
            gap: 6px;
          }


          .calc-btn {
            aspect-ratio: 1 / 0.9;

            border-radius: 8px;

            font-size: 0.95rem;
          }


          .btn-clear {
            min-height: 45px;

            padding: 11px;

            font-size: 0.85rem;

            border-radius: 8px;
          }
        }


        /* =========================================================
          TRÈS PETIT ÉCRAN
          320px → 350px
        ========================================================= */

        @media (max-width: 350px) {

          .calc-overlay {
            padding: 5px;
          }


          .calc-wrapper {
            padding: 12px;

            border-radius: 15px;
          }


          .calc-header {
            margin-bottom: 10px;
          }


          .theme-btn,
          .close-btn {
            width: 34px;
            height: 34px;
          }


          .calc-display-container {
            padding: 9px;

            margin-bottom: 9px;
          }


          .calc-grid {
            gap: 5px;
          }


          .calc-btn {
            font-size: 0.9rem;
          }


          .btn-clear {
            min-height: 42px;

            font-size: 0.8rem;
          }
        }


        /* =========================================================
          ÉCRANS TRÈS BAS
          
          Exemple : certains téléphones en mode paysage
        ========================================================= */

        @media (max-height: 600px) {

          .calc-overlay {
            align-items: flex-start;

            padding-top: 10px;
            padding-bottom: 10px;
          }


          .calc-wrapper {
            max-height:
              calc(100dvh - 20px);

            padding: 14px;
          }


          .calc-header {
            margin-bottom: 10px;
          }


          .calc-display-container {
            padding: 10px;

            margin-bottom: 10px;
          }


          .calc-grid {
            gap: 6px;

            margin-bottom: 8px;
          }


          .calc-btn {
            aspect-ratio: 1 / 0.75;
          }


          .btn-clear {
            min-height: 42px;

            padding: 10px;
          }
        }


        /* =========================================================
          MODE TACTILE
          
          Sur téléphone, pas de déplacement au hover.
        ========================================================= */

        @media (hover: none) and (pointer: coarse) {

          .calc-btn:hover,
          .btn-clear:hover,
          .theme-btn:hover,
          .close-btn:hover {
            transform: none;
          }


          .calc-btn:active {
            transform: scale(0.94);
          }


          .btn-clear:active {
            transform: scale(0.97);
          }
        }


        /* =========================================================
          ANIMATIONS
        ========================================================= */

        @keyframes calcFadeIn {

          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }


        @keyframes calcSlideUp {

          from {
            opacity: 0;

            transform:
              translateY(30px)
              scale(0.95);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }


        /* =========================================================
          RÉDUCTION DES ANIMATIONS
          Accessibilité
        ========================================================= */

        @media (prefers-reduced-motion: reduce) {

          .calc-overlay,
          .calc-wrapper {
            animation: none;

            opacity: 1;

            transform: none;
          }


          .calc-btn,
          .btn-clear,
          .theme-btn,
          .close-btn {
            transition: none;
          }
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