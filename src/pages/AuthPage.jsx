import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Code,
  BookOpen,
  Calculator,
  Trophy,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  LogIn,
  UserPlus,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/translations';
import { COUNTRIES, getCountryByCode } from '../data/curriculum';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Aiden&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Leo&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Maya&backgroundColor=d1d4f9',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Nora&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Kai&backgroundColor=b6e3f4',
];

export default function AuthPage() {
  const { login, register, uiLang, setUiLang, t } = useApp();

  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('register')) {
      return 'register';
    }
    return 'login';
  });

  // Random session seed so browsers never match previous saved credential forms
  const [fieldSeed] = useState(() => Math.random().toString(36).slice(2, 9));

  // Anti-autofill state guards: inputs remain readOnly on initial mount so Chrome skips them
  const [loginUserActive, setLoginUserActive] = useState(false);
  const [loginPassActive, setLoginPassActive] = useState(false);
  const [regEmailActive, setRegEmailActive] = useState(false);
  const [regPassActive, setRegPassActive] = useState(false);

  // Registration form state (clean empty initial states)
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [countryCode, setCountryCode] = useState('UZ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state (guaranteed 100% clean empty initial states)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Force clean inputs so Chrome never leaves ghost or autofilled credentials
  useEffect(() => {
    setLoginIdentifier('');
    setLoginPassword('');
    const t1 = setTimeout(() => {
      setLoginIdentifier('');
      setLoginPassword('');
    }, 50);
    const t2 = setTimeout(() => {
      setLoginIdentifier('');
      setLoginPassword('');
    }, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mode]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('register')) {
        setMode('register');
      } else {
        setMode('login');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setLoginIdentifier('');
    setLoginPassword('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setLoginUserActive(false);
    setLoginPassActive(false);
    setRegEmailActive(false);
    setRegPassActive(false);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState(null, '', `/${newMode}`);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setError(t.auth.fillRequired);
      return;
    }

    if (password.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        countryCode,
        avatarUrl: selectedAvatar,
      });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setError(t.auth.fillRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        identifier: loginIdentifier.trim(),
        email: loginIdentifier.trim(),
        username: loginIdentifier.trim(),
        password: loginPassword,
        rememberMe,
      });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] text-[#0F172A] flex flex-col lg:flex-row">
      {/* LEFT SHOWCASE PANEL */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative Gradient Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        {/* Top Bar: Brand + Language Switcher */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight">NeuroQuiz Global</span>
              <span className="block text-xs text-indigo-200">
                {t.brandTagline}
              </span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/15">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setUiLang(l.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  uiLang === l.code
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-indigo-100 hover:text-white'
                }`}
              >
                {l.flag} {l.short}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Headline & 4 Categories */}
        <div className="relative z-10 my-10 lg:my-0 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            {t.auth.heroBadge}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {t.auth.heroTitle}
          </h1>

          <p className="text-indigo-100/85 text-base sm:text-lg max-w-xl leading-relaxed">
            {t.auth.heroDesc}
          </p>

          {/* 4 Category Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-200 shrink-0">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  {t.auth.categories?.programmingTitle || 'Programming'}
                </h3>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  {t.auth.categories?.programmingDesc || 'HTML, CSS, React JS'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/30 flex items-center justify-center text-rose-200 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  {t.auth.categories?.russianTitle || 'Russian Language'}
                </h3>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  {t.auth.categories?.russianDesc || 'Alphabet, Vocabulary, Grammar'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/30 flex items-center justify-center text-sky-200 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  {t.auth.categories?.englishTitle || 'English Language'}
                </h3>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  {t.auth.categories?.englishDesc || 'Vocabulary, Grammar, Tenses'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-200 shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  {t.auth.categories?.mathTitle || 'Mathematics'}
                </h3>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  {t.auth.categories?.mathDesc || 'Fractions, Algebra, Geometry'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Guarantee Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.auth.isolatedNotice}</span>
          </div>
          <span className="font-mono text-indigo-300">Supabase Auth + PostgreSQL</span>
        </div>
      </div>

      {/* RIGHT AUTHENTICATION PANEL */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/40 p-7 sm:p-9">
          {/* Tab Switcher: Login vs Register */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 rounded-2xl mb-7">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{t.auth.goToLogin}</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.auth.goToRegister}</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'register' ? (
              /* ================= MODE: REGISTER (RO'YXATDAN O'TISH) ================= */
              <motion.div
                key="register-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {t.auth.createAccount}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1.5">
                    {t.auth.registerSubtitle}
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-4">
                  {/* Invisible decoy traps to swallow Chrome autofill */}
                  <div
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      height: 0,
                      width: 0,
                      overflow: 'hidden',
                      pointerEvents: 'none',
                      zIndex: -1,
                    }}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <input type="text" name="chrome_reg_user_decoy" tabIndex={-1} autoComplete="off" defaultValue="" />
                    <input type="password" name="chrome_reg_pass_decoy" tabIndex={-1} autoComplete="off" defaultValue="" />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.auth.fullName}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        name={`reg_fname_${fieldSeed}`}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t.auth.fullNamePlaceholder}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 outline-none text-sm font-medium transition-all"
                      />
                    </div>
                  </div>

                  {/* Username & Country Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        {t.auth.username}
                      </label>
                      <div className="relative">
                        <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          name={`reg_uname_${fieldSeed}`}
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder={t.auth.usernamePlaceholder}
                          className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 outline-none text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        {t.auth.country}
                      </label>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none text-sm font-medium transition-all cursor-pointer"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {getCountryByCode(c.code, uiLang).name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Email / Login */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.auth.email}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        readOnly={!regEmailActive}
                        onFocus={() => setRegEmailActive(true)}
                        onClick={() => setRegEmailActive(true)}
                        autoComplete="off"
                        name={`reg_email_${fieldSeed}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.auth.emailPlaceholder}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 outline-none text-sm font-medium transition-all"
                      />
                    </div>
                  </div>

                  {/* Password (1-marta) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.auth.password}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        readOnly={!regPassActive}
                        onFocus={() => setRegPassActive(true)}
                        onClick={() => setRegPassActive(true)}
                        autoComplete="new-password"
                        name={`reg_pwd_${fieldSeed}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.auth.passwordPlaceholder}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 outline-none text-sm font-medium transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showRegPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (2-marta kiritish) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.auth.confirmPassword}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        readOnly={!regPassActive}
                        onFocus={() => setRegPassActive(true)}
                        onClick={() => setRegPassActive(true)}
                        autoComplete="new-password"
                        name={`reg_conf_${fieldSeed}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t.auth.confirmPasswordPlaceholder}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 outline-none text-sm font-medium transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* AVATAR TANLASH: Parol va logindan so'ng oxirida */}
                  <div className="pt-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      {t.auth.selectAvatar}
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                      {AVATAR_PRESETS.map((avatar, idx) => {
                        const isSelected = selectedAvatar === avatar;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedAvatar(avatar)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                              isSelected
                                ? 'border-indigo-600 ring-2 ring-indigo-500/40 scale-105 bg-indigo-50'
                                : 'border-transparent hover:border-slate-300'
                            }`}
                          >
                            <img
                              src={avatar}
                              alt={`Avatar ${idx + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            {isSelected && (
                              <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Level 1 & Isolated Progress Guarantee */}
                  <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-3 text-xs text-indigo-900 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span>{t.auth.isolatedNotice}</span>
                  </div>

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    <span>
                      {isSubmitting ? t.auth.processing : t.auth.registerBtn}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
                  {t.auth.haveAccount}{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 ml-1 cursor-pointer"
                  >
                    {t.auth.goToLogin}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ================= MODE: LOGIN (TIZIMGA KIRISH - ZERO JOHA AUTOFILL) ================= */
              <motion.div
                key="login-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {t.auth.welcomeBack}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1.5">
                    {t.auth.loginSubtitle}
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
                  {/* Invisible decoy traps to swallow Chrome autofill */}
                  <div
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      height: 0,
                      width: 0,
                      overflow: 'hidden',
                      pointerEvents: 'none',
                      zIndex: -1,
                    }}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <input type="text" name="chrome_decoy_user_trap" tabIndex={-1} autoComplete="off" defaultValue="" />
                    <input type="password" name="chrome_decoy_pass_trap" tabIndex={-1} autoComplete="off" defaultValue="" />
                  </div>

                  {/* Email or Username */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.auth.loginIdentifier || t.auth.email}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        readOnly={!loginUserActive}
                        onFocus={() => setLoginUserActive(true)}
                        onClick={() => setLoginUserActive(true)}
                        autoComplete="off"
                        name={`login_id_${fieldSeed}`}
                        id={`login_id_${fieldSeed}`}
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder={t.auth.loginIdentifierPlaceholder || t.auth.emailPlaceholder}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 outline-none text-sm font-medium transition-all"
                      />
                      {loginIdentifier && (
                        <button
                          type="button"
                          onClick={() => setLoginIdentifier('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
                          title="Tozalash"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.auth.password}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        readOnly={!loginPassActive}
                        onFocus={() => setLoginPassActive(true)}
                        onClick={() => setLoginPassActive(true)}
                        autoComplete="new-password"
                        name={`login_pwd_${fieldSeed}`}
                        id={`login_pwd_${fieldSeed}`}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder={t.auth.passwordPlaceholder}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 outline-none text-sm font-medium transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-600">
                        {t.auth.rememberMe}
                      </span>
                    </label>
                  </div>

                  {/* Login Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    <span>{isSubmitting ? t.auth.processing : t.auth.loginBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
                  {t.auth.noAccount}{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 ml-1 cursor-pointer"
                  >
                    {t.auth.goToRegister}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
