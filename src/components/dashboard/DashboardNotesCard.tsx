import React, { useState, useEffect, useCallback } from 'react';
import {
  StickyNote,
  ArrowRight,
  Plus,
  Pin,
  Check,
} from 'lucide-react';
import { getStoredNotes, addNoteToStorage } from '../../services/notesStorage';
import type { NoteItem } from '../../types';

interface DashboardNotesCardProps {
  onNavigateToNotepad?: () => void;
  onOpenAddModal?: () => void;
}

export const DashboardNotesCard: React.FC<DashboardNotesCardProps> = ({
  onNavigateToNotepad,
  onOpenAddModal,
}) => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickTitle, setQuickTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const data = await getStoredNotes();
      setNotes(data);
    } catch (err) {
      console.warn('Error fetching notes for dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();

    const handleUpdate = () => {
      fetchNotes();
    };

    window.addEventListener('notes-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('notes-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchNotes]);

  const handleQuickAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = quickTitle.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const created = await addNoteToStorage({
        title: trimmed,
        content: '',
        category: 'General',
        tags: ['quick'],
        color: '#FEF08A',
        isPinned: false,
      });

      setNotes((prev) => [created, ...prev]);
      setQuickTitle('');
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      console.error('Failed to quick add note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show top 3 pinned / recent notes
  const topNotes = notes.slice(0, 3);

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 flex flex-col justify-between border border-[#EFE5DC]/80 shadow-soft select-none h-full relative overflow-hidden group">
      {/* Background Soft Glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              QUICK NOTEPAD
            </span>
            {notes.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF9C3] text-[#CA8A04]">
                {notes.length}
              </span>
            )}
          </div>

          <button
            onClick={onNavigateToNotepad}
            className="text-[12px] font-semibold text-[#F59E0B] hover:text-[#D97706] flex items-center gap-1 transition-colors group/btn cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Quick Add Note Form */}
        <form onSubmit={handleQuickAdd} className="mb-3.5 relative z-10">
          <div className="flex items-center gap-2 bg-[#FAF7F4] border border-[#EFE5DC]/90 rounded-2xl p-1.5 focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/20 transition-all">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Jot down a quick thought or task..."
              className="flex-1 bg-transparent px-3 py-1 text-[13px] text-neutral-900 placeholder-neutral-400 focus:outline-hidden"
              disabled={isSubmitting}
            />

            <button
              type="submit"
              disabled={!quickTitle.trim() || isSubmitting}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-2xs ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : quickTitle.trim()
                  ? 'bg-neutral-900 hover:bg-[#F59E0B] text-white'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={13} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Plus size={13} strokeWidth={2.5} />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Recent Notes Display */}
        {isLoading ? (
          <div className="space-y-2 py-1 relative z-10">
            {[1, 2].map((i) => (
              <div key={i} className="p-2.5 rounded-2xl bg-neutral-100/70 animate-pulse h-12" />
            ))}
          </div>
        ) : topNotes.length === 0 ? (
          <div className="py-5 px-3 text-center flex flex-col items-center justify-center relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF9C3] flex items-center justify-center text-[#F59E0B] mb-2 shadow-2xs">
              <StickyNote size={18} />
            </div>
            <p className="text-[12.5px] font-bold text-neutral-800">Your notepad is empty</p>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">
              Type above to quickly save thoughts directly to MongoDB Atlas.
            </p>
          </div>
        ) : (
          <div className="space-y-2 relative z-10">
            {topNotes.map((note) => (
              <div
                key={note.id}
                onClick={onNavigateToNotepad}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF7F4] border border-[#EFE5DC]/60 transition-all duration-200 cursor-pointer group/note"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Color Pip */}
                  <div
                    className="w-3 h-3 rounded-full shrink-0 border border-black/10 shadow-2xs group-hover/note:scale-110 transition-transform"
                    style={{ backgroundColor: note.color || '#FEF08A' }}
                  />

                  {/* Title & Category */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[13px] text-neutral-900 leading-tight group-hover/note:text-[#DF886F] transition-colors truncate max-w-[200px] sm:max-w-[260px]">
                      {note.title}
                    </span>
                    <span className="text-[10.5px] text-neutral-400 mt-0.5 truncate">
                      {note.category}
                      {note.content ? ` · ${note.content.substring(0, 30)}...` : ''}
                    </span>
                  </div>
                </div>

                {/* Pin indicator */}
                {note.isPinned && (
                  <div className="text-[#F59E0B] shrink-0" title="Pinned Note">
                    <Pin size={13} className="fill-[#F59E0B]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer link to detailed note modal */}
      {onOpenAddModal && (
        <div className="pt-2.5 mt-2 border-t border-[#EFE5DC]/50 flex items-center justify-between relative z-10">
          <span className="text-[11px] text-neutral-400">Want formatted notes?</span>
          <button
            onClick={onOpenAddModal}
            className="text-[11px] font-semibold text-neutral-700 hover:text-[#14B8A6] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus size={12} />
            <span>New Detailed Note</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardNotesCard;
