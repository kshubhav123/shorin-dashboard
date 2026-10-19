import React, { useState, useEffect } from 'react';
import type { NoteItem, NoteCategory } from '../../types';
import { X, NotebookPen, Pin, Sparkles, Tag } from 'lucide-react';

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (noteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void> | void;
  initialNote?: NoteItem | null;
}

const CATEGORIES: NoteCategory[] = ['General', 'Work', 'Ideas', 'Personal', 'Code', 'Todo'];

const NOTE_COLORS = [
  { name: 'Yellow', bg: '#FEF08A', border: '#FDE047', label: 'Classic Yellow' },
  { name: 'Blue', bg: '#BAE6FD', border: '#7DD3FC', label: 'Sky Blue' },
  { name: 'Green', bg: '#BBF7D0', border: '#86EFAC', label: 'Mint Green' },
  { name: 'Rose', bg: '#FBCFE8', border: '#F472B6', label: 'Soft Rose' },
  { name: 'Purple', bg: '#E9D5FF', border: '#C084FC', label: 'Lavender' },
  { name: 'Peach', bg: '#FED7AA', border: '#FDBA74', label: 'Warm Peach' },
];

export const NoteFormModal: React.FC<NoteFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialNote,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('General');
  const [color, setColor] = useState('#FEF08A');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = Boolean(initialNote);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setCategory(initialNote.category || 'General');
      setColor(initialNote.color || '#FEF08A');
      setTags(initialNote.tags || []);
      setIsPinned(Boolean(initialNote.isPinned));
    } else {
      setTitle('');
      setContent('');
      setCategory('General');
      setColor('#FEF08A');
      setTags([]);
      setIsPinned(false);
    }
    setError('');
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Note title is required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        color,
        isPinned,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to save note');
      } else {
        setError('Failed to save note');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div
        className="w-full max-w-lg bg-white rounded-3xl border border-[#EFE7DE] shadow-2xl p-6 sm:p-7 relative animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow using selected color */}
        <div
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-2xl opacity-30 pointer-events-none transition-colors"
          style={{ backgroundColor: color }}
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-neutral-900 shadow-xs border transition-colors"
              style={{ backgroundColor: color, borderColor: `${color}80` }}
            >
              <NotebookPen size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 tracking-tight">
                {isEditMode ? 'Edit Note' : 'Add New Note'}
              </h3>
              <p className="text-xs text-neutral-400">
                Capture quick ideas, thoughts, and technical snippets
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

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Note Title */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js 15 Server Actions Notes..."
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:ring-2 focus:ring-[#DF886F]/20 text-sm font-semibold outline-none transition-all placeholder:text-neutral-400"
            />
          </div>

          {/* Category & Pin Option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoteCategory)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold focus:border-[#DF886F] outline-none bg-white transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 sm:pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-[#DF886F] focus:ring-[#DF886F] accent-[#DF886F] cursor-pointer"
                />
                <span className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                  <Pin size={12} className={isPinned ? 'text-[#DF886F] fill-current' : 'text-neutral-400'} />
                  <span>Pin to top</span>
                </span>
              </label>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Note Accent Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {NOTE_COLORS.map((c) => {
                const isSelected = color === c.bg;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.bg)}
                    className={`w-7 h-7 rounded-full border transition-transform cursor-pointer relative flex items-center justify-center ${
                      isSelected ? 'scale-115 ring-2 ring-neutral-900 ring-offset-2' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.bg, borderColor: c.border }}
                    title={c.label}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-neutral-900 shadow-2xs" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-neutral-700">
                Note Content
              </label>
              <span className="text-[10px] text-neutral-400 font-medium">
                {wordCount} words • {charCount} chars
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note, code, thoughts, or checklists here..."
              rows={6}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-neutral-200 focus:border-[#DF886F] focus:ring-2 focus:ring-[#DF886F]/20 text-xs sm:text-sm outline-none transition-all placeholder:text-neutral-400 leading-relaxed font-sans"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Tags <span className="text-neutral-400 font-normal">(Press Enter or comma to add)</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="e.g. react, mongo, todo..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#DF886F] focus:ring-2 focus:ring-[#DF886F]/20 outline-none transition-all placeholder:text-neutral-400"
                />
                <Tag size={13} className="absolute left-2.5 top-2.5 text-neutral-400" />
              </div>
              <button
                type="button"
                onClick={() => {
                  const trimmed = tagInput.trim().replace(/^#/, '');
                  if (trimmed && !tags.includes(trimmed)) {
                    setTags([...tags, trimmed]);
                    setTagInput('');
                  }
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-[11px] font-semibold"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-neutral-400 hover:text-neutral-800 cursor-pointer ml-0.5"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#DF886F] hover:bg-[#d4785e] text-white shadow-md flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>{isEditMode ? 'Update Note' : 'Create Note'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
