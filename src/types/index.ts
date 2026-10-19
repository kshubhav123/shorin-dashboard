export type NavTab = 'Dashboard' | 'Projects' | 'Videos' | 'Music' | 'Notepad' | 'Friend List' | 'Gallery' | 'Travel' | 'Dreams' | 'Task';

export interface StatItem {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description?: string;
  fullValue?: string;
}

export interface ActivityDataPoint {
  day: string;
  label: string;
  value: number; // 0 to 40k
  formattedValue: string;
  ratePerHour: string;
  isPeak?: boolean;
}

export interface TopPerformer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  percentage: number;
  role: string;
  projectTitle: string;
  description: string;
  tags: string[];
  metrics: string;
  liveUrl?: string;
  githubUrl?: string;
  stars?: number;
  impactScore?: string;
}

export interface ChannelItem {
  id: string;
  name: string;
  handle: string;
  change: string;
  trend: 'positive' | 'negative';
  iconType: 'dribbble' | 'behance' | 'instagram' | 'pinterest' | 'github' | 'linkedin' | 'twitter';
  iconBg: string;
  followers?: string;
  url: string;
  description?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'project' | 'metric' | 'social' | 'message';
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  email: string;
  availableForWork: boolean;
  location: string;
  yearsExperience: number;
  completedProjects: number;
  satisfiedClients: number;
  skills: {
    category: string;
    items: string[];
  }[];
  professionHighlights: {
    title: string;
    description: string;
  }[];
}

export interface FriendItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Online' | 'Offline' | 'In Code Session' | 'Traveling';
  connectionType: 'Close Friend' | 'Co-developer' | 'College Buddy' | 'Mentor';
  socialHandle: string;
  mutualProjects?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Coding Setup' | 'Travel' | 'Hackathons' | 'Personal' | 'Celebrations';
  imageUrl: string;
  date: string;
  caption: string;
}

export interface TravelDestination {
  id: string;
  place: string;
  country: string;
  year: string;
  status: 'Visited' | 'Planned' | 'Dream Destination';
  coverUrl: string;
  highlight: string;
}

export interface DreamItem {
  id: string;
  title: string;
  category: 'Career' | 'Tech Innovation' | 'Personal' | 'Travel' | 'Community';
  status: 'In Progress' | 'Target 2026' | 'Vision' | 'Achieved';
  targetDate: string;
  description: string;
  progressPercent: number;
}

export interface TaskItem {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  category: 'Coding' | 'Learning' | 'Personal' | 'Fitness';
  dueDate: string;
}

export type ProjectCategory = 'Personal / Practice' | 'Freelance';
export type ProjectTab = 'Practice' | 'Freelance';
export type ProjectStatus = 'Pending' | 'Completed';

export interface ProjectItem {
  id: string;
  name: string;
  category: ProjectCategory;
  technologies: string[];
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD (optional for ongoing)
  status: ProjectStatus;
  screenshot: string; // base64 or URL
  lpUrl?: string; // Landing Page URL / Live Demo URL
  createdAt: number;
}

export type VideoCategory = 'Learning' | 'Movies';
export type VideoTab = 'Learning' | 'Movies';
export type VideoPlatform = 'YouTube' | 'Instagram' | 'Facebook';
export type VideoStatus = 'Pending' | 'In Progress' | 'Completed';

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  platform: VideoPlatform;
  category: VideoCategory;
  status: VideoStatus;
  description?: string;
  thumbnailUrl?: string;
  createdAt: number;
}

export type MusicTab = 'Discover' | 'My Playlists';

export interface PlaylistItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: number;
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string;
  streamUrl: string;
  duration: number; // in seconds
  playlist?: string; // e.g. "Favorites"
  playlists?: string[]; // Array of playlist names/ids
  savedAt?: number;
}

export type NoteCategory = 'General' | 'Work' | 'Ideas' | 'Personal' | 'Code' | 'Todo';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags?: string[];
  color?: string; // Card background / accent
  isPinned?: boolean;
  createdAt: number;
  updatedAt?: number;
}
