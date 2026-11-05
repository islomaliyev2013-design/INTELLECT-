import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Clock,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  Server,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/translations';
import {
  getActiveSupabaseInfo,
  saveSupabaseConfig,
} from '../lib/supabase';
import { seedSupabaseCatalogTables } from '../services/databaseService';

export default function SettingsPage() {
  const {
    uiLang,
    setUiLang,
    quizLang,
    setQuizLang,
    timerEnabledByDefault,
    setTimerEnabledByDefault,
    t,
    logout,
  } = useApp();

  const supaInfo = getActiveSupabaseInfo();
  const [supabaseUrl, setSupabaseUrl] = useState(supaInfo.url || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [savedNotice, setSavedNotice] = useState('');
  const [seedStatus, setSeedStatus] = useState('');
  const [seedError, setSeedError] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSavePrefs = (e) => {
    e.preventDefault();
    setSavedNotice(t.settings.savedSuccess);
    setTimeout(() => setSavedNotice(''), 3500);
  };

  const handleConnectSupabase = (e) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    window.location.reload();
  };

  const handleSeedDatabase = async () => {
    setSeedError('');
    setSeedStatus('');
    setIsSeeding(true);
    try {
      const res = await seedSupabaseCatalogTables();
      setSeedStatus(
        `Seeded ${res.categoriesSeeded} categories, ${res.topicsSeeded} topics, ${res.questionsSeeded} questions, and ${res.optionsSeeded} answer options to Supabase PostgreSQL!`
      );
    } catch (err) {
      setSeedError(err.message || 'Failed to seed Supabase tables.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>{t.settings.preferencesBadge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t.settings.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{t.settings.subtitle}</p>
      </div>

      {/* LANGUAGE & QUIZ PREFERENCES */}
      <form
        onSubmit={handleSavePrefs}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Interface Language */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
              <Globe className="w-3.5 h-3.5 inline mr-1.5 text-indigo-600" />
              {t.settings.interfaceLanguage}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setUiLang(l.code)}
                  className={`py-3 px-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                    uiLang === l.code
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-[#F8F7FF] text-slate-700 border-indigo-100 hover:bg-indigo-50'
                  }`}
                >
                  <span className="block text-base mb-1">{l.flag}</span>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Default Quiz Question Language */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
              <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-indigo-600" />
              {t.settings.defaultQuizLanguage}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setQuizLang(l.code)}
                  className={`py-3 px-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                    quizLang === l.code
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-[#F8F7FF] text-slate-700 border-indigo-100 hover:bg-indigo-50'
                  }`}
                >
                  <span className="block text-base mb-1">{l.flag}</span>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Countdown Timer Default Toggle */}
        <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-indigo-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {t.settings.enableTimerDefault}
              </h3>
              <p className="text-xs text-slate-500">
                {t.settings.timerDesc}
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            checked={timerEnabledByDefault}
            onChange={(e) => setTimerEnabledByDefault(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        {savedNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedNotice}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.settings.saveSettings}</span>
          </button>
        </div>
      </form>

      {/* SUPABASE CLOUD CONNECTION & POSTGRESQL SEEDING */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {t.settings.supabaseHeader}
              </h2>
              <p className="text-xs text-slate-500">{t.settings.supabaseDesc}</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
              supaInfo.isConfigured
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            {supaInfo.isConfigured
              ? t.settings.cloudConnected
              : t.settings.relationalEngine}
          </span>
        </div>

        <form onSubmit={handleConnectSupabase} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                VITE_SUPABASE_URL
              </label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                VITE_SUPABASE_ANON_KEY
              </label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {t.settings.schemaFile}{' '}
              <code className="px-2 py-0.5 rounded bg-slate-100 font-mono text-indigo-700">
                supabase/schema.sql
              </code>
            </span>

            <div className="flex flex-wrap items-center gap-3">
              {supaInfo.isConfigured && (
                <button
                  type="button"
                  disabled={isSeeding}
                  onClick={handleSeedDatabase}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                >
                  {isSeeding
                    ? t.settings.seedingBtn
                    : t.settings.seedBtn}
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                {t.settings.saveReconnect}
              </button>
            </div>
          </div>
        </form>

        {seedStatus && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{seedStatus}</span>
          </div>
        )}

        {seedError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{seedError}</span>
          </div>
        )}
      </div>

      {/* ACCOUNT SESSION & LOGOUT SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-900">
              {t.settings.accountSessionTitle}
            </h2>
            <p className="text-xs text-slate-500 max-w-xl">
              {t.settings.accountSessionDesc}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-rose-500/20 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.nav.logout}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

