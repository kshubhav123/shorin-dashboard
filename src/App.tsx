import React, { useState } from 'react';
import type { NavTab, UserProfile, TopPerformer } from './types';
import {
  initialProfile,
  alternateProfiles,
  notificationsData,
} from './data/portfolioData';

import { Sidebar } from './components/sidebar/Sidebar';
import { MobileNav } from './components/sidebar/MobileNav';
import { Header } from './components/header/Header';

import { HeroBanner } from './components/dashboard/HeroBanner';
import { DashboardMusicCard } from './components/dashboard/DashboardMusicCard';
import { DashboardNotesCard } from './components/dashboard/DashboardNotesCard';

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
import { PasswordLockScreen } from './components/auth/PasswordLockScreen';
import { AIVoiceAssistant } from './components/ai/AIVoiceAssistant';

export const App: React.FC = () => {
  // Authentication Lock Screen state (persisted in sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('crowz_auth_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('Dashboard');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [notifications, setNotifications] = useState(notificationsData);

  // Modals
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TopPerformer | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSwitchProfile = (profileKey: string) => {
    if (alternateProfiles[profileKey]) {
      setProfile(alternateProfiles[profileKey]);
    }
  };

  const handleUnlock = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('crowz_auth_unlocked');
      sessionStorage.removeItem('crowz_auth_token');
    } catch {}
    setIsAuthenticated(false);
  };

  // If locked, render ONLY the PasswordLockScreen. Zero dashboard DOM nodes exist until unlocked!
  if (!isAuthenticated) {
    return <PasswordLockScreen onUnlock={handleUnlock} />;
  }

  return (
    <MusicProvider>
      <main className="min-h-screen w-full bg-[#FAF7F4] flex flex-col md:flex-row font-sans text-neutral-900 selection:bg-[#14B8A6] selection:text-white relative">
        {/* Left Sidebar (Desktop fixed + Mobile off-canvas drawer) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsMobileMenuOpen(false);
          }}
          profile={profile}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <section className="flex-1 bg-white p-3.5 sm:p-6 md:p-7 lg:p-8 flex flex-col justify-between overflow-y-auto min-h-screen pb-24 md:pb-8">
          <div className="max-w-7xl w-full mx-auto flex flex-col justify-between flex-1 space-y-4 sm:space-y-6">
            
            {/* Top Header */}
            <Header
              currentTab={currentTab}
              unreadCount={unreadCount}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
              onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
            />

            {/* Conditional Content based on Tab */}
            {currentTab === 'Dashboard' ? (
              <div className="space-y-5 sm:space-y-6 pb-6">
                {/* Row 1: Top Hero Greeting Banner */}
                <HeroBanner
                  name="Shubhav Kumar"
                  onExploreClick={() => setCurrentTab('Projects')}
                />

                {/* Responsive Music Player (Firstly) & Quick Notepad Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
                  {/* 1. Live Responsive Music Player Card (Firstly) */}
                  <DashboardMusicCard
                    onNavigateToMusic={() => setCurrentTab('Music')}
                  />

                  {/* 2. Quick Notepad / Add Note Card */}
                  <DashboardNotesCard
                    onNavigateToNotepad={() => setCurrentTab('Notepad')}
                    onOpenAddModal={() => setCurrentTab('Notepad')}
                  />
                </div>
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

        {/* Interactive AI Voice Assistant (Oral voice control copilot) */}
        <AIVoiceAssistant
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onCloseModals={() => {
            setIsContactOpen(false);
            setIsSettingsOpen(false);
            setIsNotificationsOpen(false);
            setSelectedProject(null);
          }}
          onLogout={handleLogout}
          isOpenExternal={isAIAssistantOpen}
          onCloseExternal={() => setIsAIAssistantOpen(false)}
        />
      </main>
    </MusicProvider>
  );
};

export default App;
