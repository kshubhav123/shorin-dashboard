import React, { useState, useEffect, useMemo } from 'react';
import type { SongItem, MusicTab } from '../../types';
import { useMusic } from '../../context/MusicContext';
import {
  searchSongs,
  getTrendingSongs,
} from '../../services/saavnMusicService';
import { CreatePlaylistModal } from '../music/CreatePlaylistModal';
import { AddToPlaylistModal } from '../music/AddToPlaylistModal';
import {
  Search,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Music,
  Headphones,
  Database,
  Radio,
  Clock,
  Trash2,
  ListPlus,
  Plus,
  FolderPlus,
  Bookmark,
  Sparkles,
} from 'lucide-react';

export const MusicView: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    playSong,
    togglePlayPause,
    nextSong,
    prevSong,
    seekTo,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat,
    savedPlaylist,
    playlists,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    isSaved,
    getSongPlaylists,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<MusicTab>('Discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SongItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trendingSongs, setTrendingSongs] = useState<SongItem[]>([]);
  const [activePlaylistFilter, setActivePlaylistFilter] = useState('ALL');

  // Modals state
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [songForPlaylistModal, setSongForPlaylistModal] = useState<SongItem | null>(null);

  // Quick search keywords
  const popularKeywords = [
    'Arijit Singh',
    'The Weeknd',
    'Lofi Beats',
    'Diljit Dosanjh',
    'Pritam',
    'Sidhu Moosewala',
    'Bollywood Chill',
  ];

  // Load trending songs on mount
  useEffect(() => {
    let isMounted = true;
    getTrendingSongs().then((songs) => {
      if (isMounted) {
        setTrendingSongs(songs);
        setSearchResults(songs);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Search
  const handleExecuteSearch = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) {
      setSearchResults(trendingSongs);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchSongs(queryToSearch);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(searchQuery);
  };

  // Format seconds to "03:45"
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Filtered saved playlist based on category
  const filteredSavedSongs = useMemo(() => {
    if (activePlaylistFilter === 'ALL') return savedPlaylist;
    return savedPlaylist.filter((s) => {
      const lists = s.playlists && s.playlists.length > 0 ? s.playlists : [s.playlist || 'Favorites'];
      return lists.includes(activePlaylistFilter);
    });
  }, [savedPlaylist, activePlaylistFilter]);

  // Current active playlist object (if not ALL)
  const activePlaylistObj = useMemo(() => {
    if (activePlaylistFilter === 'ALL') return null;
    return playlists.find((p) => p.name === activePlaylistFilter) || null;
  }, [playlists, activePlaylistFilter]);

  // Calculate song count for each playlist
  const getPlaylistSongCount = (playlistName: string) => {
    return savedPlaylist.filter((s) => {
      const lists = s.playlists && s.playlists.length > 0 ? s.playlists : [s.playlist || 'Favorites'];
      return lists.includes(playlistName);
    }).length;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-6 pb-20 animate-fadeIn select-none">
      {/* ================= HERO HEADER ================= */}
      <div className="bg-[#FAF5F0] rounded-[28px] p-6 sm:p-7 border border-[#EFE7DE] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#DF886F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8DDD4] text-neutral-800 flex items-center gap-1.5">
              <Headphones size={13} className="text-[#DF886F]" />
              <span>Music Hub</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
              <Radio size={11} className="text-emerald-600" />
              <span>JioSaavn 320kbps Stream</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#14B8A6]/10 text-[#0D9488] border border-[#14B8A6]/20">
              <Database size={11} className="text-[#14B8A6]" />
              <span>MongoDB Atlas Synced</span>
            </span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            Background Music & Playlists
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Search millions of songs, stream high-fidelity audio, and create custom playlists with zero local storage footprint.
          </p>
        </div>

        {/* Action Button: Create Playlist & Current Status Pill */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#DF886F] hover:bg-[#d4785e] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <FolderPlus size={16} />
            <span>Create Playlist</span>
          </button>

          {currentSong && (
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-[#EFE7DE] shadow-xs">
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="w-10 h-10 rounded-xl object-cover shadow-2xs"
              />
              <div className="max-w-[120px] sm:max-w-[150px]">
                <p className="text-xs font-bold text-neutral-900 truncate">{currentSong.title}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isPlaying ? 'Playing Now' : 'Paused'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div className="flex items-center justify-between border-b border-[#EAE2D9] pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('Discover')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'Discover'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-[#FAF7F4]'
            }`}
          >
            <Sparkles size={14} />
            <span>Discover & Search</span>
          </button>

          <button
            onClick={() => setActiveTab('My Playlists')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'My Playlists'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-[#FAF7F4]'
            }`}
          >
            <Bookmark size={14} />
            <span>My Playlists</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#DF886F] text-white font-bold ml-1">
              {savedPlaylist.length}
            </span>
          </button>
        </div>

        {activeTab === 'My Playlists' && (
          <button
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-[#DF886F] text-[#DF886F] hover:bg-[#FAF0EB] text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>New Playlist</span>
          </button>
        )}
      </div>

      {/* ================= TAB 1: DISCOVER & SEARCH ================= */}
      {activeTab === 'Discover' && (
        <div className="space-y-5">
          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any song, artist, album (e.g. Arijit Singh, Starboy, Lofi, Diljit)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F4] border border-[#EAE2D9] text-xs sm:text-sm font-medium focus:bg-white focus:border-[#DF886F] focus:ring-3 focus:ring-[#DF886F]/15 outline-none transition-all placeholder:text-neutral-400 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults(trendingSongs);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-3 rounded-2xl bg-neutral-900 text-white font-bold text-xs sm:text-sm hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Quick Genre & Artist Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-neutral-400 font-medium shrink-0">Popular:</span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setSearchQuery(kw);
                  handleExecuteSearch(kw);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF0EB] hover:bg-[#F3E3DA] text-[#DF886F] font-semibold shrink-0 transition-colors cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-neutral-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending & Top Hits'}
              </h3>
              <span className="text-xs text-neutral-400">{searchResults.length} tracks</span>
            </div>

            {isSearching ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 border-3 border-[#DF886F] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs text-neutral-400">Fetching high quality audio from JioSaavn...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {searchResults.map((song) => {
                  const isCurrent = currentSong?.id === song.id;
                  const alreadySaved = isSaved(song.id);
                  const songPlaylists = getSongPlaylists(song.id);

                  return (
                    <div
                      key={song.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 group/song ${
                        isCurrent
                          ? 'bg-[#FAF0EB] border-[#DF886F] shadow-sm'
                          : 'bg-white border-neutral-200/80 hover:border-neutral-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Left: Album cover with play overlay */}
                      <div
                        onClick={() => playSong(song, searchResults)}
                        className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 cursor-pointer group/art"
                      >
                        <img
                          src={song.image}
                          alt={song.title}
                          className="w-full h-full object-cover group-hover/art:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div
                          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                            isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover/art:opacity-100'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-full bg-[#DF886F] text-white flex items-center justify-center shadow-md">
                            {isCurrent && isPlaying ? (
                              <Pause size={12} className="fill-current" />
                            ) : (
                              <Play size={12} className="fill-current ml-0.5" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Title & Artist & Playlists Chips */}
                      <div
                        onClick={() => playSong(song, searchResults)}
                        className="min-w-0 flex-1 cursor-pointer"
                      >
                        <h4
                          className={`font-display font-bold text-xs sm:text-sm truncate leading-tight ${
                            isCurrent ? 'text-[#DF886F]' : 'text-neutral-900 group-hover/song:text-[#DF886F]'
                          }`}
                        >
                          {song.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">{song.artist}</p>
                        
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1 font-medium">
                            <Clock size={10} />
                            <span>{formatTime(song.duration)}</span>
                          </span>
                          <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
                            320kbps
                          </span>
                          {songPlaylists.length > 0 && (
                            <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-[#FAF0EB] text-[#DF886F] font-bold truncate max-w-[100px]">
                              {songPlaylists[0]}
                              {songPlaylists.length > 1 ? ` +${songPlaylists.length - 1}` : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions (Add to Playlist & Favorite Heart) */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Add to Playlist button */}
                        <button
                          type="button"
                          onClick={() => setSongForPlaylistModal(song)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                            songPlaylists.length > 0
                              ? 'text-[#DF886F] bg-[#FAF0EB] hover:bg-[#F3E3DA]'
                              : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100'
                          }`}
                          title="Add to Playlist"
                        >
                          <ListPlus size={16} />
                        </button>

                        {/* Quick Save to Favorites Heart */}
                        <button
                          type="button"
                          onClick={() => {
                            if (alreadySaved) {
                              removeFromPlaylist(song.id);
                            } else {
                              addToPlaylist(song, 'Favorites');
                            }
                          }}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                            alreadySaved
                              ? 'text-rose-500 bg-rose-50'
                              : 'text-neutral-400 hover:text-rose-500 hover:bg-neutral-100'
                          }`}
                          title={alreadySaved ? 'In Favorites (Click to remove)' : 'Quick Save to Favorites'}
                        >
                          <Heart size={15} className={alreadySaved ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-neutral-200">
                <Music size={28} className="mx-auto text-neutral-400 mb-2" />
                <p className="text-sm font-bold text-neutral-800">No songs found</p>
                <p className="text-xs text-neutral-400 mt-0.5">Try searching for a different song name or artist.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MY SAVED PLAYLISTS (MONGODB) ================= */}
      {activeTab === 'My Playlists' && (
        <div className="space-y-5">
          {/* Playlist Filter Chips with Add Button */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 text-xs">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-neutral-400 font-medium shrink-0">Filter:</span>
              
              {/* "ALL" Pill */}
              <button
                onClick={() => setActivePlaylistFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activePlaylistFilter === 'ALL'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <span>ALL</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {savedPlaylist.length}
                </span>
              </button>

              {/* Dynamic Playlist Chips from MongoDB */}
              {playlists.map((pl) => {
                const count = getPlaylistSongCount(pl.name);
                const isActive = activePlaylistFilter === pl.name;

                return (
                  <button
                    key={pl.id}
                    onClick={() => setActivePlaylistFilter(pl.name)}
                    className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-neutral-900 text-white shadow-xs ring-2 ring-neutral-900/10'
                        : 'bg-white border border-neutral-200/80 text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: pl.color || '#DF886F' }}
                    />
                    <span>{pl.name}</span>
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

            {/* Quick Create Playlist Trigger */}
            <button
              onClick={() => setIsCreatePlaylistOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#FAF0EB] text-[#DF886F] hover:bg-[#F3E3DA] font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>New Playlist</span>
            </button>
          </div>

          {/* Active Playlist Detail Card (When a specific playlist is selected) */}
          {activePlaylistObj && (
            <div
              className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#FAF5F0] to-white"
              style={{ borderColor: `${activePlaylistObj.color || '#DF886F'}40` }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0"
                  style={{ backgroundColor: activePlaylistObj.color || '#DF886F' }}
                >
                  <FolderPlus size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900">
                      {activePlaylistObj.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-neutral-500 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                      {filteredSavedSongs.length} tracks
                    </span>
                  </div>
                  {activePlaylistObj.description && (
                    <p className="text-xs text-neutral-500 mt-0.5 max-w-lg">
                      {activePlaylistObj.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Playlist Controls: Play All & Delete Custom Playlist */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {filteredSavedSongs.length > 0 && (
                  <button
                    onClick={() => playSong(filteredSavedSongs[0], filteredSavedSongs)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    style={{ backgroundColor: activePlaylistObj.color || '#DF886F' }}
                  >
                    <Play size={13} className="fill-current" />
                    <span>Play All</span>
                  </button>
                )}

                {/* Only custom playlists can be deleted */}
                {!['Favorites', 'Coding Focus', 'Chill Vibe'].includes(activePlaylistObj.name) && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete playlist "${activePlaylistObj.name}"? (Songs will remain in other playlists)`)) {
                        deletePlaylist(activePlaylistObj.id, activePlaylistObj.name);
                        setActivePlaylistFilter('ALL');
                      }
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Delete this playlist"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Saved Songs List */}
          {filteredSavedSongs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSavedSongs.map((song) => {
                const isCurrent = currentSong?.id === song.id;
                const songPlaylists = getSongPlaylists(song.id);

                return (
                  <div
                    key={song.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 group/saved ${
                      isCurrent
                        ? 'bg-[#FAF0EB] border-[#DF886F] shadow-sm'
                        : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                    }`}
                  >
                    {/* Album Art */}
                    <div
                      onClick={() => playSong(song, filteredSavedSongs)}
                      className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 cursor-pointer group/art"
                    >
                      <img
                        src={song.image}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover/art:scale-105 transition-transform"
                      />
                      <div
                        className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                          isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover/art:opacity-100'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-[#DF886F] text-white flex items-center justify-center shadow-md">
                          {isCurrent && isPlaying ? (
                            <Pause size={12} className="fill-current" />
                          ) : (
                            <Play size={12} className="fill-current ml-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div
                      onClick={() => playSong(song, filteredSavedSongs)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <h4
                        className={`font-display font-bold text-xs sm:text-sm truncate leading-tight ${
                          isCurrent ? 'text-[#DF886F]' : 'text-neutral-900 group-hover/saved:text-[#DF886F]'
                        }`}
                      >
                        {song.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">{song.artist}</p>
                      
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[10px] text-neutral-400 flex items-center gap-1 font-medium">
                          <Clock size={10} />
                          <span>{formatTime(song.duration)}</span>
                        </span>
                        
                        {/* Playlists tags chips */}
                        {songPlaylists.map((pName) => (
                          <span
                            key={pName}
                            className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#FAF0EB] text-[#DF886F] font-bold"
                          >
                            {pName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions: Add to Playlist & Remove */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSongForPlaylistModal(song)}
                        className="w-8 h-8 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
                        title="Manage Playlists"
                      >
                        <ListPlus size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (activePlaylistFilter === 'ALL') {
                            removeFromPlaylist(song.id);
                          } else {
                            removeFromPlaylist(song.id, activePlaylistFilter);
                          }
                        }}
                        className="w-8 h-8 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                        title={activePlaylistFilter === 'ALL' ? 'Delete song completely' : `Remove from ${activePlaylistFilter}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[28px] border border-dashed border-[#EFE5DC] p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF0EB] text-[#DF886F] flex items-center justify-center">
                <Bookmark size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-neutral-900">
                  {activePlaylistFilter === 'ALL'
                    ? 'Your Playlist is Empty'
                    : `No songs in "${activePlaylistFilter}" yet`}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                  Search any song in Discover and click the &quot;Add to Playlist&quot; icon to add tracks here!
                </p>
              </div>
              <button
                onClick={() => setActiveTab('Discover')}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#DF886F] text-white hover:bg-[#d4785e] transition-colors cursor-pointer"
              >
                Go to Discover
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= BOTTOM PERSISTENT PLAYER DECK ================= */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#12151E]/95 backdrop-blur-xl border-t border-white/10 px-4 sm:px-8 py-3 text-white shadow-2xl">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
            {/* Song Preview */}
            <div className="flex items-center gap-3 w-full sm:w-1/4 min-w-0">
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-md"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-display font-bold text-xs sm:text-sm text-white truncate">
                  {currentSong.title}
                </h4>
                <p className="text-[11px] text-neutral-400 truncate">{currentSong.artist}</p>
              </div>

              {/* Add to Playlist button */}
              <button
                type="button"
                onClick={() => setSongForPlaylistModal(currentSong)}
                className="w-8 h-8 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                title="Add to Playlist"
              >
                <ListPlus size={16} />
              </button>

              {/* Quick Favorite Heart button */}
              <button
                type="button"
                onClick={() => {
                  if (isSaved(currentSong.id)) {
                    removeFromPlaylist(currentSong.id);
                  } else {
                    addToPlaylist(currentSong, 'Favorites');
                  }
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  isSaved(currentSong.id)
                    ? 'text-rose-500 bg-rose-500/10'
                    : 'text-neutral-400 hover:text-rose-500 hover:bg-white/10'
                }`}
                title={isSaved(currentSong.id) ? 'Saved' : 'Save'}
              >
                <Heart size={16} className={isSaved(currentSong.id) ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Playback Controls & Timeline Scrubber */}
            <div className="w-full sm:w-2/4 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleShuffle}
                  className={`transition-colors cursor-pointer ${
                    isShuffle ? 'text-[#DF886F]' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Shuffle"
                >
                  <Shuffle size={14} />
                </button>
                <button
                  onClick={prevSong}
                  className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Previous"
                >
                  <SkipBack size={17} />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-9 h-9 rounded-full bg-[#DF886F] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause size={15} className="fill-current" />
                  ) : (
                    <Play size={15} className="fill-current ml-0.5" />
                  )}
                </button>
                <button
                  onClick={nextSong}
                  className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Next"
                >
                  <SkipForward size={17} />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`transition-colors cursor-pointer ${
                    isRepeat ? 'text-[#DF886F]' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Repeat Track"
                >
                  <Repeat size={14} />
                </button>
              </div>

              {/* Progress Slider */}
              <div className="w-full flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = clickX / rect.width;
                    seekTo(percent * duration);
                  }}
                  className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative group/timeline overflow-hidden"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#DF886F] to-[#14B8A6] rounded-full relative"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center justify-end gap-2.5 w-1/4">
              <button
                onClick={toggleMute}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#DF886F]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreate={async (name, description, color) => {
          await createPlaylist(name, description, color);
          setActivePlaylistFilter(name);
          setActiveTab('My Playlists');
        }}
      />

      <AddToPlaylistModal
        isOpen={songForPlaylistModal !== null}
        onClose={() => setSongForPlaylistModal(null)}
        song={songForPlaylistModal}
      />
    </div>
  );
};
