import React, { useEffect, useMemo, useState } from 'react';

export type AlertChannel = 'whatsapp' | 'email' | 'sms';
export type AlertStatus = 'pending' | 'processing' | 'sent';

export interface ReminderAlert {
  id: number;
  client: string;
  docType: string;
  dueDate: string;
  channel: AlertChannel;
  status: AlertStatus;
}

export interface NotifyHubProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHANNEL_CONFIG: Record<AlertChannel, { label: string; colorClass: string }> = {
  whatsapp: {
    label: 'WhatsApp',
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  email: {
    label: 'Email',
    colorClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
  sms: {
    label: 'SMS',
    colorClass: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  },
};

const STORAGE_KEY = 'gtt_notifyhub_data';

const NotifyHubModal: React.FC<NotifyHubProps> = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState<ReminderAlert[]>([]);
  const [client, setClient] = useState('');
  const [docType, setDocType] = useState('Facture #');
  const [dueDate, setDueDate] = useState('');
  const [channel, setChannel] = useState<AlertChannel>('whatsapp');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'sent'>('all');
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setAlerts(parsedData);
          return;
        }
      } catch {
        // Fallback en cas d'erreur de parsing
      }
    }

    const demoAlerts: ReminderAlert[] = [
      {
        id: 1,
        client: 'Société Alpha (Lomé)',
        docType: 'Facture #2026-04',
        dueDate: '2026-10-01',
        channel: 'whatsapp',
        status: 'pending',
      },
      {
        id: 2,
        client: 'Cabinet Horizon',
        docType: 'Renouvellement Contrat',
        dueDate: '2026-09-28',
        channel: 'email',
        status: 'sent',
      },
    ];
    setAlerts(demoAlerts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoAlerts));
  }, []);

  const saveAlerts = (updatedAlerts: ReminderAlert[]) => {
    setAlerts(updatedAlerts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlerts));
  };

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToast({ text, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  const handleAddAlert = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client.trim() || !dueDate) {
      showToast('Veuillez remplir le nom du client et la date.', 'info');
      return;
    }

    const newAlert: ReminderAlert = {
      id: Date.now(),
      client: client.trim(),
      docType: docType.trim() || 'Document',
      dueDate,
      channel,
      status: 'pending',
    };

    saveAlerts([newAlert, ...alerts]);
    setClient('');
    setDueDate('');
    showToast('Relance programmée avec succès !');
  };

  const handleTriggerNotification = (id: number) => {
    const target = alerts.find((alert) => alert.id === id);
    if (!target) return;

    const processingAlerts = alerts.map((alert) =>
      alert.id === id ? { ...alert, status: 'processing' as AlertStatus } : alert
    );
    saveAlerts(processingAlerts);

    window.setTimeout(() => {
      setAlerts((currentAlerts) => {
        const updatedAlerts = currentAlerts.map((alert) =>
          alert.id === id ? { ...alert, status: 'sent' as AlertStatus } : alert
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlerts));
        return updatedAlerts;
      });
      showToast(`✔ ${CHANNEL_CONFIG[target.channel].label} transmis à ${target.client}`);
    }, 1200);
  };

  const handleDeleteAlert = (id: number) => {
    const updatedAlerts = alerts.filter((alert) => alert.id !== id);
    saveAlerts(updatedAlerts);
    showToast('Relance supprimée.', 'info');
  };

  const filteredAlerts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return [...alerts]
      .filter((alert) => (filterStatus === 'all' ? true : alert.status === filterStatus))
      .filter((alert) =>
        !normalizedSearch
          ? true
          : alert.client.toLowerCase().includes(normalizedSearch) ||
            alert.docType.toLowerCase().includes(normalizedSearch)
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [alerts, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: alerts.length,
      pending: alerts.filter((alert) => alert.status === 'pending').length,
      sent: alerts.filter((alert) => alert.status === 'sent').length,
    };
  }, [alerts]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[10000] px-5 py-3 rounded-full border text-xs sm:text-sm font-semibold shadow-2xl transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-300'
              : 'bg-amber-950/95 border-amber-500/50 text-amber-300'
          }`}
        >
          {toast.text}
        </div>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* HEADER */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h2 className="text-lg font-bold">
              Notify<span className="text-cyan-400">Hub</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-slate-800 text-amber-400"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* STATISTIQUES */}
        <div className={`grid grid-cols-3 gap-3 p-4 border-b ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <div className={`p-3 rounded-xl border text-center ${isDarkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-xl font-extrabold text-cyan-400">{stats.total}</span>
            <div className="text-[10px] uppercase opacity-60 font-medium mt-1">Total</div>
          </div>
          <div className={`p-3 rounded-xl border text-center ${isDarkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-xl font-extrabold text-amber-400">{stats.pending}</span>
            <div className="text-[10px] uppercase opacity-60 font-medium mt-1">En attente</div>
          </div>
          <div className={`p-3 rounded-xl border text-center ${isDarkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-xl font-extrabold text-emerald-400">{stats.sent}</span>
            <div className="text-[10px] uppercase opacity-60 font-medium mt-1">Transmises</div>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* FORMULAIRE */}
          <form onSubmit={handleAddAlert} className={`p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center ${isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <input
              type="text"
              placeholder="Nom du client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
            />
            <input
              type="text"
              placeholder="Document (ex: Facture #12)"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
            />
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as AlertChannel)}
              className={`w-full px-3 py-2 rounded-lg text-sm border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg text-sm transition shadow-lg shadow-cyan-500/20"
            >
              + Programmer
            </button>
          </form>

          {/* RECHERCHE ET FILTRES */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="🔍 Rechercher client ou document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full sm:w-72 px-3 py-2 rounded-lg text-sm border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300'}`}
            />
            <div className="flex gap-2">
              {(['all', 'pending', 'sent'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    filterStatus === status
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                      : isDarkMode
                      ? 'border-slate-800 text-slate-400'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {status === 'all' ? 'Toutes' : status === 'pending' ? 'En attente' : 'Envoyées'}
                </button>
              ))}
            </div>
          </div>

          {/* TABLEAU */}
          <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="overflow-x-auto">
              <div className="min-w-[650px]">
                <div className={`grid grid-cols-12 gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b ${isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                  <div className="col-span-3">Client</div>
                  <div className="col-span-3">Document</div>
                  <div className="col-span-2">Échéance</div>
                  <div className="col-span-2">Canal / Statut</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {filteredAlerts.length === 0 ? (
                  <div className="p-8 text-center text-sm opacity-50">Aucune relance trouvée.</div>
                ) : (
                  <div className={`divide-y ${isDarkMode ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                    {filteredAlerts.map((item) => (
                      <div key={item.id} className={`grid grid-cols-12 gap-2 px-4 py-3.5 items-center text-sm ${isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                        <div className="col-span-3 font-semibold truncate">{item.client}</div>
                        <div className="col-span-3 text-xs opacity-80 truncate">{item.docType}</div>
                        <div className="col-span-2 text-xs opacity-75 font-mono">{new Date(item.dueDate).toLocaleDateString('fr-FR')}</div>
                        <div className="col-span-2 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${CHANNEL_CONFIG[item.channel].colorClass}`}>
                            {CHANNEL_CONFIG[item.channel].label}
                          </span>
                          {item.status === 'pending' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Attente</span>}
                          {item.status === 'processing' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse">Envoi...</span>}
                          {item.status === 'sent' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Envoyé</span>}
                        </div>
                        <div className="col-span-2 flex justify-end items-center gap-2">
                          {item.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleTriggerNotification(item.id)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white border border-cyan-500/30 transition"
                            >
                              Relancer
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteAlert(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifyHubModal;