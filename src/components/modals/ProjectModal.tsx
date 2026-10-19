import React from 'react';
import { X, ExternalLink, Code2 } from 'lucide-react';
import type { TopPerformer } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: TopPerformer | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-[28px] w-full max-w-lg shadow-card border border-neutral-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#F5EEEA] p-6 pb-5 flex items-center justify-between border-b border-[#EFE5DC]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200">
              <img src={project.avatar} alt={project.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 leading-tight">
                {project.projectTitle}
              </h3>
              <p className="text-xs text-neutral-500 font-normal">
                Lead: <span className="font-semibold text-neutral-800">{project.name}</span> ({project.handle})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors shadow-2xs"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-600 leading-relaxed">
            {project.description}
          </p>

          {/* Metric Highlight Box */}
          <div className="bg-[#E4F4F1] rounded-2xl p-4 flex items-center justify-between border border-[#D5ECE8]">
            <div>
              <span className="text-xs font-semibold text-neutral-700">Project Performance Impact</span>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">{project.metrics}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-neutral-900 font-sans">{project.percentage}%</span>
              <span className="block text-[10px] text-neutral-500 font-medium">Platform Share</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <span className="text-xs font-semibold text-neutral-700 block mb-2">Technologies & Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[#F6EFEA] text-neutral-800 text-xs font-medium rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
            <a
              href={project.liveUrl || 'https://github.com'}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-[#DF886F] text-white font-bold text-xs tracking-tight flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>View Case Study</span>
              <ExternalLink size={13} />
            </a>
            <a
              href={project.githubUrl || 'https://github.com'}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Code2 size={14} />
              <span>Source</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
