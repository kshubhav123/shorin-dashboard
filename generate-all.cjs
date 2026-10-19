const fs = require('fs');

const sidebarCode = `import React from 'react';
import { NavTab, UserProfile } from '../../types';
import { LogOut, ArrowRight, Sparkles } from 'lucide-react';

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
    { id: 'Insights', label: 'Insights' },
    { id: 'Reports', label: 'Reports' },
    { id: 'Comments', label: 'Comments' },
    { id: 'Channels', label: 'Channels' },
  ];

  return (
    <aside className="w-full md:w-56 lg:w-64 bg-[#F5EEEA] p-6 lg:p-8 flex flex-col justify-between shrink-0 md:rounded-l-[32px] border-b md:border-b-0 md:border-r border-[#EFE5DC]/60 select-none">
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => onSelectTab('Dashboard')}>
          <div className="grid grid-cols-2 gap-1 w-5 h-5 items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-neutral-900">
            Crowz
          </span>
        </div>

        {/* Profile Card */}
        <div 
          onClick={onOpenSettings}
          className="flex flex-col items-center text-center mb-10 group cursor-pointer"
          title="Click to customize profile"
        >
          <div className="relative mb-3.5">
            <div className="w-18 h-18 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#E89982] to-[#F59E0B] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            {profile.availableForWork && (
              <span 
                className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#F5EEEA] rounded-full" 
                title="Available for projects"
              />
            )}
          </div>
          <h2 className="font-display font-bold text-[17px] text-neutral-900 tracking-tight leading-snug group-hover:text-[#DF886F] transition-colors">
            {profile.name}
          </h2>
          <p className="text-[13px] text-neutral-400 font-normal mt-0.5 tracking-tight">
            {profile.role}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center justify-between text-left px-2 py-1 rounded-lg transition-all duration-200 group \${
                  isActive
                    ? 'text-neutral-900 font-bold'
                    : 'text-neutral-500 font-normal hover:text-neutral-900 hover:translate-x-1'
                }`}
              >
                <span className="text-[15px] tracking-tight">{item.label}</span>
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

      {/* Bottom Action (Log out / Contact) */}
      <div className="pt-8 border-t border-[#EFE5DC]/80 mt-6">
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
`;

const mobileNavCode = `import React from 'react';
import { NavTab } from '../../types';
import { LayoutDashboard, Compass, FileText, MessageSquare, Share2 } from 'lucide-react';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'Dashboard', label: 'Dash', icon: <LayoutDashboard size={18} />, badge: '1' },
    { id: 'Insights', label: 'Insights', icon: <Compass size={18} /> },
    { id: 'Reports', label: 'Reports', icon: <FileText size={18} /> },
    { id: 'Comments', label: 'Reviews', icon: <MessageSquare size={18} /> },
    { id: 'Channels', label: 'Social', icon: <Share2 size={18} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5EEEA]/95 backdrop-blur-md border-t border-[#EFE5DC] px-4 py-2 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors \${
              isActive ? 'text-neutral-900 font-bold' : 'text-neutral-400 font-medium'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
`;

fs.writeFileSync('src/components/sidebar/Sidebar.tsx', sidebarCode, 'utf8');
fs.writeFileSync('src/components/sidebar/MobileNav.tsx', mobileNavCode, 'utf8');
console.log('Wrote Sidebar & MobileNav');
