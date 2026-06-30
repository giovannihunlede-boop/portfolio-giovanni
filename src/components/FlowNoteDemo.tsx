import React, { useState, useEffect } from 'react'

interface Note {
  id: number
  title: string
  content: string
  category: string
  date: string
  time: string
}

interface FlowNoteDemoProps {
  isOpen: boolean
  onClose: () => void
}

const FlowNoteDemo: React.FC<FlowNoteDemoProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Load notes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('demoFlowNotes')
    if (stored) {
      setNotes(JSON.parse(stored))
    }
  }, [])

  // Save notes to localStorage
  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes)
    localStorage.setItem('demoFlowNotes', JSON.stringify(newNotes))
  }

  const addNote = () => {
    if (!title.trim() || !content.trim()) {
      alert('Veuillez remplir le titre et le contenu!')
      return
    }

    const newNote: Note = {
      id: Date.now(),
      title,
      content,
      category,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }

    saveNotes([newNote, ...notes])
    setTitle('')
    setContent('')
  }

  const deleteNote = (id: number) => {
    if (confirm('Êtes-vous sûr?')) {
      saveNotes(notes.filter((note) => note.id !== id))
    }
  }

  const editNote = (id: number) => {
    const note = notes.find((n) => n.id === id)
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setCategory(note.category)
      deleteNote(id)
    }
  }

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      work: '#FF6B6B',
      personal: '#4ECDC4',
      ideas: '#FFE66D',
      important: '#95E1D3',
      general: '#99D8FF',
    }
    return colors[cat] || '#99D8FF'
  }

  const escapeHtml = (text: string) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={`demo-modal ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="demo-modal-content">
        <button className="demo-close" onClick={onClose}>
          &times;
        </button>

        <div className="demo-container">
          <header className="demo-header">
            <h1>📝 FlowNote - Démo Interactive</h1>
            <p>Testez l&apos;app directement! Vos notes sont sauvegardées localement.</p>
          </header>

          <main className="demo-main">
            <div className="demo-input-section">
              <div className="demo-input-group">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNote()}
                  placeholder="Titre de votre note..."
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyPress={(e) => e.ctrlKey && e.key === 'Enter' && addNote()}
                  placeholder="Contenu de votre note..."
                ></textarea>
                <div className="demo-form-row">
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="demo-category-select">
                    <option value="general">📌 General</option>
                    <option value="work">💼 Travail</option>
                    <option value="personal">👤 Personnel</option>
                    <option value="ideas">💡 Idées</option>
                    <option value="important">⭐ Important</option>
                  </select>
                  <button className="demo-btn-add" onClick={addNote}>
                    ➕ Ajouter
                  </button>
                </div>
              </div>
            </div>

            <div className="demo-search-section">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Rechercher..."
                className="demo-search-input"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="demo-category-select"
              >
                <option value="all">Toutes catégories</option>
                <option value="general">📌 General</option>
                <option value="work">💼 Travail</option>
                <option value="personal">👤 Personnel</option>
                <option value="ideas">💡 Idées</option>
                <option value="important">⭐ Important</option>
              </select>
              <div className="demo-note-stats">
                <span>📝 Total: {notes.length}</span>
                <span>🔍 Affichées: {filteredNotes.length}</span>
              </div>
            </div>

            <div className="demo-notes-section">
              <h2>Vos Notes</h2>
              <div className="demo-notes-grid">
                {filteredNotes.length === 0 ? (
                  <div className="demo-empty-state">
                    <h3>{searchQuery ? '❌ Aucune note trouvée' : '📭 Aucune note'}</h3>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className="demo-note-card"
                      style={{ borderLeftColor: getCategoryColor(note.category) }}
                    >
                      <div className="demo-note-header">
                        <h3>{escapeHtml(note.title)}</h3>
                        <span className="demo-note-category" style={{ backgroundColor: getCategoryColor(note.category) }}>
                          {note.category}
                        </span>
                      </div>
                      <p>{escapeHtml(note.content)}</p>
                      <div className="demo-note-meta">
                        <small>
                          📅 {note.date} · 🕐 {note.time}
                        </small>
                      </div>
                      <div className="demo-note-actions">
                        <button className="demo-btn-edit" onClick={() => editNote(note.id)}>
                          ✏️
                        </button>
                        <button className="demo-btn-delete" onClick={() => deleteNote(note.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default FlowNoteDemo
