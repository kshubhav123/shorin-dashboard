import type { NoteItem } from '../types';

const API_NOTES = '/api/notes';
const STORAGE_KEY = 'crowz_portfolio_notes';

export const STARTER_NOTES: NoteItem[] = [
  {
    id: 'note-welcome-1',
    title: 'Welcome to Crowz Notepad 🚀',
    content: 'Jot down quick thoughts, code snippets, bug fixes, project reminders, and daily inspirations. Notes automatically sync to MongoDB Atlas with local offline support!',
    category: 'General',
    tags: ['welcome', 'quickstart'],
    color: '#FEF08A', // soft yellow
    isPinned: true,
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'note-code-2',
    title: 'Useful Dev Commands & Git Tips',
    content: 'git stash save "wip"\ngit checkout -b feature/cool-feature\ndocker compose up -d --build\nnpx kill-port 5000 5173\ngit log --oneline -n 10',
    category: 'Code',
    tags: ['git', 'docker', 'devops'],
    color: '#BAE6FD', // sky blue
    isPinned: true,
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'note-ideas-3',
    title: 'Dashboard Expansion Ideas',
    content: '1. Voice-command notes recorder\n2. Spotify playlist OAuth integration\n3. Export notes as PDF / Markdown\n4. Cloud sync status widget',
    category: 'Ideas',
    tags: ['roadmap', 'features'],
    color: '#BBF7D0', // mint green
    isPinned: false,
    createdAt: Date.now() - 3600000 * 6,
    updatedAt: Date.now() - 3600000 * 6,
  },
];

/**
 * Get all notes from MongoDB Atlas, falling back to LocalStorage
 */
export async function getStoredNotes(): Promise<NoteItem[]> {
  try {
    const res = await fetch(API_NOTES);
    if (res.ok) {
      const data: NoteItem[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveLocalNotes(data);
        return data;
      }
    }
  } catch (err) {
    console.info('API notes offline, loading local cached notes:', err);
  }
  return getLocalNotes();
}

/**
 * Add note to MongoDB Atlas and LocalStorage
 */
export async function addNoteToStorage(
  payload: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<NoteItem> {
  const now = Date.now();
  const newNote: NoteItem = {
    ...payload,
    id: `note-${now}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const res = await fetch(API_NOTES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    });

    if (res.ok) {
      const saved: NoteItem = await res.json();
      const current = getLocalNotes();
      saveLocalNotes([saved, ...current.filter((n) => n.id !== saved.id)]);
      return saved;
    }
  } catch (err) {
    console.warn('API add note failed, saving locally:', err);
  }

  const current = getLocalNotes();
  const updated = [newNote, ...current.filter((n) => n.id !== newNote.id)];
  saveLocalNotes(updated);
  return newNote;
}

/**
 * Update note in MongoDB Atlas and LocalStorage
 */
export async function updateNoteInStorage(
  id: string,
  updates: Partial<NoteItem>
): Promise<NoteItem> {
  const now = Date.now();

  try {
    const res = await fetch(`${API_NOTES}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, updatedAt: now }),
    });

    if (res.ok) {
      const updated: NoteItem = await res.json();
      const current = getLocalNotes();
      saveLocalNotes(current.map((n) => (n.id === id ? updated : n)));
      return updated;
    }
  } catch (err) {
    console.warn('API update note failed, updating locally:', err);
  }

  const current = getLocalNotes();
  const existing = current.find((n) => n.id === id);
  const updatedNote: NoteItem = {
    ...(existing || (updates as NoteItem)),
    ...updates,
    updatedAt: now,
  };

  saveLocalNotes(current.map((n) => (n.id === id ? updatedNote : n)));
  return updatedNote;
}

/**
 * Toggle Pin status
 */
export async function toggleNotePinInStorage(id: string): Promise<NoteItem> {
  try {
    const res = await fetch(`${API_NOTES}/${id}/pin`, { method: 'PATCH' });
    if (res.ok) {
      const updated: NoteItem = await res.json();
      const current = getLocalNotes();
      saveLocalNotes(current.map((n) => (n.id === id ? updated : n)));
      return updated;
    }
  } catch (err) {
    console.warn('API toggle pin failed, toggling locally:', err);
  }

  const current = getLocalNotes();
  const note = current.find((n) => n.id === id);
  const updatedNote: NoteItem = note
    ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() }
    : ({} as NoteItem);

  saveLocalNotes(current.map((n) => (n.id === id ? updatedNote : n)));
  return updatedNote;
}

/**
 * Delete note from MongoDB Atlas and LocalStorage
 */
export async function deleteNoteFromStorage(id: string): Promise<boolean> {
  try {
    await fetch(`${API_NOTES}/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('API delete note failed, deleting locally:', err);
  }

  const current = getLocalNotes();
  saveLocalNotes(current.filter((n) => n.id !== id));
  return true;
}

// Local cache helpers
function getLocalNotes(): NoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return STARTER_NOTES;
}

function saveLocalNotes(notes: NoteItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {}
}
