import React, { useState, useEffect, useMemo } from 'react';
import type { VideoItem, VideoTab, VideoPlatform, VideoStatus } from '../../types';
import {
  getStoredVideos,
  addVideoToStorage,
  updateVideoInStorage,
  deleteVideoFromStorage,
} from '../../services/videosStorage';
import { VideoCard } from '../videos/VideoCard';
import { VideoFormModal } from '../videos/VideoFormModal';
import { VideoPlayerModal } from '../videos/VideoPlayerModal';
import { DeleteVideoModal } from '../videos/DeleteVideoModal';
import { YouTubeIcon, InstagramIcon, FacebookIcon } from '../videos/VideoIcons';
import { ProjectToast, type ToastMessage } from '../projects/ProjectToast';
import {
  Plus,
  Search,
  Film,
  BookOpen,
  RotateCcw,
  Database,
  PlaySquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VideosView: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab: 'Learning' | 'Movies'
  const [activeTab, setActiveTab] = useState<VideoTab>('Learning');

  // Search, Platform, and Status Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | VideoPlatform>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | VideoStatus>('ALL');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<VideoItem | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<VideoItem | null>(null);
  const [activePlayingVideo, setActivePlayingVideo] = useState<VideoItem | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load videos on mount
  useEffect(() => {
    let isMounted = true;
    const loadVideos = async () => {
      try {
        setIsLoading(true);
        const data = await getStoredVideos();
        if (isMounted) {
          setVideos(data);
        }
      } catch (err) {
        console.error('Failed to load videos:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  // Split into tabs
  const learningVideos = useMemo(
    () => videos.filter((v) => v.category === 'Learning'),
    [videos]
  );
  const moviesVideos = useMemo(
    () => videos.filter((v) => v.category === 'Movies'),
    [videos]
  );

  const currentTabVideos = activeTab === 'Learning' ? learningVideos : moviesVideos;

  // Filtered list
  const filteredVideos = useMemo(() => {
    return currentTabVideos.filter((v) => {
      // 1. Search Query filter (matches title or description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = v.title.toLowerCase().includes(q);
        const matchesDesc = (v.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // 2. Platform filter
      if (platformFilter !== 'ALL') {
        if (v.platform !== platformFilter) return false;
      }

      // 3. Status filter
      if (statusFilter !== 'ALL') {
        if (v.status !== statusFilter) return false;
      }

      return true;
    });
  }, [currentTabVideos, searchQuery, platformFilter, statusFilter]);

  // Open Add Video Modal
  const handleOpenAddModal = () => {
    setVideoToEdit(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Video Modal
  const handleOpenEditModal = (video: VideoItem) => {
    setVideoToEdit(video);
    setIsFormModalOpen(true);
  };

  // Save Video (Create or Update)
  const handleSaveVideo = async (
    videoData: Omit<VideoItem, 'id' | 'createdAt'> | VideoItem
  ) => {
    try {
      if ('id' in videoData) {
        // Update
        const updated = await updateVideoInStorage(videoData as VideoItem);
        setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
        setToast({
          id: 'toast-' + Date.now(),
          type: 'success',
          title: 'Video Updated',
          description: `"${updated.title}" has been successfully updated.`,
        });
      } else {
        // Create
        const created = await addVideoToStorage(videoData);
        setVideos((prev) => [created, ...prev]);

        // Trigger confetti celebration
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#DF886F', '#14B8A6', '#F59E0B', '#EF4444'],
          });
        } catch {
          // Ignore confetti error
        }

        setToast({
          id: 'toast-' + Date.now(),
          type: 'success',
          title: 'Video Added Successfully',
          description: `"${created.title}" is now saved to MongoDB Atlas.`,
        });

        // Switch to the video's tab so user immediately sees it
        if (created.category !== activeTab) {
          setActiveTab(created.category);
        }
      }
    } catch (err) {
      console.error('Error saving video:', err);
      setToast({
        id: 'toast-' + Date.now(),
        type: 'error',
        title: 'Save Failed',
        description: 'Could not save video. Changes saved locally.',
      });
    }
  };

  // Delete Video
  const handleConfirmDelete = async (videoId: string) => {
    const target = videos.find((v) => v.id === videoId);
    try {
      await deleteVideoFromStorage(videoId);
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      setToast({
        id: 'toast-' + Date.now(),
        type: 'success',
        title: 'Video Deleted',
        description: target ? `"${target.title}" was permanently removed.` : 'Video deleted.',
      });
    } catch (err) {
      console.error('Error deleting video:', err);
      setToast({
        id: 'toast-' + Date.now(),
        type: 'error',
        title: 'Delete Failed',
        description: 'Failed to delete video.',
      });
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setPlatformFilter('ALL');
    setStatusFilter('ALL');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || platformFilter !== 'ALL' || statusFilter !== 'ALL';

  return (
    <div className="space-y-6 pb-12 animate-fadeIn select-none">
      {/* ================= TOP HERO & ACTION BAR ================= */}
      <div className="bg-[#FAF5F0] rounded-[28px] p-6 sm:p-7 border border-[#EFE7DE] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#DF886F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8DDD4] text-neutral-800 flex items-center gap-1.5">
              <PlaySquare size={13} className="text-[#DF886F]" />
              <span>Video Library</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
              <Database size={11} className="text-emerald-600" />
              <span>MongoDB Atlas Connected</span>
            </span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            Curated Videos & Media
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Watch curated coding tutorials, tech deep-dives, YouTube lessons, and cinematic trailers directly within your dashboard.
          </p>
        </div>

        {/* Primary Action Button: + Add Video */}
        <button
          onClick={handleOpenAddModal}
          className="relative z-10 px-5 py-3 rounded-2xl bg-[#DF886F] hover:bg-[#d4785e] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-card hover:shadow-lg transition-all active:scale-98 cursor-pointer shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>+ Add Video</span>
        </button>
      </div>

      {/* ================= 2 TABS ON TOPBAR: LEARNING & MOVIES ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        {/* Tabs switcher */}
        <div className="flex items-center bg-[#F4EFEA] p-1.5 rounded-2xl border border-[#EBE3D9] shrink-0">
          {/* Tab 1: Learning */}
          <button
            onClick={() => setActiveTab('Learning')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'Learning'
                ? 'bg-white text-neutral-900 shadow-sm scale-100'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/40'
            }`}
          >
            <BookOpen
              size={15}
              className={activeTab === 'Learning' ? 'text-[#14B8A6]' : 'text-neutral-400'}
            />
            <span>Learning</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                activeTab === 'Learning'
                  ? 'bg-[#E3F5F2] text-[#0D9488]'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {learningVideos.length}
            </span>
          </button>

          {/* Tab 2: Movies */}
          <button
            onClick={() => setActiveTab('Movies')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'Movies'
                ? 'bg-white text-neutral-900 shadow-sm scale-100'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/40'
            }`}
          >
            <Film
              size={15}
              className={activeTab === 'Movies' ? 'text-[#DF886F]' : 'text-neutral-400'}
            />
            <span>Movies</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                activeTab === 'Movies'
                  ? 'bg-[#FAF0EB] text-[#DF886F]'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {moviesVideos.length}
            </span>
          </button>
        </div>

        {/* Platform Quick Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setPlatformFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              platformFilter === 'ALL'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Platforms
          </button>

          <button
            onClick={() => setPlatformFilter('YouTube')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              platformFilter === 'YouTube'
                ? 'bg-[#FF0000] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-red-50'
            }`}
          >
            <YouTubeIcon size={14} className={platformFilter === 'YouTube' ? 'text-white' : 'text-[#FF0000]'} />
            <span>YouTube</span>
          </button>

          <button
            onClick={() => setPlatformFilter('Instagram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              platformFilter === 'Instagram'
                ? 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-pink-50'
            }`}
          >
            <InstagramIcon size={14} className={platformFilter === 'Instagram' ? 'text-white' : 'text-[#E1306C]'} />
            <span>Instagram</span>
          </button>

          <button
            onClick={() => setPlatformFilter('Facebook')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              platformFilter === 'Facebook'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-blue-50'
            }`}
          >
            <FacebookIcon size={14} className={platformFilter === 'Facebook' ? 'text-white' : 'text-[#1877F2]'} />
            <span>Facebook</span>
          </button>
        </div>
      </div>

      {/* ================= SEARCH & FILTER CONTROLS ================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab.toLowerCase()} videos by title or topic...`}
            className="w-full pl-9.5 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-white focus:border-[#DF886F] focus:outline-hidden transition-colors"
          />
        </div>

        {/* Status Filter Pill Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide mr-1 hidden sm:inline text-[10.5px]">
            Status:
          </span>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              statusFilter === 'Pending'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-amber-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span>Pending</span>
          </button>

          <button
            onClick={() => setStatusFilter('In Progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              statusFilter === 'In Progress'
                ? 'bg-sky-500 text-white shadow-2xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-sky-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shrink-0" />
            <span>In Progress</span>
          </button>

          <button
            onClick={() => setStatusFilter('Completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              statusFilter === 'Completed'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-emerald-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>Completed</span>
          </button>

          {/* Filter Summary & Reset */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors cursor-pointer ml-1"
              title="Reset all active filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= RESPONSIVE VIDEO CARDS GRID ================= */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-3 border-[#DF886F] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-neutral-400">Loading videos from MongoDB...</p>
        </div>
      ) : filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={(v) => setActivePlayingVideo(v)}
              onEdit={handleOpenEditModal}
              onDelete={(v) => setVideoToDelete(v)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-[28px] border border-dashed border-[#EFE5DC] p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#FAF0EB] text-[#DF886F] flex items-center justify-center shadow-xs">
            {activeTab === 'Learning' ? <BookOpen size={30} /> : <Film size={30} />}
          </div>

          <div className="max-w-md">
            <h3 className="font-display font-bold text-lg text-neutral-900">
              {hasActiveFilters
                ? 'No matching videos found'
                : activeTab === 'Learning'
                ? 'No learning videos yet'
                : 'No movie trailers yet'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              {hasActiveFilters
                ? 'Try adjusting your search query or platform filters to find what you are looking for.'
                : `Add your favorite YouTube tutorials, guides, or movie trailers to your ${activeTab} tab.`}
            </p>
          </div>

          <button
            onClick={hasActiveFilters ? handleResetFilters : handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-[#DF886F] hover:bg-[#d4785e] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {hasActiveFilters ? 'Clear Filters' : `+ Add First ${activeTab} Video`}
          </button>
        </div>
      )}

      {/* ================= MODALS & TOAST NOTIFICATIONS ================= */}

      {/* Add / Edit Video Modal */}
      <VideoFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveVideo}
        videoToEdit={videoToEdit}
        defaultCategory={activeTab}
      />

      {/* Lightbox Video Player Modal */}
      <VideoPlayerModal
        video={activePlayingVideo}
        onClose={() => setActivePlayingVideo(null)}
      />

      {/* Delete Video Confirmation Modal */}
      <DeleteVideoModal
        isOpen={videoToDelete !== null}
        onClose={() => setVideoToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
        video={videoToDelete}
      />

      {/* Toast Notification */}
      <ProjectToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
