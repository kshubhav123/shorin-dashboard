import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  X,
} from 'lucide-react';
import type { NavTab } from '../../types';

interface FloatingMusicBarProps {
  onNavigateToMusic: () => void;
  currentTab: NavTab;
}

export const FloatingMusicBar: React.FC<FloatingMusicBarProps> = ({
  onNavigateToMusic,
  currentTab,
}) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    nextSong,
    prevSong,
    volume,
    setVolume,
    isMuted,
  } = useMusic();

  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If user is currently on the Music tab, don't show the duplicate floating bar
  if (currentTab === 'Music' || isDismissed || !currentSong) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 animate-bounce-in select-none max-w-sm sm:max-w-md w-[calc(100vw-2rem)]">
      <div className="relative rounded-2xl bg-[#12151E]/95 backdrop-blur-xl border border-white/15 p-2.5 sm:p-3 shadow-2xl text-white flex items-center justify-between gap-3 group/dock overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#DF886F]/20 rounded-full blur-xl pointer-events-none" />

        {/* Mini progress bar line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#DF886F] to-[#14B8A6] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Left: Album Art & Title */}
        <div
          onClick={onNavigateToMusic}
          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group/title"
          title="Open Music Player"
        >
          {/* Rotating Album Art */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-white/20 shadow-md">
            {currentSong.image ? (
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className={`w-full h-full object-cover rounded-full ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
              />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                <Music size={16} className="text-[#DF886F]" />
              </div>
            )}
            <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-[#12151E] border border-white/30" />
          </div>

          {/* Song Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-display font-bold text-xs sm:text-sm text-white truncate group-hover/title:text-[#DF886F] transition-colors">
                {currentSong.title}
              </h4>
            </div>
            <p className="text-[10.5px] text-neutral-400 truncate mt-0.5">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Equalizer animation bars when playing */}
        {isPlaying && (
          <div className="hidden sm:flex items-end gap-0.5 h-3.5 shrink-0 px-1">
            <span className="w-0.5 bg-[#14B8A6] rounded-full animate-pulse h-3" />
            <span className="w-0.5 bg-[#DF886F] rounded-full animate-bounce h-2" />
            <span className="w-0.5 bg-[#14B8A6] rounded-full animate-pulse h-3.5" />
            <span className="w-0.5 bg-[#DF886F] rounded-full animate-bounce h-2.5" />
          </div>
        )}

        {/* Center/Right: Audio Playback Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Prev */}
          <button
            type="button"
            onClick={prevSong}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            title="Previous Song"
          >
            <SkipBack size={14} />
          </button>

          {/* Play / Pause */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-r from-[#DF886F] to-[#d4785e] hover:brightness-110 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={14} className="fill-current" />
            ) : (
              <Play size={14} className="fill-current ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={nextSong}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            title="Next Song"
          >
            <SkipForward size={14} />
          </button>

          {/* Volume Control Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsVolumeOpen(!isVolumeOpen)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              title="Volume"
            >
              {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            {/* Volume Slider Popover */}
            {isVolumeOpen && (
              <div className="absolute bottom-full right-0 mb-2 p-2 bg-[#12151E] border border-white/15 rounded-xl shadow-xl flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 accent-[#DF886F] cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="w-6 h-6 rounded-lg text-neutral-500 hover:text-neutral-300 flex items-center justify-center transition-colors cursor-pointer ml-1"
            title="Minimize Player"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
