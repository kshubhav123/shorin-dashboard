import React, { useState, useEffect } from 'react';
import type { ProjectItem } from '../../types';
import { AlertTriangle, X, Trash2, Check, Copy } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (projectId: string) => void;
  project: ProjectItem | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  project,
}) => {
  const [typedName, setTypedName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTypedName('');
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  // Case-insensitive trimmed match
  const isMatch =
    typedName.trim().toLowerCase() === project.name.trim().toLowerCase();

  const handleExecuteDelete = () => {
    if (isMatch) {
      onConfirmDelete(project.id);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteDelete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-[28px] w-full max-w-md shadow-card border border-neutral-100 overflow-hidden relative text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-50/80 px-6 py-5 flex items-center justify-between border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 leading-tight">
                Delete Project
              </h3>
              <p className="text-xs text-rose-600 font-medium">This action cannot be undone</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-neutral-600 leading-relaxed">
            To permanently delete this project, type its name below to confirm.
          </p>

          {/* Project Name Highlight Badge with Click-to-Autofill */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium">
              <span>Target Project:</span>
              <button
                type="button"
                onClick={() => setTypedName(project.name)}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Click to auto-fill name"
              >
                <Copy size={11} />
                <span>Auto-fill name</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setTypedName(project.name)}
              className="w-full p-3 rounded-xl bg-neutral-100 hover:bg-rose-50 border border-neutral-200 hover:border-rose-200 font-mono text-xs font-bold text-neutral-800 text-center break-words cursor-pointer transition-all flex items-center justify-center gap-2"
              title="Click to auto-fill"
            >
              <span>{project.name}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Confirm Project Name:
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={`Type "${project.name}" to confirm...`}
              autoFocus
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:border-rose-500 focus:outline-hidden transition-colors"
            />
            {/* Feedback Helper */}
            <div className="mt-1.5 text-[11px]">
              {isMatch ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check size={12} /> Name confirmed! You can now delete this project.
                </span>
              ) : typedName.length > 0 ? (
                <span className="text-neutral-400">
                  Name does not match yet. Click "Auto-fill name" above to quickly paste.
                </span>
              ) : (
                <span className="text-neutral-400">
                  Type the project name or click the name box above.
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isMatch}
              onClick={(e) => {
                if (isMatch) {
                  e.preventDefault();
                  handleExecuteDelete();
                }
              }}
              className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs tracking-tight flex items-center gap-1.5 transition-all shadow-sm ${
                isMatch
                  ? 'bg-rose-600 hover:bg-rose-700 active:scale-98 cursor-pointer'
                  : 'bg-neutral-300 cursor-not-allowed opacity-60'
              }`}
            >
              <Trash2 size={13} />
              <span>Delete Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
