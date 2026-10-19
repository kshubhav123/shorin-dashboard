import React from 'react';
import type { UserProfile } from '../../types';
import { CheckCircle2 } from 'lucide-react';

interface ReportsViewProps {
  profile: UserProfile;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ profile }) => {
  const experiences = [
    {
      role: 'Principal Design Strategist & Lead',
      company: 'Crowz Interactive & Co.',
      period: '2022 — Present',
      description: 'Directed multi-disciplinary product engineering teams delivering enterprise SaaS web dashboards and multi-tenant applications.',
      highlights: ['Scaled client ARR by 140%', 'Designed token-based design systems for 12+ apps'],
    },
    {
      role: 'Senior Frontend Engineer & UI Specialist',
      company: 'Apex Digital Labs',
      period: '2019 — 2022',
      description: 'Built high-throughput data visualization portals with sub-second response times and micro-frontend integrations.',
      highlights: ['Engineered dynamic SVG chart engines', 'Mentored 15+ engineering peers'],
    },
    {
      role: 'Product Designer & Developer',
      company: 'Freelance & Studio Consultancy',
      period: '2017 — 2019',
      description: 'Consulted for high-growth tech startups in Silicon Valley, London, and Tokyo.',
      highlights: ['Delivered 80+ successful digital products'],
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn py-2">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
          Career Timeline & Impact Reports
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Detailed breakdown of professional milestones, leadership experience, and product achievements.
        </p>
      </div>

      {/* Summary Metrics Banner */}
      <div className="grid grid-cols-3 gap-4 bg-[#E4F4F1] rounded-[24px] p-5 border border-[#D5ECE8]">
        <div className="text-center">
          <span className="font-display font-bold text-2xl md:text-3xl text-neutral-900">{profile.yearsExperience}+</span>
          <p className="text-xs text-neutral-600 font-medium mt-0.5">Years Experience</p>
        </div>
        <div className="text-center border-x border-[#D5ECE8]">
          <span className="font-display font-bold text-2xl md:text-3xl text-neutral-900">{profile.completedProjects}+</span>
          <p className="text-xs text-neutral-600 font-medium mt-0.5">Projects Delivered</p>
        </div>
        <div className="text-center">
          <span className="font-display font-bold text-2xl md:text-3xl text-neutral-900">{profile.satisfiedClients}+</span>
          <p className="text-xs text-neutral-600 font-medium mt-0.5">Happy Clients</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-neutral-200/70 shadow-soft hover:shadow-card transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <h3 className="font-display font-bold text-base text-neutral-900">{exp.role}</h3>
              <span className="text-xs font-semibold text-[#DF886F] bg-[#FAF4EF] px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                {exp.period}
              </span>
            </div>
            <div className="text-xs font-semibold text-neutral-500 mb-2">{exp.company}</div>
            <p className="text-xs text-neutral-600 leading-relaxed mb-3">{exp.description}</p>
            <div className="flex flex-wrap gap-2">
              {exp.highlights.map((h, j) => (
                <span
                  key={j}
                  className="flex items-center gap-1 text-[11px] text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-lg"
                >
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
