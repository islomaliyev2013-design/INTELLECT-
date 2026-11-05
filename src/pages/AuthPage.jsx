import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  AtSign,
  Globe,
  Code,
  BookOpen,
  Calculator,
  Trophy,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/translations';
import { COUNTRIES } from '../data/curriculum';

export default function AuthPage() {
  const { login, register, uiLang, setUiLang, t } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState('UZ');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
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
        });
      } catch (err) {
        setError(err.message || 'Registration failed.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!email.trim() || !password) {
        setError(t.auth.fillRequired);
        return;
      }

      setIsSubmitting(true);
      try {
        await login({
          email: email.trim(),
          password,
          rememberMe,
        });
      } catch (err) {
        setError(err.message || 'Login failed.');
      } finally {
        setIsSubmitting(false);
      }
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

        {/* Hero Headline & 4 Core Pillars */}
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

          {/* 4 Category Preview Pills */}
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

      {/* RIGHT AUTHENTICATION FORM PANEL */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-indigo-100 shadow-elevated p-7 sm:p-9">
          {/* Tab Switcher: Login vs Register */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-7">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.auth.goToLogin}
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.auth.goToRegister}
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {mode === 'login' ? t.auth.welcomeBack : t.auth.createAccount}
                </h2>
                <p className="text-sm text-slate-500 mt-1.5">
                  {mode === 'login' ? t.auth.loginSubtitle : t.auth.registerSubtitle}
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <>
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
                          className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none text-sm font-medium transition-all"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {getCountryByCode(c.code, uiLang).name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    {t.auth.email}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.auth.emailPlaceholder}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 outline-none text-sm font-medium transition-all"
                    />
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
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.auth.passwordPlaceholder}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 outline-none text-sm font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Register only) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.auth.confirmPassword}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t.auth.confirmPasswordPlaceholder}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 outline-none text-sm font-medium transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me (Login only) */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-semibold text-slate-600">
                        {t.auth.rememberMe}
                      </span>
                    </label>
                  </div>
                )}

                {/* Level 1 Guarantee Notice on Register */}
                {mode === 'register' && (
                  <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-2.5 text-xs text-indigo-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{t.auth.isolatedNotice}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                >
                  <span>
                    {isSubmitting
                      ? t.auth.processing
                      : mode === 'login'
                      ? t.auth.loginBtn
                      : t.auth.registerBtn}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Footer Toggle Link */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
                {mode === 'login' ? (
                  <>
                    {t.auth.noAccount}{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 ml-1"
                    >
                      {t.auth.goToRegister}
                    </button>
                  </>
                ) : (
                  <>
                    {t.auth.haveAccount}{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 ml-1"
                    >
                      {t.auth.goToLogin}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

