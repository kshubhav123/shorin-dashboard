import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type { SongItem, PlaylistItem } from '../types';
import {
  getSavedPlaylist,
  saveSongToPlaylist,
  removeSongFromPlaylist,
  getPlaylists,
  createPlaylist as apiCreatePlaylist,
  deletePlaylist as apiDeletePlaylist,
  updateSongPlaylists as apiUpdateSongPlaylists,
  DEFAULT_PLAYLISTS,
  STARTER_POPULAR_SONGS,
} from '../services/saavnMusicService';

interface MusicContextType {
  currentSong: SongItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  queue: SongItem[];
  savedPlaylist: SongItem[];
  playlists: PlaylistItem[];
  playSong: (song: SongItem, queueList?: SongItem[]) => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seekTo: (time: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  createPlaylist: (name: string, description?: string, color?: string) => Promise<PlaylistItem>;
  deletePlaylist: (id: string, name: string) => Promise<void>;
  addToPlaylist: (song: SongItem, playlistName?: string) => Promise<void>;
  setSongPlaylists: (song: SongItem, targetPlaylists: string[]) => Promise<void>;
  removeFromPlaylist: (songId: string, fromPlaylist?: string) => Promise<void>;
  isSaved: (songId: string, inPlaylist?: string) => boolean;
  getSongPlaylists: (songId: string) => string[];
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<SongItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const [queue, setQueue] = useState<SongItem[]>(STARTER_POPULAR_SONGS);
  const [savedPlaylist, setSavedPlaylist] = useState<SongItem[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>(DEFAULT_PLAYLISTS);

  // HTML5 audio reference that stays persistent
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(console.warn);
      } else {
        handleNextSong();
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.warn('Audio playback error, stream might need refresh:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as EventListener);

    // Load playlists from storage / MongoDB
    getPlaylists().then((list) => {
      if (Array.isArray(list)) {
        setPlaylists(list);
      }
    });

    // Load saved songs from storage / MongoDB
    getSavedPlaylist().then((list) => {
      if (Array.isArray(list)) {
        setSavedPlaylist(list);
        if (list.length > 0) {
          setQueue(list);
        }
      }
    });

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, []);

  // Play a song
  const playSong = (song: SongItem, queueList?: SongItem[]) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (queueList && queueList.length > 0) {
      setQueue(queueList);
    } else if (!queue.some((s) => s.id === song.id)) {
      setQueue((prev) => [song, ...prev]);
    }

    setCurrentSong(song);
    audio.src = song.streamUrl;
    audio.currentTime = 0;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Playback autoplay prevented:', err);
        setIsPlaying(false);
      });
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (!currentSong) {
      const first = queue[0] || STARTER_POPULAR_SONGS[0];
      if (first) playSong(first, queue);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.warn);
    }
  };

  // Next song
  const handleNextSong = () => {
    if (queue.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      playSong(queue[randomIndex]);
      return;
    }

    const currentIndex = queue.findIndex((s) => s.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playSong(queue[nextIndex]);
  };

  // Previous song
  const handlePrevSong = () => {
    if (!audioRef.current || queue.length === 0) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const currentIndex = queue.findIndex((s) => s.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playSong(queue[prevIndex]);
  };

  // Seek timeline
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Volume
  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      setIsMuted(clamped === 0);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleShuffle = () => setIsShuffle((prev) => !prev);
  const toggleRepeat = () => setIsRepeat((prev) => !prev);

  // Create Playlist
  const createPlaylist = async (name: string, description = '', color = '#DF886F') => {
    const created = await apiCreatePlaylist({ name, description, color });
    setPlaylists((prev) => {
      if (prev.some((p) => p.id === created.id || p.name.toLowerCase() === created.name.toLowerCase())) {
        return prev;
      }
      return [...prev, created];
    });
    return created;
  };

  // Delete Playlist
  const deletePlaylist = async (id: string, name: string) => {
    await apiDeletePlaylist(id, name);
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    // Clean up local saved songs
    setSavedPlaylist((prev) =>
      prev
        .map((s) => {
          const list = (s.playlists || [s.playlist || 'Favorites']).filter((p) => p !== name);
          if (list.length === 0) return null;
          return { ...s, playlist: list[0], playlists: list };
        })
        .filter(Boolean) as SongItem[]
    );
  };

  // Add to single playlist
  const addToPlaylist = async (song: SongItem, playlistName = 'Favorites') => {
    const saved = await saveSongToPlaylist(song, playlistName);
    setSavedPlaylist((prev) => [saved, ...prev.filter((s) => s.id !== saved.id)]);
  };

  // Update complete playlists list for a song (e.g. from modal checkboxes)
  const setSongPlaylists = async (song: SongItem, targetPlaylists: string[]) => {
    if (targetPlaylists.length === 0) {
      await removeSongFromPlaylist(song.id);
      setSavedPlaylist((prev) => prev.filter((s) => s.id !== song.id));
      return;
    }

    const existing = savedPlaylist.find((s) => s.id === song.id);
    if (!existing) {
      // First save it
      const saved = await saveSongToPlaylist({ ...song, playlists: targetPlaylists }, targetPlaylists[0]);
      const normalized: SongItem = { ...saved, playlists: targetPlaylists };
      setSavedPlaylist((prev) => [normalized, ...prev.filter((s) => s.id !== normalized.id)]);
    } else {
      const updated = await apiUpdateSongPlaylists(song.id, targetPlaylists);
      if (updated) {
        setSavedPlaylist((prev) => [updated, ...prev.filter((s) => s.id !== updated.id)]);
      }
    }
  };

  // Remove from Playlist
  const removeFromPlaylist = async (songId: string, fromPlaylist?: string) => {
    await removeSongFromPlaylist(songId, fromPlaylist);
    setSavedPlaylist((prev) => {
      if (!fromPlaylist) {
        return prev.filter((s) => s.id !== songId);
      }
      return prev
        .map((s) => {
          if (s.id !== songId) return s;
          const currentList = s.playlists && s.playlists.length > 0 ? s.playlists : [s.playlist || 'Favorites'];
          const remaining = currentList.filter((p) => p !== fromPlaylist);
          if (remaining.length === 0) return null;
          return { ...s, playlist: remaining[0], playlists: remaining };
        })
        .filter(Boolean) as SongItem[];
    });
  };

  // Check if song is saved (optionally in a specific playlist)
  const isSaved = (songId: string, inPlaylist?: string) => {
    const song = savedPlaylist.find((s) => s.id === songId);
    if (!song) return false;
    if (!inPlaylist) return true;
    const currentList = song.playlists && song.playlists.length > 0 ? song.playlists : [song.playlist || 'Favorites'];
    return currentList.includes(inPlaylist);
  };

  // Get all playlists a song belongs to
  const getSongPlaylists = (songId: string): string[] => {
    const song = savedPlaylist.find((s) => s.id === songId);
    if (!song) return [];
    return song.playlists && song.playlists.length > 0 ? song.playlists : [song.playlist || 'Favorites'];
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        isRepeat,
        queue,
        savedPlaylist,
        playlists,
        playSong,
        togglePlayPause,
        nextSong: handleNextSong,
        prevSong: handlePrevSong,
        seekTo,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        createPlaylist,
        deletePlaylist,
        addToPlaylist,
        setSongPlaylists,
        removeFromPlaylist,
        isSaved,
        getSongPlaylists,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
