import React, { useState, useRef } from 'react';
import {
  User,
  Edit3,
  Camera,
  CheckCircle2,
  Trophy,
  Flame,
  Sparkles,
  Award,
  BookOpen,
  Target,
  Lock,
  Save,
  X,
  LogOut,
  FileCode,
  Palette,
  Atom,
  Globe,
  Calculator,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, SUBJECTS, TOPICS, getCountryByCode } from '../data/curriculum';
import { ACHIEVEMENTS_CATALOG } from '../utils/levelSystem';

const SUBJECT_ICONS = {
  html: FileCode,
  css: Palette,
  react: Atom,
  russian: BookOpen,
  english: Globe,
  math: Calculator,
};

const PRESET_AVATAR_SEEDS = [
  'Sardor',
  'Aziza',
  'Jasur',
  'Malika',
  'Alex',
  'Elena',
  'Kenji',
  'Sophia',
];

export default function ProfilePage() {
  const {
    profile,
    levelInfo,
    subjects,
    unlockedAchievements,
    quizAttempts,
    leaderboard,
    uiLang,
    t,
    updateProfile,
    uploadAvatar,
    openHistoricalAttemptReview,
    logout,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [countryCode, setCountryCode] = useState(profile?.country_code || 'UZ');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  if (!profile || !levelInfo) return null;

  const country = getCountryByCode(profile.country_code, uiLang);
  const unlockedKeys = new Set(unlockedAchievements.map((a) => a.achievement_key));

  const handleOpenEdit = () => {
    setFullName(profile.full_name);
    setUsername(profile.username);
    setCountryCode(profile.country_code || 'UZ');
    setBio(profile.bio || '');
    setAvatarUrl(profile.avatar_url || '');
    setErrorMsg('');
    setStatusMsg('');
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setStatusMsg('');
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        username: username.trim(),
        country_code: countryCode,
        bio: bio.trim(),
        avatar_url: avatarUrl,
      });
      setStatusMsg(t.profileUpdated);
      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    setIsSaving(true);
    try {
      const updated = await uploadAvatar(file);
      if (updated?.profile?.avatar_url) {
        setAvatarUrl(updated.profile.avatar_url);
      }
      setStatusMsg(t.avatarUpdated);
    } catch (err) {
      setErrorMsg(err.message || t.uploadFail);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* PROFILE HERO HEADER CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar with Upload Button */}
            <div className="relative group w-24 h-24 sm:w-28 sm:h-28 shrink-0">
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-full h-full rounded-3xl object-cover bg-indigo-50 border-4 border-indigo-100 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                title={t.profile.uploadAvatar}
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {profile.full_name}
                </h1>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-extrabold">
                  {country.flag} {country.name}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">
                  {t.levelLabel} {levelInfo.level}
                </span>
              </div>

              <p className="text-sm font-bold text-indigo-600">
                @{profile.username}
              </p>

              <p className="text-sm text-slate-600 max-w-2xl">
                {profile.bio || 'Lifelong learner competing on NeuroQuiz Global.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            <button
              type="button"
              onClick={handleOpenEdit}
              className="px-5 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t.profile.editProfile}</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
              title={t.nav.logout}
            >
              <LogOut className="w-4 h-4" />
              <span>{t.nav.logout}</span>
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* EDIT PROFILE PANEL */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-slate-100 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                {t.profile.editProfile}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {t.auth.fullName}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {t.auth.username}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {t.auth.country}
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-indigo-500 outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {getCountryByCode(c.code, uiLang).name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                {t.profile.bio}
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Preset Avatars Selector */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                {t.profile.choosePresetAvatar}
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {PRESET_AVATAR_SEEDS.map((seed) => {
                  const url = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=c0aede`;
                  return (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`p-1 rounded-2xl border-2 transition-all cursor-pointer ${
                        avatarUrl === url
                          ? 'border-indigo-600 scale-105 shadow-sm'
                          : 'border-transparent hover:border-indigo-200'
                      }`}
                    >
                      <img
                        src={url}
                        alt={seed}
                        className="w-12 h-12 rounded-xl bg-indigo-50"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                {t.profile.cancel}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? t.saving : t.profile.saveChanges}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 6 PROFILE SUMMARY METRICS (Including Global Ranking Status) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {t.dashboard.currentLevel}
          </span>
          <p className="text-2xl font-extrabold font-mono text-indigo-600 mt-1">
            {t.levelAbbr} {levelInfo.level}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {t.dashboard.totalPoints}
          </span>
          <p className="text-2xl font-extrabold font-mono text-amber-600 mt-1">
            {profile.total_xp} XP
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {t.profile.globalRank}
          </span>
          {leaderboard?.isCurrentUserEligible ? (
            <p className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">
              #{leaderboard.currentUserRank}
            </p>
          ) : (
            <p className="text-xs font-extrabold text-amber-700 mt-2 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              {t.profile.lockedUntil10}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {t.dashboard.completedQuizzes}
          </span>
          <p className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
            {profile.completed_quizzes}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {t.dashboard.correctAnswers}
          </span>
          <p className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">
            {profile.correct_answers}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {t.dashboard.accuracy}
          </span>
          <p className="text-2xl font-extrabold font-mono text-purple-600 mt-1">
            {profile.accuracy_percentage}%
          </p>
        </div>
      </div>

      {/* SUBJECT-SPECIFIC SKILL LEVELS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft space-y-5">
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.profile.subjectMastery}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(SUBJECTS).map((subj) => {
            const Icon = SUBJECT_ICONS[subj.id] || BookOpen;
            const uSubj = subjects[subj.id];
            const sLvl = uSubj?.levelInfo || {
              level: 1,
              progressPercent: 0,
              weightedSkillPoints: 0,
              nextLevelPts: 12,
            };

            return (
              <div
                key={subj.id}
                className="p-5 rounded-2xl bg-[#F8F7FF] border border-indigo-100 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subj.gradient} text-white flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {subj.name[uiLang] || subj.name.en}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {uSubj?.quizzes_completed || 0} {t.leaderboard.completed.toLowerCase()} •{' '}
                        {uSubj?.accuracy_percentage || 0}% {t.leaderboard.accuracy.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${subj.badgeClass}`}
                  >
                    {t.levelAbbr}{sLvl.level}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${subj.gradient}`}
                    style={{ width: `${Math.max(4, sLvl.progressPercent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACHIEVEMENT BADGES SHOWCASE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.nav.achievements} ({unlockedAchievements.length}/
            {ACHIEVEMENTS_CATALOG.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS_CATALOG.map((ach) => {
            const isUnlocked = unlockedKeys.has(ach.key);
            return (
              <div
                key={ach.key}
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-slate-50 border-slate-200/70 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-xs text-slate-900 truncate">
                    {ach.title[uiLang] || ach.title.en}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {ach.description[uiLang] || ach.description.en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUIZ HISTORY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.profile.quizHistory} ({quizAttempts.length})
        </h2>

        {quizAttempts.length === 0 ? (
          <p className="text-sm text-slate-500">{t.dashboard.noQuizzesYet}</p>
        ) : (
          <div className="space-y-3">
            {quizAttempts.slice(0, 10).map((attempt) => {
              const topic = TOPICS.find((tp) => tp.id === attempt.topic_id);
              const subj = SUBJECTS[attempt.subject_id];
              return (
                <div
                  key={attempt.id}
                  className="p-4 rounded-2xl bg-[#F8F7FF] border border-indigo-100 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {subj?.name?.[uiLang] || attempt.subject_id}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {topic?.title?.[uiLang] || topic?.title?.en || attempt.topic_id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {t.languageLabel}: {attempt.quiz_language.toUpperCase()} • {t.dashboard.accuracy}:{' '}
                      {attempt.accuracy_percentage}% • {t.duration}: {attempt.duration_seconds}{t.seconds}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-base text-slate-900">
                        {attempt.score_points}/10
                      </span>
                      <span className="block text-xs font-bold text-emerald-600">
                        +{attempt.earned_xp} XP
                      </span>
                    </div>
                    <button
                      onClick={() => openHistoricalAttemptReview(attempt)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold text-xs cursor-pointer"
                    >
                      {t.profile.reviewAttempt}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

