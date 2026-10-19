const fs = require('fs');
const path = require('path');

function save(filePath, content) {
  const full = path.resolve(filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Saved: ' + filePath);
}

// 1. Sidebar.tsx
save('src/components/sidebar/Sidebar.tsx', `import React from 'react';
import type { NavTab, UserProfile } from '../../types';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: UserProfile;
  onOpenContact: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenContact,
  onOpenSettings,
}) => {
  const navItems: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'Dashboard', label: 'Dashboard', badge: '1' },
    { id: 'Friend List', label: 'Friend List' },
    { id: 'Gallery', label: 'Gallery' },
    { id: 'Projects', label: 'Projects' },
    { id: 'Travel', label: 'Travel' },
    { id: 'Dreams', label: 'Dreams' },
    { id: 'Task', label: 'Task' },
  ];

  return (
    <aside className="w-full md:w-56 lg:w-64 bg-[#F5EEEA] p-6 lg:p-7 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-[#EFE5DC]/80 min-h-screen select-none">
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2.5 mb-7 cursor-pointer group" 
          onClick={() => onSelectTab('Dashboard')}
        >
          <div className="grid grid-cols-2 gap-1 w-4.5 h-4.5 items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-neutral-900 group-hover:text-[#DF886F] transition-colors">
            Crowz
          </span>
        </div>

        {/* Profile Card */}
        <div 
          onClick={onOpenSettings}
          className="flex flex-col items-center text-center mb-7 group cursor-pointer"
          title="Click to customize profile"
        >
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#E89982] to-[#F59E0B] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            {profile.availableForWork && (
              <span 
                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#F5EEEA] rounded-full" 
                title="Available for projects"
              />
            )}
          </div>
          <h2 className="font-display font-bold text-[16px] text-neutral-900 tracking-tight leading-snug group-hover:text-[#DF886F] transition-colors">
            {profile.name}
          </h2>
          <p className="text-[12px] text-neutral-400 font-medium mt-0.5 tracking-tight">
            {profile.role}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={"flex items-center justify-between text-left px-2.5 py-1.5 rounded-xl transition-all duration-200 " + 
                  (isActive
                    ? 'text-neutral-900 font-bold bg-[#EFE4DC]/60 shadow-2xs'
                    : 'text-neutral-500 font-normal hover:text-neutral-900 hover:translate-x-1')
                }
              >
                <span className="text-[14px] tracking-tight">{item.label}</span>
                {item.badge && (
                  <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action */}
      <div className="pt-5 border-t border-[#EFE5DC]/80 mt-5">
        <button
          onClick={onOpenContact}
          className="flex items-center gap-2.5 text-neutral-500 hover:text-neutral-900 transition-colors group text-sm font-medium w-full text-left"
        >
          <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center transition-transform group-hover:scale-110">
            <LogOut size={12} className="rotate-180" />
          </div>
          <span className="text-[13px] text-neutral-600 group-hover:text-neutral-900 transition-colors">
            Log out
          </span>
        </button>
      </div>
    </aside>
  );
};
`);

// 2. MobileNav.tsx
save('src/components/sidebar/MobileNav.tsx', `import React from 'react';
import type { NavTab } from '../../types';
import { LayoutDashboard, Users, Image, Code2, Compass, Sparkles, CheckSquare } from 'lucide-react';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'Dashboard', label: 'Dash', icon: <LayoutDashboard size={16} />, badge: '1' },
    { id: 'Friend List', label: 'Friends', icon: <Users size={16} /> },
    { id: 'Gallery', label: 'Gallery', icon: <Image size={16} /> },
    { id: 'Projects', label: 'Projects', icon: <Code2 size={16} /> },
    { id: 'Travel', label: 'Travel', icon: <Compass size={16} /> },
    { id: 'Dreams', label: 'Dreams', icon: <Sparkles size={16} /> },
    { id: 'Task', label: 'Tasks', icon: <CheckSquare size={16} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5EEEA]/95 backdrop-blur-md border-t border-[#EFE5DC] px-2 py-1.5 flex items-center justify-around shadow-lg overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={"relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors shrink-0 " +
              (isActive ? 'text-neutral-900 font-bold' : 'text-neutral-400 font-medium')
            }
          >
            <div className="relative">
              {tab.icon}
              {tab.badge && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
`);

// 3. AboutAndSkills.tsx
save('src/components/dashboard/AboutAndSkills.tsx', `import React from 'react';
import type { UserProfile } from '../../types';
import { Code, Terminal, Sparkles, Layers, Cpu } from 'lucide-react';

interface AboutAndSkillsProps {
  profile: UserProfile;
}

export const AboutAndSkills: React.FC<AboutAndSkillsProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-2">
      {/* Left: About Me (3-4 lines) & Profession */}
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

          {/* 3-4 Line Bio */}
          <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
            {profile.bio}
          </p>
        </div>

        {/* Profession Pillars */}
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

          {/* Categorized Skills */}
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
`);

// 4. FriendsView.tsx
save('src/components/views/FriendsView.tsx', `import React from 'react';
import { friendsList } from '../../data/portfolioData';
import { MessageSquare, UserPlus, Sparkles, Circle } from 'lucide-react';

export const FriendsView: React.FC = () => {
  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
            Friend List & Network
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Close friends, co-developers, collaborators, and mentors in the developer circle.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {friendsList.map((friend) => (
          <div
            key={friend.id}
            className="bg-white rounded-[24px] p-5 border border-neutral-200/70 shadow-soft hover:shadow-card transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-neutral-200">
                  <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                  <span
                    className={"absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white " +
                      (friend.status === 'Online'
                        ? 'bg-emerald-500'
                        : friend.status === 'In Code Session'
                        ? 'bg-amber-500'
                        : friend.status === 'Traveling'
                        ? 'bg-cyan-500'
                        : 'bg-neutral-300')
                    }
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[15px] text-neutral-900 group-hover:text-[#DF886F] transition-colors leading-snug">
                    {friend.name}
                  </h3>
                  <span className="text-xs text-neutral-400 font-normal block">{friend.socialHandle}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Role:</span>
                  <span className="font-medium text-neutral-800">{friend.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Connection:</span>
                  <span className="px-2 py-0.5 bg-[#FAF4EF] text-[#DF886F] font-bold text-[10px] rounded-md">
                    {friend.connectionType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Status:</span>
                  <span className="font-medium text-neutral-800">{friend.status}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-medium">
                {friend.mutualProjects} mutual projects
              </span>
              <button className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 transition-colors">
                <MessageSquare size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`);

// 5. GalleryView.tsx
save('src/components/views/GalleryView.tsx', `import React from 'react';
import { galleryItems } from '../../data/portfolioData';
import { Calendar, Tag } from 'lucide-react';

export const GalleryView: React.FC = () => {
  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
          Life & Tech Gallery
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Moments captured from developer setups, mountain travels, community hackathons, and celebrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[24px] overflow-hidden border border-neutral-200/70 shadow-soft hover:shadow-card transition-all group flex flex-col"
          >
            <div className="w-full h-52 sm:h-60 overflow-hidden bg-neutral-100 relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                {item.category}
              </span>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-1.5">
                  <Calendar size={12} />
                  <span>{item.date}</span>
                </div>
                <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-[#DF886F] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`);

// 6. TravelView.tsx
save('src/components/views/TravelView.tsx', `import React from 'react';
import { travelDestinations } from '../../data/portfolioData';
import { MapPin, Globe, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const TravelView: React.FC = () => {
  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
          Travel & Expeditions
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Places explored, planned journeys, and bucket-list destinations around the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {travelDestinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-[24px] overflow-hidden border border-neutral-200/70 shadow-soft hover:shadow-card transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-full h-44 overflow-hidden relative bg-neutral-100">
                <img
                  src={dest.coverUrl}
                  alt={dest.place}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={"absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold " +
                    (dest.status === 'Visited'
                      ? 'bg-emerald-500 text-white'
                      : dest.status === 'Planned'
                      ? 'bg-amber-500 text-white'
                      : 'bg-indigo-600 text-white')
                  }
                >
                  {dest.status}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1 text-[#DF886F] text-xs font-bold">
                    <MapPin size={13} />
                    <span>{dest.country}</span>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">{dest.year}</span>
                </div>

                <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-[#DF886F] transition-colors leading-snug">
                  {dest.place}
                </h3>

                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {dest.highlight}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`);

// 7. DreamsView.tsx
save('src/components/views/DreamsView.tsx', `import React from 'react';
import { dreamsList } from '../../data/portfolioData';
import { Sparkles, Target, Compass } from 'lucide-react';

export const DreamsView: React.FC = () => {
  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
          Dreams & Vision Board
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Long-term aspirations, tech breakthroughs, and life milestones being pursued.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {dreamsList.map((dream) => (
          <div
            key={dream.id}
            className="bg-white rounded-[24px] p-6 border border-neutral-200/70 shadow-soft hover:shadow-card transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#DF886F] uppercase tracking-wider">
                  {dream.category}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E4F4F1] text-[#14B8A6]">
                  Target: {dream.targetDate}
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-[#DF886F] transition-colors leading-snug">
                {dream.title}
              </h3>

              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                {dream.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-500 font-medium">Milestone Progress</span>
                <span className="font-bold text-neutral-900">{dream.progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#DF886F] to-[#F59E0B] rounded-full transition-all duration-500"
                  style={{ width: dream.progressPercent + '%' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`);

// 8. TaskView.tsx
save('src/components/views/TaskView.tsx', `import React, { useState } from 'react';
import { tasksList } from '../../data/portfolioData';
import { CheckSquare, Plus, Clock, AlertCircle } from 'lucide-react';
import type { TaskItem } from '../../types';

export const TaskView: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(tasksList);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Completed' ? 'Todo' : 'Completed' }
          : t
      )
    );
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
            Developer Tasks & Goals
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Active sprints, learning goals, and fitness routines.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isDone = task.status === 'Completed';
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={"p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group " +
                (isDone
                  ? 'bg-neutral-50 border-neutral-200 opacity-60'
                  : 'bg-white border-neutral-200 shadow-2xs hover:shadow-soft')
              }
            >
              <div className="flex items-center gap-3">
                <div
                  className={"w-5 h-5 rounded-md flex items-center justify-center border transition-colors " +
                    (isDone
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-neutral-300 group-hover:border-[#DF886F]')
                  }
                >
                  {isDone && <CheckSquare size={13} />}
                </div>
                <div>
                  <h4
                    className={"font-bold text-xs sm:text-sm text-neutral-900 " +
                      (isDone ? 'line-through text-neutral-400' : '')
                    }
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                      {task.category}
                    </span>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Clock size={10} /> {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={"text-[10px] font-bold px-2.5 py-0.5 rounded-full " +
                  (task.priority === 'High'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-amber-50 text-amber-600')
                }
              >
                {task.priority} Priority
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
`);
