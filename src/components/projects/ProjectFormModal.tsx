import React, { useState, useEffect, useRef } from 'react';
import type { ProjectItem, ProjectCategory, ProjectStatus } from '../../types';
import {
  X,
  Upload,
  Sparkles,
  Search,
  Check,
  AlertCircle,
  Trash2,
  RefreshCw,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { TECHNOLOGIES_LIST, TechBadge } from './TechnologyIcons';
import { optimizeImageFile, normalizeUrl } from '../../services/projectsStorage';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ProjectItem, 'id' | 'createdAt'> | ProjectItem) => void;
  projectToEdit?: ProjectItem | null;
  defaultCategory?: ProjectCategory;
}

const PRESET_SCREENSHOTS = [
  {
    name: 'Dashboard Analytics',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Code Editor',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Fintech Portal',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'E-commerce App',
    url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80',
  },
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
  defaultCategory = 'Personal / Practice',
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProjectCategory>(defaultCategory);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Pending');
  const [screenshot, setScreenshot] = useState('');
  const [lpUrl, setLpUrl] = useState('');

  // Dropdown & Search state for technologies
  const [techSearch, setTechSearch] = useState('');
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);
  const techDropdownRef = useRef<HTMLDivElement>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Reset or fill form on open / projectToEdit change
  useEffect(() => {
    if (isOpen) {
      if (projectToEdit) {
        setName(projectToEdit.name);
        setCategory(projectToEdit.category);
        setSelectedTechs(projectToEdit.technologies || []);
        setStartDate(projectToEdit.startDate);
        setEndDate(projectToEdit.endDate || '');
        setStatus(projectToEdit.status);
        setScreenshot(projectToEdit.screenshot || '');
        setLpUrl(projectToEdit.lpUrl || '');
      } else {
        setName('');
        setCategory(defaultCategory);
        setSelectedTechs([]);
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate('');
        setStatus('Pending');
        setScreenshot('');
        setLpUrl('');
      }
      setErrors({});
      setTechSearch('');
      setIsTechDropdownOpen(false);
    }
  }, [isOpen, projectToEdit, defaultCategory]);

  // Click outside listener for tech dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (techDropdownRef.current && !techDropdownRef.current.contains(e.target as Node)) {
        setIsTechDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Filter tech list based on user search query
  const filteredTechs = TECHNOLOGIES_LIST.filter((t) =>
    t.name.toLowerCase().includes(techSearch.toLowerCase())
  );

  const toggleTech = (techName: string) => {
    setSelectedTechs((prev) =>
      prev.includes(techName) ? prev.filter((t) => t !== techName) : [...prev, techName]
    );
    if (errors.technologies) {
      setErrors((prev) => ({ ...prev, technologies: '' }));
    }
  };

  const removeTech = (techName: string) => {
    setSelectedTechs((prev) => prev.filter((t) => t !== techName));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, screenshot: 'Please upload a valid image file (PNG, JPG, WebP).' }));
      return;
    }

    try {
      setIsProcessingImage(true);
      const optimizedUrl = await optimizeImageFile(file);
      setScreenshot(optimizedUrl);
      setErrors((prev) => ({ ...prev, screenshot: '' }));
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, screenshot: err?.message || 'Failed to process image.' }));
    } finally {
      setIsProcessingImage(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Project name is required.';
    }

    if (!category) {
      newErrors.category = 'Category is required.';
    }

    if (selectedTechs.length === 0) {
      newErrors.technologies = 'Please select at least one technology.';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        newErrors.endDate = 'End date cannot be earlier than start date.';
      }
    }

    if (!screenshot) {
      newErrors.screenshot = 'Project screenshot is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedLp = lpUrl.trim() ? normalizeUrl(lpUrl.trim()) : '';

    if (projectToEdit) {
      onSave({
        ...projectToEdit,
        name: name.trim(),
        category,
        technologies: selectedTechs,
        startDate,
        endDate: endDate ? endDate : undefined,
        status,
        screenshot,
        lpUrl: formattedLp,
      });
    } else {
      onSave({
        name: name.trim(),
        category,
        technologies: selectedTechs,
        startDate,
        endDate: endDate ? endDate : undefined,
        status,
        screenshot,
        lpUrl: formattedLp,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="bg-white rounded-[28px] w-full max-w-2xl shadow-card border border-neutral-100 overflow-hidden relative my-6 text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#F5EEEA] px-6 py-5 flex items-center justify-between border-b border-[#EFE5DC]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DF886F] text-white flex items-center justify-center shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-neutral-900 leading-tight">
                {projectToEdit ? 'Edit Project' : 'Add New Project'}
              </h3>
              <p className="text-xs text-neutral-500 font-normal">
                {projectToEdit
                  ? 'Update your project information and tech stack details'
                  : 'Showcase your best engineering and design achievements'}
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Project Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
                Project Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. Crowz AI Analytics"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                } focus:border-[#DF886F] focus:outline-hidden transition-colors`}
              />
              {errors.name && (
                <span className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.name}
                </span>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:outline-hidden transition-colors bg-white cursor-pointer"
              >
                <option value="Personal / Practice">Personal / Practice (Practice Tab)</option>
                <option value="Freelance">Freelance (Freelance Tab)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Technologies Multi-Select with Searchable Dropdown and Removable Chips */}
          <div ref={techDropdownRef} className="relative">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
              Technologies Stack <span className="text-rose-500">*</span>
            </label>

            {/* Selected Chips Area */}
            <div className="min-h-[44px] p-2 rounded-xl border border-neutral-200 bg-neutral-50/60 flex flex-wrap gap-1.5 items-center mb-2">
              {selectedTechs.length === 0 ? (
                <span className="text-xs text-neutral-400 italic px-1">
                  No technologies selected yet. Click below to add.
                </span>
              ) : (
                selectedTechs.map((tech) => (
                  <TechBadge key={tech} name={tech} onRemove={() => removeTech(tech)} size="sm" />
                ))
              )}
            </div>

            {/* Dropdown Opener & Search Input */}
            <div className="relative">
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-3.5 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={techSearch}
                  onFocus={() => setIsTechDropdownOpen(true)}
                  onChange={(e) => {
                    setTechSearch(e.target.value);
                    setIsTechDropdownOpen(true);
                  }}
                  placeholder="Search technologies (e.g. React, Next.js, Tailwind, MongoDB)..."
                  className="w-full pl-9 pr-24 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:outline-hidden transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setIsTechDropdownOpen((prev) => !prev)}
                  className="absolute right-2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                >
                  {isTechDropdownOpen ? 'Close' : 'Browse All'}
                </button>
              </div>

              {/* Dropdown Menu */}
              {isTechDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-2xl shadow-xl border border-neutral-200 max-h-56 overflow-y-auto p-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {filteredTechs.map((tech) => {
                      const isSelected = selectedTechs.includes(tech.name);
                      const IconComp = tech.icon;
                      return (
                        <button
                          key={tech.name}
                          type="button"
                          onClick={() => toggleTech(tech.name)}
                          className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-[#E4F4F1] text-teal-900 border border-[#14B8A6]/40 font-bold'
                              : 'hover:bg-neutral-100 text-neutral-700 border border-transparent'
                          }`}
                        >
                          <span className="shrink-0">
                            <IconComp className="w-4 h-4" />
                          </span>
                          <span className="truncate flex-1">{tech.name}</span>
                          {isSelected && <Check size={14} className="text-[#14B8A6] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {filteredTechs.length === 0 && (
                    <div className="py-4 text-center text-xs text-neutral-400">
                      No matching technologies found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {errors.technologies && (
              <span className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.technologies}
              </span>
            )}
          </div>

          {/* Row 3: Start Date, End Date, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' }));
                  }}
                  className={`w-full px-3 py-2 text-sm rounded-xl border ${
                    errors.startDate ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                  } focus:border-[#DF886F] focus:outline-hidden transition-colors`}
                />
              </div>
              {errors.startDate && (
                <span className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.startDate}
                </span>
              )}
            </div>

            {/* End Date (Optional for Ongoing) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                  End Date
                </label>
                <span className="text-[10px] text-neutral-400 font-medium">Optional (Ongoing)</span>
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: '' }));
                }}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  errors.endDate ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                } focus:border-[#DF886F] focus:outline-hidden transition-colors`}
              />
              {errors.endDate && (
                <span className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.endDate}
                </span>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:outline-hidden transition-colors bg-white cursor-pointer"
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Row 4: LP URL (Landing Page / Live Demo URL) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center gap-1.5">
                <Globe size={13} className="text-[#14B8A6]" />
                <span>LP URL (Landing Page / Live Project URL)</span>
              </label>
              <span className="text-[10px] text-neutral-400 font-medium">Clicking card link redirects here</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={lpUrl}
                onChange={(e) => setLpUrl(e.target.value)}
                placeholder="e.g. https://eurim.co or eurim.co"
                className="w-full pl-3.5 pr-24 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:outline-hidden transition-colors"
              />
              {lpUrl.trim() && (
                <a
                  href={normalizeUrl(lpUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#E3F5F2] hover:bg-[#D1EFEA] text-[#0D9488] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Test LP</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Provide your hosted live demo, web application, or landing page link.
            </p>
          </div>

          {/* Row 5: Project Screenshot Upload & Preview */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
              Project Screenshot <span className="text-rose-500">*</span>
            </label>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {screenshot ? (
              /* Live Preview with Replace & Remove options */
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 group">
                <div className="h-44 sm:h-52 w-full">
                  <img
                    src={screenshot}
                    alt="Project screenshot preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating Overlay Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-2xs">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-white text-neutral-900 font-bold text-xs flex items-center gap-1.5 hover:bg-neutral-100 shadow-md transition-transform hover:scale-105"
                  >
                    <RefreshCw size={14} />
                    <span>Replace Screenshot</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreenshot('')}
                    className="px-3 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-rose-700 shadow-md transition-transform hover:scale-105"
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>
                {/* Always visible small replace badge on mobile */}
                <div className="absolute bottom-2 right-2 sm:hidden">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-md"
                  >
                    <RefreshCw size={12} /> Replace
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Area */
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed ${
                  errors.screenshot ? 'border-rose-300 bg-rose-50/20' : 'border-neutral-200 bg-[#FAF7F4]'
                } hover:border-[#DF886F] rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white text-[#DF886F] flex items-center justify-center shadow-xs mb-2">
                  <Upload size={20} />
                </div>
                <p className="text-sm font-semibold text-neutral-800">
                  {isProcessingImage ? 'Optimizing image...' : 'Click to upload project screenshot'}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Supports PNG, JPG, or WebP. Auto-compressed for optimal performance.
                </p>
              </div>
            )}

            {/* Quick preset screenshots selector */}
            {!screenshot && (
              <div className="mt-2.5">
                <span className="text-[11px] font-semibold text-neutral-500 block mb-1">
                  Or pick a curated sample screenshot:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_SCREENSHOTS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setScreenshot(preset.url);
                        setErrors((prev) => ({ ...prev, screenshot: '' }));
                      }}
                      className="flex items-center gap-1.5 p-1.5 rounded-xl border border-neutral-200 hover:border-[#DF886F] bg-white text-left transition-all hover:shadow-2xs text-[11px] font-medium text-neutral-700"
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-6 h-6 rounded-md object-cover"
                      />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errors.screenshot && (
              <span className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.screenshot}
              </span>
            )}
          </div>

          {/* Modal Action Buttons: Save & Cancel */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#DF886F] text-white font-bold text-sm tracking-tight flex items-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span>{projectToEdit ? 'Save Changes' : 'Save Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
