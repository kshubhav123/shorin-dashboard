import React from 'react';
import { MessageSquare, ShoppingCart, Search, Compass, ArrowRight } from 'lucide-react';

interface RecentProjectsCardProps {
  onViewAll?: () => void;
  onSelectProject?: (title: string) => void;
}

export const RecentProjectsCard: React.FC<RecentProjectsCardProps> = ({
  onViewAll,
  onSelectProject,
}) => {
  const projects = [
    {
      id: 'whatsapp-clone',
      title: 'WhatsApp Clone',
      description: 'Real-time messaging app with Socket.io',
      icon: <MessageSquare size={16} className="text-[#14B8A6]" strokeWidth={2} />,
      badgeBg: 'bg-[#E3F5F2]',
      status: 'Live',
      statusClass: 'bg-[#E3F5F2] text-[#0D9488]',
    },
    {
      id: 'ecommerce-store',
      title: 'E-commerce Store',
      description: 'Full stack shop with MERN',
      icon: <ShoppingCart size={16} className="text-[#EF4444]" strokeWidth={2} />,
      badgeBg: 'bg-[#FEE2E2]',
      status: 'Live',
      statusClass: 'bg-[#E3F5F2] text-[#0D9488]',
    },
    {
      id: 'osint-platform',
      title: 'OSINT Platform',
      description: 'Search news, images, videos & more',
      icon: <Search size={16} className="text-[#8B5CF6]" strokeWidth={2} />,
      badgeBg: 'bg-[#EDE9FE]',
      status: 'In Progress',
      statusClass: 'bg-[#EDE9FE] text-[#6D28D9]',
    },
    {
      id: 'tourism-survey',
      title: 'Tourism Survey',
      description: 'MOT - Tourist preference web app',
      icon: <Compass size={16} className="text-[#10B981]" strokeWidth={2} />,
      badgeBg: 'bg-[#D1FAE5]',
      status: 'Completed',
      statusClass: 'bg-[#D1FAE5] text-[#059669]',
    },
  ];

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 flex flex-col justify-between border border-[#EFE5DC]/80 shadow-soft select-none h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            RECENT PROJECTS
          </span>
          <button
            onClick={onViewAll}
            className="text-[12px] font-semibold text-[#14B8A6] hover:text-[#0D9488] flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4 Project Rows */}
        <div className="space-y-2.5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject && onSelectProject(proj.title)}
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF7F4] transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Round Badge */}
                <div
                  className={`w-9 h-9 rounded-xl ${proj.badgeBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                >
                  {proj.icon}
                </div>

                {/* Title & Desc */}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[13px] text-neutral-900 leading-tight group-hover:text-[#DF886F] transition-colors truncate">
                    {proj.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-normal mt-0.5 truncate max-w-[170px] sm:max-w-[200px]">
                    {proj.description}
                  </span>
                </div>
              </div>

              {/* Status Tag */}
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight shrink-0 ${proj.statusClass}`}
              >
                {proj.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentProjectsCard;
