import React, { useEffect } from 'react';
import type { VideoItem } from '../../types';
import { X, ExternalLink, Play } from 'lucide-react';
import { getYoutubeEmbedUrl } from '../../services/videosStorage';
import { PlatformBadge } from './VideoIcons';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const isYouTube = video.platform === 'YouTube';
  const embedUrl = isYouTube ? getYoutubeEmbedUrl(video.videoUrl, true) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#12151E] border border-white/10 rounded-[28px] w-full max-w-4xl overflow-hidden shadow-2xl relative my-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <PlatformBadge platform={video.platform} />
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-neutral-300">
              {video.category}
            </span>
            <h3 className="font-display font-bold text-sm sm:text-base text-white truncate min-w-0">
              {video.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open video on source platform in new tab"
            >
              <span>Watch on {video.platform}</span>
              <ExternalLink size={12} />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Video Player Body */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {isYouTube && embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center max-w-md space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-lg">
                <Play size={28} className="fill-current ml-1" />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-white mb-1">
                  Watch on {video.platform}
                </h4>
                <p className="text-xs text-neutral-400">
                  {video.platform} videos require native player playback on their official platform.
                </p>
              </div>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                <span>Launch Video on {video.platform}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {video.description && (
          <div className="p-4 bg-white/[0.02] border-t border-white/5 text-xs text-neutral-400 leading-relaxed">
            <p className="font-medium text-neutral-300 mb-0.5">Notes / Description:</p>
            <p>{video.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
