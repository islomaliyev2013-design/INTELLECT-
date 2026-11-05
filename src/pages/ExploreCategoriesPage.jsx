import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  BookOpen,
  Globe,
  Calculator,
  FileCode,
  Palette,
  Atom,
  Play,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, SUBJECTS, TOPICS } from '../data/curriculum';
import { LANGUAGES } from '../data/translations';

const CATEGORY_ICONS = {
  'cat-programming': Code,
  'cat-russian': BookOpen,
  'cat-english': Globe,
  'cat-mathematics': Calculator,
};

const SUBJECT_ICONS = {
  html: FileCode,
  css: Palette,
  react: Atom,
  russian: BookOpen,
  english: Globe,
  math: Calculator,
};

export default function ExploreCategoriesPage() {
  const {
    subjects,
    uiLang,
    quizLang,
    setQuizLang,
    timerEnabledByDefault,
    setTimerEnabledByDefault,
    t,
    routeParams,
    startQuiz,
  } = useApp();

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    routeParams?.categoryId || null
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    routeParams?.subjectId || null
  );

  useEffect(() => {
    if (routeParams?.categoryId) {
      setSelectedCategoryId(routeParams.categoryId);
    }
    if (routeParams?.subjectId) {
      setSelectedSubjectId(routeParams.subjectId);
    }
  }, [routeParams]);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategoryId) || null;

  const handleSelectCategory = (cat) => {
    setSelectedCategoryId(cat.id);
    if (!cat.hasSubSubjects) {
      setSelectedSubjectId(cat.subjects[0]);
    } else {
      setSelectedSubjectId(null);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setSelectedSubjectId(null);
  };

  const handleBackToSubjects = () => {
    setSelectedSubjectId(null);
  };

  const currentSubjectMeta = selectedSubjectId ? SUBJECTS[selectedSubjectId] : null;
  const currentSubjectUserStats = selectedSubjectId ? subjects[selectedSubjectId] : null;
  const currentTopics = selectedSubjectId
    ? TOPICS.filter((tp) => tp.subjectId === selectedSubjectId).sort(
        (a, b) => a.order - b.order
      )
    : [];

  return (
    <div className="space-y-8">
      {/* HEADER + MULTILINGUAL QUESTION LANGUAGE & TIMER BAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100/80 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.categoriesPill}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.explore.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">{t.explore.subtitle}</p>
          </div>

          {/* Quiz Question Language & Timer Pre-Quiz Controls */}
          <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-[#F8F7FF] border border-indigo-100">
            {/* Question Language Selector */}
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                {t.explore.quizLanguageLabel}
              </span>
              <div className="flex items-center bg-white p-1 rounded-xl border border-indigo-100 shadow-2xs">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setQuizLang(lang.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      quizLang === lang.code
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-indigo-600'
                    }`}
                  >
                    <span className="mr-1">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Countdown Timer Toggle */}
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                {t.explore.timerOptionLabel}
              </span>
              <div className="flex items-center bg-white p-1 rounded-xl border border-indigo-100 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setTimerEnabledByDefault(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    timerEnabledByDefault
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.explore.timerOn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimerEnabledByDefault(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !timerEnabledByDefault
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  {t.explore.timerOff}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BREADCRUMB NAVIGATION */}
      {selectedCategoryId && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleBackToCategories}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-indigo-100 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.explore.backToCategories}</span>
          </button>

          {activeCategory?.hasSubSubjects && selectedSubjectId && (
            <button
              onClick={handleBackToSubjects}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.explore.backToSubjects}</span>
            </button>
          )}
        </div>
      )}

      {/* VIEW 1: FOUR MAIN LEARNING CATEGORY CARDS */}
      <AnimatePresence mode="wait">
        {!selectedCategoryId && (
          <motion.div
            key="categories-grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Code;
              const categoryTopicsCount = TOPICS.filter(
                (tp) => tp.categoryId === cat.id
              ).length;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className="group relative bg-white rounded-3xl p-7 sm:p-8 border border-indigo-100/90 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  <div
                    className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-br ${cat.gradient} opacity-10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform`}
                  />

                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-full ${cat.badgeBg}`}
                        >
                          {categoryTopicsCount} {t.topicsCount} • {categoryTopicsCount * 10} {t.questionsCountText}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-extrabold text-slate-900 mt-6 group-hover:text-indigo-600 transition-colors">
                      {cat.title[uiLang] || cat.title.en}
                    </h2>

                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {cat.description[uiLang] || cat.description.en}
                    </p>

                    {/* Subject Pills Preview */}
                    <div className="flex flex-wrap items-center gap-2 mt-5">
                      {cat.subjects.map((sId) => {
                        const sMeta = SUBJECTS[sId];
                        const userSubj = subjects[sId];
                        const sLevel = userSubj?.levelInfo?.level || 1;
                        return (
                          <span
                            key={sId}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F7FF] border border-indigo-100 text-xs font-bold text-slate-800"
                          >
                            <span>{sMeta.name[uiLang] || sMeta.name.en}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-extrabold">
                              {t.levelAbbr}{sLevel}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      {t.availableLanguages}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-extrabold text-indigo-600 group-hover:translate-x-1 transition-transform">
                      <span>{t.exploreAction}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* VIEW 2: PROGRAMMING SUBJECTS (HTML, CSS, REACT JS) */}
        {selectedCategoryId && activeCategory?.hasSubSubjects && !selectedSubjectId && (
          <motion.div
            key="programming-subjects"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {t.explore.selectSubject}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeCategory.subjects.map((subjId) => {
                const subj = SUBJECTS[subjId];
                const Icon = SUBJECT_ICONS[subjId] || Code;
                const subjTopics = TOPICS.filter((tp) => tp.subjectId === subjId);
                const userSubj = subjects[subjId];
                const sLvl = userSubj?.levelInfo || {
                  level: 1,
                  progressPercent: 0,
                  weightedSkillPoints: 0,
                };

                return (
                  <div
                    key={subjId}
                    onClick={() => setSelectedSubjectId(subjId)}
                    className="group bg-white rounded-3xl p-7 border border-indigo-100/90 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subj.gradient} text-white flex items-center justify-center shadow-md`}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${subj.badgeClass}`}
                        >
                          {subj.name[uiLang] || subj.name.en} {uiLang === 'uz' ? `${sLvl.level}-daraja` : `${t.levelLabel} ${sLvl.level}`}
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold text-slate-900 mt-5 group-hover:text-indigo-600 transition-colors">
                        {subj.name[uiLang] || subj.name.en}
                      </h3>

                      <p className="text-sm text-slate-600 mt-2">
                        {subj.description[uiLang] || subj.description.en}
                      </p>

                      {/* Topics list preview */}
                      <div className="mt-5 space-y-1.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {subjTopics.length} {t.topicsCount} ({subjTopics.length * 10} {t.questionsCountText}):
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {subjTopics.map((tp) => (
                            <span
                              key={tp.id}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                            >
                              {tp.title[uiLang] || tp.title.en}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        {userSubj?.quizzes_completed || 0} {t.completedText}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-indigo-600 group-hover:translate-x-1 transition-transform">
                        <span>{subjTopics.length} {t.viewTopics}</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* VIEW 3: TOPICS LIST FOR SELECTED SUBJECT */}
        {selectedSubjectId && currentSubjectMeta && (
          <motion.div
            key={`topics-${selectedSubjectId}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Subject Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentSubjectMeta.gradient} text-white flex items-center justify-center shadow-md shrink-0`}
                >
                  {React.createElement(SUBJECT_ICONS[selectedSubjectId] || Layers, {
                    className: 'w-7 h-7',
                  })}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {currentSubjectMeta.name[uiLang] || currentSubjectMeta.name.en}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold border ${currentSubjectMeta.badgeClass}`}
                    >
                      {uiLang === 'uz' ? `${currentSubjectUserStats?.levelInfo?.level || 1}-daraja` : `${t.levelLabel} ${currentSubjectUserStats?.levelInfo?.level || 1}`}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {t.explore.selectTopic} • {t.languageLabel}:{' '}
                    <strong className="text-indigo-600 uppercase">{quizLang}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-[#F8F7FF] px-4 py-3 rounded-2xl border border-indigo-100">
                <div>
                  <span className="block text-slate-400">{t.subjectXp}</span>
                  <span className="font-mono text-base text-slate-900">
                    {currentSubjectUserStats?.subject_xp || 0} XP
                  </span>
                </div>
                <div className="h-8 w-px bg-indigo-100" />
                <div>
                  <span className="block text-slate-400">{t.skillPoints}</span>
                  <span className="font-mono text-base text-indigo-600">
                    {currentSubjectUserStats?.weighted_skill_points || 0} {t.pts}
                  </span>
                </div>
                <div className="h-8 w-px bg-indigo-100" />
                <div>
                  <span className="block text-slate-400">{t.leaderboard.completed}</span>
                  <span className="font-mono text-base text-slate-900">
                    {currentSubjectUserStats?.quizzes_completed || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentTopics.map((topic, idx) => {
                const topicProgress =
                  currentSubjectUserStats?.topic_progress?.[topic.id] || null;
                const topicLevel = topicProgress?.level || 1;
                const bestScore = topicProgress?.bestScore ?? null;
                const attemptsCount = topicProgress?.attempts || 0;

                const diffColors = {
                  basic: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
                  advanced: 'bg-purple-50 text-purple-700 border-purple-200',
                };

                return (
                  <div
                    key={topic.id}
                    className="bg-white rounded-3xl p-6 border border-indigo-100/90 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top row: Topic # + Difficulty + Topic Skill Level */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-mono font-extrabold text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              diffColors[topic.difficultyTier] || diffColors.basic
                            }`}
                          >
                            {t.explore.difficulty[topic.difficultyTier] ||
                              topic.difficultyTier}
                          </span>
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {t.explore.topicLevel} {topicLevel}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900 mt-4">
                        {topic.title[uiLang] || topic.title.en}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {topic.description[uiLang] || topic.description.en}
                      </p>

                      {/* Topic Mastery Stats */}
                      <div className="mt-4 p-3 rounded-2xl bg-[#F8F7FF] border border-indigo-100/70 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">
                          {t.explore.questionsCount}
                        </span>
                        {bestScore !== null ? (
                          <span className="font-mono font-bold text-emerald-700 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {t.explore.bestScore}: {bestScore}/10 ({attemptsCount}x)
                          </span>
                        ) : (
                          <span className="font-semibold text-indigo-600">
                            {t.explore.notAttempted}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Start 10-Question Quiz Button */}
                    <button
                      onClick={() =>
                        startQuiz({
                          topicId: topic.id,
                          language: quizLang,
                          timerEnabled: timerEnabledByDefault,
                        })
                      }
                      className="mt-5 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{t.explore.startQuizBtn}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

