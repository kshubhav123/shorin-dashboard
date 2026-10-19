import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowRight,
  Code2,
  Briefcase,
  Building2,
  Globe,
  FolderPlus,
  FolderGit2,
} from 'lucide-react';
import { getStoredProjects } from '../../services/projectsStorage';
import type { ProjectItem } from '../../types';

interface RecentProjectsCardProps {
  onViewAll?: () => void;
  onSelectProject?: (title: string) => void;
}

export const RecentProjectsCard: React.FC<RecentProjectsCardProps> = ({
  onViewAll,
  onSelectProject,
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentProjects = useCallback(async () => {
    try {
      const data = await getStoredProjects();
      setProjects(data);
    } catch (err) {
      console.warn('Error fetching recent projects for dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentProjects();

    const handleUpdate = () => {
      fetchRecentProjects();
    };

    window.addEventListener('projects-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('projects-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchRecentProjects]);

  // Take top 4 recent projects
  const recentProjects = projects.slice(0, 4);

  // Helper for category icon and style fallback
  const getCategoryBadge = (category: ProjectItem['category']) => {
    switch (category) {
      case 'Freelance':
        return {
          icon: <Briefcase size={16} className="text-[#F97316]" strokeWidth={2} />,
          badgeBg: 'bg-[#FFF1E8]',
        };
      case 'Company Project':
        return {
          icon: <Building2 size={16} className="text-[#8B5CF6]" strokeWidth={2} />,
          badgeBg: 'bg-[#EDE9FE]',
        };
      case 'Open Source':
        return {
          icon: <Globe size={16} className="text-[#3B82F6]" strokeWidth={2} />,
          badgeBg: 'bg-[#E8F2FF]',
        };
      case 'Personal / Practice':
      default:
        return {
          icon: <Code2 size={16} className="text-[#14B8A6]" strokeWidth={2} />,
          badgeBg: 'bg-[#E3F5F2]',
        };
    }
  };

  // Helper for status tag styling
  const getStatusBadge = (status: ProjectItem['status']) => {
    switch (status) {
      case 'Completed':
        return {
          label: 'Live',
          badgeClass: 'bg-[#E3F5F2] text-[#0D9488]',
        };
      case 'In Progress':
        return {
          label: 'In Progress',
          badgeClass: 'bg-[#EDE9FE] text-[#6D28D9]',
        };
      case 'Pending':
      default:
        return {
          label: 'Pending',
          badgeClass: 'bg-[#FEF3C7] text-[#D97706]',
        };
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 flex flex-col justify-between border border-[#EFE5DC]/80 shadow-soft select-none h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              RECENT PROJECTS
            </span>
            {projects.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F6F3] text-[#14B8A6]">
                {projects.length}
              </span>
            )}
          </div>
          <button
            onClick={onViewAll}
            className="text-[12px] font-semibold text-[#14B8A6] hover:text-[#0D9488] flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Dynamic Project Rows / States */}
        {isLoading ? (
          <div className="space-y-3 py-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="w-28 h-3.5 bg-neutral-100 rounded" />
                    <div className="w-20 h-2.5 bg-neutral-100 rounded" />
                  </div>
                </div>
                <div className="w-12 h-4 bg-neutral-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="py-7 px-3 text-center flex flex-col items-center justify-center">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F6F3] flex items-center justify-center text-[#14B8A6] mb-2.5 shadow-2xs">
              <FolderPlus size={20} />
            </div>
            <p className="text-[13px] font-bold text-neutral-800">No projects added yet</p>
            <p className="text-[11px] text-neutral-400 mt-0.5 max-w-[210px] leading-tight">
              Projects saved to MongoDB Atlas in the Projects tab will appear right here.
            </p>
            <button
              onClick={onViewAll}
              className="mt-3.5 px-3 py-1.5 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white text-[11px] font-semibold transition-all shadow-xs cursor-pointer"
            >
              + Create First Project
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentProjects.map((proj) => {
              const categoryBadge = getCategoryBadge(proj.category);
              const statusBadge = getStatusBadge(proj.status);
              const techPreview = proj.technologies.slice(0, 2).join(' · ');

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    if (onSelectProject) onSelectProject(proj.name);
                    else if (onViewAll) onViewAll();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF7F4] transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail Image or Category Icon */}
                    {proj.screenshot ? (
                      <div className="relative w-9 h-9 shrink-0">
                        <img
                          src={proj.screenshot}
                          alt={proj.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0 shadow-2xs group-hover:scale-105 transition-transform border border-[#EFE5DC]/80"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-9 h-9 rounded-xl ${categoryBadge.badgeBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                      >
                        {categoryBadge.icon}
                      </div>
                    )}

                    {/* Title & Category / Tech */}
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[13px] text-neutral-900 leading-tight group-hover:text-[#DF886F] transition-colors truncate">
                        {proj.name}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-normal mt-0.5 truncate max-w-[170px] sm:max-w-[200px]">
                        {proj.category}{techPreview ? ` · ${techPreview}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Status Tag */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight shrink-0 ${statusBadge.badgeClass}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer subtle counter when projects exist */}
      {!isLoading && projects.length > 4 && (
        <div className="pt-3 border-t border-[#EFE5DC]/60 mt-3 text-center">
          <button
            onClick={onViewAll}
            className="text-[11px] text-neutral-400 hover:text-[#14B8A6] font-medium transition-colors cursor-pointer"
          >
            + {projects.length - 4} more projects in database
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentProjectsCard;
