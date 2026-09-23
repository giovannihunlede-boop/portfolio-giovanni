import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  desc: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface TaskManagerDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskManagerDemo: React.FC<TaskManagerDemoProps> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('demoTasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('demoTasks', JSON.stringify(newTasks));
  };

  const addTask = () => {
    if (!title.trim()) return alert('Veuillez entrer un titre !');
    const newTask: Task = { id: Date.now(), title, desc, priority, completed: false };
    saveTasks([newTask, ...tasks]);
    setTitle('');
    setDesc('');
    setPriority('medium');
  };

  const toggleTask = (id: number) => {
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  const colors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
  const icons = { low: '🟢', medium: '🟡', high: '🔴' };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .tm-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.4)'};
          backdrop-filter: blur(8px);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000; opacity: 0; animation: fadeIn 0.3s forwards;
        }

        .tm-wrapper {
          background: ${isDarkMode ? 'rgba(22, 21, 43, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          border: 1px solid ${isDarkMode ? 'rgba(0, 217, 255, 0.3)' : 'rgba(255, 0, 110, 0.3)'};
          box-shadow: 0 25px 50px -12px ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0, 217, 255, 0.15)'};
          border-radius: 24px; padding: 0 0 24px 0;
          width: 90%; max-width: 600px; max-height: 85vh;
          display: flex; flex-direction: column;
          transform: translateY(20px);
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          color: ${isDarkMode ? '#ffffff' : '#1e1e1e'};
        }

        .tm-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 24px 10px 24px; background: transparent; border: none;
        }
        .tm-title-container { text-align: center; flex-grow: 1; }
        .tm-header h2 {
          margin: 0; font-size: 1.4rem; font-weight: 700;
          background: linear-gradient(90deg, #ff006e, #00d9ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .tm-header p { margin: 4px 0 0 0; font-size: 0.85rem; color: ${isDarkMode ? '#a0a0b5' : '#555'}; }
        .tm-close, .tm-theme-btn {
          background: transparent; border: none; font-size: 1.2rem; cursor: pointer;
          color: inherit; transition: transform 0.2s; width: 40px; display: flex; justify-content: center;
        }
        .tm-close:hover, .tm-theme-btn:hover { transform: scale(1.1); }

        .tm-main { padding: 0 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
        
        .tm-input-group {
          background: ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)'};
          padding: 15px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px;
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'};
        }
        .tm-input-group input, .tm-input-group textarea, .tm-input-group select {
          width: 100%; padding: 10px 15px; border-radius: 8px;
          background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'};
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'};
          color: ${isDarkMode ? 'white' : 'black'}; font-family: inherit; outline: none;
        }
        .tm-input-group input:focus, .tm-input-group textarea:focus { border-color: #00d9ff; }
        .tm-form-row { display: flex; gap: 10px; }
        .tm-btn-add {
          padding: 10px 20px; background: linear-gradient(135deg, #00d9ff, #007a99);
          color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; flex-grow: 1;
        }

        .tm-task-list { display: flex; flex-direction: column; gap: 12px; }
        .tm-task-card {
          background: ${isDarkMode ? 'rgba(255,255,255,0.02)' : 'white'};
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#eee'};
          border-left-width: 4px; border-radius: 8px; padding: 15px;
          display: flex; flex-direction: column; gap: 8px; transition: 0.3s;
        }
        .tm-task-header { display: flex; justify-content: space-between; align-items: center; }
        .tm-task-header h3 { margin: 0; font-size: 1.1rem; }
        .tm-task-badge { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; color: white; font-weight: bold; }
        .tm-task-desc { margin: 0; font-size: 0.9rem; color: ${isDarkMode ? '#bbb' : '#666'}; }
        
        .tm-actions { display: flex; gap: 10px; margin-top: 5px; }
        .tm-btn-action {
          flex: 1; padding: 8px; border: none; border-radius: 6px; cursor: pointer;
          background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}; color: inherit;
        }
        .tm-btn-action:hover { background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}; }

        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div className="tm-overlay" onClick={onClose}>
        <div className="tm-wrapper" onClick={(e) => e.stopPropagation()}>
          <div className="tm-header">
            <button className="tm-theme-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className="tm-title-container">
              <h2>📊 TaskManager</h2>
              <p>Gestionnaire avec priorités</p>
            </div>
            <button className="tm-close" onClick={onClose}>✖</button>
          </div>

          <div className="tm-main">
            <div className="tm-input-group">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} placeholder="Titre de la tâche..." />
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description abrégée..." rows={2} />
              <div className="tm-form-row">
                <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                  <option value="low">🟢 Basse</option>
                  <option value="medium">🟡 Normal</option>
                  <option value="high">🔴 Haute</option>
                </select>
                <button className="tm-btn-add" onClick={addTask}>➕ Ajouter</button>
              </div>
            </div>

            <div className="tm-task-list">
              {tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: isDarkMode ? '#888' : '#aaa' }}>📭 Aucune tâche</div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="tm-task-card" style={{ borderLeftColor: colors[task.priority], opacity: task.completed ? 0.5 : 1 }}>
                    <div className="tm-task-header">
                      <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
                      <span className="tm-task-badge" style={{ backgroundColor: colors[task.priority] }}>
                        {icons[task.priority]} {task.priority.toUpperCase()}
                      </span>
                    </div>
                    {task.desc && <p className="tm-task-desc">{task.desc}</p>}
                    <div className="tm-actions">
                      <button className="tm-btn-action" onClick={() => toggleTask(task.id)}>{task.completed ? '⏪ Restaurer' : '✅ Compléter'}</button>
                      <button className="tm-btn-action" onClick={() => deleteTask(task.id)}>🗑️ Supprimer</button>
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

export default TaskManagerDemo;