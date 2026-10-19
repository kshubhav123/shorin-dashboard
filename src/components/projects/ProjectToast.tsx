import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ProjectToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const ProjectToast: React.FC<ProjectToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm w-full select-none">
      <div
        className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
          isSuccess
            ? 'bg-emerald-950/90 text-white border-emerald-500/40'
            : 'bg-rose-950/90 text-white border-rose-500/40'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle2 size={18} className="text-emerald-400" />
          ) : (
            <AlertCircle size={18} className="text-rose-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold tracking-tight">{toast.title}</h4>
          {toast.description && (
            <p className="text-[11px] text-white/80 mt-0.5 leading-relaxed">{toast.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
