import React, { useState } from 'react';
import type { NavTab, UserProfile, TopPerformer } from './types';
import {
  initialProfile,
  alternateProfiles,
  topPerformersData,
  notificationsData,
} from './data/portfolioData';

import { Sidebar } from './components/sidebar/Sidebar';
import { MobileNav } from './components/sidebar/MobileNav';
import { Header } from './components/header/Header';

import { HeroBanner } from './components/dashboard/HeroBanner';
import { MetricCards } from './components/dashboard/MetricCards';
import { SkillSetCard } from './components/dashboard/SkillSetCard';
import { SocialLinksCard } from './components/dashboard/SocialLinksCard';
import { RecentProjectsCard } from './components/dashboard/RecentProjectsCard';
import { CtaBannerCard } from './components/dashboard/CtaBannerCard';

import { FriendsView } from './components/views/FriendsView';
import { GalleryView } from './components/views/GalleryView';
import { ProjectsView } from './components/views/ProjectsView';
import { VideosView } from './components/views/VideosView';
import { MusicView } from './components/views/MusicView';
import { NotepadView } from './components/views/NotepadView';
import { TravelView } from './components/views/TravelView';
import { DreamsView } from './components/views/DreamsView';
import { TaskView } from './components/views/TaskView';

import { MusicProvider } from './context/MusicContext';
import { FloatingMusicBar } from './components/music/FloatingMusicBar';

import { ContactModal } from './components/modals/ContactModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { SettingsModal } from './components/modals/SettingsModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('Dashboard');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [notifications, setNotifications] = useState(notificationsData);

  // Modals
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TopPerformer | null>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSwitchProfile = (profileKey: string) => {
    if (alternateProfiles[profileKey]) {
      setProfile(alternateProfiles[profileKey]);
    }
  };

  return (
    <MusicProvider>
      <main className="min-h-screen w-full bg-[#FAF7F4] flex flex-col md:flex-row font-sans text-neutral-900 selection:bg-[#14B8A6] selection:text-white relative">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          profile={profile}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Content Area */}
        <section className="flex-1 bg-white p-4 sm:p-6 md:p-7 lg:p-8 flex flex-col justify-between overflow-y-auto min-h-screen">
          <div className="max-w-7xl w-full mx-auto flex flex-col justify-between flex-1 space-y-5 sm:space-y-6">
            
            {/* Top Header */}
            <Header
              currentTab={currentTab}
              unreadCount={unreadCount}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Conditional Content based on Tab */}
            {currentTab === 'Dashboard' ? (
              <div className="space-y-5 sm:space-y-6 pb-6">
                {/* Row 1: Top Hero Greeting Banner */}
                <HeroBanner
                  name="Shubhav Kumar"
                  onExploreClick={() => setCurrentTab('Projects')}
                />

                {/* Row 2: 4 Metric Cards (Profession, Experience, Company, Goal) */}
                <MetricCards />

                {/* Row 3: 3 Column Feature Cards Grid (Desktop: 3 cols, Tablet: 2 cols, Mobile: 1 col) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                  {/* 1. Skill Set Card */}
                  <SkillSetCard onViewAll={() => setCurrentTab('Projects')} />

                  {/* 2. Social Media Links Card */}
                  <SocialLinksCard />

                  {/* 3. Recent Projects Card */}
                  <RecentProjectsCard
                    onViewAll={() => setCurrentTab('Projects')}
                    onSelectProject={(title) => {
                      const found = topPerformersData.find((p) =>
                        p.projectTitle.toLowerCase().includes(title.toLowerCase().split(' ')[0])
                      );
                      if (found) setSelectedProject(found);
                      else setCurrentTab('Projects');
                    }}
                  />
                </div>

                {/* Row 4: Collaboration CTA Banner */}
                <CtaBannerCard onContactClick={() => setIsContactOpen(true)} />
              </div>
            ) : currentTab === 'Friend List' ? (
              <FriendsView />
            ) : currentTab === 'Gallery' ? (
              <GalleryView />
            ) : currentTab === 'Projects' ? (
              <ProjectsView />
            ) : currentTab === 'Videos' ? (
              <VideosView />
            ) : currentTab === 'Music' ? (
              <MusicView />
            ) : currentTab === 'Notepad' ? (
              <NotepadView />
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

        {/* Persistent Floating Music Bar (Plays seamlessly across all tabs) */}
        <FloatingMusicBar
          currentTab={currentTab}
          onNavigateToMusic={() => setCurrentTab('Music')}
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
    </MusicProvider>
  );
};

export default App;
