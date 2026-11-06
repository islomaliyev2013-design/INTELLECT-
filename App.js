import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Vibration,
  ActivityIndicator,
} from 'react-native';

import { LANGUAGES, UI_TEXT } from './src/data/translations';
import {
  CATEGORIES,
  SUBJECTS,
  TOPICS,
  COUNTRIES,
  getSubjectsByCategory,
  getTopicsBySubject,
  getCountryByCode,
} from './src/data/curriculum';
import {
  calculateOverallLevelInfo,
  ACHIEVEMENTS_CATALOG,
} from './src/utils/levelSystem';
import {
  registerUser,
  loginUser,
  logoutUser,
  restoreSession,
  submitCompletedQuiz,
  getGlobalLeaderboard,
} from './src/services/databaseService';
import { getQuestionsForTopic } from './src/data/questions';
import {
  playCorrectSound,
  playIncorrectSound,
  playCompleteSound,
} from './src/utils/audioEffects';

const AVATAR_PRESETS = [
  '/avatars/avatar-1.png',
  '/avatars/avatar-2.png',
  '/avatars/avatar-3.png',
  '/avatars/avatar-4.png',
  '/avatars/avatar-5.png',
  '/avatars/avatar-6.png',
  '/avatars/avatar-7.png',
  '/avatars/avatar-8.png',
];

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function App() {
  const [uiLang, setUiLang] = useState('uz');
  const [quizLang, setQuizLang] = useState('uz');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [userBundle, setUserBundle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard'); // Dashboard | Explore | Quiz | QuizResults | Leaderboard | Achievements | Profile

  // Auth states (100% clean, zero autofill)
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [countryCode, setCountryCode] = useState('UZ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Explore navigation state
  const [selectedCategoryId, setSelectedCategoryId] = useState('programming');
  const [selectedSubjectId, setSelectedSubjectId] = useState('html');

  // Active Quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [lockedQuestions, setLockedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [lastQuizResult, setLastQuizResult] = useState(null);
  const quizStartRef = useRef(Date.now());

  // Leaderboard state
  const [leaderboardList, setLeaderboardList] = useState([]);

  const t = UI_TEXT[uiLang] || UI_TEXT.uz;

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const session = await restoreSession();
        if (mounted && session) {
          setUserBundle(session);
        }
        const lb = await getGlobalLeaderboard();
        if (mounted) setLeaderboardList(lb?.competitors || []);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Quiz countdown timer
  useEffect(() => {
    if (activeTab !== 'Quiz' || !activeQuiz) return;
    const questions = activeQuiz.questions || [];
    const currentQ = questions[currentQIndex];
    if (!currentQ || lockedQuestions[currentQ.id]) return;

    setTimeLeft(30);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerIncorrectFeedback();
          setSelectedAnswers((ans) => ({ ...ans, [currentQ.id]: -1 }));
          setLockedQuestions((l) => ({ ...l, [currentQ.id]: true }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, activeQuiz, currentQIndex, lockedQuestions]);

  const triggerCorrectFeedback = () => {
    if (!soundEnabled) return;
    playCorrectSound();
    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate(45);
      } catch (e) {}
    }
  };

  const triggerIncorrectFeedback = () => {
    if (!soundEnabled) return;
    playIncorrectSound();
    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate([0, 70, 50, 70, 50, 130]);
      } catch (e) {}
    }
  };

  const handleLanguageChange = (code) => {
    setUiLang(code);
    setQuizLang(code);
  };

  const handleLogin = async () => {
    setAuthError('');
    if (!loginIdentifier.trim() || !loginPassword) {
      setAuthError(t.auth.fillRequired);
      return;
    }
    setIsSubmittingAuth(true);
    try {
      const bundle = await loginUser({
        identifier: loginIdentifier.trim(),
        email: loginIdentifier.trim(),
        username: loginIdentifier.trim(),
        password: loginPassword,
      });
      setUserBundle(bundle);
      setActiveTab('Dashboard');
    } catch (err) {
      setAuthError(err.message || 'Login error');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleRegister = async () => {
    setAuthError('');
    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setAuthError(t.auth.fillRequired);
      return;
    }
    if (password.length < 6) {
      setAuthError(t.auth.passwordTooShort);
      return;
    }
    if (password !== confirmPassword) {
      setAuthError(t.auth.passwordMismatch);
      return;
    }
    setIsSubmittingAuth(true);
    try {
      const bundle = await registerUser({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        countryCode,
        avatarUrl: selectedAvatar,
      });
      setUserBundle(bundle);
      setActiveTab('Dashboard');
    } catch (err) {
      setAuthError(err.message || 'Registration error');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUserBundle(null);
    setActiveQuiz(null);
    setLastQuizResult(null);
    setLoginIdentifier('');
    setLoginPassword('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setActiveTab('Dashboard');
  };

  const handleStartTopicQuiz = (topicId) => {
    const topic = TOPICS.find((tp) => tp.id === topicId);
    if (!topic) return;
    const subject = SUBJECTS[topic.subjectId];
    const category = CATEGORIES.find((c) => c.id === topic.categoryId) || CATEGORIES[0];
    const questions = getQuestionsForTopic(topicId);

    setActiveQuiz({
      topic,
      subject,
      category,
      questions,
      language: quizLang,
    });
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setLockedQuestions({});
    quizStartRef.current = Date.now();
    setActiveTab('Quiz');
  };

  const handleSelectOption = (optIdx) => {
    if (!activeQuiz) return;
    const currentQ = activeQuiz.questions[currentQIndex];
    if (!currentQ || lockedQuestions[currentQ.id]) return;

    const isCorrect = optIdx === currentQ.correctIndex;
    if (isCorrect) {
      triggerCorrectFeedback();
    } else {
      triggerIncorrectFeedback();
    }

    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
    setLockedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  const handleNextOrFinishQuiz = async () => {
    if (!activeQuiz) return;
    const questions = activeQuiz.questions;
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      if (soundEnabled) playCompleteSound();
      const durationSeconds = Math.max(
        1,
        Math.round((Date.now() - quizStartRef.current) / 1000)
      );
      const res = await submitCompletedQuiz({
        userId: userBundle.profile.id,
        categoryId: activeQuiz.category.id,
        subjectId: activeQuiz.subject.id,
        topicId: activeQuiz.topic.id,
        quizLanguage: quizLang,
        questions,
        selectedAnswers,
        durationSeconds,
      });
      if (res?.bundle) {
        setUserBundle(res.bundle);
      }
      setLastQuizResult({
        ...res,
        topic: activeQuiz.topic,
        subject: activeQuiz.subject,
      });
      setActiveTab('QuizResults');
    }
  };

  // Auto-advance to the next question after answering (950ms visual & sound feedback)
  useEffect(() => {
    if (activeTab !== 'Quiz' || !activeQuiz) return;
    const currentQ = activeQuiz.questions?.[currentQIndex];
    if (!currentQ || !lockedQuestions[currentQ.id]) return;

    const autoTimer = setTimeout(() => {
      handleNextOrFinishQuiz();
    }, 950);

    return () => clearTimeout(autoTimer);
  }, [activeTab, activeQuiz, currentQIndex, lockedQuestions]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>NeuroQuiz Global...</Text>
      </SafeAreaView>
    );
  }

  // ==================== AUTHENTICATION SCREEN (OXYY SPLIT DESIGN) ====================
  if (!userBundle?.profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#0c1626' }]}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.authScroll}>
          <View style={styles.oxyyWrapper}>
            {/* LEFT / TOP BLUE HERO PANEL */}
            <View style={styles.oxyyBluePanel}>
              <View style={styles.oxyyTopRow}>
                <View style={styles.brandRow}>
                  <Image
                    source={require('./assets/icon.png')}
                    style={{ width: 34, height: 34, borderRadius: 8 }}
                  />
                  <Text style={styles.oxyyLogo}>Oxyy</Text>
                </View>
                <View style={styles.oxyyLangPill}>
                  {LANGUAGES.map((l) => (
                    <TouchableOpacity
                      key={l.code}
                      onPress={() => handleLanguageChange(l.code)}
                      style={[
                        styles.oxyyLangBtn,
                        uiLang === l.code && styles.oxyyLangBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.oxyyLangBtnText,
                          uiLang === l.code && styles.oxyyLangBtnTextActive,
                        ]}
                      >
                        {l.short}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.oxyyHeroBody}>
                <Text style={styles.oxyyHeroTitle}>
                  {authMode === 'login' ? 'Welcome back!' : "You're new here!"}
                </Text>
                <Text style={styles.oxyyHeroSub}>
                  {authMode === 'login'
                    ? 'We are glad to see you again! Get access to your Orders, Wishlist and Recommendations.'
                    : 'Sign up with your email and personal details to get started with your Level 1 learning profile.'}
                </Text>
              </View>
            </View>

            {/* RIGHT / BOTTOM WHITE FORM PANEL */}
            <View style={styles.oxyyWhitePanel}>
              <Text style={styles.oxyyFormHeading}>
                {authMode === 'login' ? 'Log In' : 'Sign Up'}
              </Text>

              {authError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠️ {authError}</Text>
                </View>
              ) : null}

              {authMode === 'login' ? (
                <View style={styles.formGroup}>
                  <Text style={styles.oxyyLabel}>Email Address</Text>
                  <TextInput
                    style={styles.oxyyInput}
                    value={loginIdentifier}
                    onChangeText={setLoginIdentifier}
                    placeholder="Enter Your Email"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Text style={styles.oxyyLabel}>Password</Text>
                  <TextInput
                    style={styles.oxyyInput}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    placeholder="Enter Password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <View style={styles.oxyyRememberRow}>
                    <Text style={styles.oxyyRememberText}>☐ Remember Me</Text>
                    <Text style={styles.oxyyForgotText}>Forgot Password ?</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.oxyySubmitBtn}
                    onPress={handleLogin}
                    disabled={isSubmittingAuth}
                  >
                    <Text style={styles.oxyySubmitBtnText}>
                      {isSubmittingAuth ? t.auth.processing : 'Login'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.oxyySwitchRow}>
                    <Text style={styles.oxyySwitchPrompt}>
                      Don&apos;t have an account?{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setAuthMode('register');
                        setAuthError('');
                      }}
                    >
                      <Text style={styles.oxyySwitchLink}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.formGroup}>
                  <Text style={styles.oxyyLabel}>Full Name</Text>
                  <TextInput
                    style={styles.oxyyInput}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter Your Full Name"
                    placeholderTextColor="#94A3B8"
                    autoCorrect={false}
                  />

                  <Text style={styles.oxyyLabel}>Username</Text>
                  <TextInput
                    style={styles.oxyyInput}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter Username"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Text style={styles.oxyyLabel}>Country</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.countryScroll}
                  >
                    {COUNTRIES.slice(0, 10).map((c) => (
                      <TouchableOpacity
                        key={c.code}
                        onPress={() => setCountryCode(c.code)}
                        style={[
                          styles.countryChip,
                          countryCode === c.code && styles.oxyyCountryChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.countryChipText,
                            countryCode === c.code && styles.countryChipTextActive,
                          ]}
                        >
                          {c.flag} {getCountryByCode(c.code, uiLang).name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.oxyyLabel}>Email Address</Text>
                  <TextInput
                    style={styles.oxyyInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter Your Email"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />

                  <Text style={styles.oxyyLabel}>Password</Text>
                  <TextInput
                    style={styles.oxyyInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter Password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Text style={styles.oxyyLabel}>Confirm Password</Text>
                  <TextInput
                    style={styles.oxyyInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {/* AVATAR PICKER AT THE END AFTER LOGIN & 2X PASSWORD */}
                  <Text style={styles.oxyyLabel}>{t.auth.selectAvatar}</Text>
                  <View style={styles.avatarGrid}>
                    {AVATAR_PRESETS.map((av, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setSelectedAvatar(av)}
                        style={[
                          styles.avatarChoice,
                          selectedAvatar === av && styles.oxyyAvatarSelected,
                        ]}
                      >
                        <Image source={{ uri: av }} style={styles.avatarImg} />
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.oxyySubmitBtn}
                    onPress={handleRegister}
                    disabled={isSubmittingAuth}
                  >
                    <Text style={styles.oxyySubmitBtnText}>
                      {isSubmittingAuth ? t.auth.processing : 'Sign Up'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.oxyySwitchRow}>
                    <Text style={styles.oxyySwitchPrompt}>
                      Already have an account?{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setAuthMode('login');
                        setAuthError('');
                      }}
                    >
                      <Text style={styles.oxyySwitchLink}>Log In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ==================== AUTHENTICATED MAIN APP ====================
  const { profile, levelInfo, subjectProgress, achievements } = userBundle;
  const country = getCountryByCode(profile.country_code, uiLang);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Mobile Navigation Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('Dashboard')}
          style={styles.brandRow}
        >
          <Image
            source={require('./assets/icon.png')}
            style={{ width: 32, height: 32, borderRadius: 8 }}
          />
          <Text style={styles.topBarTitle}>NeuroQuiz</Text>
        </TouchableOpacity>

        <View style={styles.topBarRight}>
          {/* Language Switcher */}
          <View style={styles.langPillSmall}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                onPress={() => handleLanguageChange(l.code)}
                style={[
                  styles.langBtnSmall,
                  uiLang === l.code && styles.langBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.langBtnTextSmall,
                    uiLang === l.code && styles.langBtnTextActive,
                  ]}
                >
                  {l.short}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* XP Badge */}
          <View style={styles.xpPill}>
            <Text style={styles.xpPillText}>
              {t.levelAbbr}
              {levelInfo.level} • {levelInfo.totalXp} XP
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutTopBtn}>
            <Text style={styles.logoutTopBtnText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.mainScroll}>
        {/* 1. DASHBOARD */}
        {activeTab === 'Dashboard' && (
          <View style={styles.sectionGap}>
            {/* Hero Welcome Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroUserRow}>
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={styles.heroAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroWelcome}>{t.dashboard.welcome} 👋</Text>
                  <Text style={styles.heroName}>
                    {profile.full_name} {country.flag}
                  </Text>
                  <Text style={styles.heroUsername}>@{profile.username}</Text>
                </View>
              </View>

              {/* Level Progress Bar */}
              <View style={styles.levelBox}>
                <View style={styles.levelRow}>
                  <Text style={styles.levelLabelText}>
                    🔥 {t.levelLabel} {levelInfo.level}
                  </Text>
                  <Text style={styles.levelXpText}>
                    {levelInfo.totalXp} / {levelInfo.nextLevelXp} XP
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${levelInfo.progressPercent}%` },
                    ]}
                  />
                </View>
              </View>

              {/* Big START LEARNING Button */}
              <TouchableOpacity
                style={styles.startLearningBtn}
                onPress={() => setActiveTab('Explore')}
              >
                <Text style={styles.startLearningBtnText}>
                  ▶ {t.dashboard.startLearning}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 4 Key Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{profile.total_xp}</Text>
                <Text style={styles.statLabel}>{t.dashboard.totalPoints}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{profile.completed_quizzes}</Text>
                <Text style={styles.statLabel}>
                  {t.dashboard.completedQuizzes}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{profile.correct_answers}</Text>
                <Text style={styles.statLabel}>
                  {t.dashboard.correctAnswers}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {profile.accuracy_percentage}%
                </Text>
                <Text style={styles.statLabel}>{t.dashboard.accuracyRate}</Text>
              </View>
            </View>

            {/* 4 Categories Quick Access */}
            <Text style={styles.sectionHeading}>
              {t.dashboard.fourPillarsTitle}
            </Text>
            {Object.values(CATEGORIES).map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCard}
                onPress={() => {
                  setSelectedCategoryId(cat.id);
                  const subjs = getSubjectsByCategory(cat.id);
                  if (subjs[0]) setSelectedSubjectId(subjs[0].id);
                  setActiveTab('Explore');
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.categoryTitle}>
                    {cat.title[uiLang] || cat.title.en}
                  </Text>
                  <Text style={styles.categoryDesc}>
                    {cat.description[uiLang] || cat.description.en}
                  </Text>
                </View>
                <Text style={styles.categoryArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 2. EXPLORE CATEGORIES, SUBJECTS & TOPICS */}
        {activeTab === 'Explore' && (
          <View style={styles.sectionGap}>
            <Text style={styles.pageTitle}>{t.explore.title}</Text>

            {/* Category Selector */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {Object.values(CATEGORIES).map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      setSelectedCategoryId(cat.id);
                      const subjs = getSubjectsByCategory(cat.id);
                      if (subjs[0]) setSelectedSubjectId(subjs[0].id);
                    }}
                    style={[
                      styles.catTab,
                      isSelected && styles.catTabActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.catTabText,
                        isSelected && styles.catTabTextActive,
                      ]}
                    >
                      {cat.title[uiLang] || cat.title.en}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Subject Selector (e.g. HTML, CSS, React JS for Programming) */}
            {getSubjectsByCategory(selectedCategoryId).length > 1 && (
              <View style={styles.subjectRow}>
                {getSubjectsByCategory(selectedCategoryId).map((subj) => {
                  const isSubjSelected = selectedSubjectId === subj.id;
                  const sLevel =
                    subjectProgress?.[subj.id]?.subject_level || 1;
                  return (
                    <TouchableOpacity
                      key={subj.id}
                      onPress={() => setSelectedSubjectId(subj.id)}
                      style={[
                        styles.subjBtn,
                        isSubjSelected && styles.subjBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.subjBtnText,
                          isSubjSelected && styles.subjBtnTextActive,
                        ]}
                      >
                        {subj.name[uiLang] || subj.name.en} ({t.levelAbbr}
                        {sLevel})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Topics List */}
            {getTopicsBySubject(selectedSubjectId).map((topic, idx) => (
              <View key={topic.id} style={styles.topicCard}>
                <View style={styles.topicHeader}>
                  <View style={styles.topicNumBadge}>
                    <Text style={styles.topicNumText}>#{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.topicTitle}>
                      {topic.title[uiLang] || topic.title.en}
                    </Text>
                    <Text style={styles.topicMeta}>
                      10 {t.explore.questionsCount} •{' '}
                      {t.explore.difficulty[topic.difficultyTier] ||
                        topic.difficultyTier}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.startQuizBtn}
                  onPress={() => handleStartTopicQuiz(topic.id)}
                >
                  <Text style={styles.startQuizBtnText}>
                    ▶ {t.explore.startTopicQuiz}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* 3. INTERACTIVE QUIZ SCREEN WITH SOUND EFFECTS */}
        {activeTab === 'Quiz' && activeQuiz && (
          <View style={styles.sectionGap}>
            {(() => {
              const questions = activeQuiz.questions || [];
              const currentQ = questions[currentQIndex];
              if (!currentQ) return null;
              const isLocked = Boolean(lockedQuestions[currentQ.id]);
              const selectedIdx = selectedAnswers[currentQ.id];

              return (
                <>
                  {/* Quiz Header */}
                  <View style={styles.quizHeaderCard}>
                    <View style={styles.quizTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.quizSubjectTag}>
                          {activeQuiz.subject.name[quizLang] ||
                            activeQuiz.subject.name.en}
                        </Text>
                        <Text style={styles.quizTopicTitle}>
                          {activeQuiz.topic.title[quizLang] ||
                            activeQuiz.topic.title.en}
                        </Text>
                      </View>

                      {/* Sound Toggle Button */}
                      <TouchableOpacity
                        onPress={() => {
                          const next = !soundEnabled;
                          setSoundEnabled(next);
                          if (next) playCorrectSound();
                        }}
                        style={styles.soundBtn}
                      >
                        <Text style={styles.soundBtnText}>
                          {soundEnabled ? '🔊 Ovoz' : '🔇 Mute'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.quizMetaRow}>
                      <Text style={styles.quizProgressText}>
                        {t.quiz.questionOf} {currentQIndex + 1} /{' '}
                        {questions.length}
                      </Text>
                      <Text style={styles.quizTimerText}>⏱ {timeLeft}s</Text>
                    </View>
                  </View>

                  {/* Question Card */}
                  <View style={styles.questionCard}>
                    <Text style={styles.questionText}>
                      {currentQ.question[quizLang] || currentQ.question.en}
                    </Text>

                    {/* 4 Options */}
                    <View style={styles.optionsList}>
                      {currentQ.options.map((opt, idx) => {
                        const isSelected = selectedIdx === idx;
                        const isCorrectOpt = idx === currentQ.correctIndex;

                        let optStyle = styles.optionBtn;
                        let optTextStyle = styles.optionText;

                        if (isLocked) {
                          if (isCorrectOpt) {
                            optStyle = [styles.optionBtn, styles.optionCorrect];
                            optTextStyle = [
                              styles.optionText,
                              styles.optionTextCorrect,
                            ];
                          } else if (isSelected && !isCorrectOpt) {
                            optStyle = [styles.optionBtn, styles.optionWrong];
                            optTextStyle = [
                              styles.optionText,
                              styles.optionTextWrong,
                            ];
                          }
                        }

                        return (
                          <TouchableOpacity
                            key={idx}
                            disabled={isLocked}
                            onPress={() => handleSelectOption(idx)}
                            style={optStyle}
                          >
                            <View style={styles.optionLetterBadge}>
                              <Text style={styles.optionLetterText}>
                                {OPTION_LETTERS[idx]}
                              </Text>
                            </View>
                            <Text style={optTextStyle}>
                              {opt[quizLang] || opt.en}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Explanation & Next Button */}
                    {isLocked && (
                      <View style={styles.explanationBox}>
                        <Text style={styles.explanationTitle}>
                          {selectedIdx === currentQ.correctIndex
                            ? `✅ ${t.quiz.correctBadge}`
                            : `❌ ${t.quiz.incorrectBadge}`}
                        </Text>
                        <Text style={styles.explanationText}>
                          {currentQ.explanation[quizLang] ||
                            currentQ.explanation.en}
                        </Text>

                        <TouchableOpacity
                          style={styles.primaryBtn}
                          onPress={handleNextOrFinishQuiz}
                        >
                          <Text style={styles.primaryBtnText}>
                            {currentQIndex < questions.length - 1
                              ? `${t.quiz.nextQuestion} →`
                              : `${t.quiz.finishQuiz} ✓`}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </>
              );
            })()}
          </View>
        )}

        {/* 4. QUIZ RESULTS & REVIEW ANSWERS */}
        {activeTab === 'QuizResults' && lastQuizResult && (
          <View style={styles.sectionGap}>
            <View style={styles.resultHeroCard}>
              <Text style={styles.resultBigScore}>
                {lastQuizResult.attempt.score_points} / 10
              </Text>
              <Text style={styles.resultTitle}>{t.results.title}</Text>
              <Text style={styles.resultSub}>
                +{lastQuizResult.attempt.earned_xp} XP •{' '}
                {lastQuizResult.attempt.accuracy_percentage}%{' '}
                {t.results.accuracy}
              </Text>

              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() =>
                    handleStartTopicQuiz(lastQuizResult.topic.id)
                  }
                >
                  <Text style={styles.primaryBtnText}>
                    🔄 {t.results.retryTopic}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => setActiveTab('Explore')}
                >
                  <Text style={styles.secondaryBtnText}>
                    {t.results.chooseAnotherTopic}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionHeading}>{t.results.reviewAnswers}</Text>
            {(lastQuizResult.reviewItems || []).map((item, i) => (
              <View key={i} style={styles.reviewCard}>
                <Text style={styles.reviewQ}>
                  #{i + 1}. {item.questionText[quizLang] || item.questionText.en}
                </Text>
                <Text
                  style={[
                    styles.reviewAns,
                    { color: item.isCorrect ? '#059669' : '#E11D48' },
                  ]}
                >
                  {item.isCorrect ? '✅' : '❌'} {t.results.yourAnswer}:{' '}
                  {item.selectedOptionText
                    ? item.selectedOptionText[quizLang] ||
                      item.selectedOptionText.en
                    : t.results.noAnswerTimedOut}
                </Text>
                {!item.isCorrect && (
                  <Text style={[styles.reviewAns, { color: '#059669' }]}>
                    ✔ {t.results.correctAnswer}:{' '}
                    {item.correctOptionText[quizLang] ||
                      item.correctOptionText.en}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 5. GLOBAL LEADERBOARD */}
        {activeTab === 'Leaderboard' && (
          <View style={styles.sectionGap}>
            <Text style={styles.pageTitle}>{t.leaderboard.title}</Text>

            {!levelInfo.leaderboardUnlocked && (
              <View style={styles.lockBanner}>
                <Text style={styles.lockBannerTitle}>
                  🔒 {t.leaderboard.lockedBannerTitle}
                </Text>
                <Text style={styles.lockBannerDesc}>
                  {t.leaderboard.lockedBannerDesc} ({levelInfo.totalXp} / 400 XP)
                </Text>
              </View>
            )}

            {leaderboardList.map((comp, index) => (
              <View key={comp.id} style={styles.leaderRow}>
                <Text style={styles.leaderRank}>#{index + 1}</Text>
                <Image
                  source={{ uri: comp.avatar_url }}
                  style={styles.leaderAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.leaderName}>
                    {comp.full_name}{' '}
                    {getCountryByCode(comp.country_code, uiLang).flag}
                  </Text>
                  <Text style={styles.leaderMeta}>
                    @{comp.username} • {t.levelLabel} {comp.current_level}
                  </Text>
                </View>
                <Text style={styles.leaderXp}>{comp.total_xp} XP</Text>
              </View>
            ))}
          </View>
        )}

        {/* 6. ACHIEVEMENTS */}
        {activeTab === 'Achievements' && (
          <View style={styles.sectionGap}>
            <Text style={styles.pageTitle}>{t.achievements.title}</Text>
            {ACHIEVEMENTS_CATALOG.map((ach) => {
              const isUnlocked = (achievements || []).some(
                (a) => a.achievement_id === ach.id
              );
              return (
                <View
                  key={ach.id}
                  style={[
                    styles.achCard,
                    !isUnlocked && { opacity: 0.6 },
                  ]}
                >
                  <Text style={styles.achIcon}>
                    {isUnlocked ? '🏆' : '🔒'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.achTitle}>
                      {ach.title[uiLang] || ach.title.en}
                    </Text>
                    <Text style={styles.achDesc}>
                      {ach.description[uiLang] || ach.description.en}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* 7. PROFILE & LOGOUT */}
        {activeTab === 'Profile' && (
          <View style={styles.sectionGap}>
            <View style={styles.profileCard}>
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.profileBigAvatar}
              />
              <Text style={styles.profileName}>
                {profile.full_name} {country.flag}
              </Text>
              <Text style={styles.profileUsername}>@{profile.username}</Text>
              <Text style={styles.profileLevelBadge}>
                {t.levelLabel} {levelInfo.level} • {profile.total_xp} XP
              </Text>

              <TouchableOpacity
                style={styles.logoutFullBtn}
                onPress={handleLogout}
              >
                <Text style={styles.logoutFullBtnText}>
                  🚪 {t.nav.logout}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomNav}>
        {[
          { id: 'Dashboard', icon: '🏠', label: t.nav.dashboard },
          { id: 'Explore', icon: '🧭', label: t.nav.explore },
          { id: 'Achievements', icon: '🎖', label: t.nav.achievements },
          { id: 'Profile', icon: '👤', label: t.nav.profile },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={styles.bottomNavItem}
            >
              <Text style={styles.bottomNavIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.bottomNavLabel,
                  active && styles.bottomNavLabelActive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7FF' },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#F8F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  authScroll: { padding: 16, paddingBottom: 40 },
  oxyyWrapper: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  oxyyBluePanel: {
    backgroundColor: '#0062FF',
    padding: 24,
    minHeight: 210,
    justifyContent: 'space-between',
  },
  oxyyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  oxyyLogo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  oxyyLangPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 3,
    borderRadius: 6,
  },
  oxyyLangBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  oxyyLangBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  oxyyLangBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  oxyyLangBtnTextActive: {
    color: '#0062FF',
  },
  oxyyHeroBody: {
    marginTop: 22,
    marginBottom: 8,
  },
  oxyyHeroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  oxyyHeroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 19,
  },
  oxyyWhitePanel: {
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  oxyyFormHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 18,
  },
  oxyyLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
    marginTop: 4,
  },
  oxyyInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 4,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1E293B',
  },
  oxyyRememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  oxyyRememberText: {
    fontSize: 12,
    color: '#475569',
  },
  oxyyForgotText: {
    fontSize: 12,
    color: '#0D6EFD',
    fontWeight: '500',
  },
  oxyySubmitBtn: {
    backgroundColor: '#0D6EFD',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  oxyySubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  oxyySwitchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  oxyySwitchPrompt: {
    fontSize: 12,
    color: '#64748B',
  },
  oxyySwitchLink: {
    fontSize: 12,
    color: '#0D6EFD',
    fontWeight: '600',
  },
  oxyyCountryChipActive: {
    backgroundColor: '#0D6EFD',
  },
  oxyyAvatarSelected: {
    borderColor: '#0D6EFD',
    backgroundColor: '#EFF6FF',
  },
  authHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: { fontSize: 18, color: '#FFF' },
  brandTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  brandSub: { fontSize: 10, color: '#64748B' },
  langPill: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 3,
    borderRadius: 10,
  },
  langBtn: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  langBtnActive: { backgroundColor: '#FFF' },
  langBtnText: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
  langBtnTextActive: { color: '#4F46E5' },
  authCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderRadius: 14,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: '#FFF' },
  tabBtnText: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  tabBtnTextActive: { color: '#4F46E5' },
  authTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  authSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 14,
  },
  errorBox: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  errorText: { color: '#BE123C', fontSize: 12, fontWeight: '600' },
  formGroup: { gap: 10 },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
  countryScroll: { flexDirection: 'row', marginVertical: 4 },
  countryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  countryChipActive: { backgroundColor: '#4F46E5' },
  countryChipText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  countryChipTextActive: { color: '#FFF' },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarChoice: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  avatarChoiceSelected: { borderColor: '#4F46E5' },
  avatarImg: { width: '100%', height: '100%' },
  guaranteeBox: {
    backgroundColor: '#EEF2FF',
    padding: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  guaranteeText: { fontSize: 11, color: '#312E81', fontWeight: '600' },
  primaryBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  secondaryBtn: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryBtnText: { color: '#4F46E5', fontWeight: '800', fontSize: 13 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  logoBadgeSmall: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconSmall: { fontSize: 14, color: '#FFF' },
  topBarTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  langPillSmall: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 2,
    borderRadius: 8,
  },
  langBtnSmall: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  langBtnTextSmall: { fontSize: 10, fontWeight: 'bold', color: '#64748B' },
  xpPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  xpPillText: { fontSize: 11, fontWeight: '800', color: '#4F46E5' },
  logoutTopBtn: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  logoutTopBtnText: { fontSize: 13 },
  mainScroll: { padding: 16, paddingBottom: 32 },
  sectionGap: { gap: 14 },
  heroCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  heroUserRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF',
  },
  heroWelcome: { fontSize: 11, color: '#A5B4FC', fontWeight: 'bold' },
  heroName: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  heroUsername: { fontSize: 12, color: '#C7D2FE' },
  levelBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 14,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelLabelText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  levelXpText: { color: '#C7D2FE', fontWeight: 'bold', fontSize: 12 },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#6366F1' },
  startLearningBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  startLearningBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  statValue: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 2 },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  categoryCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  categoryDesc: { fontSize: 12, color: '#64748B', marginTop: 3 },
  categoryArrow: { fontSize: 18, fontWeight: 'bold', color: '#4F46E5' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  horizontalScroll: { flexDirection: 'row', marginVertical: 4 },
  catTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catTabActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  catTabText: { fontSize: 12, fontWeight: 'bold', color: '#334155' },
  catTabTextActive: { color: '#FFF' },
  subjectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  subjBtnActive: { backgroundColor: '#312E81' },
  subjBtnText: { fontSize: 12, fontWeight: 'bold', color: '#4F46E5' },
  subjBtnTextActive: { color: '#FFF' },
  topicCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    gap: 12,
  },
  topicHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topicNumBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  topicNumText: { fontSize: 12, fontWeight: '800', color: '#4F46E5' },
  topicTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  topicMeta: { fontSize: 11, color: '#64748B', marginTop: 2 },
  startQuizBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  startQuizBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  quizHeaderCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    gap: 10,
  },
  quizTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizSubjectTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  quizTopicTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  soundBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  soundBtnText: { fontSize: 11, fontWeight: 'bold', color: '#4F46E5' },
  quizMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  quizProgressText: { fontSize: 12, fontWeight: 'bold', color: '#334155' },
  quizTimerText: { fontSize: 12, fontWeight: 'bold', color: '#4F46E5' },
  questionCard: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    gap: 14,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
  },
  optionsList: { gap: 10 },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F8F7FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  optionCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  optionWrong: {
    backgroundColor: '#FFF1F2',
    borderColor: '#F43F5E',
    borderWidth: 2,
  },
  optionLetterBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  optionLetterText: { fontSize: 12, fontWeight: '800', color: '#4F46E5' },
  optionText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1E293B' },
  optionTextCorrect: { color: '#065F46', fontWeight: '800' },
  optionTextWrong: { color: '#9F1239', fontWeight: '800' },
  explanationBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  explanationTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  explanationText: { fontSize: 12, color: '#475569', lineHeight: 18 },
  resultHeroCard: {
    backgroundColor: '#FFF',
    padding: 22,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  resultBigScore: { fontSize: 36, fontWeight: '900', color: '#4F46E5' },
  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  resultSub: { fontSize: 13, color: '#64748B', marginTop: 4 },
  resultActions: { width: '100%', marginTop: 14 },
  reviewCard: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  reviewQ: { fontSize: 13, fontWeight: 'bold', color: '#0F172A' },
  reviewAns: { fontSize: 12, fontWeight: '600' },
  lockBanner: {
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  lockBannerTitle: { fontSize: 13, fontWeight: '800', color: '#92400E' },
  lockBannerDesc: { fontSize: 11, color: '#B45309', marginTop: 4 },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  leaderRank: {
    width: 28,
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
  },
  leaderAvatar: { width: 40, height: 40, borderRadius: 12 },
  leaderName: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
  leaderMeta: { fontSize: 11, color: '#64748B' },
  leaderXp: { fontSize: 13, fontWeight: '800', color: '#4F46E5' },
  achCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  achIcon: { fontSize: 24 },
  achTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
  achDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },
  profileCard: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    gap: 8,
  },
  profileBigAvatar: { width: 84, height: 84, borderRadius: 24 },
  profileName: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  profileUsername: { fontSize: 13, color: '#4F46E5', fontWeight: 'bold' },
  profileLevelBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
    marginTop: 4,
  },
  logoutFullBtn: {
    marginTop: 16,
    width: '100%',
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutFullBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  bottomNavIcon: { fontSize: 16 },
  bottomNavLabel: { fontSize: 10, fontWeight: '600', color: '#64748B' },
  bottomNavLabelActive: { color: '#4F46E5', fontWeight: '800' },
});
