import React, { useState, useEffect } from 'react';

interface ReminderAlert {
  id: number;
  client: string;
  docType: string;
  dueDate: string;
  channel: 'whatsapp' | 'email' | 'sms';
  status: 'pending' | 'sent';
}

interface DigiAlertDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const DigiAlertDemo: React.FC<DigiAlertDemoProps> = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState<ReminderAlert[]>([]);
  const [client, setClient] = useState('');
  const [docType, setDocType] = useState('Facture en attente');
  const [dueDate, setDueDate] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('demoDigiAlerts');
    if (stored) {
      setAlerts(JSON.parse(stored));
    } else {
      // Données de démonstration par défaut
      const defaultAlerts: ReminderAlert[] = [
        { id: 1, client: 'Société Alpha', docType: 'Facture #2026-04', dueDate: '2026-10-01', channel: 'whatsapp', status: 'pending' },
        { id: 2, client: 'Cabinet Horizon', docType: 'Renouvellement Contrat', dueDate: '2026-09-28', channel: 'email', status: 'pending' }
      ];
      setAlerts(defaultAlerts);
      localStorage.setItem('demoDigiAlerts', JSON.stringify(defaultAlerts));
    }
  }, []);

  const saveAlerts = (newAlerts: ReminderAlert[]) => {
    setAlerts(newAlerts);
    localStorage.setItem('demoDigiAlerts', JSON.stringify(newAlerts));
  };

  const addAlert = () => {
    if (!client.trim() || !dueDate) {
      alert('Veuillez renseigner le nom du client et la date d\'échéance !');
      return;
    }

    const newAlert: ReminderAlert = {
      id: Date.now(),
      client,
      docType,
      dueDate,
      channel,
      status: 'pending'
    };

    saveAlerts([newAlert, ...alerts]);
    setClient('');
    setDueDate('');
  };

  const triggerManualNotification = (id: number) => {
    const target = alerts.find(a => a.id === id);
    if (!target) return;

    const updated = alerts.map(a => a.id === id ? { ...a, status: 'sent' as const } : a);
    saveAlerts(updated);

    // Simulation d'envoi visuel
    const channelName = target.channel === 'whatsapp' ? 'WhatsApp' : target.channel === 'email' ? 'Email' : 'SMS';
    setToastMessage(`📱 Notification ${channelName} envoyée à ${target.client} !`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const deleteAlert = (id: number) => {
    saveAlerts(alerts.filter(a => a.id !== id));
  };

  const channelIcons = {
    whatsapp: '💬 WhatsApp',
    email: '✉️ Email',
    sms: '📲 SMS'
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .da-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.4)'};
          backdrop-filter: blur(8px);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000; opacity: 0; animation: fadeIn 0.3s forwards;
        }

        .da-wrapper {
          background: ${isDarkMode ? 'rgba(22, 21, 43, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          border: 1px solid ${isDarkMode ? 'rgba(0, 217, 255, 0.3)' : 'rgba(255, 0, 110, 0.3)'};
          box-shadow: 0 25px 50px -12px ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0, 217, 255, 0.15)'};
          border-radius: 24px; padding: 0 0 24px 0;
          width: 90%; max-width: 620px; max-height: 85vh;
          display: flex; flex-direction: column;
          transform: translateY(20px);
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          color: ${isDarkMode ? '#ffffff' : '#1e1e1e'};
          position: relative;
        }

        /* En-tête standardisé */
        .da-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 24px 10px 24px; background: transparent; border: none;
        }
        .da-title-container { text-align: center; flex-grow: 1; }
        .da-header h2 {
          margin: 0; font-size: 1.4rem; font-weight: 700;
          background: linear-gradient(90deg, #ff006e, #00d9ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .da-header p { margin: 4px 0 0 0; font-size: 0.85rem; color: ${isDarkMode ? '#a0a0b5' : '#555'}; }
        .da-close, .da-theme-btn {
          background: transparent; border: none; font-size: 1.2rem; cursor: pointer;
          color: inherit; transition: transform 0.2s; width: 40px; display: flex; justify-content: center;
        }
        .da-close:hover, .da-theme-btn:hover { transform: scale(1.1); }

        .da-main { padding: 0 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }

        /* Notification Toast */
        .da-toast {
          position: absolute; top: 75px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, #10b981, #059669); color: white;
          padding: 8px 18px; border-radius: 20px; font-weight: 600; font-size: 0.85rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10;
          animation: fadeIn 0.3s forwards;
        }

        /* Formulaire */
        .da-input-group {
          background: ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)'};
          padding: 15px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px;
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'};
        }
        .da-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .da-input-group input, .da-input-group select {
          width: 100%; padding: 10px 12px; border-radius: 8px;
          background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'};
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'};
          color: ${isDarkMode ? 'white' : 'black'}; font-family: inherit; outline: none; font-size: 0.9rem;
        }
        .da-btn-add {
          padding: 10px 20px; background: linear-gradient(135deg, #ff006e, #00d9ff);
          color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;
          transition: 0.2s;
        }
        .da-btn-add:hover { opacity: 0.9; transform: translateY(-1px); }

        /* Liste des Relances */
        .da-list { display: flex; flex-direction: column; gap: 10px; }
        .da-card {
          background: ${isDarkMode ? 'rgba(255,255,255,0.02)' : 'white'};
          border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#eee'};
          border-left: 4px solid #00d9ff; border-radius: 8px; padding: 14px;
          display: flex; justify-content: space-between; align-items: center; gap: 10px;
        }
        .da-card.sent { border-left-color: #10b981; }

        .da-card-info h4 { margin: 0; font-size: 1rem; }
        .da-card-info p { margin: 3px 0 0 0; font-size: 0.8rem; color: ${isDarkMode ? '#aaa' : '#666'}; }

        .da-badge {
          display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: bold;
          margin-top: 4px; background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#eee'};
        }

        .da-actions { display: flex; gap: 6px; }
        .da-btn-trigger {
          padding: 6px 12px; background: linear-gradient(135deg, #00d9ff, #007a99);
          color: white; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
        }
        .da-btn-delete {
          padding: 6px 10px; background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#f0f0f0'};
          border: none; border-radius: 6px; cursor: pointer; color: inherit;
        }

        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div className="da-overlay" onClick={onClose}>
        <div className="da-wrapper" onClick={(e) => e.stopPropagation()}>
          
          <div className="da-header">
            <button className="da-theme-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className="da-title-container">
              <h2> Mini DigiAlert</h2>
              <p>Rappels & relances automatiques d'échéances</p>
            </div>
            <button className="da-close" onClick={onClose}>✖</button>
          </div>

          {toastMessage && <div className="da-toast">{toastMessage}</div>}

          <div className="da-main">
            <div className="da-input-group">
              <div className="da-form-row">
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Nom du client..."
                />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="da-form-row">
                <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <option value="Facture en attente">📄 Facture en attente</option>
                  <option value="Renouvellement Contrat">✍️ Renouvellement Contrat</option>
                  <option value="Maintenance Serveur">🖥️ Maintenance Serveur</option>
                  <option value="Suivi Projet">📌 Suivi Projet</option>
                </select>

                <select value={channel} onChange={(e) => setChannel(e.target.value as any)}>
                  <option value="whatsapp">💬 Canal WhatsApp</option>
                  <option value="email">✉️ Canal Email</option>
                  <option value="sms">📲 Canal SMS</option>
                </select>
              </div>

              <button className="da-btn-add" onClick={addAlert}>
                ⚡ Programmer la relance
              </button>
            </div>

            <div className="da-list">
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px' }}>
                Relances programmées ({alerts.length})
              </div>

              {alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: isDarkMode ? '#888' : '#aaa' }}>
                  🔕 Aucune relance programmée
                </div>
              ) : (
                alerts.map((item) => (
                  <div key={item.id} className={`da-card ${item.status === 'sent' ? 'sent' : ''}`}>
                    <div className="da-card-info">
                      <h4>{item.client}</h4>
                      <p>{item.docType} · Échéance: <strong>{item.dueDate}</strong></p>
                      <span className="da-badge">
                        {channelIcons[item.channel]} · {item.status === 'sent' ? '✅ Relancé' : '⏳ En attente'}
                      </span>
                    </div>

                    <div className="da-actions">
                      <button
                        className="da-btn-trigger"
                        onClick={() => triggerManualNotification(item.id)}
                        title="Simuler l'envoi immédiat"
                      >
                        🚀 Relancer
                      </button>
                      <button className="da-btn-delete" onClick={() => deleteAlert(item.id)}>
                        🗑️
                      </button>
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

export default DigiAlertDemo;