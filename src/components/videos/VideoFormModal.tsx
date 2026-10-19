import React, { useState, useEffect, useRef } from 'react';
import type { VideoItem, VideoPlatform, VideoCategory, VideoStatus } from '../../types';
import {
  X,
  Sparkles,
  Video as VideoIcon,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Check,
  Play,
} from 'lucide-react';
import {
  YouTubeIcon,
  InstagramIcon,
  FacebookIcon,
  PLATFORM_CONFIGS,
  PlatformBadge,
  VideoStatusBadge,
} from './VideoIcons';
import {
  extractYoutubeId,
  getYoutubeThumbnail,
  detectPlatformFromUrl,
  normalizeVideoUrl,
} from '../../services/videosStorage';

interface VideoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (videoData: Omit<VideoItem, 'id' | 'createdAt'> | VideoItem) => void;
  videoToEdit?: VideoItem | null;
  defaultCategory?: VideoCategory;
}

export const VideoFormModal: React.FC<VideoFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  videoToEdit,
  defaultCategory = 'Learning',
}) => {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [platform, setPlatform] = useState<VideoPlatform>('YouTube');
  const [category, setCategory] = useState<VideoCategory>(defaultCategory);
  const [status, setStatus] = useState<VideoStatus>('Pending');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dropdown state for social media platform
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close platform dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPlatformDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state when editing or opening
  useEffect(() => {
    if (isOpen) {
      if (videoToEdit) {
        setTitle(videoToEdit.title);
        setVideoUrl(videoToEdit.videoUrl);
        setPlatform(videoToEdit.platform);
        setCategory(videoToEdit.category);
        setStatus(videoToEdit.status || 'Pending');
        setDescription(videoToEdit.description || '');
      } else {
        setTitle('');
        setVideoUrl('');
        setPlatform('YouTube');
        setCategory(defaultCategory);
        setStatus('Pending');
        setDescription('');
      }
      setErrors({});
      setIsPlatformDropdownOpen(false);
    }
  }, [isOpen, videoToEdit, defaultCategory]);

  // Auto-detect platform when videoUrl changes
  const handleUrlChange = (value: string) => {
    setVideoUrl(value);
    if (errors.videoUrl) setErrors((prev) => ({ ...prev, videoUrl: '' }));

    // If adding a new video and user pastes URL, auto-detect platform
    if (!videoToEdit && value.trim()) {
      const detected = detectPlatformFromUrl(value);
      setPlatform(detected);
    }
  };

  if (!isOpen) return null;

  // Real-time live thumbnail preview for YouTube
  const youtubeId = extractYoutubeId(videoUrl);
  const liveThumbnail = youtubeId ? getYoutubeThumbnail(youtubeId) : '';
  const normalizedTestUrl = normalizeVideoUrl(videoUrl);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Video title is required.';
    }

    if (!videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required.';
    } else if (!/^https?:\/\//i.test(normalizeVideoUrl(videoUrl))) {
      newErrors.videoUrl = 'Please provide a valid video URL.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedUrl = normalizeVideoUrl(videoUrl);
    const thumb = platform === 'YouTube' ? getYoutubeThumbnail(formattedUrl) : '';

    if (videoToEdit) {
      onSave({
        ...videoToEdit,
        title: title.trim(),
        videoUrl: formattedUrl,
        platform,
        category,
        status,
        description: description.trim(),
        thumbnailUrl: thumb || videoToEdit.thumbnailUrl,
      });
    } else {
      onSave({
        title: title.trim(),
        videoUrl: formattedUrl,
        platform,
        category,
        status,
        description: description.trim(),
        thumbnailUrl: thumb,
      });
    }

    onClose();
  };

  const platformOptions: { platform: VideoPlatform; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      platform: 'YouTube',
      label: 'YouTube',
      icon: <YouTubeIcon size={18} className="text-[#FF0000]" />,
      desc: 'Watch videos, shorts, tutorials & live streams',
    },
    {
      platform: 'Instagram',
      label: 'Instagram',
      icon: <InstagramIcon size={18} className="text-[#E1306C]" />,
      desc: 'Reels, video posts & stories',
    },
    {
      platform: 'Facebook',
      label: 'Facebook',
      icon: <FacebookIcon size={18} className="text-[#1877F2]" />,
      desc: 'Facebook Watch & video posts',
    },
  ];

  const currentPlatformConfig = PLATFORM_CONFIGS[platform];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] w-full max-w-xl shadow-card border border-neutral-100 overflow-hidden relative my-6 text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#FAF5F0] px-6 py-5 flex items-center justify-between border-b border-[#EFE7DE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DF886F] text-white flex items-center justify-center shadow-xs">
              <VideoIcon size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-neutral-900 leading-tight">
                {videoToEdit ? 'Edit Video' : 'Add New Video'}
              </h3>
              <p className="text-xs text-neutral-500 font-normal">
                {videoToEdit
                  ? 'Update your video link and social media platform details'
                  : 'Add YouTube tutorials, learning materials, or movie trailers'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Title */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
              Video Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Full Stack Web Development Roadmap 2025"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
              } focus:border-[#DF886F] focus:outline-hidden transition-colors`}
            />
            {errors.title && (
              <span className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.title}
              </span>
            )}
          </div>

          {/* Row 2: Video URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                Video URL <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-neutral-400 font-medium">
                Supports YouTube, Instagram & Facebook
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                className={`w-full pl-3.5 pr-24 py-2.5 text-sm rounded-xl border ${
                  errors.videoUrl ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                } focus:border-[#DF886F] focus:outline-hidden transition-colors`}
              />
              {normalizedTestUrl && (
                <a
                  href={normalizedTestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#E3F5F2] hover:bg-[#D1EFEA] text-[#0D9488] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Test URL</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
            {errors.videoUrl && (
              <span className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.videoUrl}
              </span>
            )}
          </div>

          {/* Row 3: Social Media Icons Dropdown & Category Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Social Media Platform Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
                Social Media Platform <span className="text-rose-500">*</span>
              </label>

              {/* Selected Trigger Button */}
              <button
                type="button"
                onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="shrink-0">{currentPlatformConfig.icon(18)}</span>
                  <span className="font-semibold text-neutral-900">{currentPlatformConfig.label}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-neutral-400 transition-transform duration-200 ${
                    isPlatformDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isPlatformDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-neutral-200 rounded-2xl shadow-xl z-30 p-1.5 animate-fadeIn space-y-1">
                  {platformOptions.map((opt) => {
                    const isSelected = platform === opt.platform;
                    return (
                      <button
                        key={opt.platform}
                        type="button"
                        onClick={() => {
                          setPlatform(opt.platform);
                          setIsPlatformDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                          isSelected ? 'bg-neutral-100/90 font-bold' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="shrink-0">{opt.icon}</span>
                          <div>
                            <p className="text-xs font-bold text-neutral-900">{opt.label}</p>
                            <p className="text-[10.5px] text-neutral-400">{opt.desc}</p>
                          </div>
                        </div>
                        {isSelected && <Check size={14} className="text-[#14B8A6] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Category Dropdown (Learning vs Movies tabs) */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
                Section Tab / Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VideoCategory)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:outline-hidden transition-colors bg-white cursor-pointer font-medium"
              >
                <option value="Learning">Learning (Learning Tab)</option>
                <option value="Movies">Movies (Movies Tab)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Status Selector (Pending, In Progress, Completed) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                Video Status Tag <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-neutral-400 font-medium">Select progress state</span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {/* Option 1: Pending */}
              <button
                type="button"
                onClick={() => setStatus('Pending')}
                className={`py-2 px-2.5 sm:px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === 'Pending'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-700 shadow-2xs ring-1 ring-amber-500/20'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${status === 'Pending' ? 'bg-amber-500' : 'bg-neutral-300'}`} />
                <span className="truncate">Pending</span>
              </button>

              {/* Option 2: In Progress */}
              <button
                type="button"
                onClick={() => setStatus('In Progress')}
                className={`py-2 px-2.5 sm:px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === 'In Progress'
                    ? 'bg-sky-500/15 border-sky-500 text-sky-700 shadow-2xs ring-1 ring-sky-500/20'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${status === 'In Progress' ? 'bg-sky-500 animate-pulse' : 'bg-neutral-300'}`} />
                <span className="truncate">In Progress</span>
              </button>

              {/* Option 3: Completed */}
              <button
                type="button"
                onClick={() => setStatus('Completed')}
                className={`py-2 px-2.5 sm:px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === 'Completed'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 shadow-2xs ring-1 ring-emerald-500/20'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${status === 'Completed' ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                <span className="truncate">Completed</span>
              </button>
            </div>
          </div>

          {/* Row 5: Description (Optional) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
              Description / Notes <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key concepts, takeaways, or reason for bookmarking..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:outline-hidden transition-colors resize-none"
            />
          </div>

          {/* Live Preview Card */}
          {liveThumbnail && (
            <div className="p-3.5 rounded-2xl bg-[#0E1118] border border-white/10 text-white flex items-center gap-3.5">
              <div className="relative w-28 h-18 rounded-xl overflow-hidden bg-black shrink-0">
                <img
                  src={liveThumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                    <Play size={10} className="fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <PlatformBadge platform={platform} />
                  <VideoStatusBadge status={status} size="sm" />
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                    {category} Tab
                  </span>
                </div>
                <p className="text-xs font-bold text-white truncate">
                  {title || 'Video Title Preview'}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">
                  {videoUrl}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-[#DF886F] hover:bg-[#d4785e] text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-md"
            >
              <Sparkles size={14} />
              <span>{videoToEdit ? 'Save Changes' : 'Add Video'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
