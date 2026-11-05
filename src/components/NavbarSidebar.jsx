import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  BarChart3,
  Award,
  Trophy,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Lock,
  Unlock,
  Flame,
  Globe,
  Play,
  ChevronDown,
  QrCode,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/translations';
import { getCountryByCode } from '../data/curriculum';
import MobileQrModal from './MobileQrModal';

export default function NavbarSidebar({ children }) {
  const {
    profile,
    levelInfo,
    uiLang,
    setUiLang,
    t,
    activeRoute,
    navigate,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  if (!profile || !levelInfo) {
    return <>{children}</>;
  }

  const country = getCountryByCode(profile.country_code, uiLang);

  const navItems = [
    { id: 'Dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'Explore', label: t.nav.explore, icon: Compass },
    { id: 'Progress', label: t.nav.progress, icon: BarChart3 },
    { id: 'Achievements', label: t.nav.achievements, icon: Award },
    {
      id: 'Leaderboard',
      label: t.nav.leaderboard,
      icon: Trophy,
      badge: levelInfo.leaderboardUnlocked ? t.liveBadge : t.level10Badge,
      locked: !levelInfo.leaderboardUnlocked,
    },
    { id: 'Profile', label: t.nav.profile, icon: User },
    { id: 'Settings', label: t.nav.settings, icon: Settings },
  ];

  const handleNavClick = (routeId) => {
    navigate(routeId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] text-[#0F172A] flex flex-col lg:flex-row">
      {/* DESKTOP FIXED SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[272px] lg:fixed lg:inset-y-0 bg-white border-r border-indigo-100/80 shadow-soft z-30 select-none">
        {/* Brand Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
          <button
            onClick={() => handleNavClick('Dashboard')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  NeuroQuiz
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200/60">
                  Global
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[160px]">
                {t.learnLevelCompete}
              </p>
            </div>
          </button>
        </div>

        {/* User Mini Level Summary Card */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-blue-50/80 border border-indigo-100">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-11 h-11 rounded-xl object-cover bg-white border-2 border-indigo-200 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-slate-900 truncate">
                  {profile.full_name}
                </p>
                <span title={country.name} className="text-sm">
                  {country.flag}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">@{profile.username}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-indigo-100/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-indigo-700 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {uiLang === 'uz' ? `${levelInfo.level}-daraja` : `${t.levelLabel} ${levelInfo.level}`}
              </span>
              <span className="font-mono font-semibold text-slate-700">
                {levelInfo.totalXp} / {levelInfo.nextLevelXp} XP
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-indigo-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {levelInfo.title?.[uiLang] || levelInfo.title?.en}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeRoute === item.id ||
              (item.id === 'Explore' && (activeRoute === 'Quiz' || activeRoute === 'QuizResults'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:bg-indigo-50/70 hover:text-indigo-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.locked
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {item.locked ? (
                      <Lock className="w-2.5 h-2.5" />
                    ) : (
                      <Unlock className="w-2.5 h-2.5" />
                    )}
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Start Learning Button & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => handleNavClick('Explore')}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-indigo-700" />
            {t.dashboard.startLearning}
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.nav.logout}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 lg:pl-[272px] flex flex-col min-h-screen">
        {/* TOP STICKY HEADER */}
        <header className="sticky top-0 z-20 h-16 lg:h-20 bg-white/85 backdrop-blur-md border-b border-indigo-100/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Mobile Brand & Hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleNavClick('Dashboard')}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900">NeuroQuiz</span>
            </button>
          </div>

          {/* Desktop Page Breadcrumb / Tagline */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {t.brandTagline}
            </span>
          </div>

          {/* Right Controls: Language Switcher, XP Pill, Level Badge, Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Mobile / QR Code Launcher Button */}
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Telefonda ochish (QR Kod)"
            >
              <QrCode className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Telefonda ochish</span>
            </button>

            {/* Trilingual UI Language Selector (UZ / EN / RU) */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1 hidden sm:inline" />
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setUiLang(lang.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    uiLang === lang.code
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={lang.label}
                >
                  <span className="mr-1">{lang.flag}</span>
                  {lang.short}
                </button>
              ))}
            </div>

            {/* Live XP & Level Pill */}
            <button
              onClick={() => handleNavClick('Progress')}
              className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/70 hover:border-indigo-300 transition-all"
            >
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-xs">
                {t.levelAbbr}{levelInfo.level}
              </span>
              <span className="font-mono font-bold text-xs text-slate-800">
                {levelInfo.totalXp} XP
              </span>
            </button>

            {/* User Profile Avatar Button with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
                title={profile.full_name}
              >
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-8 h-8 rounded-lg object-cover bg-indigo-50 border border-indigo-100"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {profile.username}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {country.flag} {country.name}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-indigo-100 shadow-elevated p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-extrabold text-slate-900 truncate">
                        {profile.full_name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        @{profile.username}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-extrabold">
                        {t.levelAbbr}{levelInfo.level} • {levelInfo.totalXp} XP
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleNavClick('Profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{t.nav.profile}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleNavClick('Settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>{t.nav.settings}</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Direct Quick Logout Button in Top Header */}
            <button
              type="button"
              onClick={logout}
              title={t.nav.logout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/80 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">{t.nav.logout}</span>
            </button>
          </div>
        </header>

        {/* MOBILE DRAWER SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-2xl z-10">
              <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-base text-slate-900">NeuroQuiz</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-indigo-50/70 border-b border-indigo-100">
                <div className="flex items-center gap-3">
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-10 h-10 rounded-xl bg-white border border-indigo-200"
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-900">
                      {profile.full_name} {country.flag}
                    </p>
                    <p className="text-xs text-indigo-700 font-semibold">
                      {uiLang === 'uz' ? `${levelInfo.level}-daraja` : `${t.levelLabel} ${levelInfo.level}`} • {levelInfo.totalXp} XP
                    </p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav.logout}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* MOBILE QR CODE MODAL */}
      <MobileQrModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </div>
  );
}

