import React from 'react';
import type { VideoItem } from '../../types';
import {
  Play,
  Pencil,
  Trash2,
  ExternalLink,
  Film,
  BookOpen,
} from 'lucide-react';
import { PlatformBadge, VideoStatusBadge } from './VideoIcons';
import { getYoutubeThumbnail } from '../../services/videosStorage';

interface VideoCardProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
  onEdit: (video: VideoItem) => void;
  onDelete: (video: VideoItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  onEdit,
  onDelete,
}) => {
  const isYouTube = video.platform === 'YouTube';
  const thumbnail =
    video.thumbnailUrl || (isYouTube ? getYoutubeThumbnail(video.videoUrl) : '');

  return (
    <div className="group relative rounded-[24px] bg-gradient-to-b from-[#181B26] via-[#141722] to-[#0E1118] border border-white/10 p-4 shadow-card hover:border-white/25 transition-all flex flex-col justify-between overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#DF886F]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Video Thumbnail Area with Play Button */}
      <div
        onClick={() => onPlay(video)}
        className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-black/80 border border-white/5 shrink-0 cursor-pointer group/thumb"
        title="Click to play video"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-6 text-center ${
              video.platform === 'Instagram'
                ? 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]'
                : 'bg-gradient-to-tr from-[#1877F2] to-[#0B58CA]'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-lg mb-2">
              <Play size={24} className="fill-current ml-1" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              {video.platform} Video
            </span>
          </div>
        )}

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1118] via-black/20 to-black/40 pointer-events-none" />

        {/* Center Animated Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 text-neutral-900 group-hover/thumb:bg-white group-hover/thumb:scale-115 flex items-center justify-center shadow-xl transition-all duration-300">
            <Play size={18} className="fill-current ml-0.5 text-[#14B8A6]" />
          </div>
        </div>

        {/* Top-Left: Platform & Category Badges */}
        <div
          className="absolute top-3 left-3 z-20 flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <PlatformBadge platform={video.platform} />
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-neutral-200 border border-white/10 flex items-center gap-1">
            {video.category === 'Learning' ? (
              <BookOpen size={10} className="text-[#14B8A6]" />
            ) : (
              <Film size={10} className="text-[#DF886F]" />
            )}
            <span>{video.category}</span>
          </span>
        </div>

        {/* Top-Right: Quick Action Corner (Edit & Delete) */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(video);
            }}
            className="w-8 h-8 rounded-xl bg-black/75 hover:bg-[#DF886F] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md hover:scale-110 active:scale-95 cursor-pointer"
            title="Edit Video"
          >
            <Pencil size={13} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(video);
            }}
            className="w-8 h-8 rounded-xl bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md hover:scale-110 active:scale-95 cursor-pointer"
            title="Delete Video"
          >
            <Trash2 size={13} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Card Body & Info */}
      <div className="pt-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Status Tag & Platform Label */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <span>Status:</span>
            </span>
            <VideoStatusBadge status={video.status} size="sm" />
          </div>

          <button
            type="button"
            onClick={() => onPlay(video)}
            className="text-left w-full group/title cursor-pointer"
            title={video.title}
          >
            <h3 className="font-display font-bold text-base text-white group-hover/title:text-[#DF886F] transition-colors line-clamp-2 leading-snug">
              {video.title}
            </h3>
          </button>

          {video.description && (
            <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

        {/* Footer Actions: Play button + Open on Platform */}
        <div className="pt-3.5 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onPlay(video)}
            className="px-3.5 py-1.5 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow-md"
          >
            <Play size={12} className="fill-current" />
            <span>Watch Now</span>
          </button>

          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title={`Open directly on ${video.platform}`}
          >
            <span className="text-[11px]">Open {video.platform}</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
};
