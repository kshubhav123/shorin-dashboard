import type { ProjectItem } from '../types';

const STORAGE_KEY = 'crowz_portfolio_projects_data';
const API_BASE = '/api/projects';

export const INITIAL_PROJECTS: ProjectItem[] = [
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

// LocalStorage helpers for caching & offline resiliency
export function getLocalCachedProjects(): ProjectItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveLocalCachedProjects(INITIAL_PROJECTS);
      return INITIAL_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_PROJECTS;
  } catch (err) {
    console.warn('Could not read cached projects:', err);
    return INITIAL_PROJECTS;
  }
}

export function saveLocalCachedProjects(projects: ProjectItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.warn('Could not write cached projects:', err);
  }
}

export function normalizeUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Fetch projects directly from MongoDB Atlas backend API.
 * Falls back to local cache if server is offline or starting up.
 */
export async function getStoredProjects(): Promise<ProjectItem[]> {
  try {
    const response = await fetch(API_BASE, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const projects: ProjectItem[] = await response.json();
    if (Array.isArray(projects)) {
      const sanitized = projects.map((p) => ({
        ...p,
        lpUrl: p.lpUrl ? normalizeUrl(p.lpUrl) : 'https://github.com',
      }));
      const local = getLocalCachedProjects();
      const localOnly = local.filter(
        (lp) => !sanitized.some((sp) => sp.id === lp.id || sp.name.trim() === lp.name.trim())
      );
      const merged = [...sanitized, ...localOnly];
      saveLocalCachedProjects(merged);
      return merged;
    }
    const cached = getLocalCachedProjects().map((p) => ({
      ...p,
      lpUrl: p.lpUrl ? normalizeUrl(p.lpUrl) : 'https://github.com',
    }));
    return cached;
  } catch (err) {
    console.info('MongoDB API offline or unreachable, using local cache:', err);
    const cached = getLocalCachedProjects().map((p) => ({
      ...p,
      lpUrl: p.lpUrl ? normalizeUrl(p.lpUrl) : 'https://github.com',
    }));
    return cached;
  }
}


/**
 * Check MongoDB Atlas database connection status via /api/health
 */
export async function checkDatabaseStatus(): Promise<{
  isConnected: boolean;
  cluster: string;
  totalProjects: number;
}> {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) throw new Error('Health check non-200');
    const data = await response.json();
    return {
      isConnected: data.database === 'connected',
      cluster: data.cluster || 'cluster0.slho0dw.mongodb.net',
      totalProjects: data.totalProjects || 0,
    };
  } catch {
    return {
      isConnected: false,
      cluster: 'cluster0.slho0dw.mongodb.net',
      totalProjects: 0,
    };
  }
}

/**
 * Add a new project to MongoDB Atlas.
 */
export async function addProjectToStorage(
  projectData: Omit<ProjectItem, 'id' | 'createdAt'>
): Promise<ProjectItem> {
  const newProject: ProjectItem = {
    ...projectData,
    id: 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: Date.now(),
  };

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    });

    if (response.ok) {
      const saved: ProjectItem = await response.json();
      const current = getLocalCachedProjects();
      saveLocalCachedProjects([saved, ...current.filter((p) => p.id !== saved.id)]);
      return saved;
    }
  } catch (err) {
    console.warn('API call failed, saving to local cache fallback:', err);
  }

  // Local fallback
  const current = getLocalCachedProjects();
  const updated = [newProject, ...current];
  saveLocalCachedProjects(updated);
  return newProject;
}

/**
 * Update an existing project in MongoDB Atlas.
 */
export async function updateProjectInStorage(project: ProjectItem): Promise<ProjectItem> {
  try {
    const response = await fetch(`${API_BASE}/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });

    if (response.ok) {
      const updated: ProjectItem = await response.json();
      const current = getLocalCachedProjects();
      saveLocalCachedProjects(current.map((p) => (p.id === updated.id ? updated : p)));
      return updated;
    }
  } catch (err) {
    console.warn('API call failed, updating local cache fallback:', err);
  }

  // Local fallback
  const current = getLocalCachedProjects();
  const updated = current.map((p) => (p.id === project.id ? project : p));
  saveLocalCachedProjects(updated);
  return project;
}

/**
 * Delete a project from MongoDB Atlas.
 */
export async function deleteProjectFromStorage(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('API delete call failed, removing from local cache fallback:', err);
  }

  // Local fallback
  const current = getLocalCachedProjects();
  const updated = current.filter((p) => p.id !== id);
  saveLocalCachedProjects(updated);
}

/**
 * Optimizes an uploaded image using Canvas before saving to MongoDB
 */
export async function optimizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file format.'));
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 900;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
