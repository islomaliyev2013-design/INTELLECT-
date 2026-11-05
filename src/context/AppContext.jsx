import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  registerUser,
  loginUser,
  restoreSession,
  logoutUser,
  getUserDashboardBundle,
  submitCompletedQuiz,
  updateUserProfile,
  uploadAvatarImage,
} from '../services/databaseService';
import { UI_TEXT } from '../data/translations';
import { getQuestionsForTopic } from '../data/questions';
import { CATEGORIES, SUBJECTS, TOPICS } from '../data/curriculum';

const AppContext = createContext(null);

const PREFS_KEY = 'neuroquiz_ui_prefs_v1';

export function AppProvider({ children }) {
  const [userBundle, setUserBundle] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Language & Quiz Preferences
  const [uiLang, setUiLangState] = useState('en');
  const [quizLang, setQuizLangState] = useState('en');
  const [timerEnabledByDefault, setTimerEnabledByDefaultState] = useState(true);

  // Navigation State (Dashboard, Explore, Progress, Achievements, Leaderboard, Profile, Settings, Quiz, QuizResults)
  const [activeRoute, setActiveRoute] = useState('Dashboard');
  const [routeParams, setRouteParams] = useState({});

  // Active Quiz Session & Latest Result
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [lastQuizResult, setLastQuizResult] = useState(null);

  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.uiLang && UI_TEXT[parsed.uiLang]) setUiLangState(parsed.uiLang);
        if (parsed.quizLang && UI_TEXT[parsed.quizLang]) setQuizLangState(parsed.quizLang);
        if (typeof parsed.timerEnabled === 'boolean') {
          setTimerEnabledByDefaultState(parsed.timerEnabled);
        }
      }
    } catch (e) {
      // ignore
    }

    async function initAuth() {
      try {
        const bundle = await restoreSession();
        if (bundle) {
          setUserBundle(bundle);
          if (bundle.profile?.preferred_language && UI_TEXT[bundle.profile.preferred_language]) {
            setUiLangState(bundle.profile.preferred_language);
            setQuizLangState(bundle.profile.preferred_language);
          }
        }
      } catch (e) {
        console.warn('Session restore error:', e);
      } finally {
        setIsLoadingAuth(false);
      }
    }
    initAuth();
  }, []);

  const persistPrefs = (updates) => {
    try {
      const current = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
      localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...updates }));
    } catch (e) {
      // ignore
    }
  };

  const setUiLang = (lang) => {
    if (!UI_TEXT[lang]) return;
    setUiLangState(lang);
    setQuizLangState(lang);
    persistPrefs({ uiLang: lang, quizLang: lang });
    if (userBundle?.profile?.id) {
      updateUserProfile(userBundle.profile.id, { preferred_language: lang }).catch(() => {});
    }
  };

  const setQuizLang = (lang) => {
    if (!UI_TEXT[lang]) return;
    setQuizLangState(lang);
    persistPrefs({ quizLang: lang });
  };

  const setTimerEnabledByDefault = (val) => {
    setTimerEnabledByDefaultState(Boolean(val));
    persistPrefs({ timerEnabled: Boolean(val) });
  };

  const navigate = useCallback((route, params = {}) => {
    setActiveRoute(route);
    setRouteParams(params);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleRegister = async (formData) => {
    const bundle = await registerUser(formData);
    setUserBundle(bundle);
    setActiveRoute('Dashboard');
    return bundle;
  };

  const handleLogin = async (formData) => {
    const bundle = await loginUser(formData);
    setUserBundle(bundle);
    setActiveRoute('Dashboard');
    return bundle;
  };

  const handleLogout = async () => {
    await logoutUser();
    setUserBundle(null);
    setActiveQuiz(null);
    setLastQuizResult(null);
    setActiveRoute('Dashboard');
  };

  const refreshUserData = useCallback(async () => {
    if (!userBundle?.profile?.id) return null;
    const fresh = await getUserDashboardBundle(userBundle.profile.id);
    if (fresh) setUserBundle(fresh);
    return fresh;
  }, [userBundle?.profile?.id]);

  /**
   * Starts a 10-question interactive quiz for any topic in the selected language
   */
  const startQuiz = useCallback(
    ({ topicId, language = quizLang, timerEnabled = timerEnabledByDefault }) => {
      const topic = TOPICS.find((t) => t.id === topicId);
      if (!topic) return;

      const category = CATEGORIES.find((c) => c.id === topic.categoryId);
      const subject = SUBJECTS[topic.subjectId];
      const questions = getQuestionsForTopic(topicId);

      setQuizLang(language);
      setActiveQuiz({
        topic,
        category,
        subject,
        questions,
        language,
        timerEnabled,
        startedAt: Date.now(),
      });
      setActiveRoute('Quiz');
    },
    [quizLang, timerEnabledByDefault]
  );

  /**
   * Finishes a 10-question quiz, saves results in Supabase/DB, updates levels & achievements
   */
  const finishQuiz = useCallback(
    async ({ selectedAnswers, durationSeconds }) => {
      if (!activeQuiz || !userBundle?.profile?.id) return null;

      const result = await submitCompletedQuiz({
        userId: userBundle.profile.id,
        categoryId: activeQuiz.category.id,
        subjectId: activeQuiz.subject.id,
        topicId: activeQuiz.topic.id,
        quizLanguage: activeQuiz.language,
        questions: activeQuiz.questions,
        selectedAnswers,
        durationSeconds,
      });

      setUserBundle(result.bundle);
      setLastQuizResult({
        ...result,
        topic: activeQuiz.topic,
        subject: activeQuiz.subject,
        category: activeQuiz.category,
        quizLanguage: activeQuiz.language,
      });
      setActiveQuiz(null);
      setActiveRoute('QuizResults');
      return result;
    },
    [activeQuiz, userBundle?.profile?.id]
  );

  /**
   * Opens the "Review Answers" page for a historical quiz attempt
   */
  const openHistoricalAttemptReview = useCallback(
    (attempt) => {
      const topic = TOPICS.find((t) => t.id === attempt.topic_id);
      const subject = SUBJECTS[attempt.subject_id];
      const category = CATEGORIES.find((c) => c.id === attempt.category_id);

      let reviewItems = attempt.review_items || [];
      if (!reviewItems.length && topic) {
        const questions = getQuestionsForTopic(topic.id);
        reviewItems = questions.map((q) => ({
          questionId: q.id,
          questionNumber: q.questionNumber,
          difficulty: q.difficulty,
          questionText: q.question,
          options: q.options,
          selectedOptionIndex: q.correctIndex,
          correctOptionIndex: q.correctIndex,
          isCorrect: true,
          pointsAwarded: 1,
          explanation: q.explanation,
        }));
      }

      setLastQuizResult({
        attempt,
        reviewItems,
        newlyUnlockedAchievements: [],
        leveledUpOverall: attempt.level_after > attempt.level_before,
        leveledUpSubject:
          (attempt.subject_level_after || 1) > (attempt.subject_level_before || 1),
        topic,
        subject,
        category,
        quizLanguage: attempt.quiz_language || uiLang,
        isHistoricalReview: true,
      });
      setActiveRoute('QuizResults');
    },
    [uiLang]
  );

  const handleUpdateProfile = async (updates) => {
    if (!userBundle?.profile?.id) return;
    const updated = await updateUserProfile(userBundle.profile.id, updates);
    setUserBundle(updated);
    return updated;
  };

  const handleUploadAvatar = async (file) => {
    if (!userBundle?.profile?.id) return;
    const updated = await uploadAvatarImage(userBundle.profile.id, file);
    setUserBundle(updated);
    return updated;
  };

  const t = UI_TEXT[uiLang] || UI_TEXT.en;

  return (
    <AppContext.Provider
      value={{
        userBundle,
        profile: userBundle?.profile || null,
        levelInfo: userBundle?.levelInfo || null,
        subjects: userBundle?.subjects || {},
        unlockedAchievements: userBundle?.unlockedAchievements || [],
        quizAttempts: userBundle?.quizAttempts || [],
        leaderboard: userBundle?.leaderboard || null,
        isLoadingAuth,
        uiLang,
        setUiLang,
        quizLang,
        setQuizLang,
        timerEnabledByDefault,
        setTimerEnabledByDefault,
        t,
        activeRoute,
        routeParams,
        navigate,
        activeQuiz,
        lastQuizResult,
        startQuiz,
        finishQuiz,
        openHistoricalAttemptReview,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        refreshUserData,
        updateProfile: handleUpdateProfile,
        uploadAvatar: handleUploadAvatar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

