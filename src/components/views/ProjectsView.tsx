import React, { useState, useEffect, useMemo } from 'react';
import type { ProjectItem, ProjectTab, ProjectStatus } from '../../types';
import {
  getStoredProjects,
  addProjectToStorage,
  updateProjectInStorage,
  deleteProjectFromStorage,
  checkDatabaseStatus,
} from '../../services/projectsStorage';
import { ProjectCard } from '../projects/ProjectCard';
import { ProjectFormModal } from '../projects/ProjectFormModal';
import { DeleteConfirmModal } from '../projects/DeleteConfirmModal';
import { ProjectToast, type ToastMessage } from '../projects/ProjectToast';
import { TECHNOLOGIES_LIST } from '../projects/TechnologyIcons';
import {
  Plus,
  Search,
  FolderCode,
  Briefcase,
  Layers,
  Sparkles,
  RotateCcw,
  Database,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProjectsView: React.FC = () => {
  // Main projects state loaded persistently from storage & MongoDB
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<{
    isConnected: boolean;
    cluster: string;
    totalProjects: number;
  }>({
    isConnected: false,
    cluster: 'cluster0.slho0dw.mongodb.net',
    totalProjects: 0,
  });

  // Active Tab: 'Practice' | 'Freelance'
  const [activeTab, setActiveTab] = useState<ProjectTab>('Practice');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechFilter, setSelectedTechFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProjectStatus>('ALL');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectItem | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load projects from MongoDB Atlas / Cache on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [data, status] = await Promise.all([
          getStoredProjects(),
          checkDatabaseStatus(),
        ]);
        if (isMounted) {
          setProjects(data);
          setDbStatus(status);
        }
      } catch (err) {
        console.error('Failed to load projects from MongoDB:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Map category to tab
  // 'Personal / Practice' -> 'Practice'
  // 'Freelance' -> 'Freelance'
  const practiceProjects = useMemo(
    () => projects.filter((p) => p.category === 'Personal / Practice'),
    [projects]
  );
  const freelanceProjects = useMemo(
    () => projects.filter((p) => p.category === 'Freelance'),
    [projects]
  );

  // Current tab projects
  const currentTabProjects = activeTab === 'Practice' ? practiceProjects : freelanceProjects;

  // Filtered projects within the active tab
  const filteredProjects = useMemo(() => {
    return currentTabProjects.filter((p) => {
      // 1. Search Query filter (matches project name or technologies)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesTech = p.technologies.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesTech) return false;
      }

      // 2. Technology Filter
      if (selectedTechFilter !== 'ALL') {
        const hasTech = p.technologies.some(
          (t) => t.toLowerCase() === selectedTechFilter.toLowerCase()
        );
        if (!hasTech) return false;
      }

      // 3. Status Filter
      if (statusFilter !== 'ALL') {
        if (p.status !== statusFilter) return false;
      }

      return true;
    });
  }, [currentTabProjects, searchQuery, selectedTechFilter, statusFilter]);

  // Handle Add Project Click
  const handleOpenAddModal = () => {
    setProjectToEdit(null);
    setIsFormModalOpen(true);
  };

  // Handle Edit Project Click
  const handleOpenEditModal = (project: ProjectItem) => {
    setProjectToEdit(project);
    setIsFormModalOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSaveProject = async (data: Omit<ProjectItem, 'id' | 'createdAt'> | ProjectItem) => {
    if ('id' in data) {
      // Update existing
      const updated = await updateProjectInStorage(data as ProjectItem);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setToast({
        id: String(Date.now()),
        type: 'success',
        title: 'Project Updated in MongoDB',
        description: `"${updated.name}" has been updated in your MongoDB database.`,
      });
    } else {
      // Create new
      const created = await addProjectToStorage(data);
      setProjects((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);

      // Fire celebratory confetti for new project creation
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DF886F', '#14B8A6', '#F59E0B'],
        });
      } catch (e) {}

      // Automatically switch to the corresponding tab if needed
      if (created.category === 'Personal / Practice' && activeTab !== 'Practice') {
        setActiveTab('Practice');
      } else if (created.category === 'Freelance' && activeTab !== 'Freelance') {
        setActiveTab('Freelance');
      }

      setToast({
        id: String(Date.now()),
        type: 'success',
        title: 'Project Saved to MongoDB',
        description: `"${created.name}" is now saved live in your MongoDB database!`,
      });
    }

    setIsFormModalOpen(false);
    setProjectToEdit(null);
  };

  // Handle Safe Delete Confirmation
  const handleConfirmDelete = async (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    // Instant UI update
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setProjectToDelete(null);

    setToast({
      id: String(Date.now()),
      type: 'info',
      title: 'Project Deleted',
      description: target ? `"${target.name}" was removed from MongoDB.` : 'Project removed.',
    });

    // Delete from MongoDB & storage
    try {
      await deleteProjectFromStorage(projectId);
    } catch (err) {
      console.error('Failed to delete project from MongoDB:', err);
    }
  };

  // Reset search and filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTechFilter('ALL');
    setStatusFilter('ALL');
  };

  const hasActiveFilters = searchQuery !== '' || selectedTechFilter !== 'ALL' || statusFilter !== 'ALL';

  return (
    <div className="space-y-6 animate-fadeIn py-1 select-none">
      {/* ================= TOPBAR SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFE5DC] pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-1.5 rounded-lg bg-[#FAF0EB] text-[#DF886F]">
              <Sparkles size={18} />
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 tracking-tight">
              Projects Showcase
            </h2>

            {/* Live MongoDB Status Indicator */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                dbStatus.isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={`Cluster: ${dbStatus.cluster}`}
            >
              <Database size={12} className={dbStatus.isConnected ? 'text-emerald-500' : 'text-amber-500'} />
              <span className={`w-1.5 h-1.5 rounded-full ${dbStatus.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{dbStatus.isConnected ? 'MongoDB Atlas Live' : 'MongoDB Sync'}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Browse through completed and ongoing personal practice initiatives and client freelance deliverables stored dynamically.
          </p>
        </div>

        {/* Top Right Action: Prominent "+ Add Project" Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 sm:px-5 py-2.5 rounded-2xl bg-neutral-900 hover:bg-[#DF886F] text-white font-bold text-xs sm:text-sm tracking-tight flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* ================= TWO TOPBAR TABS: PRACTICE & FREELANCE ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="inline-flex p-1.5 rounded-2xl bg-[#F5EEEA] border border-[#EFE5DC] max-w-fit">
          {/* Tab 1: Practice */}
          <button
            type="button"
            onClick={() => setActiveTab('Practice')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'Practice'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <FolderCode
              size={16}
              className={activeTab === 'Practice' ? 'text-[#14B8A6]' : 'text-neutral-400'}
            />
            <span>Practice</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'Practice'
                  ? 'bg-[#E3F5F2] text-[#0D9488]'
                  : 'bg-neutral-200/70 text-neutral-600'
              }`}
            >
              {practiceProjects.length}
            </span>
          </button>

          {/* Tab 2: Freelance */}
          <button
            type="button"
            onClick={() => setActiveTab('Freelance')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'Freelance'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Briefcase
              size={16}
              className={activeTab === 'Freelance' ? 'text-[#DF886F]' : 'text-neutral-400'}
            />
            <span>Freelance</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'Freelance'
                  ? 'bg-[#FEEAE3] text-[#DF886F]'
                  : 'bg-neutral-200/70 text-neutral-600'
              }`}
            >
              {freelanceProjects.length}
            </span>
          </button>
        </div>

        {/* Quick Summary / Counter Indicator */}
        <div className="text-xs text-neutral-500 flex items-center gap-2">
          <span>Showing</span>
          <span className="font-bold text-neutral-900">{filteredProjects.length}</span>
          <span>of {currentTabProjects.length} projects</span>
        </div>
      </div>

      {/* ================= SEARCH & FILTER CONTROLS BAR ================= */}
      <div className="bg-[#FAF7F4] p-3 sm:p-4 rounded-2xl border border-[#EFE5DC] flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or technology..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white border border-neutral-200 focus:border-[#DF886F] focus:outline-hidden transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Technology Filter Selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Layers size={14} className="absolute left-3 text-neutral-400 pointer-events-none" />
            <select
              value={selectedTechFilter}
              onChange={(e) => setSelectedTechFilter(e.target.value)}
              className="pl-8 pr-8 py-2 text-xs rounded-xl bg-white border border-neutral-200 text-neutral-700 font-semibold focus:border-[#DF886F] focus:outline-hidden transition-colors cursor-pointer"
            >
              <option value="ALL">All Technologies</option>
              {TECHNOLOGIES_LIST.map((tech) => (
                <option key={tech.name} value={tech.name}>
                  {tech.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Selector */}
          <div className="relative flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | ProjectStatus)}
              className="px-3 py-2 text-xs rounded-xl bg-white border border-neutral-200 text-neutral-700 font-semibold focus:border-[#DF886F] focus:outline-hidden transition-colors cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2 rounded-xl bg-neutral-200/70 hover:bg-neutral-200 text-neutral-700 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ================= RESPONSIVE GRID OF ANIMATED FLIP CARDS ================= */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-3 border-[#DF886F] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-neutral-400">Loading projects...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleOpenEditModal}
              onDelete={(proj) => setProjectToDelete(proj)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-[28px] border border-dashed border-[#EFE5DC] p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#FAF0EB] text-[#DF886F] flex items-center justify-center shadow-xs">
            {activeTab === 'Practice' ? <FolderCode size={30} /> : <Briefcase size={30} />}
          </div>

          <div className="max-w-md">
            <h3 className="font-display font-bold text-lg text-neutral-900">
              {hasActiveFilters
                ? 'No matching projects found'
                : activeTab === 'Practice'
                ? 'No practice projects yet'
                : 'No freelance projects yet'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {hasActiveFilters
                ? 'Try adjusting your search query, technology stack, or status filters.'
                : activeTab === 'Practice'
                ? 'Document your learning journey, code experiments, and side projects with interactive flip cards.'
                : 'Showcase your client commissions, consulting contracts, and professional deliverables.'}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#DF886F] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Your First {activeTab} Project</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= INTERACTIVE MODALS ================= */}
      {/* 1. Add / Edit Project Modal */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setProjectToEdit(null);
        }}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
        defaultCategory={activeTab === 'Practice' ? 'Personal / Practice' : 'Freelance'}
      />

      {/* 2. Safe Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={projectToDelete !== null}
        onClose={() => setProjectToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
        project={projectToDelete}
      />

      {/* 3. Toast Notifications */}
      <ProjectToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default ProjectsView;
