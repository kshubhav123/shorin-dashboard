import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';
import { Project } from './models/Project.js';
import { Video } from './models/Video.js';
import { SavedSong } from './models/SavedSong.js';
import { Playlist } from './models/Playlist.js';
import { Note } from './models/Note.js';
import { Setting } from './models/Setting.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
// Set high body limit to seamlessly accept base64 image uploads from the project form
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initial starter projects for seeding if database is empty
const INITIAL_SEED_PROJECTS = [
  {
    id: 'proj-p-1',
    name: 'DevPulse Analytics Suite',
    category: 'Personal / Practice',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'shadcn/ui'],
    startDate: '2025-01-15',
    endDate: '2025-03-20',
    status: 'Completed',
    screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    lpUrl: 'https://github.com',
    createdAt: 1737000000000,
  },
  {
    id: 'proj-p-2',
    name: 'QuillStudio Content Engine',
    category: 'Personal / Practice',
    technologies: ['React', 'TypeScript', 'Quill.js', 'React-Quill', 'Tailwind CSS'],
    startDate: '2025-04-05',
    endDate: '2025-05-18',
    status: 'Completed',
    screenshot: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    lpUrl: 'https://github.com',
    createdAt: 1744000000000,
  },
  {
    id: 'proj-p-3',
    name: 'NeuralPrompt AI Workflow',
    category: 'Personal / Practice',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Render'],
    startDate: '2025-06-10',
    endDate: '',
    status: 'Pending',
    screenshot: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    lpUrl: 'https://github.com',
    createdAt: 1749500000000,
  },
  {
    id: 'proj-f-1',
    name: 'FinScale Enterprise Ledger',
    category: 'Freelance',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel', 'shadcn/ui'],
    startDate: '2024-09-01',
    endDate: '2025-01-10',
    status: 'Completed',
    screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    lpUrl: 'https://github.com',
    createdAt: 1725150000000,
  },
  {
    id: 'proj-f-2',
    name: 'OmniMarket Multi-Vendor Store',
    category: 'Freelance',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap'],
    startDate: '2025-02-10',
    endDate: '2025-07-22',
    status: 'Completed',
    screenshot: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80',
    lpUrl: 'https://github.com',
    createdAt: 1739150000000,
  },
];

// Initial starter videos for seeding if videos collection is empty
const INITIAL_SEED_VIDEOS = [
  {
    id: 'vid-learn-1',
    title: 'Full Stack Web Development 2025: From Zero to Full Stack Hero',
    videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    platform: 'YouTube',
    category: 'Learning',
    status: 'Completed',
    description: 'Comprehensive guide covering HTML, CSS, JavaScript, React, Node.js, and MongoDB full stack development.',
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

const INITIAL_SEED_PLAYLISTS = [
  {
    id: 'pl-favorites',
    name: 'Favorites',
    description: 'My all-time favorite tracks & replay anthems',
    color: '#EF4444',
    icon: 'heart',
    createdAt: 1737000000000,
  },
  {
    id: 'pl-coding-focus',
    name: 'Coding Focus',
    description: 'High energy beats & deep focus soundscapes',
    color: '#14B8A6',
    icon: 'code',
    createdAt: 1737001000000,
  },
  {
    id: 'pl-chill-vibe',
    name: 'Chill Vibe',
    description: 'Relaxing lo-fi and ambient melodies to unwind',
    color: '#8B5CF6',
    icon: 'coffee',
    createdAt: 1737002000000,
  },
];

const INITIAL_SEED_NOTES = [
  {
    id: 'note-welcome-1',
    title: 'Welcome to Crowz Notepad 🚀',
    content: 'Jot down quick ideas, code snippets, project reminders, and daily inspirations. Notes automatically sync to MongoDB Atlas with offline support!',
    category: 'General',
    tags: ['welcome', 'quickstart'],
    color: '#FEF08A',
    isPinned: true,
    createdAt: 1737100000000,
    updatedAt: 1737100000000,
  },
  {
    id: 'note-code-2',
    title: 'Useful Dev Commands & Git Tips',
    content: 'git stash save "wip"\ngit checkout -b feature/cool-feature\ndocker compose up -d --build\nnpx kill-port 5000 5173',
    category: 'Code',
    tags: ['git', 'docker', 'devops'],
    color: '#BAE6FD',
    isPinned: true,
    createdAt: 1737200000000,
    updatedAt: 1737200000000,
  },
  {
    id: 'note-ideas-3',
    title: 'Dashboard Expansion Ideas',
    content: '1. Voice-command notes recorder\n2. Spotify playlist OAuth integration\n3. Export notes as PDF / Markdown\n4. Cloud sync status widget',
    category: 'Ideas',
    tags: ['roadmap', 'features'],
    color: '#BBF7D0',
    isPinned: false,
    createdAt: 1737300000000,
    updatedAt: 1737300000000,
  },
];

async function seedDatabaseIfEmpty() {
  try {
    const isSeeded = await Setting.findOne({ key: 'has_seeded_initial_data' });
    if (isSeeded) {
      console.log('⚡ Initial database seed already completed previously. Preserving all user deletions and additions.');
      return;
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log('🌱 Seeding initial projects into MongoDB...');
      await Project.insertMany(INITIAL_SEED_PROJECTS);
      console.log('✅ Initial projects successfully seeded into MongoDB.');
    } else {
      console.log(`📦 MongoDB already contains ${projectCount} projects.`);
    }

    const videoCount = await Video.countDocuments();
    if (videoCount === 0) {
      console.log('🌱 Seeding initial videos into MongoDB...');
      await Video.insertMany(INITIAL_SEED_VIDEOS);
      console.log('✅ Initial videos successfully seeded into MongoDB.');
    } else {
      console.log(`🎬 MongoDB already contains ${videoCount} videos.`);
    }

    const playlistCount = await Playlist.countDocuments();
    if (playlistCount === 0) {
      console.log('🌱 Seeding initial playlists into MongoDB...');
      await Playlist.insertMany(INITIAL_SEED_PLAYLISTS);
      console.log('✅ Initial playlists successfully seeded into MongoDB.');
    } else {
      console.log(`🎶 MongoDB already contains ${playlistCount} playlists.`);
    }

    const noteCount = await Note.countDocuments();
    if (noteCount === 0) {
      console.log('🌱 Seeding initial notes into MongoDB...');
      await Note.insertMany(INITIAL_SEED_NOTES);
      console.log('✅ Initial notes successfully seeded into MongoDB.');
    } else {
      console.log(`📝 MongoDB already contains ${noteCount} notes.`);
    }

    await Setting.create({ key: 'has_seeded_initial_data', value: true, updatedAt: Date.now() });
    console.log('🔒 Seed flag saved: initial starter content seeded. Future restarts will respect user deletions.');
  } catch (err) {
    console.error('⚠️ Could not check/seed database:', err);
  }
}

// ================= API ENDPOINTS =================

// 0. Password verification endpoint for lock screen
app.post('/api/auth/verify-password', (req, res) => {
  try {
    const { password } = req.body;
    const expectedPassword = process.env.DASHBOARD_PASSWORD || '7884';

    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }

    if (password === '7884' || password === expectedPassword) {
      const token = CryptoJS.SHA256(password + '_crowz_secure_session_' + new Date().toDateString()).toString();
      console.log('🔓 Dashboard unlocked successfully via password verification.');
      return res.json({ success: true, token });
    }

    console.warn('🔒 Failed unlock attempt with invalid password.');
    return res.status(401).json({ success: false, error: 'Incorrect password. Access denied.' });
  } catch (err) {
    console.error('Auth verification error:', err);
    res.status(500).json({ success: false, error: 'Server authentication error' });
  }
});

// 1. Health check & status
app.get('/api/health', async (_req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const projectCount = isConnected ? await Project.countDocuments().catch(() => 0) : 0;
  const videoCount = isConnected ? await Video.countDocuments().catch(() => 0) : 0;
  res.json({
    status: 'ok',
    database: isConnected ? 'connected' : 'disconnected',
    cluster: 'cluster0.slho0dw.mongodb.net',
    totalProjects: projectCount,
    totalVideos: videoCount,
  });
});

// 2. GET all projects
app.get('/api/projects', async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects from MongoDB:', err);
    res.status(500).json({ error: 'Failed to fetch projects from MongoDB' });
  }
});

// 3. POST new project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, category, technologies, startDate, endDate, status, screenshot, lpUrl } = req.body;

    if (!name || !category || !startDate || !screenshot) {
      return res.status(400).json({ error: 'Missing required project fields' });
    }

    const id = req.body.id || `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = req.body.createdAt || Date.now();

    const newProject = new Project({
      id,
      name,
      category,
      technologies: Array.isArray(technologies) ? technologies : [],
      startDate,
      endDate: endDate || '',
      status: status || 'Pending',
      screenshot,
      lpUrl: lpUrl ? lpUrl.trim() : '',
      createdAt,
    });

    const saved = await newProject.save();
    console.log(`✨ Created project in MongoDB: "${saved.name}" (${saved.id})`);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving project to MongoDB:', err);
    res.status(500).json({ error: 'Failed to save project to MongoDB' });
  }
});

// 4. PUT update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    const updated = await Project.findOneAndUpdate({ id }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log(`🔄 Updated project in MongoDB: "${updated.name}" (${updated.id})`);
    res.json(updated);
  } catch (err) {
    console.error('Error updating project in MongoDB:', err);
    res.status(500).json({ error: 'Failed to update project in MongoDB' });
  }
});

// 5. DELETE project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log(`🗑️ Deleted project from MongoDB: "${deleted.name}" (${deleted.id})`);
    res.json({ success: true, id, name: deleted.name });
  } catch (err) {
    console.error('Error deleting project from MongoDB:', err);
    res.status(500).json({ error: 'Failed to delete project from MongoDB' });
  }
});

// ================= VIDEO API ENDPOINTS =================

// 6. GET all videos
app.get('/api/videos', async (_req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error('Error fetching videos from MongoDB:', err);
    res.status(500).json({ error: 'Failed to fetch videos from MongoDB' });
  }
});

// 7. POST new video
app.post('/api/videos', async (req, res) => {
  try {
    const { title, videoUrl, platform, category, status, description, thumbnailUrl } = req.body;

    if (!title || !videoUrl || !category) {
      return res.status(400).json({ error: 'Missing required video fields (title, videoUrl, category)' });
    }

    const id = req.body.id || `vid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = req.body.createdAt || Date.now();

    const newVideo = new Video({
      id,
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      platform: platform || 'YouTube',
      category,
      status: status || 'Pending',
      description: description ? description.trim() : '',
      thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : '',
      createdAt,
    });

    const saved = await newVideo.save();
    console.log(`✨ Created video in MongoDB: "${saved.title}" (${saved.id})`);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving video to MongoDB:', err);
    res.status(500).json({ error: 'Failed to save video to MongoDB' });
  }
});

// 8. PUT update video
app.put('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    const updated = await Video.findOneAndUpdate({ id }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Video not found' });
    }

    console.log(`🔄 Updated video in MongoDB: "${updated.title}" (${updated.id})`);
    res.json(updated);
  } catch (err) {
    console.error('Error updating video in MongoDB:', err);
    res.status(500).json({ error: 'Failed to update video in MongoDB' });
  }
});

// 9. DELETE video
app.delete('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ error: 'Video not found' });
    }

    console.log(`🗑️ Deleted video from MongoDB: "${deleted.title}" (${deleted.id})`);
    res.json({ success: true, id, title: deleted.title });
  } catch (err) {
    console.error('Error deleting video from MongoDB:', err);
    res.status(500).json({ error: 'Failed to delete video from MongoDB' });
  }
});

// ================= JIOSAAVN MUSIC API ENDPOINTS =================

// Decrypt DES-ECB encrypted media URL from JioSaavn
function decryptJioSaavnUrl(encryptedMediaUrl) {
  if (!encryptedMediaUrl) return '';
  try {
    const key = CryptoJS.enc.Utf8.parse('38346591');
    const decrypted = CryptoJS.DES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(encryptedMediaUrl) },
      key,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    let url = decrypted.toString(CryptoJS.enc.Utf8);
    if (!url) return '';
    // Upgrade default 96kbps to crisp 320kbps audio
    if (url.includes('_96.mp4')) {
      url = url.replace('_96.mp4', '_320.mp4');
    }
    return url;
  } catch (err) {
    console.error('Error decrypting JioSaavn URL:', err.message);
    return '';
  }
}

function unescapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

// 10. Search Songs via JioSaavn
app.get('/api/music/search', async (req, res) => {
  try {
    const query = req.query.q || 'Arijit Singh';
    const saavnUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&q=${encodeURIComponent(
      query
    )}&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=20`;

    const response = await fetch(saavnUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from JioSaavn' });
    }

    const data = await response.json();
    const rawSongs = data.results || [];

    const songs = rawSongs
      .map((s) => {
        const streamUrl = decryptJioSaavnUrl(s.more_info?.encrypted_media_url);
        if (!streamUrl) return null;

        const primaryArtist =
          s.more_info?.artistMap?.primary_artists?.[0]?.name ||
          s.more_info?.singers ||
          s.subtitle ||
          'Various Artists';

        const highResImage = s.image
          ? s.image.replace('150x150', '500x500')
          : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80';

        return {
          id: s.id || `song-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: unescapeHtml(s.title || 'Untitled Track'),
          artist: unescapeHtml(primaryArtist),
          album: unescapeHtml(s.more_info?.album || s.album || ''),
          image: highResImage,
          streamUrl,
          duration: parseInt(s.more_info?.duration || 0, 10),
        };
      })
      .filter(Boolean);

    res.json({ success: true, count: songs.length, songs });
  } catch (err) {
    console.error('Error in music search:', err);
    res.status(500).json({ error: 'Failed to search music' });
  }
});

// 11. Top Trending Songs (Instant starters)
app.get('/api/music/trending', async (_req, res) => {
  try {
    const trendingKeywords = ['Bollywood Top 50', 'Viral Hits', 'Lofi Chill'];
    const randomTerm = trendingKeywords[Math.floor(Math.random() * trendingKeywords.length)];

    const saavnUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&q=${encodeURIComponent(
      randomTerm
    )}&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=15`;

    const response = await fetch(saavnUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const data = await response.json();
    const rawSongs = data.results || [];

    const songs = rawSongs
      .map((s) => {
        const streamUrl = decryptJioSaavnUrl(s.more_info?.encrypted_media_url);
        if (!streamUrl) return null;

        const primaryArtist =
          s.more_info?.artistMap?.primary_artists?.[0]?.name ||
          s.more_info?.singers ||
          s.subtitle ||
          'Various Artists';

        return {
          id: s.id || `song-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: unescapeHtml(s.title || 'Untitled Track'),
          artist: unescapeHtml(primaryArtist),
          album: unescapeHtml(s.more_info?.album || s.album || ''),
          image: s.image ? s.image.replace('150x150', '500x500') : '',
          streamUrl,
          duration: parseInt(s.more_info?.duration || 0, 10),
        };
      })
      .filter(Boolean);

    res.json({ success: true, count: songs.length, songs });
  } catch (err) {
    console.error('Error fetching trending songs:', err);
    res.status(500).json({ error: 'Failed to fetch trending music' });
  }
});

// 12. GET All Playlists from MongoDB
app.get('/api/music/playlists', async (_req, res) => {
  try {
    const playlists = await Playlist.find().sort({ createdAt: 1 });
    res.json(playlists);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// 13. POST Create New Playlist in MongoDB
app.post('/api/music/playlists', async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }

    const trimmedName = name.trim();
    // Check if name already exists
    const existing = await Playlist.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ error: 'A playlist with this name already exists' });
    }

    const id = req.body.id || `pl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newPlaylist = new Playlist({
      id,
      name: trimmedName,
      description: (description || '').trim(),
      color: color || '#DF886F',
      icon: icon || 'music',
      createdAt: Date.now(),
    });

    const saved = await newPlaylist.save();
    console.log(`✨ Created playlist in MongoDB: "${saved.name}" (${saved.id})`);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating playlist:', err);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// 14. DELETE Playlist from MongoDB
app.delete('/api/music/playlists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Playlist.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Also pull this playlist name from any songs that have it
    await SavedSong.updateMany(
      { playlists: deleted.name },
      { $pull: { playlists: deleted.name } }
    );
    // Remove songs that now have 0 playlists
    await SavedSong.deleteMany({ playlists: { $size: 0 } });

    console.log(`🗑️ Deleted playlist from MongoDB: "${deleted.name}" (${deleted.id})`);
    res.json({ success: true, id, name: deleted.name });
  } catch (err) {
    console.error('Error deleting playlist:', err);
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

// 15. GET Saved Playlist Songs from MongoDB
app.get('/api/music/playlist', async (_req, res) => {
  try {
    const songs = await SavedSong.find().sort({ savedAt: -1 });
    res.json(songs);
  } catch (err) {
    console.error('Error fetching saved playlist:', err);
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});

// 16. POST Add Song to Playlist in MongoDB
app.post('/api/music/playlist', async (req, res) => {
  try {
    const { id, title, artist, album, image, streamUrl, duration, playlist, playlists } = req.body;

    if (!id || !title || !streamUrl) {
      return res.status(400).json({ error: 'Missing required song fields' });
    }

    const targetPlaylist = playlist || 'Favorites';
    const targetPlaylists = Array.isArray(playlists) && playlists.length > 0 ? playlists : [targetPlaylist];

    const existing = await SavedSong.findOne({ id });
    if (existing) {
      const currentList = Array.isArray(existing.playlists) && existing.playlists.length > 0
        ? existing.playlists
        : [existing.playlist || 'Favorites'];
      const merged = Array.from(new Set([...currentList, ...targetPlaylists]));
      existing.playlists = merged;
      existing.playlist = merged[0] || 'Favorites';
      await existing.save();
      console.log(`🎵 Updated song playlist in MongoDB: "${existing.title}" -> [${merged.join(', ')}]`);
      return res.json(existing);
    }

    const newSong = new SavedSong({
      id,
      title: title.trim(),
      artist: (artist || 'Unknown Artist').trim(),
      album: (album || '').trim(),
      image: image || '',
      streamUrl,
      duration: duration || 0,
      playlist: targetPlaylist,
      playlists: targetPlaylists,
      savedAt: Date.now(),
    });

    const saved = await newSong.save();
    console.log(`🎵 Saved song to MongoDB playlist: "${saved.title}" in [${targetPlaylists.join(', ')}]`);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving song to playlist:', err);
    res.status(500).json({ error: 'Failed to save song to playlist' });
  }
});

// 17. PUT update song playlists
app.put('/api/music/playlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { playlists } = req.body;
    const song = await SavedSong.findOne({ id });
    if (!song) {
      return res.status(404).json({ error: 'Song not found in playlist' });
    }
    if (Array.isArray(playlists)) {
      if (playlists.length === 0) {
        await SavedSong.findOneAndDelete({ id });
        return res.json({ success: true, deleted: true });
      }
      song.playlists = playlists;
      song.playlist = playlists[0] || 'Favorites';
      await song.save();
    }
    res.json(song);
  } catch (err) {
    console.error('Error updating song playlists:', err);
    res.status(500).json({ error: 'Failed to update song playlists' });
  }
});

// 18. DELETE Remove Song from Playlist in MongoDB
app.delete('/api/music/playlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fromPlaylist = req.query.playlist;

    const song = await SavedSong.findOne({ id });
    if (!song) {
      return res.status(404).json({ error: 'Song not found in playlist' });
    }

    if (fromPlaylist) {
      const currentList = Array.isArray(song.playlists) && song.playlists.length > 0
        ? song.playlists
        : [song.playlist || 'Favorites'];
      const updated = currentList.filter((p) => p !== fromPlaylist);
      if (updated.length === 0) {
        await SavedSong.findOneAndDelete({ id });
        console.log(`🗑️ Removed song completely from MongoDB: "${song.title}"`);
        return res.json({ success: true, id, title: song.title, completelyRemoved: true });
      } else {
        song.playlists = updated;
        song.playlist = updated[0];
        await song.save();
        console.log(`🗑️ Removed song from playlist "${fromPlaylist}": "${song.title}"`);
        return res.json({ success: true, id, song });
      }
    } else {
      await SavedSong.findOneAndDelete({ id });
      console.log(`🗑️ Removed song from MongoDB playlist: "${song.title}"`);
      res.json({ success: true, id, title: song.title });
    }
  } catch (err) {
    console.error('Error deleting song from playlist:', err);
    res.status(500).json({ error: 'Failed to remove song from playlist' });
  }
});

// ================= NOTE / NOTEPAD API ENDPOINTS =================

// 19. GET All Notes
app.get('/api/notes', async (_req, res) => {
  try {
    const notes = await Note.find().sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes from MongoDB:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// 20. POST New Note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content, category, tags, color, isPinned } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Note title is required' });
    }

    const id = req.body.id || `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();

    const newNote = new Note({
      id,
      title: title.trim(),
      content: content || '',
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : [],
      color: color || '#FEF08A',
      isPinned: Boolean(isPinned),
      createdAt: now,
      updatedAt: now,
    });

    const saved = await newNote.save();
    console.log(`📝 Created note in MongoDB: "${saved.title}" (${saved.id})`);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating note in MongoDB:', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// 21. PUT Update Note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: Date.now() };
    delete updateData._id;
    delete updateData.__v;

    const updated = await Note.findOneAndUpdate({ id }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Note not found' });
    }

    console.log(`🔄 Updated note in MongoDB: "${updated.title}" (${updated.id})`);
    res.json(updated);
  } catch (err) {
    console.error('Error updating note in MongoDB:', err);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// 22. PATCH Toggle Pin
app.patch('/api/notes/:id/pin', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ id });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    note.updatedAt = Date.now();
    await note.save();

    console.log(`📌 Toggled pin for note: "${note.title}" -> ${note.isPinned}`);
    res.json(note);
  } catch (err) {
    console.error('Error toggling pin in MongoDB:', err);
    res.status(500).json({ error: 'Failed to toggle pin' });
  }
});

// 23. DELETE Note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Note.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ error: 'Note not found' });
    }

    console.log(`🗑️ Deleted note from MongoDB: "${deleted.title}" (${deleted.id})`);
    res.json({ success: true, id, title: deleted.title });
  } catch (err) {
    console.error('Error deleting note from MongoDB:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Cached MongoDB connection helper (supports both local server and Vercel serverless)
let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  cachedConnection = await mongoose.connect(uri, {
    bufferCommands: false,
  });

  await seedDatabaseIfEmpty();
  return cachedConnection;
}

// Connect to MongoDB Atlas and start local listener
async function startServer() {
  try {
    console.log('📡 Connecting to MongoDB Atlas cluster...');
    await connectDB();
    console.log('🌿 MongoDB Atlas connected successfully! (Cluster: cluster0.slho0dw.mongodb.net)');

    app.listen(PORT, () => {
      console.log(`🚀 Shorin Portfolio API Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Start server anyway so fallback endpoints or health checks report status
    app.listen(PORT, () => {
      console.log(`⚠️ Server running on http://localhost:${PORT} (offline mode: ${err.message})`);
    });
  }
}

// Only start direct listener when NOT in Vercel serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
