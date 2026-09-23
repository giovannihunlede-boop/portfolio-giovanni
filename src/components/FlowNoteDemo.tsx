import React, { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  date: string;
  time: string;
}

interface FlowNoteDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const FlowNoteDemo: React.FC<FlowNoteDemoProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Charger les notes
  useEffect(() => {
    const stored = localStorage.getItem('demoFlowNotes');
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  // Sauvegarder les notes
  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('demoFlowNotes', JSON.stringify(newNotes));
  };

  const addNote = () => {
    if (!title.trim() || !content.trim()) {
      alert('Veuillez remplir le titre et le contenu !');
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title,
      content,
      category,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    saveNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
  };

  const deleteNote = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      saveNotes(notes.filter((note) => note.id !== id));
    }
  };

  const editNote = (id: number) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      // Supprime l'ancienne note pour la remplacer lors du prochain "Ajouter"
      saveNotes(notes.filter((n) => n.id !== id)); 
    }
  };

  // Couleurs dynamiques pour les catégories (adaptées à ton thème)
  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      work: '#FF6B6B',      // Rouge doux
      personal: '#4ECDC4',  // Menthe
      ideas: '#FFE66D',     // Jaune
      important: '#ff006e', // Rose Néon
      general: '#00d9ff',   // Cyan Néon
    };
    return colors[cat] || '#00d9ff';
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .fn-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.4)'};
          backdrop-filter: blur(8px);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s forwards;
        }

        .fn-wrapper {
          position: relative;
          background: ${isDarkMode ? 'rgba(22, 21, 43, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          border: 1px solid ${isDarkMode ? 'rgba(0, 217, 255, 0.3)' : 'rgba(255, 0, 110, 0.3)'};
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          border-radius: 20px;
          width: 100%; max-width: 850px;
          max-height: 90vh;
          display: flex; flex-direction: column;
          overflow: hidden; /* Empêche le contenu de dépasser les bords arrondis */
          transform: translateY(20px);
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          color: ${isDarkMode ? '#ffffff' : '#1e1e1e'};
        }

        .fn-header {
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          padding: 24px 24px 10px 24px;
          background: transparent !important;
          border-bottom: none !important; /* Enlève la ligne de séparation */
        }

        .fn-title-container {
          text-align: center;
          flex-grow: 1; /* Pousse les boutons sur les côtés */
        }

        .fn-header h2 {
          margin: 0; 
          font-size: 1.5rem; 
          font-weight: 700;
          background: linear-gradient(90deg, #ff006e, #00d9ff);
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent;
        }

        .fn-header p {
          margin: 5px 0 0 0; 
          font-size: 0.85rem;
          color: ${isDarkMode ? '#a0a0b5' : '#555'};
        }

        .fn-close, .fn-theme-btn {
          background: transparent; 
          border: none; 
          font-size: 1.2rem;
          cursor: pointer; 
          color: inherit; 
          transition: transform 0.2s;
          width: 40px; /* Équilibre parfait gauche/droite */
          display: flex;
          justify-content: center;
        }

        .fn-close:hover, .fn-theme-btn:hover { 
          transform: scale(1.1); 
        }
        
        .fn-close {
          position: absolute; top: 20px; right: 20px;
        }

        .fn-body {
          padding: 24px;
          overflow-y: auto; /* Scroll uniquement dans le corps */
          display: flex; flex-direction: column; gap: 24px;
        }

        /* Formulaire */
        .fn-input-group {
          background: ${isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border-radius: 16px; padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
        }

        .fn-input, .fn-textarea, .fn-select {
          width: 100%;
          background: ${isDarkMode ? 'rgba(0,0,0,0.4)' : '#ffffff'};
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'};
          border-radius: 10px; padding: 12px;
          color: inherit; font-size: 1rem;
          outline: none; transition: 0.3s;
          font-family: inherit;
        }
        
        .fn-input:focus, .fn-textarea:focus, .fn-select:focus {
          border-color: #00d9ff;
          box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
        }

        .fn-textarea { resize: vertical; min-height: 80px; }

        .fn-row {
          display: flex; gap: 12px;
        }

        .fn-btn-add {
          background: linear-gradient(135deg, #00d9ff, #007a99);
          color: white; border: none; border-radius: 10px;
          padding: 12px 24px; font-weight: bold; cursor: pointer;
          transition: 0.3s; white-space: nowrap;
        }
        .fn-btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 217, 255, 0.4);
        }

        /* Filtres */
        .fn-filters {
          display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
        }
        .fn-stats {
          margin-left: auto; font-size: 0.9rem; font-weight: 600;
          color: ${isDarkMode ? '#00d9ff' : '#007a99'};
        }

        /* Grille de notes */
        .fn-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .fn-card {
          background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#ffffff'};
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border-radius: 12px; padding: 16px;
          border-left: 5px solid; /* Couleur gérée en inline */
          display: flex; flex-direction: column; gap: 10px;
          transition: 0.3s; position: relative;
        }
        .fn-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }

        .fn-card-header {
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .fn-card-title {
          margin: 0; font-size: 1.1rem; font-weight: 700;
        }
        .fn-badge {
          font-size: 0.75rem; padding: 4px 8px; border-radius: 20px;
          color: #1e1e1e; font-weight: bold; text-transform: uppercase;
        }

        .fn-card-content {
          margin: 0; font-size: 0.95rem; line-height: 1.5;
          color: ${isDarkMode ? '#d1d1e0' : '#444'};
          flex-grow: 1; white-space: pre-wrap;
        }

        .fn-card-footer {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 10px; border-top: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          padding-top: 10px;
        }
        
        .fn-meta {
          font-size: 0.8rem; color: ${isDarkMode ? '#888' : '#777'};
        }

        .fn-actions button {
          background: transparent; border: none; cursor: pointer;
          font-size: 1.2rem; transition: 0.2s; padding: 4px;
        }
        .fn-actions button:hover { transform: scale(1.2); }

        .fn-empty {
          text-align: center; padding: 40px; color: ${isDarkMode ? '#888' : '#777'};
          grid-column: 1 / -1;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        
        /* Personnalisation de la scrollbar pour le style Pro */
        .fn-body::-webkit-scrollbar { width: 8px; }
        .fn-body::-webkit-scrollbar-track { background: transparent; }
        .fn-body::-webkit-scrollbar-thumb { background: rgba(0, 217, 255, 0.3); border-radius: 10px; }
        .fn-body::-webkit-scrollbar-thumb:hover { background: rgba(0, 217, 255, 0.6); }
      `}</style>

      <div className="fn-overlay" onClick={onClose}>
        <div className="fn-wrapper" onClick={(e) => e.stopPropagation()}>
          
          
          

          <div className="fn-header">
            <button className="fn-theme-btn" onClick={() => setIsDarkMode(!isDarkMode)} title="Changer de thème">
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            <div className="fn-title-container">
              <h2>📝 FlowNote</h2>
              <p>Sauvegarde locale · Démo interactive</p>
            </div>

            <button className="fn-close" onClick={onClose} title="Fermer">
              ✖
            </button>
          </div>

          

          <div className="fn-body">
            {/* Section Ajout */}
            <div className="fn-input-group">
              <input
                type="text"
                className="fn-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                placeholder="Titre de votre note..."
              />
              <textarea
                className="fn-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.ctrlKey && e.key === 'Enter' && addNote()}
                placeholder="Contenu (Ctrl + Entrée pour valider)..."
              />
              <div className="fn-row">
                <select className="fn-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="general">📌 Général</option>
                  <option value="work">💼 Travail</option>
                  <option value="personal">👤 Personnel</option>
                  <option value="ideas">💡 Idées</option>
                  <option value="important">⭐ Important</option>
                </select>
                <button className="fn-btn-add" onClick={addNote}>➕ Ajouter</button>
              </div>
            </div>

            {/* Section Recherche / Filtres */}
            <div className="fn-filters">
              <input
                type="text"
                className="fn-input"
                style={{ flex: 1, minWidth: '200px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Rechercher une note..."
              />
              <select 
                className="fn-select" 
                style={{ width: 'auto' }}
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Toutes catégories</option>
                <option value="general">📌 Général</option>
                <option value="work">💼 Travail</option>
                <option value="personal">👤 Personnel</option>
                <option value="ideas">💡 Idées</option>
                <option value="important">⭐ Important</option>
              </select>
              <div className="fn-stats">
                {filteredNotes.length} / {notes.length} note(s)
              </div>
            </div>

            {/* Section Liste des Notes */}
            <div className="fn-grid">
              {filteredNotes.length === 0 ? (
                <div className="fn-empty">
                  <h3>{searchQuery ? '❌ Aucune note ne correspond à la recherche.' : '📭 Votre carnet est vide. Ajoutez une note !'}</h3>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div key={note.id} className="fn-card" style={{ borderLeftColor: getCategoryColor(note.category) }}>
                    <div className="fn-card-header">
                      <h3 className="fn-card-title">{note.title}</h3>
                      <span className="fn-badge" style={{ backgroundColor: getCategoryColor(note.category) }}>
                        {note.category}
                      </span>
                    </div>
                    
                    <p className="fn-card-content">{note.content}</p>
                    
                    <div className="fn-card-footer">
                      <div className="fn-meta">
                        📅 {note.date} à {note.time}
                      </div>
                      <div className="fn-actions">
                        <button onClick={() => editNote(note.id)} title="Modifier">✏️</button>
                        <button onClick={() => deleteNote(note.id)} title="Supprimer">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default FlowNoteDemo;