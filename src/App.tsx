import { useState } from 'react'
import FlowNoteDemo from './components/FlowNoteDemo'
import SnakeGameDemo from './components/SnakeGameDemo'
import TaskManagerDemo from './components/TaskManagerDemo'
import CalculatorDemo from './components/CalculatorDemo'
import ContactForm from './components/ContactForm'
import DigiAlertDemo from './components/DigiAlertDemo'
import { useEffect } from 'react'

function App() {
  const [isFlowNoteOpen, setIsFlowNoteOpen] = useState(false)
  const [isSnakeOpen, setIsSnakeOpen] = useState(false)
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [isDigiAlertOpen, setIsDigiAlertOpen] = useState(false)
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light'
  })
  useEffect(() => {
    window.scrollTo(0, 0)

    // Logique du Thème
    if (isLightMode) {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'dark')
    }

    // Logique du Curseur Magique
    const cursor = document.getElementById('glow-cursor');
    const handleMouseMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX - 150}px, ${e.clientY - 150}px, 0)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLightMode])
  const projects = [
    {
      id: 1,
      title: "Calculator",
      description: "Une calculatrice interactive avec support des opérations mathématiques basiques.",
      technologies: ["React", "TypeScript", "CSS"],
      image: "/images/calculator.png",
      setDemoState: setIsCalculatorOpen,
    },
    {
      id: 2,
      title: "FlowNote - App de Notes Intelligente",
      description: "Application web moderne avec catégories, recherche en temps réel et persistance localStorage.",
      technologies: ["React", "TypeScript", "Vite", "LocalStorage"],
      image: "/images/flownote.png",
      setDemoState: setIsFlowNoteOpen,
    },
    {
      id: 3,
      title: "Snake Game - Développement Jeux",
      description: "Jeu classique en React avec boucle de jeu professionnelle, gestion des collisions et animations fluides.",
      technologies: ["React", "Canvas API", "TypeScript", "Game Loop"],
      image: "/images/snakegame.png",
      setDemoState: setIsSnakeOpen,
    },
    {
      id: 4,
      title: "TaskManager - React Web App",
      description: "Application complète de gestion de tâches avec priorités, filtrage, et persistance localStorage.",
      technologies: ["React", "TypeScript", "State Management", "localStorage"],
      image: "/images/taskmanager.png",
      setDemoState: setIsTaskManagerOpen,
    },
    {
      id: 5,
      title: "Mini DigiAlert - App de Notification",
      description: "Application de notification en temps réel avec support des canaux de communication multiples.",
      technologies: ["React", "TypeScript", "WebSocket", "Node.js"],
      image: "/images/digialert.png",
      setDemoState: setIsDigiAlertOpen,
    }
  ];

  return (
    <>
      <div id="glow-cursor" className="glow-cursor"></div>
      {/* Header */}
      <header >
        <h2 className="nom">Giovanni</h2>
        <nav className="liens">
          <a href="#accueil">Accueil</a>
          <a href="#apropos">À Propos</a>
          <a href="#competences">Compétences</a>
          <a href="#projets">Projets</a>
          <a href="#contact">Contact</a>
          <button 
            className="theme-toggle" 
            onClick={() => setIsLightMode(!isLightMode)}
            title="Changer de thème"
          >
            {isLightMode ? '🌙' : '☀️'}
          </button>
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
              <fieldset className="hero-fieldset">
                <legend className='word'>Développeur full-stack & concepteur d&apos;expériences UI/UX</legend>
                <p className="hero-description">
                Je transforme des idées en produits web rapides, élégants et utiles, de la première interface au
                déploiement.
              </p>

              <p className="hero-status">
                <span className="hero-status-dot" aria-hidden="true" />
                Disponible pour des projets web créatifs
              </p>
              </fieldset>
              
              <div className="hero-actions">
                <button type="button" className="btn-bg" onClick={() => document.getElementById('projets')?.scrollIntoView({ behavior: 'smooth' })}>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: '800', fontFamily: 'Arial, sans-serif', color: '#00d9ff' }}>
                    Découvrir mes projets
                  </p>
                </button>
                <button type="button" className="btn-bg" onClick={() => window.open('https://wa.me/22899256495', '_blank')}>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: '800', fontFamily: 'Arial, sans-serif', color: '#00d9ff' }}>
                    Me contacter
                  </p>
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
              <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
              <div className="hero-image-frame">
                <img src="/images/giovanni.png" alt="Portrait de Giovanni" className="image" />
              </div>
            </div>
          </div>
          
        </section>

        {/* SECTION À PROPOS */}
        <section id="apropos" className="section apropos">
          <h2>À Propos</h2>
          
          <div className="bento-grid">
            
            {/* CARTE 1 : Contexte (Prend 2 colonnes) */}
            <div className="bento-card col-span-2">
              <h3 className="bento-title">Un peu de contexte</h3>
              <p>
                Je suis un développeur full-stack passionné par la création de produits web à grande échelle. 
                Mon objectif ? Prendre des problèmes complexes et des centaines de cas particuliers, pour les transformer 
                en une <span className="text-highlight">interface simple et intuitive</span>.
              </p>
              <p>
                Je crois que chaque ligne de code peut raconter une histoire. Entre <span className="text-highlight">design, logique et imagination</span>, 
                je crée des interfaces où l'esthétique rencontre la fonctionnalité, tout en gardant une empreinte élégante et minimaliste.
              </p>
            </div>

            {/* CARTE 2 : Visuel / Vibe (Prend 1 colonne) */}
            <div className="bento-card bento-visual">
              <div className="visual-content">
                <span className="visual-icon">✨</span>
                <h4>Code & Art</h4>
                <p>Créer pour inspirer.</p>
              </div>
            </div>

            {/* CARTE 3 : Parcours / Timeline (Prend 2 colonnes) */}
            <div className="bento-card col-span-2">
              <h3 className="bento-title">Mon Parcours</h3>
              
              <div className="timeline-container">
                <div className="timeline-track"></div>
                
                <div className="timeline-point">
                  <div className="point-dot"></div>
                  <span className="point-date">Les Débuts</span>
                  <h4 className="point-title">Passion & Logique</h4>
                  <p className="point-desc">Premières lignes de code et algorithmes.</p>
                </div>

                <div className="timeline-point">
                  <div className="point-dot"></div>
                  <span className="point-date">Apprentissage</span>
                  <h4 className="point-title">Dev Full-Stack</h4>
                  <p className="point-desc">Maîtrise de React, TS, et Backend.</p>
                </div>

                <div className="timeline-point">
                  <div className="point-dot active"></div>
                  <span className="point-date">Aujourd'hui</span>
                  <h4 className="point-title">Créateur d'Expériences</h4>
                  <p className="point-desc">Conception UI/UX et projets complexes.</p>
                </div>
              </div>
            </div>

            {/* CARTE 4 : Passions (Prend 1 colonne) */}
            <div className="bento-card">
              <h3 className="bento-title">Au-delà du code</h3>
              <p>
                En dehors de mon éditeur de code, je suis un tech nerd à l'affût des dernières innovations. 
                J'adore le design graphique, le gaming (surtout les jeux avec une belle direction artistique), 
                et découvrir de nouvelles choses.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION COMPÉTENCES */}
        <section id="competences" className="section competences">
          <h2>Mes Compétences</h2>

          <div className="skills-grid">
            {/* FRONTEND */}
            <div className="skill-card cyber-card">
              <div className="skill-header">
                <span className="skill-icon">🌐</span>
                <h3>Frontend Development</h3>
              </div>
              <div className="skill-tags">
                <span className="tag tag-cyan">HTML5</span>
                <span className="tag tag-pink">JS</span>
                <span className="tag tag-cyan">React</span>
                <span className="tag tag-pink">TypeScript</span>
                <span className="tag tag-cyan">UI/UX Design</span>
              </div>
            </div>

            {/* BACKEND */}
            <div className="skill-card cyber-card">
              <div className="skill-header">
                <span className="skill-icon">⚡</span>
                <h3>Backend & Databases</h3>
              </div>
              <div className="skill-tags">
                <span className="tag tag-pink">PHP</span>
                <span className="tag tag-cyan">MySQL / PDO</span>
                <span className="tag tag-pink">API REST</span>
                <span className="tag tag-cyan">Node.js</span>
                <span className="tag tag-pink">Architecture MVC</span>
              </div>
            </div>

            {/* GAME & SYSTEMS */}
            <div className="skill-card cyber-card">
              <div className="skill-header">
                <span className="skill-icon">🎮</span>
                <h3>Game & Systems</h3>
              </div>
              <div className="skill-tags">
                <span className="tag tag-cyan">Python</span>
                <span className="tag tag-pink">Pygame</span>
                <span className="tag tag-cyan">Java OOP</span>
                <span className="tag tag-pink">C# .NET</span>
              </div>
            </div>

            {/* TOOLS */}
            <div className="skill-card cyber-card">
              <div className="skill-header">
                <span className="skill-icon">🛠️</span>
                <h3>Tools & Methodologies</h3>
              </div>
              <div className="skill-tags">
                <span className="tag tag-pink">Git & GitHub</span>
                <span className="tag tag-cyan">VS Code / Cursor</span>
                <span className="tag tag-pink">Ligne de commande</span>
                <span className="tag tag-cyan">Figma</span>
                <span className="tag tag-pink">Heroku / Vercel</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION PROJETS */}
        <section id="projets" className="section projets">
          <h2>Projets réalisés</h2>

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
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    <button
                      onClick={() => project.setDemoState(true)}
                      className="btn-projet"
                    > 
                      Tester maintenant 
                    </button>
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
            <a href="https://github.com/giovannihunlede-boop" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://wa.me/22899256495" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href="mailto:giovannihunlede@gmail.com">
              Email
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
      {/* DIGIALERT MODAL */}
      <DigiAlertDemo isOpen={isDigiAlertOpen} onClose={() => setIsDigiAlertOpen(false)} />
    </>
  )
}

export default App
