import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  X,
  Mail,
  Lock,
  User,
  AtSign,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Trophy,
  BookOpen,
  Code,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/translations';
import { COUNTRIES, getCountryByCode } from '../data/curriculum';

const AVATAR_PRESETS = [
  '/avatars/avatar-1.png',
  '/avatars/avatar-2.png',
  '/avatars/avatar-3.png',
  '/avatars/avatar-4.png',
  '/avatars/avatar-5.png',
  '/avatars/avatar-6.png',
  '/avatars/avatar-7.png',
  '/avatars/avatar-8.png',
];

const WORKSPACE_BG_IMAGE =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';

export default function AuthPage() {
  const { login, register, uiLang, setUiLang, t } = useApp();

  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('register')) {
      return 'register';
    }
    return 'login';
  });

  // Random session seed so browsers never autofill saved credentials (like joha@gmail.com)
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
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotNotice, setForgotNotice] = useState('');

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
    setForgotNotice('');
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
    setForgotNotice('');

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
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#070d19] overflow-hidden select-none">
      {/* Ambient Background Image & Glowing Gradient Orbs */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 blur-md scale-105 pointer-events-none"
        style={{ backgroundImage: `url(${WORKSPACE_BG_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#060c18]/95 via-[#0b172e]/90 to-[#070d19]/95 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-blue-600/25 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-indigo-600/25 blur-[130px] pointer-events-none" />

      {/* MAIN PREMIUM OXYY SPLIT-SCREEN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[1080px] min-h-[640px] bg-white rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.65)] ring-1 ring-white/15 grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
      >
        {/* ================= LEFT BLUE HERO PANEL (5 COLUMNS / ~46%) ================= */}
        <div className="lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-10 lg:p-12 text-white overflow-hidden min-h-[300px] lg:min-h-[640px]">
          {/* Workspace Photo Background */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700 pointer-events-none"
            style={{ backgroundImage: `url(${WORKSPACE_BG_IMAGE})` }}
          />
          {/* Rich Multi-Layer Electric Blue & Indigo Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0055ff]/90 via-[#1d4ed8]/88 to-[#3730a3]/92 pointer-events-none" />

          {/* Decorative Glass Circles inside Left Panel */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-sky-400/20 blur-2xl pointer-events-none" />

          {/* Top Bar: Clean Seamless Icon + Oxyy Wordmark + Language & Music */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              {/* Seamless Custom Icon Badge (no ugly white sticker border!) */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#2563eb] flex items-center justify-center shadow-lg shadow-blue-950/40 ring-2 ring-white/25">
                <Sparkles className="w-5 h-5 text-white drop-shadow" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight text-white block leading-none">
                  Oxyy
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-100/80">
                  NeuroQuiz Global
                </span>
              </div>
            </div>

            {/* Right Controls: Language Pill */}
            <div className="flex items-center gap-1.5">
              {/* Language Pill */}
              <div className="flex items-center bg-white/15 backdrop-blur-md p-1 rounded-xl border border-white/20">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setUiLang(l.code)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      uiLang === l.code
                        ? 'bg-white text-[#0055ff] shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {l.short}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Hero Content */}
          <div className="relative z-10 my-auto py-8 lg:py-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-bold uppercase tracking-wider text-blue-50">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive Learning Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {mode === 'login' ? 'Welcome back!' : 'Join Oxyy Today!'}
            </h1>

            <p className="text-sm sm:text-[15px] text-blue-50/90 leading-relaxed font-normal">
              {mode === 'login'
                ? 'We are glad to see you again! Get access to your Quizzes, Achievements and Personalized Recommendations.'
                : 'Create your independent student profile at Level 1 with 0 XP and start mastering new skills today.'}
            </p>

            {/* 3 Glassmorphic Feature Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <Code className="w-4 h-4 text-sky-300 mb-1.5" />
                <div className="text-sm font-extrabold text-white">53+</div>
                <div className="text-[11px] text-blue-100/80">Mavzular</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <BookOpen className="w-4 h-4 text-amber-300 mb-1.5" />
                <div className="text-sm font-extrabold text-white">3 Tilda</div>
                <div className="text-[11px] text-blue-100/80">UZ • EN • RU</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <Trophy className="w-4 h-4 text-emerald-300 mb-1.5" />
                <div className="text-sm font-extrabold text-white">6 Fan</div>
                <div className="text-[11px] text-blue-100/80">Yutuqlar</div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-100/85">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Supabase Cloud • 100% Xavfsiz</span>
            </div>
            <span className="font-mono text-[11px] text-white/70">v2.0</span>
          </div>
        </div>

        {/* ================= RIGHT WHITE FORM PANEL (7 COLUMNS / ~54%) ================= */}
        <div className="lg:col-span-7 bg-white flex flex-col justify-center px-6 py-8 sm:px-12 lg:px-14">
          <div className="w-full max-w-[420px] mx-auto">
            {/* Top Mode Switcher Pill */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-7 border border-slate-200/60">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#0055ff] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-[#0055ff] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                /* ================= LOG IN FORM ================= */
                <motion.div
                  key="oxyy-login"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Log In
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Shaxsiy hisobingizga kiring va o‘qishni davom ettiring
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {forgotNotice && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-[#0055ff] text-xs font-medium">
                      {forgotNotice}
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

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-[#0055ff] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
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
                          placeholder="Enter Your Email"
                          className="w-full pl-10 pr-9 py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 text-sm font-medium focus:border-[#0055ff] focus:ring-4 focus:ring-[#0055ff]/10 outline-none transition-all"
                        />
                        {loginIdentifier && (
                          <button
                            type="button"
                            onClick={() => setLoginIdentifier('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-[#0055ff] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
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
                          placeholder="Enter Password"
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 text-sm font-medium focus:border-[#0055ff] focus:ring-4 focus:ring-[#0055ff]/10 outline-none transition-all"
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

                    {/* Remember Me & Forgot Password ? */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-[#0055ff] focus:ring-[#0055ff] cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-600">
                          Remember Me
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setForgotNotice(
                            "Yangi hisob ochish uchun 'Sign Up' bo'limiga o'ting yoki emailingiz orqali tizimga kiring."
                          )
                        }
                        className="text-xs text-[#0055ff] hover:text-blue-700 hover:underline font-bold cursor-pointer"
                      >
                        Forgot Password ?
                      </button>
                    </div>

                    {/* Primary Gradient Blue Login Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0062ff] via-[#2563eb] to-[#4f46e5] hover:from-[#0051d5] hover:to-[#4338ca] text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/45 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer mt-2"
                    >
                      <span>{isSubmitting ? t.auth.processing : 'Login'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Bottom Switch to Sign Up */}
                  <div className="mt-7 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="text-[#0055ff] hover:underline font-bold ml-1 cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ================= SIGN UP FORM (WITH AVATAR PICKER AT THE END) ================= */
                <motion.div
                  key="oxyy-register"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-4">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Sign Up
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      1-daraja va 0 XP bilan yangi o‘quvchi profilini yarating
                    </p>
                  </div>

                  {error && (
                    <div className="mb-3.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-3">
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative group">
                        <User className="w-4 h-4 text-slate-400 group-focus-within:text-[#0055ff] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          name={`reg_fname_${fieldSeed}`}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter Your Full Name"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:border-[#0055ff] focus:ring-4 focus:ring-[#0055ff]/10 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Username & Country */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Username
                        </label>
                        <div className="relative group">
                          <AtSign className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#0055ff] absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
                          <input
                            type="text"
                            required
                            autoComplete="off"
                            name={`reg_uname_${fieldSeed}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                            className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:border-[#0055ff] focus:ring-4 focus:ring-[#0055ff]/10 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Country
                        </label>
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-800 text-xs sm:text-sm font-medium focus:border-[#0055ff] outline-none transition-all cursor-pointer"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {getCountryByCode(c.code, uiLang).name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-[#0055ff] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
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
                          placeholder="Enter Your Email"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:border-[#0055ff] focus:ring-4 focus:ring-[#0055ff]/10 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Password & Confirm Password (2 marta parol kiritish) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Password
                        </label>
                        <div className="relative group">
                          <Lock className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#0055ff] absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
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
                            placeholder="Enter Password"
                            className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:border-[#0055ff] focus:ring-4 focus:ring-[#0055ff]/10 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showRegPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <Lock className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#0055ff] absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
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
                            placeholder="Repeat Password"
                            className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:border-[#0055ff] focus:ring-4 focus:ring-[#0055ff]/10 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* AVATAR PICKER AT THE END (login va 2 marta paroldan keyin) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.auth.selectAvatar || 'Choose Your Avatar'}
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-inner">
                        {AVATAR_PRESETS.map((avatar, idx) => {
                          const isSelected = selectedAvatar === avatar;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedAvatar(avatar)}
                              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'border-[#0055ff] ring-3 ring-[#0055ff]/25 scale-105 shadow-md shadow-blue-500/20'
                                  : 'border-white hover:border-blue-300 hover:scale-105 shadow-sm'
                              }`}
                            >
                              <img
                                src={avatar}
                                alt={`3D Avatar ${idx + 1}`}
                                className="w-full h-full object-cover rounded-xl"
                              />
                              {isSelected && (
                                <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#0055ff] text-white rounded-full flex items-center justify-center shadow-md border border-white">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Primary Gradient Blue Sign Up Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0062ff] via-[#2563eb] to-[#4f46e5] hover:from-[#0051d5] hover:to-[#4338ca] text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/45 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer mt-2"
                    >
                      <span>{isSubmitting ? t.auth.processing : 'Sign Up'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Bottom Switch to Log In */}
                  <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-[#0055ff] hover:underline font-bold ml-1 cursor-pointer"
                    >
                      Log In
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
