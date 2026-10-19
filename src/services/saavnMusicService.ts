import type { SongItem, PlaylistItem } from '../types';

const API_SEARCH = '/api/music/search';
const API_TRENDING = '/api/music/trending';
const API_PLAYLIST = '/api/music/playlist';
const API_PLAYLISTS = '/api/music/playlists';

const PLAYLIST_STORAGE_KEY = 'crowz_portfolio_saved_playlist';
const PLAYLISTS_META_KEY = 'crowz_portfolio_playlists_meta';

// Default starter playlists
export const DEFAULT_PLAYLISTS: PlaylistItem[] = [
  {
    id: 'pl-favorites',
    name: 'Favorites',
    description: 'My all-time favorite tracks & replay anthems',
    color: '#EF4444',
    icon: 'heart',
    createdAt: 1737000000000,
  },
  {
    id: 'pl-coding-focus',
    name: 'Coding Focus',
    description: 'High energy beats & deep focus soundscapes',
    color: '#14B8A6',
    icon: 'code',
    createdAt: 1737001000000,
  },
  {
    id: 'pl-chill-vibe',
    name: 'Chill Vibe',
    description: 'Relaxing lo-fi and ambient melodies to unwind',
    color: '#8B5CF6',
    icon: 'coffee',
    createdAt: 1737002000000,
  },
];

// Starter default songs if offline or initial load
export const STARTER_POPULAR_SONGS: SongItem[] = [
  {
    id: 'starter-1',
    title: 'Kesariya',
    artist: 'Pritam, Arijit Singh',
    album: 'Brahmastra',
    image: 'https://c.saavncdn.com/423/Arijit-Singh-All-Time-Best-Hindi-Hit-Love-Songs-Collection-Hindi-2026-20261008160834-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/423/852ad6cc81d7733c5e9bfc46d7b063e2_320.mp4',
    duration: 268,
    playlist: 'Favorites',
    playlists: ['Favorites'],
  },
  {
    id: 'starter-2',
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    album: 'Starboy',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80',
    streamUrl: 'https://aac.saavncdn.com/393/9c2409095da1f165e381014138e6e5fe_320.mp4',
    duration: 230,
    playlist: 'Coding Focus',
    playlists: ['Coding Focus'],
  },
  {
    id: 'starter-3',
    title: 'Lofi Chill Beats & Coding Rain',
    artist: 'Lofi Records',
    album: 'Midnight Code',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=500&q=80',
    streamUrl: 'https://aac.saavncdn.com/264/88c69ee03a6bcbf0e85f099cbe7cf823_320.mp4',
    duration: 180,
    playlist: 'Chill Vibe',
    playlists: ['Chill Vibe'],
  },
];

/**
 * Search JioSaavn songs via backend proxy
 */
export async function searchSongs(query: string): Promise<SongItem[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const res = await fetch(`${API_SEARCH}?q=${encodeURIComponent(trimmed)}`);
    if (!res.ok) throw new Error(`Search error ${res.status}`);
    const data = await res.json();
    return data.songs || [];
  } catch (err) {
    console.warn('Direct search API failed, falling back:', err);
    return STARTER_POPULAR_SONGS.filter(
      (s) =>
        s.title.toLowerCase().includes(trimmed.toLowerCase()) ||
        s.artist.toLowerCase().includes(trimmed.toLowerCase())
    );
  }
}

/**
 * Fetch top trending / curated hits
 */
export async function getTrendingSongs(): Promise<SongItem[]> {
  try {
    const res = await fetch(API_TRENDING);
    if (!res.ok) throw new Error(`Trending error ${res.status}`);
    const data = await res.json();
    if (data.songs && data.songs.length > 0) {
      return data.songs;
    }
    return STARTER_POPULAR_SONGS;
  } catch (err) {
    console.warn('Trending fetch failed, using starter hits:', err);
    return STARTER_POPULAR_SONGS;
  }
}

/**
 * Get all playlists from MongoDB Atlas / local cache
 */
export async function getPlaylists(): Promise<PlaylistItem[]> {
  try {
    const res = await fetch(API_PLAYLISTS);
    if (res.ok) {
      const data: PlaylistItem[] = await res.json();
      if (Array.isArray(data)) {
        saveLocalPlaylists(data);
        return data;
      }
    }
  } catch (err) {
    console.info('API playlists offline, loading local playlists:', err);
  }
  return getLocalPlaylists();
}

/**
 * Create a new playlist
 */
export async function createPlaylist(payload: {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}): Promise<PlaylistItem> {
  const item: PlaylistItem = {
    id: `pl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: payload.name.trim(),
    description: (payload.description || '').trim(),
    color: payload.color || '#DF886F',
    icon: payload.icon || 'music',
    createdAt: Date.now(),
  };

  try {
    const res = await fetch(API_PLAYLISTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      const saved: PlaylistItem = await res.json();
      const current = getLocalPlaylists();
      saveLocalPlaylists([...current.filter((p) => p.id !== saved.id), saved]);
      return saved;
    }
  } catch (err) {
    console.warn('API create playlist failed, saving locally:', err);
  }

  const current = getLocalPlaylists();
  saveLocalPlaylists([...current, item]);
  return item;
}

/**
 * Delete a playlist
 */
export async function deletePlaylist(id: string, playlistName?: string): Promise<boolean> {
  try {
    await fetch(`${API_PLAYLISTS}/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('API delete playlist failed, removing locally:', err);
  }

  const current = getLocalPlaylists();
  saveLocalPlaylists(current.filter((p) => p.id !== id));

  // Also remove that playlist tag from local saved songs
  if (playlistName) {
    const songs = getLocalPlaylist();
    const updated = songs
      .map((s) => {
        const pList = (s.playlists || [s.playlist || 'Favorites']).filter((p) => p !== playlistName);
        if (pList.length === 0) return null;
        return { ...s, playlist: pList[0], playlists: pList };
      })
      .filter(Boolean) as SongItem[];
    saveLocalPlaylist(updated);
  }

  return true;
}

/**
 * Get Saved Playlist Songs from MongoDB Atlas, falling back to LocalStorage
 */
export async function getSavedPlaylist(): Promise<SongItem[]> {
  try {
    const res = await fetch(API_PLAYLIST);
    if (res.ok) {
      const songs: SongItem[] = await res.json();
      if (Array.isArray(songs)) {
        // Ensure playlists array is initialized
        const normalized = songs.map((s) => ({
          ...s,
          playlists: Array.isArray(s.playlists) && s.playlists.length > 0 ? s.playlists : [s.playlist || 'Favorites'],
        }));
        saveLocalPlaylist(normalized);
        return normalized;
      }
    }
  } catch (err) {
    console.info('API playlist offline, loading local cached playlist:', err);
  }
  return getLocalPlaylist();
}

/**
 * Save Song to MongoDB Atlas & Local Cache (adds to specified playlist)
 */
export async function saveSongToPlaylist(
  song: SongItem,
  playlist = 'Favorites'
): Promise<SongItem> {
  const current = getLocalPlaylist();
  const existing = current.find((s) => s.id === song.id);

  const existingPlaylists = existing?.playlists && existing.playlists.length > 0
    ? existing.playlists
    : existing?.playlist
    ? [existing.playlist]
    : [];

  const targetPlaylists = Array.from(new Set([...existingPlaylists, playlist]));

  const item: SongItem = {
    ...song,
    playlist: targetPlaylists[0] || playlist,
    playlists: targetPlaylists,
    savedAt: Date.now(),
  };

  try {
    const res = await fetch(API_PLAYLIST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      const saved: SongItem = await res.json();
      const normalized: SongItem = {
        ...saved,
        playlists: Array.isArray(saved.playlists) && saved.playlists.length > 0
          ? saved.playlists
          : targetPlaylists,
      };
      saveLocalPlaylist([normalized, ...current.filter((s) => s.id !== normalized.id)]);
      return normalized;
    }
  } catch (err) {
    console.warn('API save song failed, saving locally:', err);
  }

  const updated = [item, ...current.filter((s) => s.id !== item.id)];
  saveLocalPlaylist(updated);
  return item;
}

/**
 * Update the exact list of playlists for a song
 */
export async function updateSongPlaylists(
  songId: string,
  playlists: string[]
): Promise<SongItem | null> {
  const current = getLocalPlaylist();
  const song = current.find((s) => s.id === songId);
  if (!song) return null;

  const updatedItem: SongItem = {
    ...song,
    playlist: playlists[0] || 'Favorites',
    playlists,
  };

  try {
    const res = await fetch(`${API_PLAYLIST}/${songId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlists }),
    });
    if (res.ok) {
      const saved: SongItem = await res.json();
      saveLocalPlaylist([saved, ...current.filter((s) => s.id !== saved.id)]);
      return saved;
    }
  } catch (err) {
    console.warn('API update playlists failed, updating locally:', err);
  }

  if (playlists.length === 0) {
    saveLocalPlaylist(current.filter((s) => s.id !== songId));
    return null;
  }

  saveLocalPlaylist([updatedItem, ...current.filter((s) => s.id !== songId)]);
  return updatedItem;
}

/**
 * Remove Song from a specific playlist (or completely if no playlist specified)
 */
export async function removeSongFromPlaylist(
  songId: string,
  fromPlaylist?: string
): Promise<boolean> {
  try {
    const url = fromPlaylist
      ? `${API_PLAYLIST}/${songId}?playlist=${encodeURIComponent(fromPlaylist)}`
      : `${API_PLAYLIST}/${songId}`;
    await fetch(url, { method: 'DELETE' });
  } catch (err) {
    console.warn('API remove song failed, removing locally:', err);
  }

  const current = getLocalPlaylist();
  if (fromPlaylist) {
    const updated = current
      .map((s) => {
        if (s.id !== songId) return s;
        const currentList = s.playlists && s.playlists.length > 0 ? s.playlists : [s.playlist || 'Favorites'];
        const remaining = currentList.filter((p) => p !== fromPlaylist);
        if (remaining.length === 0) return null;
        return { ...s, playlist: remaining[0], playlists: remaining };
      })
      .filter(Boolean) as SongItem[];
    saveLocalPlaylist(updated);
  } else {
    saveLocalPlaylist(current.filter((s) => s.id !== songId));
  }
  return true;
}

// Local cache helpers
function getLocalPlaylist(): SongItem[] {
  try {
    const raw = localStorage.getItem(PLAYLIST_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return STARTER_POPULAR_SONGS;
}

function saveLocalPlaylist(songs: SongItem[]) {
  try {
    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(songs));
  } catch {}
}

function getLocalPlaylists(): PlaylistItem[] {
  try {
    const raw = localStorage.getItem(PLAYLISTS_META_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return DEFAULT_PLAYLISTS;
}

function saveLocalPlaylists(playlists: PlaylistItem[]) {
  try {
    localStorage.setItem(PLAYLISTS_META_KEY, JSON.stringify(playlists));
  } catch {}
}
