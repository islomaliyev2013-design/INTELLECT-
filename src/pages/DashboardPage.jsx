import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Flame,
  Trophy,
  CheckCircle2,
  Target,
  Award,
  BookOpen,
  Code,
  Globe,
  Calculator,
  FileCode,
  Palette,
  Atom,
  ArrowRight,
  Lock,
  Unlock,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, TOPICS, getCountryByCode } from '../data/curriculum';
import { ACHIEVEMENTS_CATALOG } from '../utils/levelSystem';

const SUBJECT_ICONS = {
  html: FileCode,
  css: Palette,
  react: Atom,
  russian: BookOpen,
  english: Globe,
  math: Calculator,
};

export default function DashboardPage() {
  const {
    profile,
    levelInfo,
    subjects,
    unlockedAchievements,
    quizAttempts,
    leaderboard,
    uiLang,
    t,
    navigate,
    openHistoricalAttemptReview,
  } = useApp();

  if (!profile || !levelInfo) return null;

  const country = getCountryByCode(profile.country_code, uiLang);
  const unlockedKeys = new Set(unlockedAchievements.map((a) => a.achievement_key));

  return (
    <div className="space-y-8">
      {/* HERO WELCOME CARD WITH LARGE "START LEARNING" BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 text-white p-6 sm:p-8 lg:p-10 shadow-elevated"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* User Identity & Level Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-white border-4 border-white/30 shadow-lg"
              />
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs shadow">
                {t.levelAbbr}{levelInfo.level}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs">
                  {country.flag} {country.name}
                </span>
                <span className="text-xs font-semibold text-indigo-100">
                  @{profile.username}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-900/40 text-indigo-100">
                  {levelInfo.title?.[uiLang] || levelInfo.title?.en}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {t.dashboard.welcomeBack} {profile.full_name}!
              </h1>

              <p className="text-sm sm:text-base text-indigo-100/90 max-w-xl">
                {t.dashboard.heroSubtitle}
              </p>

              {/* Overall Level XP Progress Bar */}
              <div className="pt-2 max-w-md">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-100 mb-1.5">
                  <span>
                    {uiLang === 'uz' ? `${levelInfo.level}-daraja` : `${t.dashboard.currentLevel} ${levelInfo.level}`} ({levelInfo.totalXp} XP)
                  </span>
                  <span>
                    {levelInfo.xpToNextLevel} {t.dashboard.xpToNext} {levelInfo.level + 1}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-indigo-950/40 p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-300 transition-all duration-500"
                    style={{ width: `${Math.max(4, levelInfo.progressPercent)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LARGE & ATTRACTIVE "START LEARNING" CTA BUTTON */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <button
              onClick={() => navigate('Explore')}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold text-base sm:text-lg tracking-wide shadow-xl shadow-indigo-950/25 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
              <span>{t.dashboard.startLearning}</span>
              <ArrowRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform" />
            </button>

            <span className="text-xs text-indigo-100/80 text-center lg:text-right">
              {t.categoriesPill}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 5 KEY PERFORMANCE METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Current Level */}
        <div className="bg-white rounded-2xl p-5 border border-indigo-100/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.currentLevel}
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {t.levelAbbr} {levelInfo.level}
            </p>
            <p className="text-xs font-semibold text-indigo-600 mt-1 truncate">
              {levelInfo.title?.[uiLang] || levelInfo.title?.en}
            </p>
          </div>
        </div>

        {/* Total Points (XP) */}
        <div className="bg-white rounded-2xl p-5 border border-indigo-100/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.totalPoints}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {profile.total_xp} <span className="text-sm font-bold text-amber-600">XP</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t.oneXpPerCorrect}
            </p>
          </div>
        </div>

        {/* Completed Quizzes */}
        <div className="bg-white rounded-2xl p-5 border border-indigo-100/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.completedQuizzes}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {profile.completed_quizzes}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {profile.total_questions_answered} {t.questionsAnswered}
            </p>
          </div>
        </div>

        {/* Correct Answers */}
        <div className="bg-white rounded-2xl p-5 border border-indigo-100/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.correctAnswers}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {profile.correct_answers}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              {t.verifiedCorrect}
            </p>
          </div>
        </div>

        {/* Accuracy Percentage */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-5 border border-indigo-100/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.accuracy}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {profile.accuracy_percentage}%
            </p>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-600"
                style={{ width: `${Math.min(100, profile.accuracy_percentage)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SUBJECT-SPECIFIC SKILL LEVELS (Section 7 Requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100/80 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {t.dashboard.subjectSkillLevels}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{t.dashboard.subjectSkillDesc}</p>
          </div>
          <button
            onClick={() => navigate('Progress')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>{t.nav.progress}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(SUBJECTS).map((subj) => {
            const Icon = SUBJECT_ICONS[subj.id] || Code;
            const userSubj = subjects[subj.id] || {
              subject_level: 1,
              subject_xp: 0,
              weighted_skill_points: 0,
              quizzes_completed: 0,
              accuracy_percentage: 0,
              levelInfo: {
                level: 1,
                progressPercent: 0,
                weightedSkillPoints: 0,
                nextLevelPts: 12,
                label: { en: 'Beginner', uz: "Boshlang'ich", ru: 'Начальный' },
              },
            };
            const sLvl = userSubj.levelInfo || { level: 1, progressPercent: 0 };

            return (
              <div
                key={subj.id}
                className="p-5 rounded-2xl bg-[#F8F7FF] hover:bg-indigo-50/40 border border-indigo-100/90 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${subj.gradient} text-white flex items-center justify-center shadow-sm`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">
                          {subj.name[uiLang] || subj.name.en}
                        </h3>
                        <span className="text-xs font-semibold text-slate-500">
                          {sLvl.label?.[uiLang] || sLvl.label?.en}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold border ${subj.badgeClass}`}
                    >
                      {uiLang === 'uz' ? `${sLvl.level}-daraja` : `${t.levelLabel} ${sLvl.level}`}
                    </span>
                  </div>

                  {/* Skill Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">
                        {t.skillPoints}:{' '}
                        <strong className="font-mono text-slate-800">
                          {sLvl.weightedSkillPoints}
                        </strong>{' '}
                        / {sLvl.nextLevelPts}
                      </span>
                      <span className="font-mono font-bold text-indigo-600">
                        {sLvl.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${subj.gradient} transition-all duration-500`}
                        style={{ width: `${Math.max(3, sLvl.progressPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    <strong className="text-slate-800">{userSubj.quizzes_completed}</strong> {uiLang === 'uz' ? 'ta test' : uiLang === 'ru' ? 'тестов' : 'quizzes'}
                    {' '}• <strong className="text-slate-800">{userSubj.accuracy_percentage}%</strong>{' '}
                    {uiLang === 'uz' ? 'aniqlik' : uiLang === 'ru' ? 'точность' : 'acc'}
                  </span>
                  <button
                    onClick={() =>
                      navigate('Explore', {
                        categoryId: subj.categoryId,
                        subjectId: subj.id,
                      })
                    }
                    className="font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.dashboard.practiceTopic}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOWER 2-COLUMN GRID: CURRENT ACHIEVEMENTS & RECENT QUIZ ACTIVITY / LEADERBOARD STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CURRENT ACHIEVEMENTS (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {t.dashboard.recentAchievements}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {unlockedAchievements.length} / {ACHIEVEMENTS_CATALOG.length} {t.unlockedText.toLowerCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('Achievements')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                <span>{t.dashboard.viewAllAchievements}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {ACHIEVEMENTS_CATALOG.slice(0, 6).map((ach) => {
                const isUnlocked = unlockedKeys.has(ach.key);
                return (
                  <div
                    key={ach.key}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-50/70 to-indigo-50/40 border-amber-200/90 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200/60 opacity-75'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-slate-900 truncate">
                          {ach.title[uiLang] || ach.title.en}
                        </h3>
                        {isUnlocked && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {ach.description[uiLang] || ach.description.en}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Global Leaderboard Eligibility Banner inside Card */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    levelInfo.leaderboardUnlocked
                      ? 'bg-emerald-500 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {levelInfo.leaderboardUnlocked ? (
                    <Unlock className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {t.dashboard.leaderboardStatus}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {levelInfo.leaderboardUnlocked
                      ? `${t.dashboard.eligibleNow} (${
                          uiLang === 'uz'
                            ? `Global Reytingda #${leaderboard?.currentUserRank || '—'}-o'rin`
                            : uiLang === 'ru'
                            ? `В мировом рейтинге #${leaderboard?.currentUserRank || '—'}`
                            : `Global Rank #${leaderboard?.currentUserRank || '—'}`
                        })`
                      : `${t.dashboard.unlockedAt10} — ${levelInfo.xpUntilLeaderboard} ${
                          uiLang === 'uz' ? 'XP qoldi' : uiLang === 'ru' ? 'XP осталось' : 'XP remaining'
                        }`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('Leaderboard')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs shrink-0 transition-colors cursor-pointer"
              >
                {t.nav.leaderboard}
              </button>
            </div>
          </div>
        </div>

        {/* RECENT QUIZ ACTIVITY (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {t.dashboard.recentQuizzes}
                </h2>
              </div>
            </div>

            {quizAttempts.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50/70 border border-dashed border-slate-200">
                <Trophy className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600 max-w-xs mx-auto">
                  {t.dashboard.noQuizzesYet}
                </p>
                <button
                  onClick={() => navigate('Explore')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{t.dashboard.startLearning}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {quizAttempts.slice(0, 5).map((attempt) => {
                  const topic = TOPICS.find((tp) => tp.id === attempt.topic_id);
                  const subj = SUBJECTS[attempt.subject_id];
                  return (
                    <div
                      key={attempt.id}
                      className="p-3.5 rounded-2xl bg-[#F8F7FF] border border-indigo-100/80 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                            {subj?.name?.[uiLang] || attempt.subject_id}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 uppercase">
                            {attempt.quiz_language}
                          </span>
                        </div>
                        <p className="font-bold text-sm text-slate-900 truncate mt-1">
                          {topic?.title?.[uiLang] || topic?.title?.en || attempt.topic_id}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-slate-900">
                            {attempt.score_points}/10
                          </span>
                          <span className="block text-[11px] font-bold text-emerald-600">
                            +{attempt.earned_xp} XP
                          </span>
                        </div>
                        <button
                          onClick={() => openHistoricalAttemptReview(attempt)}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {t.review}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

