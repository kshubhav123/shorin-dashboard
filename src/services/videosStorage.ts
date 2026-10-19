import type { VideoItem, VideoPlatform } from '../types';

const STORAGE_KEY = 'crowz_portfolio_videos_data';
const API_BASE = '/api/videos';

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-learn-1',
    title: 'Full Stack Web Development 2025: From Zero to Full Stack Hero',
    videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    platform: 'YouTube',
    category: 'Learning',
    status: 'Completed',
    description: 'Comprehensive modern guide covering HTML, CSS, JavaScript, React, Node.js, and MongoDB full stack development.',
    thumbnailUrl: 'https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg',
    createdAt: 1738000000000,
  },
  {
    id: 'vid-learn-2',
    title: 'React 19 & Next.js 15 Masterclass - Complete Architecture',
    videoUrl: 'https://www.youtube.com/watch?v=8pDqJVdNa44',
    platform: 'YouTube',
    category: 'Learning',
    status: 'In Progress',
    description: 'Deep dive into server components, client actions, modern caching, and production-grade state management.',
    thumbnailUrl: 'https://img.youtube.com/vi/8pDqJVdNa44/hqdefault.jpg',
    createdAt: 1739000000000,
  },
  {
    id: 'vid-learn-3',
    title: 'Tailwind CSS v4 & Modern Component Systems',
    videoUrl: 'https://www.youtube.com/watch?v=pfaSUYaSgRo',
    platform: 'YouTube',
    category: 'Learning',
    status: 'Pending',
    description: 'Building ultra-responsive, accessible, and high-performance user interfaces with clean atomic utility classes.',
    thumbnailUrl: 'https://img.youtube.com/vi/pfaSUYaSgRo/hqdefault.jpg',
    createdAt: 1740000000000,
  },
  {
    id: 'vid-movie-1',
    title: 'Interstellar - Official 4K Ultra HD Trailer',
    videoUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    platform: 'YouTube',
    category: 'Movies',
    status: 'Completed',
    description: 'Christopher Nolan epic sci-fi masterpiece exploring the depths of space, time dilation, and human endurance.',
    thumbnailUrl: 'https://img.youtube.com/vi/zSWdZVtXT7E/hqdefault.jpg',
    createdAt: 1737500000000,
  },
  {
    id: 'vid-movie-2',
    title: 'Inception - 10th Anniversary Cinematic Trailer',
    videoUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    platform: 'YouTube',
    category: 'Movies',
    status: 'Completed',
    description: 'Mind-bending dream heist thriller with stunning visual effects, unforgettable score by Hans Zimmer.',
    thumbnailUrl: 'https://img.youtube.com/vi/YoHD9XEInc0/hqdefault.jpg',
    createdAt: 1738500000000,
  },
];

/**
 * Extracts 11-character YouTube video ID from standard, shortened, shorts, or embed URLs.
 */
export function extractYoutubeId(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  return match ? match[1] : null;
}

/**
 * Returns YouTube high-quality thumbnail URL from a URL or video ID.
 */
export function getYoutubeThumbnail(urlOrId?: string): string {
  if (!urlOrId) return '';
  const videoId = extractYoutubeId(urlOrId) || urlOrId;
  if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return '';
}

/**
 * Generates an embeddable YouTube URL with nocookie domain.
 */
export function getYoutubeEmbedUrl(urlOrId?: string, autoplay = true): string {
  if (!urlOrId) return '';
  const videoId = extractYoutubeId(urlOrId) || urlOrId;
  if (!videoId) return '';
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? '1' : '0'}&rel=0`;
}

/**
 * Smart auto-detector for platform based on user input URL.
 */
export function detectPlatformFromUrl(url?: string): VideoPlatform {
  if (!url || typeof url !== 'string') return 'YouTube';
  const lower = url.toLowerCase();
  if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
    return 'Instagram';
  }
  if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.com')) {
    return 'Facebook';
  }
  return 'YouTube';
}

/**
 * Normalizes video URL by trimming and adding https:// if missing.
 */
export function normalizeVideoUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const emitVideosUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('videos-updated'));
  }
};

// LocalStorage helpers for caching & offline resilience
export function getLocalCachedVideos(): VideoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    saveLocalCachedVideos(INITIAL_VIDEOS);
    return INITIAL_VIDEOS;
  } catch (err) {
    console.warn('Could not read cached videos:', err);
    return INITIAL_VIDEOS;
  }
}

export function saveLocalCachedVideos(videos: VideoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (err) {
    console.warn('Could not write cached videos:', err);
  }
}

/**
 * Fetch videos from MongoDB Atlas backend API, falling back to local cache.
 */
export async function getStoredVideos(): Promise<VideoItem[]> {
  try {
    const response = await fetch(API_BASE, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const videos: VideoItem[] = await response.json();
    if (Array.isArray(videos)) {
      const sanitized = videos.map((v) => ({
        ...v,
        status: v.status || 'Pending',
        videoUrl: normalizeVideoUrl(v.videoUrl),
        thumbnailUrl: v.thumbnailUrl || (v.platform === 'YouTube' ? getYoutubeThumbnail(v.videoUrl) : ''),
      }));
      saveLocalCachedVideos(sanitized);
      return sanitized;
    }
    return getLocalCachedVideos();
  } catch (err) {
    console.info('MongoDB API offline for videos, using local cache:', err);
    return getLocalCachedVideos();
  }
}

/**
 * Add a new video to MongoDB Atlas and update local cache.
 */
export async function addVideoToStorage(
  videoData: Omit<VideoItem, 'id' | 'createdAt'>
): Promise<VideoItem> {
  const normalizedUrl = normalizeVideoUrl(videoData.videoUrl);
  const autoThumb = videoData.thumbnailUrl || (videoData.platform === 'YouTube' ? getYoutubeThumbnail(normalizedUrl) : '');

  const newVideo: VideoItem = {
    ...videoData,
    status: videoData.status || 'Pending',
    videoUrl: normalizedUrl,
    thumbnailUrl: autoThumb,
    id: 'vid-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: Date.now(),
  };

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVideo),
    });

    if (response.ok) {
      const saved: VideoItem = await response.json();
      const current = getLocalCachedVideos();
      saveLocalCachedVideos([saved, ...current.filter((v) => v.id !== saved.id)]);
      emitVideosUpdated();
      return saved;
    }
  } catch (err) {
    console.warn('API call failed for video save, using local cache:', err);
  }

  // Local fallback
  const current = getLocalCachedVideos();
  const updated = [newVideo, ...current];
  saveLocalCachedVideos(updated);
  emitVideosUpdated();
  return newVideo;
}

/**
 * Update an existing video in MongoDB Atlas and update local cache.
 */
export async function updateVideoInStorage(video: VideoItem): Promise<VideoItem> {
  const normalizedUrl = normalizeVideoUrl(video.videoUrl);
  const autoThumb = video.thumbnailUrl || (video.platform === 'YouTube' ? getYoutubeThumbnail(normalizedUrl) : '');

  const updatedVideo: VideoItem = {
    ...video,
    videoUrl: normalizedUrl,
    thumbnailUrl: autoThumb,
  };

  try {
    const response = await fetch(`${API_BASE}/${video.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedVideo),
    });

    if (response.ok) {
      const saved: VideoItem = await response.json();
      const current = getLocalCachedVideos();
      saveLocalCachedVideos(current.map((v) => (v.id === saved.id ? saved : v)));
      emitVideosUpdated();
      return saved;
    }
  } catch (err) {
    console.warn('API call failed for video update, using local cache:', err);
  }

  // Local fallback
  const current = getLocalCachedVideos();
  saveLocalCachedVideos(current.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)));
  emitVideosUpdated();
  return updatedVideo;
}

/**
 * Delete a video from MongoDB Atlas and remove from local cache.
 */
export async function deleteVideoFromStorage(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const current = getLocalCachedVideos();
      saveLocalCachedVideos(current.filter((v) => v.id !== id));
      emitVideosUpdated();
      return true;
    }
  } catch (err) {
    console.warn('API call failed for video deletion, using local cache:', err);
  }

  // Local fallback
  const current = getLocalCachedVideos();
  saveLocalCachedVideos(current.filter((v) => v.id !== id));
  emitVideosUpdated();
  return true;
}
