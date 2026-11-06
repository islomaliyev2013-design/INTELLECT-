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
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { Sparkles, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NeuroQuiz ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7FF] text-[#0F172A] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-indigo-100 shadow-elevated space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Qayta tiklash / System Recovery
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kutilmagan xatolik yuz berdi. Ilovani qayta ochish va toza holatda davom ettirish uchun quyidagi tugmani bosing:
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Qayta yuklash (Restart App)</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </ErrorBoundary>
  );
}

