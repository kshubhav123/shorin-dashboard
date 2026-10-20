import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Music2,
  ArrowRight,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

interface DashboardMusicCardProps {
  onNavigateToMusic?: () => void;
}

export const DashboardMusicCard: React.FC<DashboardMusicCardProps> = ({ onNavigateToMusic }) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    nextSong,
    prevSong,
    queue,
    playSong,
    isMuted,
    toggleMute,
    seekTo,
  } = useMusic();

  // If no song is loaded yet, fall back to first item in queue or starter
  const activeSong = currentSong || queue[0] || {
    id: 'starter-1',
    title: 'Kesariya',
    artist: 'Pritam, Arijit Singh',
    album: 'Brahmastra',
    image: 'https://c.saavncdn.com/423/Arijit-Singh-All-Time-Best-Hindi-Hit-Love-Songs-Collection-Hindi-2026-20261008160834-500x500.jpg',
    duration: 268,
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayToggle = () => {
    if (!currentSong) {
      playSong(activeSong);
    } else {
      togglePlayPause();
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(percent * duration);
  };

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 flex flex-col justify-between border border-[#EFE5DC]/80 shadow-soft select-none h-full relative overflow-hidden group">
      {/* Subtle Ambient Background Gradient */}
      <div className="absolute -top-14 -right-14 w-44 h-44 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-14 -left-14 w-44 h-44 bg-[#DF886F]/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              MUSIC PLAYER
            </span>
            {isPlaying && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F6F3] text-[#14B8A6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-ping" />
                <span>Playing</span>
              </span>
            )}
          </div>

          <button
            onClick={onNavigateToMusic}
            className="text-[12px] font-semibold text-[#14B8A6] hover:text-[#0D9488] flex items-center gap-1 transition-colors group/btn cursor-pointer"
          >
            <span>Music Hub</span>
            <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Player Layout (Responsive: Stack on small screens, Side-by-side on tablet/desktop) */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 relative z-10">
          {/* Album Art with Floating Glow */}
          <div className="relative shrink-0 group/cover">
            <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl overflow-hidden shadow-md border border-[#EFE5DC]/80 relative bg-[#FAF7F4]">
              {activeSong.image ? (
                <img
                  src={activeSong.image}
                  alt={activeSong.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/cover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#FAF5F0] to-[#E3F5F2] text-[#14B8A6]">
                  <Music2 size={32} />
                </div>
              )}

              {/* Play Overlay Button */}
              <button
                onClick={handlePlayToggle}
                className="absolute inset-0 bg-black/35 opacity-0 group-hover/cover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
              >
                {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
              </button>
            </div>
          </div>

          {/* Song Details & Wave Controls */}
          <div className="flex-1 min-w-0 w-full flex flex-col justify-between text-center sm:text-left">
            <div>
              <h4 className="font-bold text-[15px] sm:text-[16px] text-neutral-900 tracking-tight truncate leading-tight group-hover:text-[#DF886F] transition-colors">
                {activeSong.title}
              </h4>
              <p className="text-[12px] text-neutral-500 font-normal mt-0.5 truncate">
                {activeSong.artist || 'Unknown Artist'}
                {activeSong.album ? ` · ${activeSong.album}` : ''}
              </p>
            </div>

            {/* Interactive Progress Bar */}
            <div className="mt-3.5 w-full">
              <div
                onClick={handleProgressBarClick}
                className="w-full h-2 rounded-full bg-[#FAF5F0] border border-[#EFE5DC]/80 overflow-hidden cursor-pointer relative group/bar"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#DF886F] to-[#14B8A6] rounded-full transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10.5px] text-neutral-400 mt-1 font-mono font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-center sm:justify-between mt-3 gap-3">
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Prev */}
                <button
                  onClick={prevSong}
                  className="w-8 h-8 rounded-full bg-[#FAF7F4] hover:bg-[#F2ECE5] text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Previous Track"
                >
                  <SkipBack size={14} />
                </button>

                {/* Play / Pause Main Button */}
                <button
                  onClick={handlePlayToggle}
                  className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-[#14B8A6] text-white flex items-center justify-center transition-all cursor-pointer shadow-soft active:scale-95 hover:scale-105"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause size={17} fill="white" />
                  ) : (
                    <Play size={17} fill="white" className="ml-0.5" />
                  )}
                </button>

                {/* Next */}
                <button
                  onClick={nextSong}
                  className="w-8 h-8 rounded-full bg-[#FAF7F4] hover:bg-[#F2ECE5] text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Next Track"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              {/* Mute Toggle */}
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-[#FAF7F4] hover:bg-[#F2ECE5] text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={14} className="text-[#EF4444]" /> : <Volume2 size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMusicCard;
