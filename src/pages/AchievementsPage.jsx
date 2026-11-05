import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Trophy,
  Sparkles,
  CheckCircle2,
  Lock,
  Code2,
  Palette,
  Atom,
  Calculator,
  Globe2,
  BookCheck,
  Crown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS_CATALOG } from '../utils/levelSystem';

const ACHIEVEMENT_ICONS = {
  Sparkles,
  Award,
  Code2,
  Palette,
  Atom,
  Calculator,
  Globe2,
  BookCheck,
  Trophy,
  Crown,
};

export default function AchievementsPage() {
  const {
    profile,
    levelInfo,
    subjects,
    unlockedAchievements,
    quizAttempts,
    uiLang,
    t,
  } = useApp();

  if (!profile || !levelInfo) return null;

  const unlockedMap = new Map(
    unlockedAchievements.map((a) => [a.achievement_key, a])
  );

  const subjectLevels = {};
  Object.keys(subjects).forEach((sId) => {
    subjectLevels[sId] = subjects[sId]?.levelInfo?.level || 1;
  });

  const bestQuizScore = quizAttempts.reduce(
    (max, a) => Math.max(max, a.score_points || 0),
    0
  );

  const evalStats = {
    completedQuizzes: profile.completed_quizzes,
    currentLevel: levelInfo.level,
    totalXp: profile.total_xp,
    hasPerfectScore: bestQuizScore === 10,
    bestQuizScore,
    subjectLevels,
  };

  return (
    <div className="space-y-8">
      {/* HEADER BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>{t.milestonesBadges}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.nav.achievements}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t.milestonesDesc}
          </p>
        </div>

        <div className="px-6 py-4 rounded-2xl bg-gradient-to-br from-amber-50 to-indigo-50 border border-amber-200/80 text-center shrink-0">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            {t.unlockedBadges}
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
            {unlockedAchievements.length}{' '}
            <span className="text-lg text-slate-400">
              / {ACHIEVEMENTS_CATALOG.length}
            </span>
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ACHIEVEMENTS_CATALOG.map((ach, idx) => {
          const unlockedRecord = unlockedMap.get(ach.key);
          const isUnlocked = Boolean(unlockedRecord);
          const Icon = ACHIEVEMENT_ICONS[ach.icon] || Award;
          const prog = ach.getProgress
            ? ach.getProgress(evalStats)
            : { current: isUnlocked ? 1 : 0, target: 1 };
          const pct = Math.min(
            100,
            Math.round((prog.current / Math.max(1, prog.target)) * 100)
          );

          return (
            <motion.div
              key={ach.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-amber-300 shadow-elevated'
                  : 'bg-white/80 border-indigo-100/80 shadow-soft opacity-85'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t.unlockedText}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      {t.lockedText}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mt-4">
                  {ach.title[uiLang] || ach.title.en}
                </h3>

                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {ach.description[uiLang] || ach.description.en}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500">{t.progressText}</span>
                  <span className="font-mono text-indigo-600">
                    {prog.current} / {prog.target} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-amber-400 to-emerald-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

