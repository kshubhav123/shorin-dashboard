import React, { useState, useEffect } from 'react';
import type { VideoItem } from '../../types';
import { AlertTriangle, X, Trash2, Copy } from 'lucide-react';

interface DeleteVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (videoId: string) => void;
  video: VideoItem | null;
}

export const DeleteVideoModal: React.FC<DeleteVideoModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  video,
}) => {
  const [typedTitle, setTypedTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTypedTitle('');
    }
  }, [isOpen, video]);

  if (!isOpen || !video) return null;

  // Case-insensitive trimmed match
  const isMatch =
    typedTitle.trim().toLowerCase() === video.title.trim().toLowerCase();

  const handleExecuteDelete = () => {
    if (isMatch) {
      onConfirmDelete(video.id);
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
                Delete Video
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-neutral-600 leading-relaxed">
              To permanently remove this video from your portfolio and database, please type its title below to confirm:
            </p>

            {/* Quick autofill helper */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-neutral-100/80 border border-neutral-200/60 text-xs">
              <span className="font-mono font-bold text-neutral-800 truncate" title={video.title}>
                {video.title}
              </span>
              <button
                type="button"
                onClick={() => setTypedTitle(video.title)}
                className="shrink-0 text-[11px] font-semibold text-[#DF886F] hover:text-[#c46950] flex items-center gap-1 cursor-pointer"
                title="Autofill video title"
              >
                <Copy size={11} />
                <span>Autofill</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
              Confirm Video Title
            </label>
            <input
              type="text"
              autoFocus
              value={typedTitle}
              onChange={(e) => setTypedTitle(e.target.value)}
              placeholder="Type or click autofill above..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:border-rose-500 focus:outline-hidden transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isMatch}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                isMatch
                  ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer hover:shadow-md'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed opacity-70'
              }`}
            >
              <Trash2 size={13} />
              <span>Delete Video</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
