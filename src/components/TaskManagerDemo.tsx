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
      // Mock data pour la démo
      setTasks([
        { id: 1, title: 'Réviser CCNA (VLANs)', desc: 'Pratique sur Packet Tracer', priority: 'high', category: 'Réseau', dueDate: '2026-10-15', completed: false },
        { id: 2, title: 'API C# DigiAlert', desc: 'Terminer les endpoints', priority: 'medium', category: 'Dev', dueDate: '', completed: true }
      ]);
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('gtt_tasks_advanced', JSON.stringify(newTasks));
  };

  const addTask = () => {
    if (!title.trim()) return;
    const newTask: Task = { id: Date.now(), title, desc, priority, category, dueDate, completed: false };
    saveTasks([newTask, ...tasks]);
    setTitle(''); setDesc(''); setDueDate('');
  };

  const toggleTask = (id: number) => saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id: number) => saveTasks(tasks.filter(t => t.id !== id));

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => Number(a.completed) - Number(b.completed)); // Les complétées en bas
  }, [tasks, filter, searchQuery]);

  const progress = tasks.length === 0 ? 0 : Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

  const colors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
  const categories = ['Dev', 'Réseau', 'Base de données', 'Design', 'GTT'];

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .tm-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: ${isDarkMode ? 'rgba(10, 10, 15, 0.8)' : 'rgba(240, 240, 245, 0.6)'};
          backdrop-filter: blur(10px);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000; animation: fadeIn 0.3s forwards;
        }

        .tm-wrapper {
          background: ${isDarkMode ? 'rgba(22, 21, 43, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
          border: 1px solid ${isDarkMode ? 'rgba(0, 217, 255, 0.2)' : 'rgba(255, 0, 110, 0.2)'};
          box-shadow: 0 30px 60px -15px ${isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0, 217, 255, 0.15)'};
          border-radius: 20px; width: 95%; max-width: 700px; max-height: 90vh;
          display: flex; flex-direction: column; overflow: hidden;
          color: ${isDarkMode ? '#ffffff' : '#1a1a2e'};
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .tm-header {
          padding: 20px 24px; border-bottom: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          display: flex; justify-content: space-between; align-items: center;
        }
        
        .tm-title h2 { margin: 0; font-size: 1.5rem; background: linear-gradient(90deg, #ff006e, #00d9ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .tm-title p { margin: 4px 0 0; font-size: 0.85rem; opacity: 0.7; }

        .tm-progress-container { padding: 15px 24px; background: ${isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'}; }
        .tm-progress-bar { width: 100%; height: 8px; background: ${isDarkMode ? '#333' : '#e0e0e0'}; border-radius: 4px; overflow: hidden; margin-top: 8px; }
        .tm-progress-fill { height: 100%; background: linear-gradient(90deg, #ff006e, #00d9ff); transition: width 0.5s ease; }
        
        .tm-main { padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }

        .tm-form {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
          background: ${isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          padding: 16px; border-radius: 12px; border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'};
        }
        .tm-full-width { grid-column: 1 / -1; }
        .tm-input {
          padding: 10px 14px; border-radius: 8px; font-family: inherit;
          background: ${isDarkMode ? 'rgba(0,0,0,0.3)' : '#fff'}; color: inherit;
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          outline: none; transition: 0.2s;
        }
        .tm-input:focus { border-color: #00d9ff; box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.2); }
        .tm-btn-primary {
          background: linear-gradient(135deg, #00d9ff, #007a99); color: white;
          border: none; border-radius: 8px; font-weight: bold; cursor: pointer; padding: 10px;
          transition: transform 0.2s;
        }
        .tm-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,217,255,0.3); }

        .tm-controls { display: flex; gap: 10px; align-items: center; }
        .tm-filter-chips { display: flex; gap: 8px; }
        .tm-chip {
          padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; cursor: pointer;
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#ddd'};
          background: transparent; color: inherit; transition: 0.2s;
        }
        .tm-chip.active { background: rgba(0, 217, 255, 0.15); border-color: #00d9ff; color: ${isDarkMode ? '#00d9ff' : '#007a99'}; }

        .tm-task-card {
          background: ${isDarkMode ? 'rgba(0,0,0,0.2)' : '#fff'};
          border-left: 4px solid; border-radius: 8px; padding: 16px;
          display: flex; flex-direction: column; gap: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: 0.3s;
        }
        .tm-task-card.completed { opacity: 0.6; }
        .tm-task-meta { display: flex; gap: 10px; font-size: 0.75rem; opacity: 0.8; }
        .tm-task-actions { display: flex; gap: 8px; margin-top: 5px; }
        
        .tm-icon-btn { background: transparent; border: none; cursor: pointer; font-size: 1.1rem; opacity: 0.7; transition: 0.2s; }
        .tm-icon-btn:hover { opacity: 1; transform: scale(1.1); }

        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="tm-overlay" onClick={onClose}>
        <div className="tm-wrapper" onClick={e => e.stopPropagation()}>
          <div className="tm-header">
            <div className="tm-title">
              <h2>GTT Workspace</h2>
              <p>Gestionnaire de tâches avancé</p>
            </div>
            <div>
              <button className="tm-icon-btn" onClick={() => setIsDarkMode(!isDarkMode)} style={{ marginRight: 15 }}>
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button className="tm-icon-btn" onClick={onClose}>✖</button>
            </div>
          </div>

          <div className="tm-progress-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Progression Globale</span>
              <strong>{progress}% ({tasks.filter(t => t.completed).length}/{tasks.length})</strong>
            </div>
            <div className="tm-progress-bar">
              <div className="tm-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="tm-main">
            <div className="tm-form">
              <input className="tm-input tm-full-width" placeholder="Nouvelle tâche..." value={title} onChange={e => setTitle(e.target.value)} />
              <textarea className="tm-input tm-full-width" placeholder="Détails techniques (optionnel)" value={desc} onChange={e => setDesc(e.target.value)} rows={2} />
              
              <select className="tm-input" value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              
              <select className="tm-input" value={priority} onChange={e => setPriority(e.target.value as any)}>
                <option value="low">🟢 Priorité Basse</option>
                <option value="medium">🟡 Priorité Normale</option>
                <option value="high">🔴 Priorité Haute</option>
              </select>

              <input type="date" className="tm-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              <button className="tm-btn-primary" onClick={addTask}>Ajouter la tâche</button>
            </div>

            <div className="tm-controls">
              <input 
                className="tm-input" 
                style={{ flex: 1 }} 
                placeholder="🔍 Rechercher..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
              />
              <div className="tm-filter-chips">
                {(['all', 'active', 'completed'] as const).map(f => (
                  <button key={f} className={`tm-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                    {f === 'all' ? 'Toutes' : f === 'active' ? 'En cours' : 'Terminées'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTasks.map(task => (
                <div key={task.id} className={`tm-task-card ${task.completed ? 'completed' : ''}`} style={{ borderColor: colors[task.priority] }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, textDecoration: task.completed ? 'line-through' : 'none', fontSize: '1.1rem' }}>
                        {task.title}
                      </h4>
                      <div className="tm-task-meta">
                        <span>📁 {task.category}</span>
                        {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="tm-task-actions">
                      <button className="tm-icon-btn" onClick={() => toggleTask(task.id)} title={task.completed ? "Restaurer" : "Compléter"}>
                        {task.completed ? '⏪' : '✅'}
                      </button>
                      <button className="tm-icon-btn" onClick={() => deleteTask(task.id)} title="Supprimer">🗑️</button>
                    </div>
                  </div>
                  {task.desc && <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{task.desc}</p>}
                </div>
              ))}
              {filteredTasks.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>Aucune tâche trouvée.</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskManagerAdvanced;