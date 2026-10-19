const fs = require('fs');

// 1. Fix src/data/portfolioData.ts by appending extendedProjects, clientTestimonials, alternateProfiles
const dataContent = fs.readFileSync('src/data/portfolioData.ts', 'utf8');

const extraData = `
export const alternateProfiles: Record<string, UserProfile> = {
  shubhav: initialProfile,
  robert: {
    ...initialProfile,
    name: 'Robert Grant',
    role: 'Marketing Director',
  },
};

export const extendedProjects = [
  {
    id: 'proj-1',
    title: 'Crowz AI Analytics Suite',
    category: 'Product & Web App',
    year: '2025',
    summary: 'A unified metric visualizer and automated reporting tool for creative studios and founders.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'D3.js'],
    stars: 1840,
    demoUrl: 'https://github.com',
    codeUrl: 'https://github.com',
  },
  {
    id: 'proj-2',
    title: 'VentureX Capital Portal',
    category: 'Fintech Platform',
    year: '2024',
    summary: 'Institutional investor portal facilitating seamless capital deployment and real-time ledger tracking.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tags: ['Next.js', 'PostgreSQL', 'GraphQL', 'Tailwind'],
    stars: 920,
    demoUrl: 'https://github.com',
    codeUrl: 'https://github.com',
  },
  {
    id: 'proj-3',
    title: 'Aura Studio Website & CMS',
    category: 'Brand & E-commerce',
    year: '2024',
    summary: 'Award-winning interactive brand experience with 3D fluid simulations and smooth page transitions.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    tags: ['Three.js', 'Framer Motion', 'Tailwind CSS'],
    stars: 1430,
    demoUrl: 'https://github.com',
    codeUrl: 'https://github.com',
  },
];

export const clientTestimonials = [
  {
    id: 'test-1',
    name: 'Elena Rostova',
    title: 'VP of Engineering, FinScale',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    content: 'Shubhav turned our complex dashboard telemetry into a high-performance, modular system. Engineering velocity increased by 40%.',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Marcus Vance',
    title: 'Founder & CEO, HyperCloud',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    content: 'Exceptional software developer with a rare knack for clean code, system architecture, and delightful UI ergonomics.',
    rating: 5,
  },
];
`;

if (!dataContent.includes('alternateProfiles')) {
  fs.writeFileSync('src/data/portfolioData.ts', dataContent + extraData, 'utf8');
}

// 2. Fix AboutAndSkills.tsx
fs.writeFileSync('src/components/dashboard/AboutAndSkills.tsx', `import React from 'react';
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
`, 'utf8');

// 3. Fix FriendsView.tsx
fs.writeFileSync('src/components/views/FriendsView.tsx', `import React from 'react';
import { friendsList } from '../../data/portfolioData';
import { MessageSquare } from 'lucide-react';

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
`, 'utf8');

// 4. Fix GalleryView.tsx
fs.writeFileSync('src/components/views/GalleryView.tsx', `import React from 'react';
import { galleryItems } from '../../data/portfolioData';
import { Calendar } from 'lucide-react';

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
`, 'utf8');

// 5. Fix TravelView.tsx
fs.writeFileSync('src/components/views/TravelView.tsx', `import React from 'react';
import { travelDestinations } from '../../data/portfolioData';
import { MapPin } from 'lucide-react';

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
`, 'utf8');

// 6. Fix DreamsView.tsx
fs.writeFileSync('src/components/views/DreamsView.tsx', `import React from 'react';
import { dreamsList } from '../../data/portfolioData';

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
`, 'utf8');

// 7. Fix TaskView.tsx
fs.writeFileSync('src/components/views/TaskView.tsx', `import React, { useState } from 'react';
import { tasksList } from '../../data/portfolioData';
import { CheckSquare, Clock } from 'lucide-react';
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
`, 'utf8');

console.log('Fixed all views successfully');
