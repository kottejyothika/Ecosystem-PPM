import React, { useState } from 'react';
import { EcoCampusProvider, useEcoCampus } from './context/EcoCampusContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { WorkerDashboard } from './components/WorkerDashboard';
import { SmartCollectionPage } from './components/SmartCollectionPage';
import { SegregationPage } from './components/SegregationPage';
import { AlternativesPage } from './components/AlternativesPage';
import { RewardsPage } from './components/RewardsPage';
import { CampaignsPage } from './components/CampaignsPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { ReportsPage } from './components/ReportsPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { StationsManagementPage } from './components/StationsManagementPage';
import { StudentsManagementPage } from './components/StudentsManagementPage';
import { EcoTipsPage } from './components/EcoTipsPage';
import { NotificationsPage } from './components/NotificationsPage';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, currentRole } = useEcoCampus();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // When on landing page, display the full landing page without sidebar
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#f7faf8]">
        <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
        <main>
          <LandingPage onOpenAuth={() => setIsAuthOpen(true)} />
        </main>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    );
  }

  // Render view based on context currentView
  const renderCurrentView = () => {
    switch (currentView) {
      case 'student-dashboard':
        return (
          <StudentDashboard onOpenReportModal={() => setIsReportModalOpen(true)} />
        );
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'worker-dashboard':
      case 'worker-tasks':
      case 'collections-history':
        return <WorkerDashboard />;
      case 'smart-collection':
        return (
          <SmartCollectionPage
            initialReportModalOpen={isReportModalOpen}
          />
        );
      case 'segregation':
        return <SegregationPage />;
      case 'alternatives':
        return <AlternativesPage />;
      case 'rewards':
        return <RewardsPage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'analytics':
      case 'impact':
      case 'my-impact':
        return <AnalyticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'stations-management':
        return <StationsManagementPage />;
      case 'students-list':
        return <StudentsManagementPage />;
      case 'eco-tips':
        return <EcoTipsPage />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        // Default role fallback
        if (currentRole === 'admin') return <AdminDashboard />;
        if (currentRole === 'worker') return <WorkerDashboard />;
        return (
          <StudentDashboard onOpenReportModal={() => setIsReportModalOpen(true)} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] flex flex-col">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderCurrentView()}
        </main>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <EcoCampusProvider>
      <AppContent />
    </EcoCampusProvider>
  );
}
