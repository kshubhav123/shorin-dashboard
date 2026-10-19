import React, { useState } from 'react';
import type { ProjectItem } from '../../types';
import {
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { TechBadge } from './TechnologyIcons';
import { normalizeUrl } from '../../services/projectsStorage';

interface ProjectCardProps {
  project: ProjectItem;
  onEdit: (project: ProjectItem) => void;
  onDelete: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Normalize target LP URL (prepends https:// if missing)
  const targetUrl = normalizeUrl(project.lpUrl);

  // Format date helper: "2025-01-15" -> "Jan 15, 2025"
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Present / Ongoing';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const isCompleted = project.status === 'Completed';
  const showBack = isFlipped;

  // Direct redirection handler
  const handleOpenLp = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      // If no LP URL has been set, open the edit modal directly so user can add one
      onEdit(project);
    }
  };

  return (
    <div className="perspective-1000 w-full min-h-[420px] h-[430px] select-none relative">
      {/* 3D Inner Container */}
      <div
        className={`relative w-full h-full transition-transform duration-600 transform-style-3d ${
          showBack ? 'rotate-y-180' : ''
        }`}
      >
        {/* ==================== FRONT OF CARD ==================== */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-[24px] bg-gradient-to-b from-[#181B26] via-[#141722] to-[#0E1118] border border-white/10 p-4 shadow-card hover:border-white/25 transition-all flex flex-col justify-between overflow-hidden ${
            showBack ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#DF886F]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Visual: Project Screenshot (Clicking redirects directly to LP URL) */}
          <div
            onClick={handleOpenLp}
            className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shrink-0 cursor-pointer group"
            title={targetUrl ? `Click image to open project: ${targetUrl}` : 'Click to configure project Landing Page URL'}
          >
            <img
              src={project.screenshot}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Dark vignette gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1118] via-transparent to-black/40 pointer-events-none" />

            {/* Hover overlay hint: "Open Project LP ↗" */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="px-4 py-2 rounded-xl bg-white text-neutral-900 text-xs font-bold flex items-center gap-1.5 shadow-2xl transform translate-y-1 group-hover:translate-y-0 transition-transform">
                <span>{targetUrl ? 'Open Project LP' : '+ Set Project LP URL'}</span>
                <ExternalLink size={13} strokeWidth={2.5} className="text-[#14B8A6]" />
              </span>
            </div>

            {/* Top Left: Category badge & LP indicator */}
            <div
              className="absolute top-3 left-3 z-30 flex items-center gap-1.5 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white/95 border border-white/15 shadow-sm">
                {project.category === 'Personal / Practice' ? 'Practice' : 'Freelance'}
              </span>
              {targetUrl && (
                <button
                  type="button"
                  onClick={handleOpenLp}
                  title={`Open LP: ${targetUrl}`}
                  className="w-6 h-6 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-white flex items-center justify-center backdrop-blur-md border border-white/15 shadow-xs transition-colors cursor-pointer"
                >
                  <Globe size={12} />
                </button>
              )}
            </div>

            {/* Quick Action Corner: Edit & Delete Buttons (Strictly stops propagation) */}
            <div
              className="absolute top-3 right-3 flex items-center gap-1.5 z-30 pointer-events-auto"
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
                  onEdit(project);
                }}
                className="w-8 h-8 rounded-xl bg-black/75 hover:bg-[#DF886F] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                title="Edit Project"
              >
                <Pencil size={13} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(project);
                }}
                className="w-8 h-8 rounded-xl bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                title="Delete Project"
              >
                <Trash2 size={13} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Bottom Info: Title, Status Badge, LP Link & Flip Hint */}
          <div className="pt-3 flex flex-col justify-between flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={handleOpenLp}
                  className="text-left group/title inline-flex items-center gap-1.5 text-white hover:text-[#DF886F] transition-colors cursor-pointer max-w-full"
                  title={targetUrl ? `Click to open LP: ${targetUrl}` : 'Click to configure LP URL'}
                >
                  <h3 className="font-display font-bold text-lg leading-tight truncate">
                    {project.name}
                  </h3>
                  <ExternalLink
                    size={13}
                    className="shrink-0 text-[#14B8A6] group-hover/title:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>

              {/* Status Badge */}
              {isCompleted ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Completed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Pending
                </span>
              )}
            </div>

            {/* Quick Tech Preview & Action Buttons */}
            <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-[11px] text-neutral-400 gap-2">
              {/* Tech Tags preview */}
              <div className="flex items-center gap-1 truncate max-w-[170px] sm:max-w-[190px]">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-neutral-300 truncate font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-[10px] text-neutral-400 font-semibold">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              {/* Action Buttons: Live LP Link & Flip Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenLp}
                  className="px-2.5 py-1 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                  title={`Open Landing Page: ${targetUrl || 'Click to set LP URL'}`}
                >
                  <span>Live LP</span>
                  <ExternalLink size={10} strokeWidth={2.5} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="View tech stack details & timeline"
                >
                  <span>Details</span>
                  <RotateCcw size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== BACK OF CARD ==================== */}
        <div
          className={`absolute inset-0 w-full h-full rotate-y-180 backface-hidden rounded-[24px] bg-gradient-to-b from-[#161A24] via-[#12151F] to-[#0A0D14] border border-white/15 p-5 shadow-card text-white flex flex-col justify-between overflow-hidden ${
            showBack ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#14B8A6]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Back Header: Title, Category & Edit/Delete Buttons */}
          <div>
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DF886F] block mb-1">
                  {project.category}
                </span>
                <button
                  type="button"
                  onClick={handleOpenLp}
                  className="text-left font-display font-bold text-lg text-white hover:text-[#DF886F] transition-colors leading-tight truncate cursor-pointer block w-full"
                  title={`Open LP: ${targetUrl || project.name}`}
                >
                  {project.name}
                </button>
              </div>

              {/* Action Controls on back as well */}
              <div
                className="flex items-center gap-1.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(project);
                  }}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#DF886F] text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="Edit Project"
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(project);
                  }}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Back Middle: Technologies Stack */}
            <div className="pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                TECHNOLOGIES USED ({project.technologies.length})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                {project.technologies.map((tech) => (
                  <TechBadge key={tech} name={tech} size="sm" isDarkTheme={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Back Footer: Timeline, LP URL Button, Status & Flip Back Button */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            {/* Timeline */}
            <div className="flex items-center justify-between text-xs text-neutral-300">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Calendar size={13} className="text-[#14B8A6]" />
                <span className="text-[11px] font-medium">Timeline:</span>
              </div>
              <span className="font-semibold text-[11.5px] text-white">
                {formatDate(project.startDate)} → {formatDate(project.endDate)}
              </span>
            </div>

            {/* LP URL Button - Redirects directly to Landing Page */}
            <button
              type="button"
              onClick={handleOpenLp}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:from-[#0D9488] hover:to-[#0B7A70] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
              title={`Open ${targetUrl || 'Landing Page'}`}
            >
              <span>{targetUrl ? 'Open Landing Page (LP)' : 'Configure Project LP URL'}</span>
              <ExternalLink size={13} />
            </button>

            {/* Status & Flip Back Button */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Clock size={12} className="text-amber-400" />
                    Pending
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="text-xs text-[#DF886F] hover:text-[#e89982] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Flip to Front</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
