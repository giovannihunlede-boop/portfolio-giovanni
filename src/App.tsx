import { useState } from 'react'
import FlowNoteDemo from './components/FlowNoteDemo'
import SnakeGameDemo from './components/SnakeGameDemo'
import TaskManagerDemo from './components/TaskManagerDemo'
import CalculatorDemo from './components/CalculatorDemo'
import ContactForm from './components/ContactForm'
import photoGiovanni from '../public/images/giovanni.png'
import { useEffect } from 'react';
function App() {
  const [isFlowNoteOpen, setIsFlowNoteOpen] = useState(false)
  const [isSnakeOpen, setIsSnakeOpen] = useState(false)
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  useEffect(() => {window.scrollTo(0, 0);}, []);
  const projects = [
    {
      id: 1,
      title: "Calculator",
      description: "Une calculatrice interactive avec support des opérations mathématiques basiques.",
      technologies: ["React", "TypeScript", "CSS"],
      image: "/images/calculator.png",
      demoState: isCalculatorOpen,
      setDemoState: setIsCalculatorOpen,
      codeLink: "projects/05-CSharpCalculator/"
    },
    {
      id: 2,
      title: "FlowNote - App de Notes Intelligente",
      description: "Application web moderne avec catégories, recherche en temps réel et persistance localStorage. Démontre maîtrise du DOM, gestion d'état, et design responsive avec Glassmorphism.",
      technologies: ["React", "TypeScript", "Vite", "LocalStorage"],
      image: "/images/flownote.png",
      demoState: isFlowNoteOpen,
      setDemoState: setIsFlowNoteOpen,
      codeLink: "projects/01-FlowNote/"
    },
    {
      id: 3,
      title: "Snake Game - Développement Jeux",
      description: "Jeu classique en React avec boucle de jeu professionnelle, gestion des collisions et animations fluides. Montre expertise Canvas, state management, et architecture game loop.",
      technologies: ["React", "Canvas API", "TypeScript", "Game Loop"],
      image: "/images/snakegame.png",
      demoState: isSnakeOpen,
      setDemoState: setIsSnakeOpen,
      codeLink: "projects/02-SnakeGame/"
    },
    {
      id: 4,
      title: "TaskManager - React Web App",
      description: "Application complète de gestion de tâches avec priorités, filtrage, et persistance localStorage. Démontre expertise CRUD, state management React, et communication asynchrone.",
      technologies: ["React", "TypeScript", "State Management", "localStorage"],
      image: "/images/taskmanager.png",
      demoState: isTaskManagerOpen,
      setDemoState: setIsTaskManagerOpen,
      codeLink: "projects/03-TaskManager/"
    }
  ];

  return (
    <>
      {/* Header */}
      <header>
        <h2 className="nom">Giovanni</h2>
        <nav className="liens">
          <a href="#accueil">Accueil</a>
          <a href="#apropos">À Propos</a>
          <a href="#competences">Compétences</a>
          <a href="#projets">Projets</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        {/* SECTION ACCUEIL */}
        <section id="accueil" className="accueil">
          <div className="toftruc">
            <div className="texte">
              <h3>
                <em>Salut, </em> je suis <br />
                <strong>Giovanni</strong>
              </h3>
              <p className="word">Développeur Fullstack | Graphiste(UI/UX) </p>
            </div>
            <img src={photoGiovanni} alt="Giovanni" className="image" />
          </div>
        </section>

        {/* SECTION À PROPOS */}
        <section id="apropos" className="section apropos">
          <div className="apropos-content">
            <h2>À Propos</h2>
            <p>
              Je crois que chaque ligne de code peut raconter une histoire. Entre design, logique et imagination, je
              crée des interfaces où l&apos;esthétique rencontre la fonctionnalité.
              <br />
              <br />
              Mon approche repose sur la simplicité, la fluidité et la cohérence visuelle. J&apos;aime concevoir des
              projets qui parlent aux yeux et à l&apos;esprit, tout en gardant une empreinte élégante et minimaliste.
            </p>
          </div>
        </section>

        {/* SECTION COMPÉTENCES */}
        <section id="competences" className="section competences">
          <h2>Mes Compétences</h2>

          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-icon">🌐</div>
              <h3>Frontend Development</h3>
              <p>
                HTML5 sémantique, CSS3 avancé (Grid, Flexbox, animations), JavaScript vanilla ES6+. Design responsive
                et Glassmorphism moderne.
              </p>
            </div>

            <div className="skill-card">
              <div className="skill-icon">⚡</div>
              <h3>Backend & Databases</h3>
              <p>
                PHP serveur, MySQL/PDO, API REST, AJAX/Fetch. Sécurité (préparé statements), gestion de données et
                architecture MVC.
              </p>
            </div>

            <div className="skill-card">
              <div className="skill-icon">🎮</div>
              <h3>Game & Systems Development</h3>
              <p>
                Python avancé avec Pygame, Java OOP avec Collections/Streams, C# .NET. Architecture game loops et
                patterns de conception.
              </p>
            </div>

            <div className="skill-card">
              <div className="skill-icon">🛠️</div>
              <h3>Tools & Methodologies</h3>
              <p>
                Git/GitHub, VS Code, ligne de commande. Code propre, documentation, testing, et déploiement (GitHub
                Pages, Heroku, Railway).
              </p>
            </div>
          </div>
        </section>

        {/* SECTION PROJETS */}
        <section id="projets" className="section projets">
        <h2>Mes Projets Réalisés</h2>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-img-container">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-img"
                />
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="tech-tags">
                  {project.technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="project-links">
                  <button
                    onClick={() => project.setDemoState(true)}
                    className="btn-projet"
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ff006e 0%, #00d9ff 100%)',
                      color: 'white',
                      padding: '11px 24px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      boxShadow: '0 10px 28px rgba(255, 0, 110, 0.35)',
                      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      fontSize: '0.95rem',
                      flex: 1,
                      textAlign: 'center',
                    }}
                  > Tester maintenant </button>
                  <a href={project.codeLink} className="btn-github" target="_blank" rel="noreferrer">
                    Code source 
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

        {/* SECTION CONTACT */}
        <ContactForm />
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-content">
          <h3 className="nom-footer">Giovanni.</h3>
          <p>Création d&apos;expériences web modernes et fluides.</p>

          <div className="social-links">
            <a href="#" aria-label="LinkedIn">
              💼 LinkedIn
            </a>
            <a href="#" aria-label="GitHub">
              🐙 GitHub
            </a>
            <a href="#" aria-label="Twitter">
              🐦 Twitter
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Giovanni. Tous droits réservés.</p>
          <p>Designed by Giovanni</p>
        </div>
      </footer>

      {/* FLOWNOTE MODAL */}
      <FlowNoteDemo isOpen={isFlowNoteOpen} onClose={() => setIsFlowNoteOpen(false)} />

      {/* SNAKE GAME MODAL */}
      <SnakeGameDemo isOpen={isSnakeOpen} onClose={() => setIsSnakeOpen(false)} />

      {/* TASKMANAGER MODAL */}
      <TaskManagerDemo isOpen={isTaskManagerOpen} onClose={() => setIsTaskManagerOpen(false)} />

      {/* CALCULATOR MODAL */}
      <CalculatorDemo isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </>
  )
}

export default App
