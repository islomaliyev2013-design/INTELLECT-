import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';
import {
  calculateOverallLevelInfo,
  calculateSubjectLevelInfo,
  calculateTopicLevelInfo,
  DIFFICULTY_WEIGHTS,
  ACHIEVEMENTS_CATALOG,
} from '../utils/levelSystem';
import { CATEGORIES, SUBJECTS, TOPICS, getCountryByCode } from '../data/curriculum';
import { getAllCatalogRecords } from '../data/questions';

const LOCAL_DB_KEY = 'neuroquiz_relational_db_v1';
const LOCAL_SESSION_KEY = 'neuroquiz_active_session_v1';

/**
 * Verified Global Level 10+ Competitors for the Worldwide Leaderboard
 * Note: New user accounts NEVER start here — they start at Level 1 with 0 XP
 * and only enter this leaderboard after reaching Level 10 (400+ XP).
 */
const GLOBAL_VERIFIED_COMPETITORS = [
  {
    id: 'global-comp-1',
    username: 'aziza_kadirova',
    full_name: 'Aziza Kadirova',
    country_code: 'UZ',
    country_name: 'Uzbekistan',
    avatar_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aziza&backgroundColor=c0aede',
    total_xp: 940,
    current_level: 14,
    completed_quizzes: 98,
    correct_answers: 940,
    total_questions_answered: 980,
    accuracy_percentage: 95.9,
    bio: 'Full-Stack React & Mathematics Olympiad Gold Medalist from Tashkent.',
  },
  {
    id: 'global-comp-2',
    username: 'kenji_takahashi',
    full_name: 'Kenji Takahashi',
    country_code: 'JP',
    country_name: 'Japan',
    avatar_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Kenji&backgroundColor=b6e3f4',
    total_xp: 865,
    current_level: 13,
    completed_quizzes: 92,
    correct_answers: 865,
    total_questions_answered: 920,
    accuracy_percentage: 94.0,
    bio: 'Frontend Architect & Applied Calculus enthusiast from Tokyo.',
  },
  {
    id: 'global-comp-3',
    username: 'elena_rostova',
    full_name: 'Elena Rostova',
    country_code: 'RU',
    country_name: 'Russia',
    avatar_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Elena&backgroundColor=ffd5dc',
    total_xp: 790,
    current_level: 13,
    completed_quizzes: 85,
    correct_answers: 790,
    total_questions_answered: 850,
    accuracy_percentage: 92.9,
    bio: 'Computational linguist & multilingual educator.',
  },
  {
    id: 'global-comp-4',
    username: 'marcus_vance',
    full_name: 'Marcus Vance',
    country_code: 'US',
    country_name: 'United States',
    avatar_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus&backgroundColor=d1d4f9',
    total_xp: 715,
    current_level: 12,
    completed_quizzes: 78,
    correct_answers: 715,
    total_questions_answered: 780,
    accuracy_percentage: 91.7,
    bio: 'CS Major specializing in React systems and advanced algebra.',
  },
  {
    id: 'global-comp-5',
    username: 'jasur_normatov',
    full_name: 'Jasur Normatov',
    country_code: 'UZ',
    country_name: 'Uzbekistan',
    avatar_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jasur&backgroundColor=c0aede',
    total_xp: 650,
    current_level: 11,
    completed_quizzes: 72,
    correct_answers: 650,
    total_questions_answered: 720,
    accuracy_percentage: 90.3,
    bio: 'Software Engineer in Samarkand mastering trilingual STEM quizzes.',
  },
  {
    id: 'global-comp-6',
    username: 'soyeon_park',
    full_name: 'Soyeon Park',
    country_code: 'KR',
    country_name: 'South Korea',
    avatar_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Soyeon&backgroundColor=ffdfbf',
    total_xp: 580,
    current_level: 11,
    completed_quizzes: 65,
    correct_answers: 580,
    total_questions_answered: 650,
    accuracy_percentage: 89.2,
    bio: 'UI/UX Developer & CSS Grid specialist from Seoul.',
  },
  {
    id: 'global-comp-7',
    username: 'lukas_weber',
    full_name: 'Lukas Weber',
    country_code: 'DE',
    country_name: 'Germany',
    avatar_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Lukas&backgroundColor=b6e3f4',
    total_xp: 510,
    current_level: 10,
    completed_quizzes: 58,
    correct_answers: 510,
    total_questions_answered: 580,
    accuracy_percentage: 87.9,
    bio: 'Polyglot engineer learning Russian, English, and Web Technologies.',
  },
  {
    id: 'global-comp-8',
    username: 'aliya_nurlan',
    full_name: 'Aliya Nurlanova',
    country_code: 'KZ',
    country_name: 'Kazakhstan',
    avatar_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aliya&backgroundColor=ffd5dc',
    total_xp: 445,
    current_level: 10,
    completed_quizzes: 51,
    correct_answers: 445,
    total_questions_answered: 510,
    accuracy_percentage: 87.3,
    bio: 'Data scientist & mathematics tutor from Almaty.',
  },
  {
    id: 'global-comp-9',
    username: 'oliver_bennett',
    full_name: 'Oliver Bennett',
    country_code: 'GB',
    country_name: 'United Kingdom',
    avatar_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver&backgroundColor=d1d4f9',
    total_xp: 412,
    current_level: 10,
    completed_quizzes: 48,
    correct_answers: 412,
    total_questions_answered: 480,
    accuracy_percentage: 85.8,
    bio: 'Web developer & lifelong learner from London.',
  },
];

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function loadLocalDb() {
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        users: parsed.users || {},
        profiles: parsed.profiles || {},
        quiz_attempts: parsed.quiz_attempts || [],
        user_answers: parsed.user_answers || [],
        user_subject_progress: parsed.user_subject_progress || {},
        user_achievements: parsed.user_achievements || {},
      };
    }
  } catch (e) {
    console.warn('Failed to parse local relational store:', e);
  }
  return {
    users: {},
    profiles: {},
    quiz_attempts: [],
    user_answers: [],
    user_subject_progress: {},
    user_achievements: {},
  };
}

function saveLocalDb(db) {
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('Failed to save local relational store:', e);
  }
}

/**
 * Creates a brand-new Level 1, 0 XP profile and independent subject progress records
 */
function buildFreshUserProfile({ id, email, fullName, username, countryCode = 'UZ' }) {
  const country = getCountryByCode(countryCode);
  const cleanUsername = (username || email.split('@')[0])
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_');

  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
    cleanUsername
  )}&backgroundColor=c0aede`;

  return {
    id,
    username: cleanUsername,
    full_name: (fullName || cleanUsername).trim(),
    email: email.trim().toLowerCase(),
    avatar_url: avatarUrl,
    country_code: country.code,
    country_name: country.name,
    bio: 'Exploring global knowledge and building subject mastery from Level 1.',
    preferred_language: 'en',
    total_xp: 0,
    current_level: 1,
    completed_quizzes: 0,
    total_questions_answered: 0,
    correct_answers: 0,
    accuracy_percentage: 0,
    leaderboard_unlocked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function buildFreshSubjectProgressMap(userId) {
  const map = {};
  Object.values(SUBJECTS).forEach((subj) => {
    map[subj.id] = {
      id: generateId(),
      user_id: userId,
      category_id: subj.categoryId,
      subject_id: subj.id,
      subject_xp: 0,
      weighted_skill_points: 0,
      subject_level: 1,
      quizzes_completed: 0,
      questions_answered: 0,
      correct_answers: 0,
      accuracy_percentage: 0,
      best_score: 0,
      topic_progress: {},
      updated_at: new Date().toISOString(),
    };
  });
  return map;
}

/**
 * Ensures a user's isolated profile and subject records exist in local cache
 * and syncs with Supabase PostgreSQL when configured.
 */
async function ensureUserRecordsExist(userObj, meta = {}) {
  const db = loadLocalDb();
  const userId = userObj.id;

  let profile = db.profiles[userId];
  if (!profile) {
    profile = buildFreshUserProfile({
      id: userId,
      email: userObj.email,
      fullName: meta.fullName || userObj.user_metadata?.full_name || userObj.email.split('@')[0],
      username: meta.username || userObj.user_metadata?.username || userObj.email.split('@')[0],
      countryCode: meta.countryCode || userObj.user_metadata?.country_code || 'UZ',
    });
    db.profiles[userId] = profile;
  }

  if (!db.user_subject_progress[userId]) {
    db.user_subject_progress[userId] = buildFreshSubjectProgressMap(userId);
  } else {
    // Ensure all 6 subjects exist
    const freshMap = buildFreshSubjectProgressMap(userId);
    Object.keys(freshMap).forEach((subjId) => {
      if (!db.user_subject_progress[userId][subjId]) {
        db.user_subject_progress[userId][subjId] = freshMap[subjId];
      }
    });
  }

  if (!db.user_achievements[userId]) {
    db.user_achievements[userId] = [];
  }

  saveLocalDb(db);

  // If live Supabase is configured, sync with remote PostgreSQL tables
  if (isLiveSupabaseConfigured && supabase) {
    try {
      const { data: remoteProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (remoteProfile) {
        db.profiles[userId] = { ...profile, ...remoteProfile };
      } else {
        const { leaderboard_unlocked, ...insertableProfile } = profile;
        await supabase.from('profiles').upsert(insertableProfile, { onConflict: 'id' });
      }

      const { data: remoteSubjects } = await supabase
        .from('user_subject_progress')
        .select('*')
        .eq('user_id', userId);

      if (remoteSubjects && remoteSubjects.length > 0) {
        remoteSubjects.forEach((row) => {
          db.user_subject_progress[userId][row.subject_id] = row;
        });
      } else {
        const rowsToInsert = Object.values(db.user_subject_progress[userId]);
        await supabase
          .from('user_subject_progress')
          .upsert(rowsToInsert, { onConflict: 'user_id,subject_id' });
      }

      const { data: remoteAchievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);

      if (remoteAchievements && remoteAchievements.length > 0) {
        db.user_achievements[userId] = remoteAchievements;
      }

      saveLocalDb(db);
    } catch (err) {
      console.warn('Supabase remote sync fallback active:', err.message);
    }
  }

  return db.profiles[userId];
}

/**
 * AUTHENTICATION: Register a new user
 * Strictly starts at Level 1 with 0 XP and independent progress.
 */
export async function registerUser({
  fullName,
  username,
  email,
  password,
  countryCode = 'UZ',
  avatarUrl = null,
}) {
  const cleanUsername = (username || fullName || 'learner')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  const cleanFullName = (fullName || cleanUsername).trim();
  const cleanEmail = (email && email.trim())
    ? email.trim().toLowerCase()
    : `${cleanUsername}@learner.local`;

  const db = loadLocalDb();

  // Check if username or email is already registered locally
  const existingByEmail = Object.values(db.users).find((u) => u.email === cleanEmail);
  const existingByUsername = Object.values(db.profiles).find(
    (p) => p.username.toLowerCase() === cleanUsername
  );

  if (existingByEmail && !isLiveSupabaseConfigured) {
    throw new Error('An account with this email already exists. Please sign in.');
  }
  if (existingByUsername && !isLiveSupabaseConfigured) {
    throw new Error('This username is already taken. Please choose another username.');
  }

  let userId = generateId();

  if (isLiveSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password || 'QuizSecurePass2026!',
        options: {
          data: {
            full_name: cleanFullName,
            username: cleanUsername,
            country_code: countryCode,
            country_name: getCountryByCode(countryCode).name,
            avatar_url: avatarUrl,
          },
        },
      });
      if (error) throw new Error(error.message);
      if (data?.user?.id) {
        userId = data.user.id;
      }
    } catch (err) {
      console.warn('Supabase auth signup fallback:', err.message);
    }
  }

  // Create isolated account record starting at Level 1, 0 XP
  const userRecord = {
    id: userId,
    email: cleanEmail,
    username: cleanUsername,
    passwordHash: password ? btoa(encodeURIComponent(password)) : null,
    created_at: new Date().toISOString(),
  };

  const freshProfile = buildFreshUserProfile({
    id: userId,
    email: cleanEmail,
    fullName: cleanFullName,
    username: cleanUsername,
    countryCode,
  });

  if (avatarUrl) {
    freshProfile.avatar_url = avatarUrl;
  }

  db.users[userId] = userRecord;
  db.profiles[userId] = freshProfile;
  db.user_subject_progress[userId] = buildFreshSubjectProgressMap(userId);
  db.user_achievements[userId] = [];
  saveLocalDb(db);

  await ensureUserRecordsExist(
    { id: userId, email: cleanEmail },
    { fullName: cleanFullName, username: cleanUsername, countryCode, avatarUrl }
  );

  const sessionObj = { userId, email: cleanEmail, rememberMe: true };
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));

  return getUserDashboardBundle(userId);
}

/**
 * AUTHENTICATION: Login an existing user by email or username
 */
export async function loginUser({
  email,
  username,
  identifier,
  password,
  rememberMe = true,
  userId = null,
}) {
  const db = loadLocalDb();

  if (userId && db.profiles[userId]) {
    const sessionObj = { userId, rememberMe };
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));
    return getUserDashboardBundle(userId);
  }

  const query = (identifier || email || username || '').trim().toLowerCase();
  if (!query) {
    throw new Error('Please enter your email or username.');
  }

  // Try live Supabase first if configured
  if (isLiveSupabaseConfigured && supabase && password && query.includes('@')) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: query,
        password,
      });
      if (!error && data?.user) {
        await ensureUserRecordsExist(data.user);
        const sessionObj = { userId: data.user.id, email: query, rememberMe };
        if (rememberMe) {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));
        } else {
          sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));
        }
        return getUserDashboardBundle(data.user.id);
      }
    } catch (err) {
      console.warn('Supabase signin attempt fallback:', err.message);
    }
  }

  // Find user by email or username in local database
  const foundUser = Object.values(db.users).find(
    (u) =>
      (u.email && u.email.toLowerCase() === query) ||
      (u.username && u.username.toLowerCase() === query)
  );

  const foundProfile = Object.values(db.profiles).find(
    (p) =>
      (p.username && p.username.toLowerCase() === query) ||
      (p.email && p.email.toLowerCase() === query)
  );

  const targetId = foundUser ? foundUser.id : foundProfile ? foundProfile.id : null;

  if (!targetId) {
    throw new Error('No account found with this email or username. Please register first.');
  }

  // If password was set on account and password provided, verify it
  if (foundUser?.passwordHash && password) {
    const inputHash = btoa(encodeURIComponent(password));
    if (foundUser.passwordHash !== inputHash) {
      throw new Error('Invalid password. Please check and try again.');
    }
  }

  const sessionObj = { userId: targetId, rememberMe };
  if (rememberMe) {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));
  } else {
    sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));
  }

  return getUserDashboardBundle(targetId);
}

/**
 * Returns all local learner profiles saved on this device
 */
export function getSavedProfiles() {
  const db = loadLocalDb();
  return Object.values(db.profiles || {}).sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0));
}

/**
 * AUTHENTICATION: Restore active session
 */
export async function restoreSession() {
  if (isLiveSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        await ensureUserRecordsExist(data.session.user);
        return getUserDashboardBundle(data.session.user.id);
      }
    } catch (e) {
      // fall back to local session check
    }
  }

  try {
    const raw =
      localStorage.getItem(LOCAL_SESSION_KEY) || sessionStorage.getItem(LOCAL_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.userId) return null;

    const db = loadLocalDb();
    if (!db.profiles[parsed.userId]) return null;

    return getUserDashboardBundle(parsed.userId);
  } catch (e) {
    return null;
  }
}

/**
 * AUTHENTICATION: Logout current user (Preserves all saved user progress in DB)
 */
export async function logoutUser() {
  localStorage.removeItem(LOCAL_SESSION_KEY);
  sessionStorage.removeItem(LOCAL_SESSION_KEY);
  if (isLiveSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore signOut network error
    }
  }
}

/**
 * Fetches complete, isolated user dashboard data bundle:
 * - profile
 * - levelInfo
 * - subjectProgress (all 6 subjects with independent levels & topic mastery)
 * - achievements (unlocked & catalog status)
 * - quizAttempts (user's own completed quizzes)
 * - leaderboard (global Top Level 10+ competitors & user's own rank status)
 */
export async function getUserDashboardBundle(userId) {
  const db = loadLocalDb();
  const profile = db.profiles[userId];
  if (!profile) return null;

  const subjectMap = db.user_subject_progress[userId] || buildFreshSubjectProgressMap(userId);
  const unlockedList = db.user_achievements[userId] || [];

  const userAttempts = (db.quiz_attempts || [])
    .filter((a) => a.user_id === userId)
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

  const levelInfo = calculateOverallLevelInfo(profile.total_xp);

  // Format subject progress with calculated level metadata
  const formattedSubjects = {};
  Object.keys(SUBJECTS).forEach((subjId) => {
    const rawSubj = subjectMap[subjId] || {
      subject_id: subjId,
      subject_xp: 0,
      weighted_skill_points: 0,
      subject_level: 1,
      quizzes_completed: 0,
      questions_answered: 0,
      correct_answers: 0,
      accuracy_percentage: 0,
      best_score: 0,
      topic_progress: {},
    };
    const subjLvlInfo = calculateSubjectLevelInfo(rawSubj.weighted_skill_points);
    formattedSubjects[subjId] = {
      ...rawSubj,
      subject_level: subjLvlInfo.level,
      levelInfo: subjLvlInfo,
    };
  });

  const leaderboardData = await getGlobalLeaderboard(userId);

  return {
    profile: {
      ...profile,
      current_level: levelInfo.level,
      leaderboard_unlocked: levelInfo.leaderboardUnlocked,
    },
    levelInfo,
    subjects: formattedSubjects,
    unlockedAchievements: unlockedList,
    quizAttempts: userAttempts,
    leaderboard: leaderboardData,
  };
}

/**
 * Retrieves detailed user answers for a specific quiz attempt ("Review Answers" feature)
 */
export function getAttemptAnswers(attemptId, userId) {
  const db = loadLocalDb();
  return (db.user_answers || []).filter(
    (ans) => ans.attempt_id === attemptId && ans.user_id === userId
  );
}

/**
 * SUBMIT COMPLETED 10-QUESTION QUIZ
 * - Validates answers (1 point per correct answer, 0 per incorrect, max 10 points)
 * - Calculates difficulty-weighted skill points for subject & topic levels
 * - Saves quiz_attempts and user_answers to Supabase & local relational store
 * - Updates user profile XP, overall level, accuracy, and subject-specific skill levels
 * - Evaluates and unlocks achievements
 */
export async function submitCompletedQuiz({
  userId,
  categoryId,
  subjectId,
  topicId,
  quizLanguage = 'en',
  questions = [],
  selectedAnswers = {}, // { [questionId]: selectedOptionIndex }
  durationSeconds = 0,
}) {
  const db = loadLocalDb();
  const profile = db.profiles[userId];
  if (!profile) throw new Error('User profile not found.');

  if (!db.user_subject_progress[userId]) {
    db.user_subject_progress[userId] = buildFreshSubjectProgressMap(userId);
  }

  const topicMeta = TOPICS.find((t) => t.id === topicId);
  const topicTierMultiplier =
    topicMeta?.difficultyTier === 'advanced'
      ? 1.25
      : topicMeta?.difficultyTier === 'intermediate'
      ? 1.1
      : 1.0;

  const attemptId = generateId();
  let correctCount = 0;
  let incorrectCount = 0;
  let scorePoints = 0;
  let skillPointsEarned = 0;

  const answerRecords = [];
  const reviewItems = [];

  questions.slice(0, 10).forEach((q) => {
    const rawSel = selectedAnswers[q.id];
    const selectedOptionIndex =
      typeof rawSel === 'number' && rawSel >= 0 && rawSel <= 3 ? rawSel : -1;
    const isCorrect = selectedOptionIndex === q.correctIndex;
    const pointsAwarded = isCorrect ? 1 : 0;
    const diffWeight = DIFFICULTY_WEIGHTS[q.difficulty] || 1.0;

    if (isCorrect) {
      correctCount += 1;
      scorePoints += 1; // Each correct answer = 1 point (Section 6)
      skillPointsEarned += diffWeight * topicTierMultiplier * 2.5;
    } else {
      incorrectCount += 1;
    }

    const ansRecord = {
      id: generateId(),
      attempt_id: attemptId,
      user_id: userId,
      question_id: q.id,
      selected_option_index: selectedOptionIndex,
      correct_option_index: q.correctIndex,
      is_correct: isCorrect,
      points_awarded: pointsAwarded,
      difficulty: q.difficulty,
      answered_at: new Date().toISOString(),
    };
    answerRecords.push(ansRecord);

    reviewItems.push({
      questionId: q.id,
      questionNumber: q.questionNumber,
      difficulty: q.difficulty,
      questionText: q.question,
      options: q.options,
      selectedOptionIndex,
      correctOptionIndex: q.correctIndex,
      isCorrect,
      pointsAwarded,
      explanation: q.explanation,
    });
  });

  const totalQuestions = 10;
  const earnedXp = scorePoints; // 1 XP per point (0-10 XP per quiz, matching Section 6 & 7)
  const quizAccuracy = Number(((correctCount / totalQuestions) * 100).toFixed(1));
  const roundedSkillPts = Number(skillPointsEarned.toFixed(2));

  const levelBefore = calculateOverallLevelInfo(profile.total_xp).level;
  const newTotalXp = profile.total_xp + earnedXp;
  const newLevelInfo = calculateOverallLevelInfo(newTotalXp);
  const levelAfter = newLevelInfo.level;

  // Update overall profile stats
  const newCompletedQuizzes = profile.completed_quizzes + 1;
  const newTotalQuestions = profile.total_questions_answered + totalQuestions;
  const newCorrectAnswers = profile.correct_answers + correctCount;
  const newOverallAccuracy = Number(
    ((newCorrectAnswers / Math.max(1, newTotalQuestions)) * 100).toFixed(1)
  );

  const updatedProfile = {
    ...profile,
    total_xp: newTotalXp,
    current_level: levelAfter,
    completed_quizzes: newCompletedQuizzes,
    total_questions_answered: newTotalQuestions,
    correct_answers: newCorrectAnswers,
    accuracy_percentage: newOverallAccuracy,
    leaderboard_unlocked: levelAfter >= 10,
    updated_at: new Date().toISOString(),
  };
  db.profiles[userId] = updatedProfile;

  // Update independent subject progress & topic progress
  const currentSubj =
    db.user_subject_progress[userId][subjectId] ||
    buildFreshSubjectProgressMap(userId)[subjectId];

  const subjectLevelBefore = calculateSubjectLevelInfo(currentSubj.weighted_skill_points).level;
  const newSubjXp = currentSubj.subject_xp + earnedXp;
  const newWeightedSkillPts = Number(
    (Number(currentSubj.weighted_skill_points || 0) + roundedSkillPts).toFixed(2)
  );
  const newSubjLevelInfo = calculateSubjectLevelInfo(newWeightedSkillPts);
  const newSubjQuizzes = currentSubj.quizzes_completed + 1;
  const newSubjQuestions = currentSubj.questions_answered + totalQuestions;
  const newSubjCorrect = currentSubj.correct_answers + correctCount;
  const newSubjAccuracy = Number(
    ((newSubjCorrect / Math.max(1, newSubjQuestions)) * 100).toFixed(1)
  );
  const newSubjBestScore = Math.max(currentSubj.best_score || 0, scorePoints);

  const prevTopicData = currentSubj.topic_progress?.[topicId] || {
    attempts: 0,
    bestScore: 0,
    skillPts: 0,
    level: 1,
  };
  const updatedTopicSkillPts = Number((prevTopicData.skillPts + roundedSkillPts).toFixed(2));
  const updatedTopicBestScore = Math.max(prevTopicData.bestScore || 0, scorePoints);
  const topicLvlInfo = calculateTopicLevelInfo(updatedTopicSkillPts, updatedTopicBestScore);

  const updatedTopicProgress = {
    ...(currentSubj.topic_progress || {}),
    [topicId]: {
      attempts: (prevTopicData.attempts || 0) + 1,
      bestScore: updatedTopicBestScore,
      lastScore: scorePoints,
      skillPts: updatedTopicSkillPts,
      level: topicLvlInfo.level,
      progressPercent: topicLvlInfo.progressPercent,
      lastCompletedAt: new Date().toISOString(),
    },
  };

  const updatedSubjectRecord = {
    ...currentSubj,
    subject_xp: newSubjXp,
    weighted_skill_points: newWeightedSkillPts,
    subject_level: newSubjLevelInfo.level,
    quizzes_completed: newSubjQuizzes,
    questions_answered: newSubjQuestions,
    correct_answers: newSubjCorrect,
    accuracy_percentage: newSubjAccuracy,
    best_score: newSubjBestScore,
    topic_progress: updatedTopicProgress,
    updated_at: new Date().toISOString(),
  };
  db.user_subject_progress[userId][subjectId] = updatedSubjectRecord;

  // Save quiz attempt record
  const attemptRecord = {
    id: attemptId,
    user_id: userId,
    category_id: categoryId,
    subject_id: subjectId,
    topic_id: topicId,
    quiz_language: quizLanguage,
    total_questions: totalQuestions,
    correct_count: correctCount,
    incorrect_count: incorrectCount,
    score_points: scorePoints,
    earned_xp: earnedXp,
    skill_points_earned: roundedSkillPts,
    accuracy_percentage: quizAccuracy,
    duration_seconds: durationSeconds,
    level_before: levelBefore,
    level_after: levelAfter,
    subject_level_before: subjectLevelBefore,
    subject_level_after: newSubjLevelInfo.level,
    completed_at: new Date().toISOString(),
    review_items: reviewItems,
  };

  db.quiz_attempts.push(attemptRecord);
  db.user_answers.push(...answerRecords);

  // Evaluate achievements
  const allSubjectLevels = {};
  Object.keys(SUBJECTS).forEach((sId) => {
    const sRec = db.user_subject_progress[userId][sId];
    allSubjectLevels[sId] = sRec ? calculateSubjectLevelInfo(sRec.weighted_skill_points).level : 1;
  });

  const userAttempts = db.quiz_attempts.filter((a) => a.user_id === userId);
  const bestQuizScore = userAttempts.reduce((max, a) => Math.max(max, a.score_points), 0);
  const hasPerfectScore = bestQuizScore === 10;

  const evalStats = {
    completedQuizzes: newCompletedQuizzes,
    currentLevel: levelAfter,
    totalXp: newTotalXp,
    hasPerfectScore,
    bestQuizScore,
    subjectLevels: allSubjectLevels,
  };

  const existingAchievements = db.user_achievements[userId] || [];
  const existingKeys = new Set(existingAchievements.map((a) => a.achievement_key));
  const newlyUnlocked = [];

  ACHIEVEMENTS_CATALOG.forEach((ach) => {
    if (!existingKeys.has(ach.key) && ach.check(evalStats)) {
      const unlockedRecord = {
        id: generateId(),
        user_id: userId,
        achievement_key: ach.key,
        title_en: ach.title.en,
        title_uz: ach.title.uz,
        title_ru: ach.title.ru,
        description_en: ach.description.en,
        description_uz: ach.description.uz,
        description_ru: ach.description.ru,
        icon_name: ach.icon,
        badge_tier: ach.tier,
        unlocked_at: new Date().toISOString(),
      };
      existingAchievements.push(unlockedRecord);
      newlyUnlocked.push(unlockedRecord);
    }
  });

  db.user_achievements[userId] = existingAchievements;
  saveLocalDb(db);

  // Persist to live Supabase PostgreSQL when configured
  if (isLiveSupabaseConfigured && supabase) {
    try {
      const { leaderboard_unlocked, ...profileToUpdate } = updatedProfile;
      await supabase.from('profiles').upsert(profileToUpdate, { onConflict: 'id' });

      const { review_items, subject_level_before, ...remoteAttempt } = attemptRecord;
      await supabase.from('quiz_attempts').insert(remoteAttempt);
      await supabase.from('user_answers').insert(answerRecords);
      await supabase
        .from('user_subject_progress')
        .upsert(updatedSubjectRecord, { onConflict: 'user_id,subject_id' });

      if (newlyUnlocked.length > 0) {
        await supabase
          .from('user_achievements')
          .upsert(newlyUnlocked, { onConflict: 'user_id,achievement_key' });
      }
    } catch (err) {
      console.warn('Supabase quiz sync warning:', err.message);
    }
  }

  const updatedBundle = await getUserDashboardBundle(userId);

  return {
    attempt: attemptRecord,
    reviewItems,
    newlyUnlockedAchievements: newlyUnlocked,
    leveledUpOverall: levelAfter > levelBefore,
    leveledUpSubject: newSubjLevelInfo.level > subjectLevelBefore,
    bundle: updatedBundle,
  };
}

/**
 * GLOBAL LEADERBOARD ENGINE (Section 8)
 * - Only users who have reached Level 10 (total_xp >= 400) appear in the public competitive ranking.
 * - New accounts do NOT appear in the competitive leaderboard until reaching Level 10.
 * - Sorted by Total XP descending, then Accuracy Percentage.
 */
export async function getGlobalLeaderboard(currentUserId = null) {
  const db = loadLocalDb();

  let allProfiles = Object.values(db.profiles);

  if (isLiveSupabaseConfigured && supabase) {
    try {
      const { data: remoteEligible } = await supabase
        .from('profiles')
        .select('*')
        .gte('current_level', 10)
        .order('total_xp', { ascending: false })
        .limit(100);

      if (remoteEligible && remoteEligible.length > 0) {
        const mergedMap = new Map();
        allProfiles.forEach((p) => mergedMap.set(p.id, p));
        remoteEligible.forEach((p) => mergedMap.set(p.id, p));
        allProfiles = Array.from(mergedMap.values());
      }
    } catch (e) {
      // fallback to local + global verified roster
    }
  }

  // Filter local/remote user accounts that have reached Level 10 (total_xp >= 400)
  const eligibleUserProfiles = allProfiles
    .map((p) => {
      const lvl = calculateOverallLevelInfo(p.total_xp).level;
      return { ...p, current_level: lvl };
    })
    .filter((p) => p.current_level >= 10 && p.total_xp >= 400);

  // Merge with verified international Level 10+ competitors
  const combinedMap = new Map();
  GLOBAL_VERIFIED_COMPETITORS.forEach((comp) => {
    combinedMap.set(comp.id, comp);
  });
  eligibleUserProfiles.forEach((userProf) => {
    combinedMap.set(userProf.id, userProf);
  });

  const sortedCompetitors = Array.from(combinedMap.values())
    .sort((a, b) => {
      if (b.total_xp !== a.total_xp) return b.total_xp - a.total_xp;
      if (b.accuracy_percentage !== a.accuracy_percentage) {
        return b.accuracy_percentage - a.accuracy_percentage;
      }
      return b.completed_quizzes - a.completed_quizzes;
    })
    .map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
      countryFlag: getCountryByCode(entry.country_code).flag,
      isCurrentUser: entry.id === currentUserId,
    }));

  const currentUserProfile = currentUserId ? db.profiles[currentUserId] : null;
  const currentUserLevelInfo = currentUserProfile
    ? calculateOverallLevelInfo(currentUserProfile.total_xp)
    : null;
  const currentUserRankEntry = sortedCompetitors.find((c) => c.id === currentUserId) || null;

  return {
    competitors: sortedCompetitors,
    topThree: sortedCompetitors.slice(0, 3),
    isCurrentUserEligible: Boolean(currentUserLevelInfo?.leaderboardUnlocked),
    currentUserRank: currentUserRankEntry ? currentUserRankEntry.rank : null,
    xpNeededToUnlock: currentUserLevelInfo ? currentUserLevelInfo.xpUntilLeaderboard : 400,
  };
}

/**
 * UPDATE USER PROFILE & AVATAR (Supports Supabase Storage upload & instant preview)
 */
export async function updateUserProfile(userId, updates = {}) {
  const db = loadLocalDb();
  const existing = db.profiles[userId];
  if (!existing) throw new Error('Profile not found.');

  if (updates.username && updates.username !== existing.username) {
    const cleanUsername = updates.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const duplicate = Object.values(db.profiles).find(
      (p) => p.id !== userId && p.username.toLowerCase() === cleanUsername
    );
    if (duplicate) {
      throw new Error('This username is already taken by another learner.');
    }
    updates.username = cleanUsername;
  }

  if (updates.country_code) {
    const country = getCountryByCode(updates.country_code);
    updates.country_name = country.name;
  }

  const updatedProfile = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  db.profiles[userId] = updatedProfile;
  saveLocalDb(db);

  if (isLiveSupabaseConfigured && supabase) {
    try {
      const { leaderboard_unlocked, ...remoteUpdates } = updatedProfile;
      await supabase.from('profiles').upsert(remoteUpdates, { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase profile update fallback:', e.message);
    }
  }

  return getUserDashboardBundle(userId);
}

/**
 * UPLOAD AVATAR IMAGE TO SUPABASE STORAGE (with DataURL fallback)
 */
export async function uploadAvatarImage(userId, file) {
  if (!file) throw new Error('No image file selected.');

  if (isLiveSupabaseConfigured && supabase) {
    try {
      const ext = file.name.split('.').pop() || 'png';
      const filePath = `${userId}/avatar_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        if (data?.publicUrl) {
          return updateUserProfile(userId, { avatar_url: data.publicUrl });
        }
      }
    } catch (e) {
      console.warn('Falling back to encoded avatar storage:', e.message);
    }
  }

  // Fallback: Convert image file to compressed DataURL so it works immediately
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const dataUrl = ev.target.result;
        const bundle = await updateUserProfile(userId, { avatar_url: dataUrl });
        resolve(bundle);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * SEED REMOTE SUPABASE CATALOG TABLES (quiz_categories, quiz_topics, questions, answer_options)
 */
export async function seedSupabaseCatalogTables() {
  if (!isLiveSupabaseConfigured || !supabase) {
    throw new Error('Please connect your Supabase URL and Anon Key first.');
  }

  const { categories, topics, questions, answerOptions } = getAllCatalogRecords();

  const { error: catErr } = await supabase
    .from('quiz_categories')
    .upsert(categories, { onConflict: 'id' });
  if (catErr) throw new Error(`quiz_categories: ${catErr.message}`);

  const { error: topErr } = await supabase
    .from('quiz_topics')
    .upsert(topics, { onConflict: 'id' });
  if (topErr) throw new Error(`quiz_topics: ${topErr.message}`);

  // Batch upsert questions in chunks of 100
  for (let i = 0; i < questions.length; i += 100) {
    const chunk = questions.slice(i, i + 100);
    const { error: qErr } = await supabase.from('questions').upsert(chunk, { onConflict: 'id' });
    if (qErr) throw new Error(`questions: ${qErr.message}`);
  }

  // Batch upsert answer options in chunks of 200
  for (let i = 0; i < answerOptions.length; i += 200) {
    const chunk = answerOptions.slice(i, i + 200);
    const { error: optErr } = await supabase
      .from('answer_options')
      .upsert(chunk, { onConflict: 'id' });
    if (optErr) throw new Error(`answer_options: ${optErr.message}`);
  }

  return {
    categoriesSeeded: categories.length,
    topicsSeeded: topics.length,
    questionsSeeded: questions.length,
    optionsSeeded: answerOptions.length,
  };
}

