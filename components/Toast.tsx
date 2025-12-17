import React, { useEffect } from 'react';
import { X, Bell, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle2 size={20} className="text-green-400" />,
    info: <Bell size={20} className="text-nexus-accent" />,
    warning: <AlertTriangle size={20} className="text-orange-400" />
  };

  const bgColors = {
    success: 'bg-nexus-900/90 border-green-500/30',
    info: 'bg-nexus-900/90 border-nexus-accent/30',
    warning: 'bg-nexus-900/90 border-orange-500/30'
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl min-w-[320px] animate-fade-in-up ${bgColors[toast.type]}`}>
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-white mb-1">{toast.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{toast.message}</p>
      </div>
      <button 
        onClick={() => onClose(toast.id)}
        className="text-slate-500 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-3">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};
