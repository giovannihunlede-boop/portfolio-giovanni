import React, { useState, useEffect, useRef } from 'react';
import FlowNoteDemo from './components/FlowNoteDemo';
import SnakeGameDemo from './components/SnakeGameDemo';
import TaskManagerDemo from './components/TaskManagerDemo';
import CalculatorDemo from './components/CalculatorDemo';
import ContactForm from './components/ContactForm';
import NotifyHubModal from './components/NotifyHubModal';

function App() {
  const [isFlowNoteOpen, setIsFlowNoteOpen] = useState(false);
  const [isSnakeOpen, setIsSnakeOpen] = useState(false);
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isNotifyHubOpen, setIsNotifyHubOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // État pour la Lightbox (Image en grand)
  const [selectedVisual, setSelectedVisual] = useState<string | null>(null);
  
  // États pour le Carrousel 3D
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  // Gestion du thème et du curseur magique
  useEffect(() => {
    window.scrollTo(0, 0);

    if (isLightMode) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    }

    const cursor = document.getElementById('glow-cursor');
    const handleMouseMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX - 150}px, ${e.clientY - 150}px, 0)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLightMode]);

  // Gestion de l'Auto-Scroll Infini (Le Vrai !)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrameId: number;

    // Cette fonction écoute le scroll manuel du visiteur ET l'auto-scroll
    const handleScroll = () => {
      const set1 = track.querySelector('#set-1') as HTMLElement;
      if (!set1) return;
      
      // On calcule la taille exacte d'un bloc + l'espace (gap)
      const jumpPoint = set1.offsetWidth + 30;

      // Dès qu'on atteint la fin du premier bloc, on retourne au début de façon invisible
      if (track.scrollLeft >= jumpPoint) {
        track.scrollLeft -= jumpPoint;
      }
    };

    track.addEventListener('scroll', handleScroll);

    const autoScroll = () => {
      if (!isHovered) {
        track.scrollLeft += 1.5; // Vitesse de défilement automatique
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      track.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

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
      title: "TaskManager - Workspace",
      description: "Application complète de gestion de tâches avec suivi de progression globale, filtrage par statut/priorité.",
      technologies: ["React", "TypeScript", "CSS-in-JS", "localStorage"],
      image: "/images/taskmanager.png",
      setDemoState: setIsTaskManagerOpen,
    },
    {
      id: 5,
      title: "NotifyHub - Système de Notifications",
      description: "Tableau de gestion des relances avec recherche, filtres, suivi des statuts et notifications multicanales.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "localStorage"],
      image: "/images/notifyhub.png",
      setDemoState: setIsNotifyHubOpen,
    },
  ];

  // --- VISUELS PERSOS (Design) ---
  const baseVisuals = [
    { 
      id: 1, 
      title: "Design Événementiel", 
      image: "/images/design-bday.webp" 
    },
    { 
      id: 2, 
      title: "Campagne Cosmétique", 
      image: "/images/design-cosmetique.png" 
    },
    { 
      id: 3, 
      title: "Flyer Restauration", 
      image: "/images/design-food.png" 
    },
    { 
      id: 4, 
      title: "Création Social Media", 
      image: "/images/design-social.png" 
    },
    { 
      id: 5, 
      title: "Affiche Mode / Éditorial", 
      image: "/images/design-fashion.png" 
    }
  ];

  return (
    <>
      <div id="glow-cursor" className="glow-cursor"></div>
      
      {/* HEADER */}
      <header>
        <h2 className="nom">Giovanni</h2>
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>
        <nav className={`liens ${isMenuOpen ? 'open' : ''}`}>
          <a href="#accueil" onClick={() => setIsMenuOpen(false)}>Accueil</a>
          <a href="#apropos" onClick={() => setIsMenuOpen(false)}>À Propos</a>
          <a href="#competences" onClick={() => setIsMenuOpen(false)}>Compétences</a>
          <a href="#design" onClick={() => setIsMenuOpen(false)}>Design</a>
          <a href="#projets" onClick={() => setIsMenuOpen(false)}>Code</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          <button 
            className="theme-toggle" 
            onClick={() => { setIsLightMode(!isLightMode); setIsMenuOpen(false); }}
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

              <div className="hero-visual hero-visual-mobile">
                <div className="hero-image-frame">
                  <img className="image" src="/images/giovanni.png" alt="Giovanni" />
                </div>
                <div className="hero-orbit hero-orbit-one"></div>
                <div className="hero-orbit hero-orbit-two"></div>
              </div>

              <fieldset className="hero-fieldset">
                <legend className='word'>Développeur Full-Stack & UI/UX Designer</legend>
                <p className="hero-description">
                  Je transforme des idées complexes en produits web rapides, élégants et utiles. De la première maquette visuelle au déploiement technique final.
                </p>

                <p className="hero-status">
                  <span className="hero-status-dot" aria-hidden="true" />
                  Disponible pour des missions web & créatives
                </p>
              </fieldset>
              
              <div className="hero-actions">
                <a 
                  href="/CV_Giovanni.pdf" 
                  download 
                  className="btn-bg btn-cv" 
                  style={{textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #00d9ff 0%, #0369a1 100%)'}}
                >
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: '800', fontFamily: 'Arial, sans-serif', color: '#fff' }}>
                    Télécharger mon CV
                  </p>
                </a>
                <button type="button" className="btn-bg" onClick={() => document.getElementById('projets')?.scrollIntoView({ behavior: 'smooth' })}>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: '800', fontFamily: 'Arial, sans-serif', color: '#fff' }}>
                    Découvrir mes projets
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
            <div className="bento-card col-span-2">
              <h3 className="bento-title">Un profil hybride : Code & Design</h3>
              <p>
                En tant que <span className="text-highlight">Développeur Full-Stack et UI/UX Designer indépendant</span>, je fusionne la logique algorithmique avec l'excellence créative du design. 
                Mon objectif ? Transformer vos idées en identités visuelles percutantes et en applications performantes.
              </p>
              <p>
                Je ne me contente pas de faire du "beau" ou du code basique. Je conçois des interfaces qui <span className="text-highlight">résolvent des problèmes, captent l'attention de vos utilisateurs et fluidifient la navigation</span>.
              </p>
            </div>

            <div className="bento-card bento-visual">
              <div className="visual-content">
                <span className="visual-icon">✨</span>
                <h4>Code & Art</h4>
                <p>Créer pour inspirer.</p>
              </div>
            </div>

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
                  <h4 className="point-title">Designer & Développeur</h4>
                  <p className="point-desc">Freelance spécialisé en UI/UX et conception web.</p>
                </div>
              </div>
            </div>

            <div className="bento-card">
              <h3 className="bento-title">Au-delà du code</h3>
              <p>
                En dehors de mon éditeur de code, je suis un tech nerd à l'affût des dernières innovations. 
                J'adore le design graphique, le gaming, et le montage vidéo créatif.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION COMPÉTENCES */}
        <section id="competences" className="section competences">
          <h2>Mes Compétences</h2>

          <div className="skills-grid">
            <div className="skill-card cyber-card">
              <div className="skill-header">
                <span className="skill-icon">🌐</span>
                <h3>Frontend Development</h3>
              </div>
              <div className="skill-tags">
                <span className="tag tag-cyan">HTML5</span>
                <span className="tag tag-pink">JS / React</span>
                <span className="tag tag-cyan">TypeScript</span>
                <span className="tag tag-pink">Tailwind CSS</span>
              </div>
            </div>

            <div className="skill-card cyber-card">
              <div className="skill-header">
                <span className="skill-icon">⚡</span>
                <h3>Backend & Databases</h3>
              </div>
              <div className="skill-tags">
                <span className="tag tag-pink">PHP / Node.js</span>
                <span className="tag tag-cyan">MySQL / PDO</span>
                <span className="tag tag-pink">API REST</span>
                <span className="tag tag-cyan">Architecture MVC</span>
              </div>
            </div>

            <div className="skill-card cyber-card">
              <div className="skill-header">
                <span className="skill-icon">🛠️</span>
                <h3>Tools & Workflow</h3>
              </div>
              <div className="skill-tags">
                <span className="tag tag-pink">Git & GitHub</span>
                <span className="tag tag-cyan">VS Code / Cursor</span>
                <span className="tag tag-pink">Figma</span>
                <span className="tag tag-cyan">Vercel</span>
              </div>
            </div>

            {/* CARTE DESIGN */}
            <div className="skill-card cyber-card">
              <div className="skill-header">
                <span className="skill-icon">🎨</span>
                <h3>Design, UI/UX & Visuel</h3>
              </div>
              <div className="skill-tags">
                <span className="tag tag-pink">Maquettes UI/UX</span>
                <span className="tag tag-cyan">Direction Artistique</span>
                <span className="tag tag-pink">Création Visuels Réseaux</span>
                <span className="tag tag-cyan">Montage Vidéo</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION PORTFOLIO DESIGN (CARROUSEL 3D INFINI) */}
        <section id="design" className="section design">
          <h2>Mon Univers Graphique</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "10px", fontSize: "1.1rem" }}>
            Mes créations UI/UX, visuels et identités de marque. 
          </p>

          <div className="carousel-3d-wrapper">
            <div 
              className="carousel-3d-track"
              ref={trackRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
            >
              {/* BLOC 1 */}
              <div className="carousel-set" id="set-1">
                {baseVisuals.map((visuel, index) => (
                  <div 
                    key={`set1-${visuel.id}-${index}`} 
                    className="carousel-3d-item"
                    onClick={() => setSelectedVisual(visuel.image)}
                  >
                    <img src={visuel.image} alt={visuel.title} loading="lazy" />
                    <div className="item-overlay">
                      <span>{visuel.title}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* BLOC 2 */}
              <div className="carousel-set" id="set-2">
                {baseVisuals.map((visuel, index) => (
                  <div 
                    key={`set2-${visuel.id}-${index}`} 
                    className="carousel-3d-item"
                    onClick={() => setSelectedVisual(visuel.image)}
                  >
                    <img src={visuel.image} alt={visuel.title} loading="lazy" />
                    <div className="item-overlay">
                      <span>{visuel.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION PROJETS CODE */}
        <section id="projets" className="section projets">
          <h2>Mes Projets Code</h2>

          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-img-container">
                  <img src={project.image} alt={project.title} className="project-img" />
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
                    <button onClick={() => project.setDemoState(true)} className="btn-projet"> 
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
          <p>Développement Web & UI/UX Design.</p>

          <div className="social-links">
            <a href="https://github.com/giovannihunlede-boop" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://wa.me/22899256495" target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="mailto:giovannihunlede@gmail.com">Email</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Giovanni. Tous droits réservés.</p>
          <p>Designed & Coded by Giovanni</p>
        </div>
      </footer>

      {/* LIGHTBOX MODAL (Quand on clique sur une image 3D) */}
      {selectedVisual && (
        <div className="lightbox-overlay" onClick={() => setSelectedVisual(null)}>
          <button className="lightbox-close" onClick={() => setSelectedVisual(null)}>✖</button>
          <img src={selectedVisual} alt="Visuel agrandi" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* MODALS DEMOS */}
      <FlowNoteDemo isOpen={isFlowNoteOpen} onClose={() => setIsFlowNoteOpen(false)} />
      <SnakeGameDemo isOpen={isSnakeOpen} onClose={() => setIsSnakeOpen(false)} />
      <TaskManagerDemo isOpen={isTaskManagerOpen} onClose={() => setIsTaskManagerOpen(false)} />
      <CalculatorDemo isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
      <NotifyHubModal isOpen={isNotifyHubOpen} onClose={() => setIsNotifyHubOpen(false)} />
    </>
  );
}

export default App;