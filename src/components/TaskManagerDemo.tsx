import React, { useState, useEffect } from 'react'

interface Task {
  id: number
  title: string
  desc: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
}

interface TaskManagerDemoProps {
  isOpen: boolean
  onClose: () => void
}

const TaskManagerDemo: React.FC<TaskManagerDemoProps> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  useEffect(() => {
    const stored = localStorage.getItem('demoTasks')
    if (stored) {
      setTasks(JSON.parse(stored))
    }
  }, [])

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
    localStorage.setItem('demoTasks', JSON.stringify(newTasks))
  }

  const addTask = () => {
    if (!title.trim()) {
      alert('Veuillez entrer un titre!')
      return
    }

    const newTask: Task = {
      id: Date.now(),
      title,
      desc,
      priority,
      completed: false,
    }

    saveTasks([newTask, ...tasks])
    setTitle('')
    setDesc('')
    setPriority('medium')
  }

  const toggleTask = (id: number) => {
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTask = (id: number) => {
    saveTasks(tasks.filter((t) => t.id !== id))
  }

  const colors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' }
  const icons = { low: '🟢', medium: '🟡', high: '🔴' }

  return (
    <div className={`demo-modal ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="demo-modal-content">
        <button className="demo-close" onClick={onClose}>
          &times;
        </button>

        <div className="demo-container">
          <header className="demo-header">
            <h1>📊 TaskManager - Démo Interactive</h1>
            <p>Gérez vos tâches avec priorités!</p>
          </header>

          <main className="demo-main">
            <div className="demo-input-section">
              <div className="demo-input-group">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Titre de la tâche..."
                />
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Description..."
                ></textarea>
                <div className="demo-form-row">
                  <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="demo-category-select">
                    <option value="low">🟢 Basse</option>
                    <option value="medium">🟡 Normal</option>
                    <option value="high">🔴 Haute</option>
                  </select>
                  <button className="demo-btn-add" onClick={addTask}>
                    ➕ Ajouter
                  </button>
                </div>
              </div>
            </div>

            <div className="demo-notes-section">
              <h2>Vos Tâches ({tasks.length})</h2>
              <div className="demo-notes-grid">
                {tasks.length === 0 ? (
                  <div className="demo-empty-state">
                    <h3>📭 Aucune tâche</h3>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="demo-note-card"
                      style={{ borderLeftColor: colors[task.priority], opacity: task.completed ? 0.5 : 1 }}
                    >
                      <div className="demo-note-header">
                        <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
                        <span className="demo-note-category" style={{ backgroundColor: colors[task.priority] }}>
                          {icons[task.priority]} {task.priority}
                        </span>
                      </div>
                      <p>{task.desc}</p>
                      <div className="demo-note-actions">
                        <button className="demo-btn-edit" onClick={() => toggleTask(task.id)} style={{ flex: 1 }}>
                          {task.completed ? '⏮️' : '✅'}
                        </button>
                        <button className="demo-btn-delete" onClick={() => deleteTask(task.id)} style={{ flex: 1 }}>
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

export default TaskManagerDemo
