import React, { useState } from 'react';
import { X, FolderPlus, Sparkles } from 'lucide-react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string, color?: string) => Promise<void> | void;
}

const PRESET_COLORS = [
  { label: 'Coral', value: '#DF886F' },
  { label: 'Teal', value: '#14B8A6' },
  { label: 'Emerald', value: '#10B981' },
  { label: 'Violet', value: '#8B5CF6' },
  { label: 'Rose', value: '#F43F5E' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Sky', value: '#0EA5E9' },
  { label: 'Indigo', value: '#6366F1' },
];

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#DF886F');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a playlist name');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onCreate(name.trim(), description.trim(), selectedColor);
      setName('');
      setDescription('');
      setSelectedColor('#DF886F');
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to create playlist');
      } else {
        setError('Failed to create playlist');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-[#EFE7DE] shadow-2xl p-6 sm:p-7 relative animate-scaleUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ backgroundColor: selectedColor }}
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm transition-colors duration-300"
              style={{ backgroundColor: selectedColor }}
            >
              <FolderPlus size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 tracking-tight">
                Create New Playlist
              </h3>
              <p className="text-xs text-neutral-400">
                Organize your background tracks by vibe or task
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Playlist Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Late Night Coding, Gym Pump, Lo-Fi Chill"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:ring-2 focus:ring-[#DF886F]/20 text-sm outline-none transition-all placeholder:text-neutral-400"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Description <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kind of tracks live here?"
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:ring-2 focus:ring-[#DF886F]/20 text-sm outline-none transition-all resize-none placeholder:text-neutral-400"
            />
          </div>

          {/* Color Tag Picker */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2">
              Color Theme
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => {
                const isSelected = selectedColor === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                      isSelected ? 'scale-115 ring-2 ring-offset-2 ring-neutral-900' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white shadow-xs" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
              style={{ backgroundColor: selectedColor }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>Create Playlist</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
