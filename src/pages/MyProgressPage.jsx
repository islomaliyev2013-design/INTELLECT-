import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Play,
  FileCode,
  Palette,
  Atom,
  Globe,
  Calculator,
  Clock,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, TOPICS } from '../data/curriculum';
import { LEVEL_THRESHOLDS } from '../utils/levelSystem';

const SUBJECT_ICONS = {
  html: FileCode,
  css: Palette,
  react: Atom,
  russian: BookOpen,
  english: Globe,
  math: Calculator,
};

export default function MyProgressPage() {
  const {
    profile,
    levelInfo,
    subjects,
    quizAttempts,
    uiLang,
    quizLang,
    t,
    startQuiz,
    openHistoricalAttemptReview,
  } = useApp();

  const [activeSubjectTab, setActiveSubjectTab] = useState('html');

  if (!profile || !levelInfo) return null;

  const selectedSubjectMeta = SUBJECTS[activeSubjectTab];
  const selectedSubjectProgress = subjects[activeSubjectTab] || {
    subject_level: 1,
    subject_xp: 0,
    weighted_skill_points: 0,
    quizzes_completed: 0,
    accuracy_percentage: 0,
    topic_progress: {},
    levelInfo: {
      level: 1,
      progressPercent: 0,
      weightedSkillPoints: 0,
      nextLevelPts: 12,
    },
  };
  const selectedSubjectTopics = TOPICS.filter(
    (tp) => tp.subjectId === activeSubjectTab
  ).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      {/* OVERALL LEVEL & XP PROGRESSION ROADMAP (Section 7) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.smartLevelHeader}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.nav.progress}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t.trackOverallXp}
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F7FF] border border-indigo-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-mono font-extrabold text-lg flex items-center justify-center">
              {t.levelAbbr}{levelInfo.level}
            </div>
            <div>
              <p className="font-extrabold text-slate-900">
                {levelInfo.title?.[uiLang] || levelInfo.title?.en}
              </p>
              <p className="text-xs font-mono font-bold text-indigo-600">
                {profile.total_xp} {t.xpEarned} • {levelInfo.xpToNextLevel} {t.xpToLevelNext}{' '}
                {levelInfo.level + 1}
              </p>
            </div>
          </div>
        </div>

        {/* 10-Level Milestone Ladder */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            {t.smartLevelRoadmap}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
            {LEVEL_THRESHOLDS.map((tier) => {
              const isReached = levelInfo.level >= tier.level;
              const isCurrent = levelInfo.level === tier.level;

              return (
                <div
                  key={tier.level}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-[1.03]'
                      : isReached
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200/70 text-slate-400'
                  }`}
                >
                  <div className="font-mono font-extrabold text-sm">
                    {t.levelAbbr}{tier.level}
                  </div>
                  <div
                    className={`text-[10px] font-mono font-bold mt-1 ${
                      isCurrent
                        ? 'text-indigo-100'
                        : isReached
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {tier.level === 10
                      ? '400+ XP'
                      : `${tier.minXp}–${tier.maxXp} XP`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUBJECT-SPECIFIC SKILL LEVELS & TOPIC MASTERY BREAKDOWN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.dashboard.subjectSkillLevels}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {t.chooseSubjectToInspect}
          </p>
        </div>

        {/* 6 Subject Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.values(SUBJECTS).map((subj) => {
            const Icon = SUBJECT_ICONS[subj.id] || BookOpen;
            const uSubj = subjects[subj.id];
            const lvl = uSubj?.levelInfo?.level || 1;
            const isSelected = activeSubjectTab === subj.id;

            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => setActiveSubjectTab(subj.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-[#F8F7FF] hover:bg-indigo-50/70 border-indigo-100 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected ? 'text-white' : 'text-indigo-600'
                    }`}
                  />
                  <span
                    className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {t.levelAbbr}{lvl}
                  </span>
                </div>
                <p className="font-extrabold text-sm mt-2.5 truncate">
                  {subj.name[uiLang] || subj.name.en}
                </p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    isSelected ? 'text-indigo-100' : 'text-slate-500'
                  }`}
                >
                  {uSubj?.weighted_skill_points || 0} {t.pts}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Subject Topic Mastery Breakdown */}
        {selectedSubjectMeta && (
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#F8F7FF] border border-indigo-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {selectedSubjectMeta.name[uiLang] || selectedSubjectMeta.name.en} — {uiLang === 'uz' ? `${selectedSubjectProgress.levelInfo?.level || 1}-daraja` : `${t.levelLabel} ${selectedSubjectProgress.levelInfo?.level || 1}`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.skillPoints}:{' '}
                  <strong>{selectedSubjectProgress.weighted_skill_points || 0}</strong> /{' '}
                  {selectedSubjectProgress.levelInfo?.nextLevelPts || 12} • {t.dashboard.completedQuizzes}:{' '}
                  <strong>{selectedSubjectProgress.quizzes_completed || 0}</strong> • {t.dashboard.accuracy}:{' '}
                  <strong>{selectedSubjectProgress.accuracy_percentage || 0}%</strong>
                </p>
              </div>

              <div className="w-full sm:w-64">
                <div className="flex justify-between text-xs font-bold text-indigo-700 mb-1">
                  <span>{t.subjectLevelProgress}</span>
                  <span>{selectedSubjectProgress.levelInfo?.progressPercent || 0}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-indigo-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${selectedSubjectMeta.gradient}`}
                    style={{
                      width: `${Math.max(
                        4,
                        selectedSubjectProgress.levelInfo?.progressPercent || 0
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedSubjectTopics.map((topic, idx) => {
                const tProg =
                  selectedSubjectProgress.topic_progress?.[topic.id] || null;
                const tLevel = tProg?.level || 1;
                const bestScore = tProg?.bestScore ?? null;
                const attempts = tProg?.attempts || 0;
                const progressPct = tProg?.progressPercent || 0;

                return (
                  <div
                    key={topic.id}
                    className="p-4 rounded-2xl border border-indigo-100 bg-white flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-slate-400">
                          {t.topicNumber} #{idx + 1}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold">
                          {t.topicNumber} {t.levelAbbr}{tLevel}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1.5">
                        {topic.title[uiLang] || topic.title.en}
                      </h4>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${Math.max(3, progressPct)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500">
                        {bestScore !== null
                          ? `${t.bestScoreText}: ${bestScore}/10 (${attempts}x)`
                          : t.notAttemptedYet}
                      </span>
                      <button
                        onClick={() =>
                          startQuiz({
                            topicId: topic.id,
                            language: quizLang,
                          })
                        }
                        className="font-extrabold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-indigo-600" />
                        <span>{t.dashboard.practiceTopic}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* COMPLETE QUIZ HISTORY TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.profile.quizHistory} ({quizAttempts.length})
          </h2>
        </div>

        {quizAttempts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-sm text-slate-500">
            {t.dashboard.noQuizzesYet}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F7FF] border-b border-indigo-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">{t.subjectAndTopic}</th>
                  <th className="py-3 px-4">{t.languageLabel}</th>
                  <th className="py-3 px-4">{t.scoreLabel}</th>
                  <th className="py-3 px-4">{t.dashboard.accuracy}</th>
                  <th className="py-3 px-4">{t.xpEarned}</th>
                  <th className="py-3 px-4">{t.skillPoints}</th>
                  <th className="py-3 px-4 text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {quizAttempts.map((attempt) => {
                  const topic = TOPICS.find((tp) => tp.id === attempt.topic_id);
                  const subj = SUBJECTS[attempt.subject_id];
                  return (
                    <tr key={attempt.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 mr-2">
                          {subj?.name?.[uiLang] || attempt.subject_id}
                        </span>
                        <span className="font-bold text-slate-900">
                          {topic?.title?.[uiLang] || topic?.title?.en || attempt.topic_id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono uppercase text-xs text-slate-500">
                        {attempt.quiz_language}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                        {attempt.score_points}/10
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                        {attempt.accuracy_percentage}%
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                        +{attempt.earned_xp} XP
                      </td>
                      <td className="py-3.5 px-4 font-mono text-indigo-600 font-bold">
                        +{attempt.skill_points_earned || 0}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openHistoricalAttemptReview(attempt)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs cursor-pointer"
                        >
                          {t.profile.reviewAttempt}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

