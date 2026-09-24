import React, { useState, useEffect, useMemo } from 'react';

interface Task {
  id: number;
  title: string;
  desc: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string;
  completed: boolean;
}

interface TaskManagerAdvancedProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskManagerAdvanced: React.FC<TaskManagerAdvancedProps> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('Dev');
  const [dueDate, setDueDate] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const stored = localStorage.getItem('gtt_tasks_advanced');
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      // Données de démonstration
      setTasks([
        {
          id: 1,
          title: 'Réviser CCNA (VLANs)',
          desc: 'Pratique sur Packet Tracer',
          priority: 'high',
          category: 'Réseau',
          dueDate: '2026-10-15',
          completed: false,
        },
        {
          id: 2,
          title: 'API C# DigiAlert',
          desc: 'Terminer les endpoints',
          priority: 'medium',
          category: 'Dev',
          dueDate: '',
          completed: true,
        },
      ]);
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('gtt_tasks_advanced', JSON.stringify(newTasks));
  };

  const addTask = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      desc: desc.trim(),
      priority,
      category,
      dueDate,
      completed: false,
    };

    saveTasks([newTask, ...tasks]);
    setTitle('');
    setDesc('');
    setDueDate('');
  };

  const toggleTask = (id: number) => {
    saveTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      saveTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => Number(a.completed) - Number(b.completed)); // Tâches complétées en bas
  }, [tasks, filter, searchQuery]);

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((t) => t.completed).length / tasks.length) * 100
        );

  const colors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
  const categories = ['Dev', 'Réseau', 'Base de données', 'Design', 'GTT'];

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        /* ============================ */
        /* BASE & OVERLAY               */
        /* ============================ */
        .tm-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: ${isDarkMode ? 'rgba(10, 10, 15, 0.8)' : 'rgba(240, 240, 245, 0.6)'};
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s forwards;
          box-sizing: border-box;
        }

        .tm-overlay * {
          box-sizing: border-box;
        }

        .tm-wrapper {
          background: ${isDarkMode ? 'rgba(22, 21, 43, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          border: 1px solid ${isDarkMode ? 'rgba(0, 217, 255, 0.2)' : 'rgba(255, 0, 110, 0.2)'};
          box-shadow: 0 30px 60px 15px ${isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0, 217, 255, 0.15)'};
          border-radius: 20px;
          width: 100%; max-width: 720px;
          max-height: 90vh;
          display: flex; flex-direction: column;
          overflow: hidden;
          color: ${isDarkMode ? '#ffffff' : '#1a1a2e'};
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        /* ============================ */
        /* HEADER & PROGRESS            */
        /* ============================ */
        .tm-header {
          padding: 20px 24px 16px 24px;
          border-bottom: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          display: flex; justify-content: space-between; align-items: center;
          flex-shrink: 0;
        }

        .tm-title h2 {
          margin: 0; font-size: 1.5rem; font-weight: 700;
          background: linear-gradient(90deg, #ff006e, #00d9ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .tm-title p { margin: 4px 0 0; font-size: 0.85rem; opacity: 0.7; }

        .tm-header-actions {
          display: flex; gap: 8px; align-items: center;
        }

        .tm-progress-container {
          padding: 12px 24px;
          background: ${isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'};
          border-bottom: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          flex-shrink: 0;
        }
        .tm-progress-bar {
          width: 100%; height: 8px;
          background: ${isDarkMode ? '#333' : '#e0e0e0'};
          border-radius: 4px; overflow: hidden; margin-top: 6px;
        }
        .tm-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff006e, #00d9ff);
          transition: width 0.5s ease;
        }

        /* ============================ */
        /* BODY & FORM                  */
        /* ============================ */
        .tm-main {
          padding: 20px 24px;
          overflow-y: auto;
          display: flex; flex-direction: column; gap: 20px;
        }

        .tm-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: ${isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          padding: 16px; border-radius: 12px;
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'};
        }

        .tm-full-width { grid-column: 1 / -1; }

        .tm-input {
          width: 100%;
          padding: 10px 14px; border-radius: 8px; font-family: inherit;
          background: ${isDarkMode ? 'rgba(0,0,0,0.3)' : '#fff'};
          color: inherit;
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)'};
          outline: none; transition: 0.2s; font-size: 0.95rem;
        }
        .tm-input:focus {
          border-color: #00d9ff;
          box-shadow: 0 0 8px rgba(0, 217, 255, 0.25);
        }

        .tm-btn-primary {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #00d9ff, #007a99);
          color: white; border: none; border-radius: 8px;
          font-weight: bold; cursor: pointer; padding: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
          font-size: 0.95rem;
        }
        .tm-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
        }

        /* ============================ */
        /* CONTROLS & FILTERS           */
        /* ============================ */
        .tm-controls {
          display: flex; gap: 12px; align-items: center;
        }

        .tm-filter-chips {
          display: flex; gap: 6px; flex-shrink: 0;
        }
        .tm-chip {
          padding: 8px 12px; border-radius: 20px; font-size: 0.8rem;
          cursor: pointer; font-weight: 500;
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#ddd'};
          background: transparent; color: inherit; transition: 0.2s;
        }
        .tm-chip.active {
          background: rgba(0, 217, 255, 0.15);
          border-color: #00d9ff;
          color: ${isDarkMode ? '#00d9ff' : '#007a99'};
          font-weight: bold;
        }

        /* ============================ */
        /* TASKS LIST & CARDS           */
        /* ============================ */
        .tm-task-list {
          display: flex; flex-direction: column; gap: 12px;
        }

        .tm-task-card {
          background: ${isDarkMode ? 'rgba(0,0,0,0.25)' : '#ffffff'};
          border-left: 4px solid; border-radius: 10px; padding: 14px 16px;
          display: flex; flex-direction: column; gap: 8px;
          border-top: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          border-right: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          border-bottom: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: 0.2s;
        }
        .tm-task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }
        .tm-task-card.completed { opacity: 0.6; }

        .tm-task-header {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
        }

        .tm-task-title {
          margin: 0; font-size: 1.05rem; font-weight: 600; word-break: break-word;
        }

        .tm-task-meta {
          display: flex; gap: 10px; font-size: 0.75rem; opacity: 0.8; margin-top: 4px;
          flex-wrap: wrap; align-items: center;
        }
        .tm-category-badge {
          background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
          padding: 2px 8px; border-radius: 4px; font-weight: 500;
        }

        .tm-task-actions {
          display: flex; gap: 6px; flex-shrink: 0;
        }

        .tm-icon-btn {
          background: transparent; border: none; cursor: pointer;
          font-size: 1.1rem; opacity: 0.8; transition: 0.2s; padding: 4px;
          border-radius: 6px; display: flex; align-items: center; justify-content: center;
          color: inherit;
        }
        .tm-icon-btn:hover { opacity: 1; transform: scale(1.15); }

        /* ============================ */
        /* ANIMATIONS & SCROLLBAR       */
        /* ============================ */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .tm-main::-webkit-scrollbar { width: 6px; }
        .tm-main::-webkit-scrollbar-track { background: transparent; }
        .tm-main::-webkit-scrollbar-thumb { background: rgba(0, 217, 255, 0.25); border-radius: 10px; }
        .tm-main::-webkit-scrollbar-thumb:hover { background: rgba(0, 217, 255, 0.5); }

        /* ============================ */
        /* RESPONSIVE (MOBILE)          */
        /* ============================ */
        @media (max-width: 768px) {
          .tm-overlay { padding: 10px; }
          .tm-wrapper { max-height: 95vh; border-radius: 16px; }
          .tm-header { padding: 16px; }
          .tm-header h2 { font-size: 1.25rem; }
          .tm-progress-container { padding: 10px 16px; }
          .tm-main { padding: 16px; gap: 16px; }

          /* Passe le formulaire en 1 seule colonne */
          .tm-form {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          /* Passe les contrôles de recherche/filtre en colonne */
          .tm-controls {
            flex-direction: column;
            align-items: stretch;
          }
          .tm-filter-chips {
            justify-content: space-between;
            width: 100%;
          }
          .tm-chip {
            flex: 1;
            text-align: center;
            padding: 8px 4px;
          }
        }

        @media (max-width: 480px) {
          .tm-task-header {
            flex-direction: column;
            gap: 8px;
          }
          .tm-task-actions {
            align-self: flex-end;
          }
        }
      `}</style>

      <div className="tm-overlay" onClick={onClose}>
        <div className="tm-wrapper" onClick={(e) => e.stopPropagation()}>
          
          {/* En-tête */}
          <div className="tm-header">
            <div className="tm-title">
              <h2>Workspace</h2>
              <p>Gestionnaire de tâches</p>
            </div>
            <div className="tm-header-actions">
              <button
                className="tm-icon-btn"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title="Changer de thème"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button className="tm-icon-btn" onClick={onClose} title="Fermer">
                ✖
              </button>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="tm-progress-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Progression Globale</span>
              <strong>
                {progress}% ({tasks.filter((t) => t.completed).length}/{tasks.length})
              </strong>
            </div>
            <div className="tm-progress-bar">
              <div className="tm-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="tm-main">
            
            {/* Formulaire d'ajout */}
            <div className="tm-form">
              <input
                className="tm-input tm-full-width"
                placeholder="Nouvelle tâche..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <textarea
                className="tm-input tm-full-width"
                placeholder="Détails techniques (optionnel)"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={2}
              />
              <select
                className="tm-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                className="tm-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                <option value="low">🟢 Priorité Basse</option>
                <option value="medium">🟡 Priorité Normale</option>
                <option value="high">🔴 Priorité Haute</option>
              </select>
              <input
                type="date"
                className="tm-input tm-full-width"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <button className="tm-btn-primary" onClick={addTask}>
                ➕ Ajouter la tâche
              </button>
            </div>

            {/* Barre de Recherche et Filtres */}
            <div className="tm-controls">
              <input
                className="tm-input"
                style={{ flex: 1 }}
                placeholder="🔍 Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="tm-filter-chips">
                {(['all', 'active', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    className={`tm-chip ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'Toutes' : f === 'active' ? 'En cours' : 'Terminées'}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste des cartes de tâches */}
            <div className="tm-task-list">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`tm-task-card ${task.completed ? 'completed' : ''}`}
                  style={{ borderColor: colors[task.priority] }}
                >
                  <div className="tm-task-header">
                    <div>
                      <h4
                        className="tm-task-title"
                        style={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </h4>
                      <div className="tm-task-meta">
                        <span className="tm-category-badge">🏷️ {task.category}</span>
                        {task.dueDate && (
                          <span>📅 {new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </div>

                    <div className="tm-task-actions">
                      <button
                        className="tm-icon-btn"
                        onClick={() => toggleTask(task.id)}
                        title={task.completed ? 'Restaurer' : 'Compléter'}
                      >
                        {task.completed ? '↩️' : '✅'}
                      </button>
                      <button
                        className="tm-icon-btn"
                        onClick={() => deleteTask(task.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {task.desc && (
                    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8, whiteSpace: 'pre-wrap' }}>
                      {task.desc}
                    </p>
                  )}
                </div>
              ))}

              {filteredTasks.length === 0 && (
                <p style={{ textAlign: 'center', opacity: 0.5, padding: '20px 0' }}>
                  {searchQuery ? '❌ Aucune tâche ne correspond à la recherche.' : '📭 Aucune tâche trouvée.'}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TaskManagerAdvanced;