import React, { useState, useEffect, useMemo } from 'react';
import type { NoteItem, NoteCategory } from '../../types';
import {
  getStoredNotes,
  addNoteToStorage,
  updateNoteInStorage,
  toggleNotePinInStorage,
  deleteNoteFromStorage,
} from '../../services/notesStorage';
import { NoteCard } from '../notepad/NoteCard';
import { NoteFormModal } from '../notepad/NoteFormModal';
import { DeleteNoteModal } from '../notepad/DeleteNoteModal';
import {
  Search,
  Plus,
  Pin,
  NotebookPen,
  Database,
  StickyNote,
  Sparkles,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: ('ALL' | NoteCategory)[] = [
  'ALL',
  'General',
  'Work',
  'Ideas',
  'Personal',
  'Code',
  'Todo',
];

export const NotepadView: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | NoteCategory>('ALL');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [deletingNote, setDeletingNote] = useState<NoteItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load notes on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getStoredNotes()
      .then((data) => {
        if (isMounted) setNotes(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter notes by search & category
  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return notes.filter((n) => {
      const matchesCategory =
        selectedCategory === 'ALL' || n.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!query) return true;

      const titleMatch = n.title.toLowerCase().includes(query);
      const contentMatch = n.content.toLowerCase().includes(query);
      const tagsMatch = n.tags?.some((t) => t.toLowerCase().includes(query));

      return titleMatch || contentMatch || tagsMatch;
    });
  }, [notes, searchQuery, selectedCategory]);

  const pinnedNotes = useMemo(
    () => filteredNotes.filter((n) => n.isPinned),
    [filteredNotes]
  );

  const otherNotes = useMemo(
    () => filteredNotes.filter((n) => !n.isPinned),
    [filteredNotes]
  );

  // Handlers
  const handleCreateOrUpdate = async (
    payload: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingNote) {
      const updated = await updateNoteInStorage(editingNote.id, payload);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      showToast('Note updated successfully!');
    } else {
      const created = await addNoteToStorage(payload);
      setNotes((prev) => [created, ...prev]);
      showToast('New note created successfully!');
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#DF886F', '#14B8A6', '#F59E0B'],
        });
      } catch {}
    }
    setEditingNote(null);
  };

  const handleTogglePin = async (id: string) => {
    const updated = await toggleNotePinInStorage(id);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    showToast(updated.isPinned ? 'Note pinned to top 📌' : 'Note unpinned');
  };

  const handleDeleteConfirm = async () => {
    if (!deletingNote) return;
    await deleteNoteFromStorage(deletingNote.id);
    setNotes((prev) => prev.filter((n) => n.id !== deletingNote.id));
    showToast('Note deleted');
    setDeletingNote(null);
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-bounce-in">
          <div className="px-4 py-2.5 rounded-2xl bg-neutral-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/10">
            <Check size={14} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ================= HERO HEADER ================= */}
      <div className="bg-[#FAF5F0] rounded-[28px] p-6 sm:p-7 border border-[#EFE7DE] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#DF886F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8DDD4] text-neutral-800 flex items-center gap-1.5">
              <StickyNote size={13} className="text-[#DF886F]" />
              <span>Notepad Hub</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#14B8A6]/10 text-[#0D9488] border border-[#14B8A6]/20">
              <Database size={11} className="text-[#14B8A6]" />
              <span>MongoDB Atlas Synced</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-800 border border-amber-500/20">
              <Sparkles size={11} className="text-amber-600" />
              <span>{notes.length} Notes Saved</span>
            </span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            Personal Notepad & Quick Thoughts
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Organize code snippets, project reminders, daily reflections, and inspirations with full cloud persistence.
          </p>
        </div>

        {/* Primary Action Button: Add Notepad / Add Note */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => {
              setEditingNote(null);
              setIsFormOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-[#DF886F] hover:bg-[#d4785e] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* ================= SEARCH & CATEGORY FILTERS ================= */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title, content, or #tags..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F4] border border-[#EAE2D9] text-xs sm:text-sm font-medium focus:bg-white focus:border-[#DF886F] focus:ring-3 focus:ring-[#DF886F]/15 outline-none transition-all placeholder:text-neutral-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-semibold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-neutral-400 font-medium shrink-0">Filter:</span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === 'ALL'
                ? notes.length
                : notes.filter((n) => n.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white border border-neutral-200/80 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= NOTES LISTING ================= */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-3 border-[#DF886F] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-neutral-400">Loading your notes from MongoDB Atlas...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-dashed border-[#EFE5DC] p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF0EB] text-[#DF886F] flex items-center justify-center">
            <NotebookPen size={26} />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-neutral-900">
              {searchQuery ? 'No notes match your search' : 'No notes created yet'}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm">
              {searchQuery
                ? 'Try searching with a different keyword or clear your filter.'
                : 'Click "Add Note" to create your very first note or code snippet!'}
            </p>
          </div>
          <button
            onClick={() => {
              if (searchQuery) setSearchQuery('');
              else {
                setEditingNote(null);
                setIsFormOpen(true);
              }
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#DF886F] text-white hover:bg-[#d4785e] transition-colors cursor-pointer"
          >
            {searchQuery ? 'Clear Search' : 'Add Note Now'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Pin size={14} className="text-[#DF886F] fill-current" />
                <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
                  Pinned Notes ({pinnedNotes.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={(n) => {
                      setEditingNote(n);
                      setIsFormOpen(true);
                    }}
                    onDelete={(n) => setDeletingNote(n)}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 2. Other Notes Section */}
          {otherNotes.length > 0 && (
            <div className="space-y-3">
              {pinnedNotes.length > 0 && (
                <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
                  Other Notes ({otherNotes.length})
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={(n) => {
                      setEditingNote(n);
                      setIsFormOpen(true);
                    }}
                    onDelete={(n) => setDeletingNote(n)}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODALS ================= */}
      <NoteFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingNote(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialNote={editingNote}
      />

      <DeleteNoteModal
        isOpen={deletingNote !== null}
        onClose={() => setDeletingNote(null)}
        onConfirm={handleDeleteConfirm}
        note={deletingNote}
      />
    </div>
  );
};
