import React, { useState } from 'react';
import type { SongItem } from '../../types';
import { useMusic } from '../../context/MusicContext';
import {
  X,
  ListPlus,
  Check,
  Plus,
  FolderPlus,
} from 'lucide-react';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: SongItem | null;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  song,
}) => {
  const {
    playlists,
    createPlaylist,
    setSongPlaylists,
    getSongPlaylists,
  } = useMusic();

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingInline, setIsCreatingInline] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !song) return null;

  const currentPlaylists = getSongPlaylists(song.id);

  const handleTogglePlaylist = async (playlistName: string) => {
    setIsUpdating(true);
    try {
      let updated: string[];
      if (currentPlaylists.includes(playlistName)) {
        updated = currentPlaylists.filter((p) => p !== playlistName);
      } else {
        updated = [...currentPlaylists, playlistName];
      }
      await setSongPlaylists(song, updated);
    } catch (err) {
      console.error('Failed to toggle playlist:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setIsCreatingInline(true);
    try {
      const created = await createPlaylist(newPlaylistName.trim());
      const updated = Array.from(new Set([...currentPlaylists, created.name]));
      await setSongPlaylists(song, updated);
      setNewPlaylistName('');
    } catch (err) {
      console.error('Failed to create and add playlist:', err);
    } finally {
      setIsCreatingInline(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-[#EFE7DE] shadow-2xl p-6 sm:p-7 relative animate-scaleUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF0EB] text-[#DF886F] flex items-center justify-center shadow-xs">
              <ListPlus size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 tracking-tight leading-tight">
                Add to Playlist
              </h3>
              <p className="text-xs text-neutral-400">
                Select one or more playlists to store this track
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

        {/* Selected Song Preview Banner */}
        <div className="p-3 rounded-2xl bg-[#FAF7F4] border border-[#EFE7DE] flex items-center gap-3 mb-5">
          <img
            src={song.image}
            alt={song.title}
            className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-xs sm:text-sm text-neutral-900 truncate">
              {song.title}
            </h4>
            <p className="text-[11px] text-neutral-400 truncate mt-0.5">{song.artist}</p>
          </div>
        </div>

        {/* Playlists List */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 mb-5">
          <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Your Playlists ({playlists.length})
          </label>
          {playlists.map((pl) => {
            const isChecked = currentPlaylists.includes(pl.name);
            return (
              <div
                key={pl.id}
                onClick={() => !isUpdating && handleTogglePlaylist(pl.name)}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-[#FAF0EB] border-[#DF886F] shadow-xs'
                    : 'bg-white border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: pl.color || '#DF886F' }}
                  />
                  <span className="font-display font-bold text-xs sm:text-sm text-neutral-900 truncate">
                    {pl.name}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#DF886F] text-white'
                      : 'border border-neutral-300 text-transparent'
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Add New Playlist Form */}
        <form onSubmit={handleCreateAndAdd} className="pt-3 border-t border-neutral-100 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Create new playlist..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#DF886F] focus:ring-2 focus:ring-[#DF886F]/20 outline-none transition-all placeholder:text-neutral-400"
            />
            <FolderPlus size={14} className="absolute left-2.5 top-2.5 text-neutral-400" />
          </div>
          <button
            type="submit"
            disabled={isCreatingInline || !newPlaylistName.trim()}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {isCreatingInline ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={13} />
                <span>Add</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Done Button */}
        <div className="mt-4 pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#DF886F] text-white hover:bg-[#d4785e] shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
