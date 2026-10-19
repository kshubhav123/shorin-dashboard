import React from 'react';
import type { UserProfile } from '../../types';
import { Terminal, Cpu } from 'lucide-react';

interface AboutAndSkillsProps {
  profile: UserProfile;
}

export const AboutAndSkills: React.FC<AboutAndSkillsProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-2">
      {/* Left: About Me & Profession */}
      <div className="lg:col-span-7 bg-[#FAF6F2] rounded-[24px] p-5 sm:p-6 border border-[#EFE5DC]/80 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-6 h-6 rounded-full bg-[#DF886F] text-white flex items-center justify-center shadow-xs">
              <Terminal size={13} />
            </div>
            <h3 className="font-display font-bold text-lg text-neutral-900 tracking-tight">
              About Me & Profession
            </h3>
          </div>

          <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
            {profile.bio}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 mt-4 border-t border-[#EFE5DC]">
          {profile.professionHighlights.map((highlight, index) => (
            <div key={index} className="bg-white/80 rounded-xl p-2.5 border border-[#EFE5DC]/60">
              <span className="font-bold text-[11px] text-neutral-900 block leading-tight">
                {highlight.title}
              </span>
              <p className="text-[10px] text-neutral-500 mt-1 leading-normal line-clamp-2">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Technical Skill Set */}
      <div className="lg:col-span-5 bg-white rounded-[24px] p-5 sm:p-6 border border-neutral-200/80 shadow-soft flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#14B8A6] text-white flex items-center justify-center shadow-xs">
                <Cpu size={13} />
              </div>
              <h3 className="font-display font-bold text-lg text-neutral-900 tracking-tight">
                Skill Set
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#14B8A6] bg-[#E4F4F1] px-2.5 py-0.5 rounded-full">
              Full Stack
            </span>
          </div>

          <div className="space-y-2.5">
            {profile.skills.map((skillGroup) => (
              <div key={skillGroup.category}>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  {skillGroup.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 bg-[#F6EFEA] hover:bg-[#DF886F] hover:text-white transition-colors text-neutral-800 text-[11px] font-medium rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
