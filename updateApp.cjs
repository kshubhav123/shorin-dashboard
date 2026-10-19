const fs = require('fs');

const appCode = `import React, { useState } from 'react';
import type { NavTab, UserProfile, TopPerformer, ChannelItem, StatItem } from './types';
import {
  initialProfile,
  alternateProfiles,
  defaultStats,
  weeklyActivityData,
  monthlyActivityData,
  topPerformersData,
  channelsData,
  notificationsData,
} from './data/portfolioData';

import { Sidebar } from './components/sidebar/Sidebar';
import { MobileNav } from './components/sidebar/MobileNav';
import { Header } from './components/header/Header';
import { StatCards } from './components/stats/StatCards';
import { UpgradeCard } from './components/promo/UpgradeCard';
import { AboutAndSkills } from './components/dashboard/AboutAndSkills';
import { ActivityChart } from './components/activity/ActivityChart';
import { TopPerformers } from './components/performers/TopPerformers';
import { ChannelsSection } from './components/channels/ChannelsSection';

import { FriendsView } from './components/views/FriendsView';
import { GalleryView } from './components/views/GalleryView';
import { ProjectsView } from './components/views/ProjectsView';
import { TravelView } from './components/views/TravelView';
import { DreamsView } from './components/views/DreamsView';
import { TaskView } from './components/views/TaskView';

import { ContactModal } from './components/modals/ContactModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { SettingsModal } from './components/modals/SettingsModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('Dashboard');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  const [selectedRange, setSelectedRange] = useState<string>('01-07 May');
  const [notifications, setNotifications] = useState(notificationsData);

  // Modals
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TopPerformer | null>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    if (range === 'Last 30 Days' || range === 'All Time') {
      setStats([
        { ...defaultStats[0], value: '114,8m' },
        { ...defaultStats[1], value: '890,4k' },
        { ...defaultStats[2], value: '8,2k' },
      ]);
    } else {
      setStats(defaultStats);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSwitchProfile = (profileKey: string) => {
    if (alternateProfiles[profileKey]) {
      setProfile(alternateProfiles[profileKey]);
    }
  };

  const handleChannelClick = (channel: ChannelItem) => {
    window.open(channel.url, '_blank');
  };

  const handleFullStatsClick = () => {
    setCurrentTab('Projects');
  };

  const currentActivityData = selectedRange === 'Last 30 Days' || selectedRange === 'All Time'
    ? monthlyActivityData
    : weeklyActivityData;

  return (
    <main className="min-h-screen w-full bg-white flex flex-col md:flex-row font-sans">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <section className="flex-1 bg-white p-5 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto min-h-screen">
        <div className="max-w-6xl w-full mx-auto flex flex-col justify-between flex-1 space-y-6">
          
          {/* Top Header */}
          <Header
            currentTab={currentTab}
            unreadCount={unreadCount}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Conditional Content based on Tab */}
          {currentTab === 'Dashboard' ? (
            <div className="space-y-6 md:space-y-7">
              {/* Row 1: Metrics (Left) & Promo Card (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Metrics Stats Columns */}
                <div className="lg:col-span-7">
                  <StatCards
                    stats={stats}
                    onStatClick={() => {}}
                  />
                </div>

                {/* Top Right "Upgrade Your Crowd" Card */}
                <div className="lg:col-span-5">
                  <UpgradeCard
                    profile={profile}
                    onHireClick={() => setIsContactOpen(true)}
                  />
                </div>
              </div>

              {/* Row 2: About Me (3-4 lines) + Skill Set + Profession */}
              <AboutAndSkills profile={profile} />

              {/* Row 3: Activity Chart (Left) & Top Performers (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-1">
                {/* Middle Left: Activity Chart */}
                <div className="lg:col-span-7">
                  <ActivityChart
                    data={currentActivityData}
                    selectedRange={selectedRange}
                    onSelectRange={handleRangeChange}
                  />
                </div>

                {/* Middle Right: Top Performers */}
                <div className="lg:col-span-5 pt-1 lg:pt-0">
                  <TopPerformers
                    performers={topPerformersData}
                    onSelectPerformer={(item) => setSelectedProject(item)}
                    onViewMore={() => setCurrentTab('Projects')}
                  />
                </div>
              </div>

              {/* Row 4: Bottom Channels Section */}
              <div className="pt-2">
                <ChannelsSection
                  channels={channelsData}
                  onChannelClick={handleChannelClick}
                  onFullStatsClick={handleFullStatsClick}
                />
              </div>
            </div>
          ) : currentTab === 'Friend List' ? (
            <FriendsView />
          ) : currentTab === 'Gallery' ? (
            <GalleryView />
          ) : currentTab === 'Projects' ? (
            <ProjectsView />
          ) : currentTab === 'Travel' ? (
            <TravelView />
          ) : currentTab === 'Dreams' ? (
            <DreamsView />
          ) : (
            <TaskView />
          )}
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Interactive Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        profile={profile}
      />

      <ProjectModal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentProfile={profile}
        onSwitchProfile={handleSwitchProfile}
      />
    </main>
  );
};

export default App;
`;

fs.writeFileSync('src/App.tsx', appCode, 'utf8');
console.log('Updated src/App.tsx successfully');
