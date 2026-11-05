import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Target,
  Sparkles,
  Flame,
  Award,
  RotateCcw,
  Compass,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
  Globe,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, UI_TEXT } from '../data/translations';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizResultsPage() {
  const { lastQuizResult, levelInfo, subjects, startQuiz, navigate } = useApp();

  const [reviewLang, setReviewLang] = useState(
    lastQuizResult?.quizLanguage || 'en'
  );
  const [showReview, setShowReview] = useState(true);

  useEffect(() => {
    if (!lastQuizResult) {
      navigate('Dashboard');
      return;
    }

    setReviewLang(lastQuizResult.quizLanguage || 'en');

    // Trigger celebration confetti for strong scores or level ups
    if (
      !lastQuizResult.isHistoricalReview &&
      (lastQuizResult.attempt?.score_points >= 7 ||
        lastQuizResult.leveledUpOverall ||
        lastQuizResult.leveledUpSubject)
    ) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore confetti error in headless environments
      }
    }
  }, [lastQuizResult, navigate]);

  if (!lastQuizResult) return null;

  const {
    attempt,
    reviewItems = [],
    newlyUnlockedAchievements = [],
    leveledUpOverall,
    leveledUpSubject,
    topic,
    subject,
    category,
  } = lastQuizResult;

  const rt = UI_TEXT[reviewLang] || UI_TEXT.en;

  const score = attempt.score_points;
  const feedbackText =
    score === 10
      ? rt.results.feedbackPerfect
      : score >= 8
      ? rt.results.feedbackGreat
      : score >= 5
      ? rt.results.feedbackGood
      : rt.results.feedbackKeepGoing;

  const currentSubjectStats = subject ? subjects[subject.id] : null;
  const subjectLevelAfter =
    attempt.subject_level_after || currentSubjectStats?.levelInfo?.level || 1;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HERO RESULTS SUMMARY CARD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 text-white p-7 sm:p-10 shadow-elevated"
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider">
                {subject?.name?.[reviewLang] || subject?.name?.en || attempt.subject_id}
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-900/40 text-xs font-bold">
                {topic?.title?.[reviewLang] || topic?.title?.en || attempt.topic_id}
              </span>
              {leveledUpOverall && (
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1 shadow">
                  <Flame className="w-3.5 h-3.5 fill-slate-950" />
                  {rt.levelUp} {rt.levelAbbr}{attempt.level_after}
                </span>
              )}
              {leveledUpSubject && (
                <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1 shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                  {subject?.name?.[reviewLang] || subject?.name?.en} {rt.levelAbbr}{subjectLevelAfter}!
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {rt.results.quizCompleted}
            </h1>

            <p className="text-indigo-100 text-sm sm:text-base max-w-xl leading-relaxed">
              {feedbackText}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-indigo-100/90 font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {rt.duration}: {attempt.duration_seconds || 0}{rt.seconds}
              </span>
              <span>•</span>
              <span>
                {rt.languageLabel}: <strong className="uppercase">{reviewLang}</strong>
              </span>
            </div>
          </div>

          {/* Giant Score Ring */}
          <div className="shrink-0 flex flex-col items-center justify-center bg-white/15 backdrop-blur-md border border-white/25 rounded-3xl p-6 min-w-[180px]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-100">
              {rt.results.totalScore}
            </span>
            <div className="text-5xl font-extrabold font-mono mt-1">
              {attempt.score_points}
              <span className="text-2xl text-indigo-200">/10</span>
            </div>
            <span className="mt-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs">
              +{attempt.earned_xp} {rt.xpEarned}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 6 DETAILED RESULT METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {rt.results.correctAnswers}
          </span>
          <p className="text-2xl font-extrabold font-mono text-emerald-600 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" />
            {attempt.correct_count}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {rt.results.incorrectAnswers}
          </span>
          <p className="text-2xl font-extrabold font-mono text-rose-600 mt-1 flex items-center gap-1.5">
            <XCircle className="w-5 h-5" />
            {attempt.incorrect_count}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {rt.results.accuracy}
          </span>
          <p className="text-2xl font-extrabold font-mono text-purple-600 mt-1 flex items-center gap-1.5">
            <Target className="w-5 h-5" />
            {attempt.accuracy_percentage}%
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {rt.results.earnedPoints}
          </span>
          <p className="text-2xl font-extrabold font-mono text-amber-600 mt-1">
            +{attempt.earned_xp} XP
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {rt.results.updatedLevel}
          </span>
          <p className="text-2xl font-extrabold font-mono text-indigo-600 mt-1">
            {rt.levelAbbr} {attempt.level_after || levelInfo?.level || 1}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            {rt.results.subjectLevel}
          </span>
          <p className="text-2xl font-extrabold font-mono text-blue-600 mt-1">
            {rt.levelAbbr} {subjectLevelAfter}
          </p>
        </div>
      </div>

      {/* NEWLY UNLOCKED ACHIEVEMENTS BANNER (If any) */}
      {newlyUnlockedAchievements.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-3xl p-6 border-2 border-amber-300 shadow-soft">
          <div className="flex items-center gap-2.5 mb-4">
            <Award className="w-6 h-6 text-amber-600" />
            <h2 className="text-lg font-extrabold text-slate-900">
              {rt.results.newAchievements}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {newlyUnlockedAchievements.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-2xl bg-white border border-amber-200 flex items-center gap-3.5 shadow-xs"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {ach[`title_${reviewLang}`] || ach.title_en}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {ach[`description_${reviewLang}`] || ach.description_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {topic && (
            <button
              onClick={() =>
                startQuiz({
                  topicId: topic.id,
                  language: reviewLang,
                })
              }
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{rt.results.retryQuiz}</span>
            </button>
          )}

          <button
            onClick={() =>
              navigate('Explore', {
                categoryId: category?.id,
                subjectId: subject?.id,
              })
            }
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>{rt.results.chooseAnotherTopic}</span>
          </button>
        </div>

        <button
          onClick={() => navigate('Dashboard')}
          className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{rt.results.backToDashboard}</span>
        </button>
      </div>

      {/* "REVIEW ANSWERS" SECTION (Section 6 Requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setShowReview(!showReview)}
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <h2 className="text-xl font-extrabold text-slate-900">
              {showReview ? rt.results.hideReview : rt.results.reviewAnswers}
            </h2>
            {showReview ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>

          {/* Language Switcher for Reviewing Answers in Uzbek / English / Russian */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setReviewLang(l.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reviewLang === l.code
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.flag} {l.short}
              </button>
            ))}
          </div>
        </div>

        {showReview && (
          <div className="space-y-4">
            {reviewItems.map((item) => {
              const selectedOpt =
                item.selectedOptionIndex >= 0
                  ? item.options[item.selectedOptionIndex]
                  : null;
              const correctOpt = item.options[item.correctOptionIndex];

              return (
                <div
                  key={item.questionId}
                  className={`p-5 sm:p-6 rounded-2xl border-2 ${
                    item.isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs">
                        #{item.questionNumber}
                      </span>
                      <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                        {rt.explore.difficulty[item.difficulty] || item.difficulty}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>+1 XP</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>0 XP</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-4">
                    {item.questionText?.[reviewLang] || item.questionText?.en}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    {/* User's Selected Answer */}
                    <div
                      className={`p-3.5 rounded-xl border ${
                        item.isCorrect
                          ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                          : 'bg-rose-100/70 border-rose-300 text-rose-950'
                      }`}
                    >
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider opacity-75 mb-1">
                        {rt.results.yourAnswer}:
                      </span>
                      <p className="font-bold">
                        {selectedOpt
                          ? `${OPTION_LETTERS[item.selectedOptionIndex]}. ${
                              selectedOpt.text?.[reviewLang] || selectedOpt.text?.en
                            }`
                          : rt.results.notAnswered}
                      </p>
                    </div>

                    {/* Correct Answer */}
                    <div className="p-3.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-950">
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider opacity-75 mb-1">
                        {rt.results.correctAnswer}:
                      </span>
                      <p className="font-bold">
                        {correctOpt
                          ? `${OPTION_LETTERS[item.correctOptionIndex]}. ${
                              correctOpt.text?.[reviewLang] || correctOpt.text?.en
                            }`
                          : ''}
                      </p>
                    </div>
                  </div>

                  {/* Explanation */}
                  {item.explanation && (
                    <div className="mt-3.5 p-3.5 rounded-xl bg-white/90 border border-indigo-100 text-xs sm:text-sm text-slate-700">
                      <strong className="text-indigo-900">
                        {rt.quiz.explanationTitle}:{' '}
                      </strong>
                      {item.explanation?.[reviewLang] || item.explanation?.en}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

