import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  Sparkles,
  X,
  Globe,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, UI_TEXT } from '../data/translations';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const QUESTION_TIME_LIMIT = 30; // 30 seconds per question when timer is enabled

export default function QuizPage() {
  const { activeQuiz, finishQuiz, navigate } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizLanguage, setQuizLanguage] = useState(activeQuiz?.language || 'en');
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionIndex }
  const [lockedQuestions, setLockedQuestions] = useState({}); // { [questionId]: true }
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const quizStartTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!activeQuiz) {
      navigate('Explore');
    }
  }, [activeQuiz, navigate]);

  if (!activeQuiz) return null;

  const questions = activeQuiz.questions || [];
  const currentQuestion = questions[currentIndex];
  const isCurrentLocked = Boolean(
    currentQuestion && lockedQuestions[currentQuestion.id]
  );
  const currentSelectedIdx = currentQuestion
    ? selectedAnswers[currentQuestion.id]
    : undefined;

  const qt = UI_TEXT[quizLanguage] || UI_TEXT.en;

  // Countdown timer effect when timerEnabled is true
  useEffect(() => {
    if (!activeQuiz?.timerEnabled || !currentQuestion) return;
    if (isCurrentLocked) return;

    setTimeLeft(QUESTION_TIME_LIMIT);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-lock question as unanswered (-1) when time expires
          setSelectedAnswers((ans) => ({
            ...ans,
            [currentQuestion.id]: ans[currentQuestion.id] ?? -1,
          }));
          setLockedQuestions((locked) => ({
            ...locked,
            [currentQuestion.id]: true,
          }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, activeQuiz?.timerEnabled, currentQuestion?.id, isCurrentLocked]);

  /**
   * Selects and immediately locks the answer for the current question
   * Prevents answering the same question multiple times (Section 6)
   */
  const handleSelectOption = (optionIndex) => {
    if (!currentQuestion || isCurrentLocked) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
    setLockedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
  };

  const handleNextOrFinish = async () => {
    if (!isCurrentLocked) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSubmittingQuiz(true);
      try {
        const durationSeconds = Math.max(
          1,
          Math.round((Date.now() - quizStartTimeRef.current) / 1000)
        );
        await finishQuiz({
          selectedAnswers,
          durationSeconds,
        });
      } finally {
        setIsSubmittingQuiz(false);
      }
    }
  };

  // Calculate live running score
  const runningScore = questions.reduce((acc, q) => {
    if (lockedQuestions[q.id] && selectedAnswers[q.id] === q.correctIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const diffBadgeColors = {
    basic: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
    advanced: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* TOP QUIZ HEADER BAR */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-indigo-100 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Topic & Subject Title */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {activeQuiz.subject.name[quizLanguage] || activeQuiz.subject.name.en}
              </span>
              <span className="text-xs font-bold text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">
                {qt.quiz.pointsRule}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
              {activeQuiz.topic.title[quizLanguage] || activeQuiz.topic.title.en}
            </h1>
          </div>

          {/* Language Switcher & Exit Button */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setQuizLanguage(l.code)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    quizLanguage === l.code
                      ? 'bg-white text-indigo-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                navigate('Explore', {
                  categoryId: activeQuiz.category.id,
                  subjectId: activeQuiz.subject.id,
                })
              }
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              title={qt.quiz.quitQuiz}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Question Step Dots */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-700">
              {qt.quiz.questionOf} {currentIndex + 1} {qt.quiz.of} {questions.length}
            </span>

            <div className="flex items-center gap-4">
              <span className="font-mono text-indigo-600">
                {qt.scoreLabel}: {runningScore}/{questions.length}
              </span>

              {activeQuiz.timerEnabled && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-extrabold ${
                    timeLeft <= 8
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {timeLeft}{qt.seconds}
                </span>
              )}
            </div>
          </div>

          {/* Segmented 10-question progress indicator */}
          <div className="grid grid-cols-10 gap-1.5">
            {questions.map((q, idx) => {
              const isLocked = lockedQuestions[q.id];
              const isCorrect = isLocked && selectedAnswers[q.id] === q.correctIndex;
              const isCurrent = idx === currentIndex;

              let barClass = 'bg-slate-200';
              if (isLocked) {
                barClass = isCorrect ? 'bg-emerald-500' : 'bg-rose-500';
              } else if (isCurrent) {
                barClass = 'bg-indigo-600';
              }

              return (
                <div
                  key={q.id}
                  className={`h-2 rounded-full transition-all duration-300 ${barClass}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN QUESTION CARD */}
      {currentQuestion && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentQuestion.id}-${quizLanguage}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-elevated space-y-6"
          >
            {/* Question Number & Difficulty Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-mono font-extrabold text-xs">
                  #{currentQuestion.questionNumber} / 10
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                    diffBadgeColors[currentQuestion.difficulty] || diffBadgeColors.basic
                  }`}
                >
                  {qt.explore.difficulty[currentQuestion.difficulty] ||
                    currentQuestion.difficulty}{' '}
                  ({currentQuestion.difficultyWeight}x {qt.skillWeight})
                </span>
              </div>

              {isCurrentLocked && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold ${
                    currentSelectedIdx === currentQuestion.correctIndex
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {currentSelectedIdx === currentQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{qt.quiz.correctBadge}</span>
                    </>
                  ) : currentSelectedIdx === -1 ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>{qt.quiz.timeUpBadge}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>{qt.quiz.incorrectBadge}</span>
                    </>
                  )}
                </span>
              )}
            </div>

            {/* Question Prompt Text */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {currentQuestion.question[quizLanguage] || currentQuestion.question.en}
            </h2>

            {/* Four Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = currentSelectedIdx === idx;
                const isCorrectOption = idx === currentQuestion.correctIndex;

                let cardStyle =
                  'bg-[#F8F7FF] hover:bg-indigo-50/80 border-indigo-100 text-slate-800';
                let badgeStyle = 'bg-white text-indigo-700 border-indigo-200';

                if (isCurrentLocked) {
                  if (isCorrectOption) {
                    cardStyle =
                      'bg-emerald-50/90 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20';
                    badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                  } else if (isSelected && !isCorrectOption) {
                    cardStyle =
                      'bg-rose-50/90 border-rose-400 text-rose-950 ring-2 ring-rose-500/20';
                    badgeStyle = 'bg-rose-600 text-white border-rose-600';
                  } else {
                    cardStyle = 'bg-slate-50 border-slate-200/70 text-slate-400 opacity-75';
                    badgeStyle = 'bg-slate-200 text-slate-500 border-slate-300';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isCurrentLocked}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-4 ${cardStyle} ${
                      !isCurrentLocked ? 'cursor-pointer hover:border-indigo-400' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`w-9 h-9 rounded-xl border font-mono font-extrabold text-sm flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}
                      >
                        {OPTION_LETTERS[idx]}
                      </span>
                      <span className="font-bold text-sm sm:text-base leading-relaxed">
                        {opt.text[quizLanguage] || opt.text.en}
                      </span>
                    </div>

                    {isCurrentLocked && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isCurrentLocked && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* EXPLANATION & NEXT QUESTION BUTTON (Shown after answer is locked) */}
            {isCurrentLocked && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-slate-100 space-y-4"
              >
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="font-extrabold text-indigo-900 block mb-0.5">
                      {qt.quiz.explanationTitle}:
                    </span>
                    {currentQuestion.explanation[quizLanguage] ||
                      currentQuestion.explanation.en}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isSubmittingQuiz}
                    onClick={handleNextOrFinish}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>
                      {isSubmittingQuiz
                        ? qt.saving
                        : currentIndex < questions.length - 1
                        ? qt.quiz.nextQuestion
                        : qt.quiz.finishQuiz}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

