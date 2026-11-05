import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import NavbarSidebar from './components/NavbarSidebar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ExploreCategoriesPage from './pages/ExploreCategoriesPage';
import QuizPage from './pages/QuizPage';
import QuizResultsPage from './pages/QuizResultsPage';
import MyProgressPage from './pages/MyProgressPage';
import AchievementsPage from './pages/AchievementsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { Sparkles } from 'lucide-react';

function AppRouter() {
  const { profile, isLoadingAuth, activeRoute } = useApp();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-lg animate-pulse">
          <Sparkles className="w-7 h-7" />
        </div>
        <p className="text-sm font-extrabold text-slate-600">
          Loading NeuroQuiz Global...
        </p>
      </div>
    );
  }

  // Protected Route Guard: Show Authentication Page if not logged in
  if (!profile) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (activeRoute) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Explore':
        return <ExploreCategoriesPage />;
      case 'Quiz':
        return <QuizPage />;
      case 'QuizResults':
        return <QuizResultsPage />;
      case 'Progress':
        return <MyProgressPage />;
      case 'Achievements':
        return <AchievementsPage />;
      case 'Leaderboard':
        return <LeaderboardPage />;
      case 'Profile':
        return <ProfilePage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <NavbarSidebar>{renderPage()}</NavbarSidebar>;
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

