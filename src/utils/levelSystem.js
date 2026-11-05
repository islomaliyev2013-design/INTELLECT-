/**
 * Smart Level, Skill Evaluation, and Achievement Progression System
 *
 * Overall Level Progression (Section 7):
 * - Level 1: 0–9 XP
 * - Level 2: 10–24 XP
 * - Level 3: 25–49 XP
 * - Level 4: 50–79 XP
 * - Level 5: 80–119 XP
 * - Level 6: 120–169 XP
 * - Level 7: 170–229 XP
 * - Level 8: 230–299 XP
 * - Level 9: 300–399 XP
 * - Level 10: 400+ XP (Unlocks Global Competitive Leaderboard)
 * - Continues dynamically beyond Level 10
 */

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, maxXp: 9, title: { en: 'Novice Explorer', uz: "Boshlang'ich Izlanuvchi", ru: 'Новичок-исследователь' } },
  { level: 2, minXp: 10, maxXp: 24, title: { en: 'Curious Learner', uz: 'Qiziquvchan Oʻquvchi', ru: 'Любознательный ученик' } },
  { level: 3, minXp: 25, maxXp: 49, title: { en: 'Rising Apprentice', uz: "O'sib Borayotgan Shogird", ru: 'Растущий подмастерье' } },
  { level: 4, minXp: 50, maxXp: 79, title: { en: 'Knowledge Seeker', uz: 'Bilim Izlovchi', ru: 'Искатель знаний' } },
  { level: 5, minXp: 80, maxXp: 119, title: { en: 'Skilled Practitioner', uz: 'Mahoratli Amaliyotchi', ru: 'Опытный практик' } },
  { level: 6, minXp: 120, maxXp: 169, title: { en: 'Dedicated Scholar', uz: 'Fidoyi Bilimdon', ru: 'Преданный эрудит' } },
  { level: 7, minXp: 170, maxXp: 229, title: { en: 'Domain Specialist', uz: 'Soha Mutaxassisi', ru: 'Специалист области' } },
  { level: 8, minXp: 230, maxXp: 299, title: { en: 'Master Strategist', uz: 'Mohir Strateg', ru: 'Мастер-стратег' } },
  { level: 9, minXp: 300, maxXp: 399, title: { en: 'Elite Contender', uz: 'Elita Daʼvogar', ru: 'Элитный претендент' } },
  { level: 10, minXp: 400, maxXp: 519, title: { en: 'Global Competitor', uz: 'Global Raqobatchi', ru: 'Глобальный участник' } },
];

/**
 * Generates level threshold metadata for any level >= 1 (including beyond Level 10)
 */
export function getLevelBounds(level) {
  if (level <= 10) {
    const found = LEVEL_THRESHOLDS.find((l) => l.level === level);
    return found || LEVEL_THRESHOLDS[0];
  }
  // Smooth progression beyond Level 10
  let currentLevel = 10;
  let minXp = 400;
  let span = 120;

  while (currentLevel < level) {
    minXp += span;
    span += 20;
    currentLevel += 1;
  }

  return {
    level,
    minXp,
    maxXp: minXp + span - 1,
    title: {
      en: level >= 15 ? 'Grandmaster Luminary' : 'Global Virtuoso',
      uz: level >= 15 ? 'Grossmeyster Donishmand' : 'Global Virtuoz',
      ru: level >= 15 ? 'Гроссмейстер знаний' : 'Глобальный виртуоз',
    },
  };
}

/**
 * Calculates overall level and progress percentage from total XP
 */
export function calculateOverallLevelInfo(totalXp = 0) {
  const safeXp = Math.max(0, Math.floor(Number(totalXp) || 0));

  let level = 1;
  while (true) {
    const bounds = getLevelBounds(level);
    if (safeXp <= bounds.maxXp || level > 100) {
      const span = bounds.maxXp - bounds.minXp + 1;
      const xpIntoLevel = safeXp - bounds.minXp;
      const progressPercent = Math.min(100, Math.max(0, Math.round((xpIntoLevel / span) * 100)));
      const xpToNextLevel = Math.max(0, bounds.maxXp + 1 - safeXp);

      return {
        level,
        totalXp: safeXp,
        minXp: bounds.minXp,
        maxXp: bounds.maxXp,
        nextLevelXp: bounds.maxXp + 1,
        xpIntoLevel,
        xpSpan: span,
        xpToNextLevel,
        progressPercent,
        title: bounds.title,
        leaderboardUnlocked: level >= 10,
        xpUntilLeaderboard: Math.max(0, 400 - safeXp),
      };
    }
    level += 1;
  }
}

/**
 * Difficulty weights for skill evaluation (Section 7):
 * Advanced questions contribute more meaningfully to subject & topic skill evaluation
 * than basic questions.
 */
export const DIFFICULTY_WEIGHTS = {
  basic: 1.0,
  intermediate: 1.5,
  advanced: 2.2,
};

/**
 * Subject Skill Level Thresholds (based on difficulty-weighted skill points)
 * - Subject Level 1: 0 – 11.9 weighted skill pts
 * - Subject Level 2: 12 – 29.9 weighted skill pts
 * - Subject Level 3: 30 – 54.9 weighted skill pts
 * - Subject Level 4: 55 – 89.9 weighted skill pts
 * - Subject Level 5: 90 – 134.9 weighted skill pts (Unlocks Subject Master Achievement!)
 * - Continues beyond Level 5
 */
export const SUBJECT_LEVEL_THRESHOLDS = [
  { level: 1, minPts: 0, maxPts: 12, label: { en: 'Beginner', uz: "Boshlang'ich", ru: 'Начальный' } },
  { level: 2, minPts: 12, maxPts: 30, label: { en: 'Elementary', uz: 'Asosiy', ru: 'Базовый' } },
  { level: 3, minPts: 30, maxPts: 55, label: { en: 'Intermediate', uz: "O'rta", ru: 'Средний' } },
  { level: 4, minPts: 55, maxPts: 90, label: { en: 'Advanced', uz: 'Ilgʻor', ru: 'Продвинутый' } },
  { level: 5, minPts: 90, maxPts: 135, label: { en: 'Master', uz: 'Usta (Master)', ru: 'Мастер' } },
  { level: 6, minPts: 135, maxPts: 190, label: { en: 'Expert', uz: 'Ekspert', ru: 'Эксперт' } },
  { level: 7, minPts: 190, maxPts: 260, label: { en: 'Grandmaster', uz: 'Grossmeyster', ru: 'Гроссмейстер' } },
];

export function calculateSubjectLevelInfo(weightedSkillPoints = 0) {
  const pts = Math.max(0, Number(weightedSkillPoints) || 0);

  for (let i = 0; i < SUBJECT_LEVEL_THRESHOLDS.length; i++) {
    const tier = SUBJECT_LEVEL_THRESHOLDS[i];
    if (pts < tier.maxPts || i === SUBJECT_LEVEL_THRESHOLDS.length - 1) {
      const span = tier.maxPts - tier.minPts;
      const into = Math.max(0, pts - tier.minPts);
      const progressPercent = Math.min(100, Math.round((into / span) * 100));
      return {
        level: tier.level,
        weightedSkillPoints: Number(pts.toFixed(1)),
        minPts: tier.minPts,
        maxPts: tier.maxPts,
        nextLevelPts: tier.maxPts,
        ptsToNextLevel: Number(Math.max(0, tier.maxPts - pts).toFixed(1)),
        progressPercent,
        label: tier.label,
      };
    }
  }
  return {
    level: 1,
    weightedSkillPoints: 0,
    minPts: 0,
    maxPts: 12,
    nextLevelPts: 12,
    ptsToNextLevel: 12,
    progressPercent: 0,
    label: SUBJECT_LEVEL_THRESHOLDS[0].label,
  };
}

/**
 * Topic Skill Level Calculation (Levels 1 to 5 based on topic weighted points & best accuracy)
 */
export function calculateTopicLevelInfo(topicSkillPts = 0, bestScore = 0) {
  const pts = Math.max(0, Number(topicSkillPts) || 0);
  let level = 1;
  if (pts >= 45 || (pts >= 30 && bestScore === 10)) level = 5;
  else if (pts >= 30 || bestScore >= 9) level = 4;
  else if (pts >= 18 || bestScore >= 7) level = 3;
  else if (pts >= 8 || bestScore >= 4) level = 2;

  const maxPtsForMastery = 45;
  const progressPercent = Math.min(100, Math.round((pts / maxPtsForMastery) * 100));

  return {
    level,
    topicSkillPts: Number(pts.toFixed(1)),
    bestScore,
    progressPercent,
  };
}

/**
 * Achievements Catalog (Section 10)
 */
export const ACHIEVEMENTS_CATALOG = [
  {
    key: 'first_quiz',
    icon: 'Sparkles',
    tier: 'bronze',
    color: '#6366F1',
    title: {
      en: 'First Quiz',
      uz: 'Birinchi Viktorina',
      ru: 'Первая викторина',
    },
    description: {
      en: 'Complete your very first 10-question quiz.',
      uz: "O'zingizning birinchi 10 savollik viktorinangizni yakunlang.",
      ru: 'Завершите свою первую викторину из 10 вопросов.',
    },
    check: (stats) => stats.completedQuizzes >= 1,
    getProgress: (stats) => ({ current: Math.min(1, stats.completedQuizzes), target: 1 }),
  },
  {
    key: 'perfect_score',
    icon: 'Award',
    tier: 'gold',
    color: '#F59E0B',
    title: {
      en: 'Perfect Score',
      uz: 'Mukammal Natija (10/10)',
      ru: 'Идеальный результат',
    },
    description: {
      en: 'Achieve a flawless 10/10 score on any quiz.',
      uz: 'Istalgan viktorinada 10/10 mukammal natijaga erishing.',
      ru: 'Получите безупречный результат 10/10 в любой викторине.',
    },
    check: (stats) => stats.hasPerfectScore,
    getProgress: (stats) => ({ current: stats.bestQuizScore || 0, target: 10 }),
  },
  {
    key: 'html_master',
    icon: 'Code2',
    tier: 'gold',
    color: '#EA580C',
    title: {
      en: 'HTML Master',
      uz: 'HTML Ustasi',
      ru: 'Мастер HTML',
    },
    description: {
      en: 'Reach Skill Level 5 in HTML.',
      uz: 'HTML fanidan 5-darajaga (Level 5) yeting.',
      ru: 'Достигните 5-го уровня мастерства в HTML.',
    },
    check: (stats) => (stats.subjectLevels?.html || 1) >= 5,
    getProgress: (stats) => ({ current: Math.min(5, stats.subjectLevels?.html || 1), target: 5 }),
  },
  {
    key: 'css_master',
    icon: 'Palette',
    tier: 'gold',
    color: '#0284C7',
    title: {
      en: 'CSS Virtuoso',
      uz: 'CSS Virtuozi',
      ru: 'Виртуоз CSS',
    },
    description: {
      en: 'Reach Skill Level 5 in CSS.',
      uz: 'CSS fanidan 5-darajaga (Level 5) yeting.',
      ru: 'Достигните 5-го уровня мастерства в CSS.',
    },
    check: (stats) => (stats.subjectLevels?.css || 1) >= 5,
    getProgress: (stats) => ({ current: Math.min(5, stats.subjectLevels?.css || 1), target: 5 }),
  },
  {
    key: 'react_master',
    icon: 'Atom',
    tier: 'gold',
    color: '#06B6D4',
    title: {
      en: 'React Architect',
      uz: 'React Arxitektori',
      ru: 'Архитектор React',
    },
    description: {
      en: 'Reach Skill Level 5 in React JS.',
      uz: 'React JS fanidan 5-darajaga (Level 5) yeting.',
      ru: 'Достигните 5-го уровня мастерства в React JS.',
    },
    check: (stats) => (stats.subjectLevels?.react || 1) >= 5,
    getProgress: (stats) => ({ current: Math.min(5, stats.subjectLevels?.react || 1), target: 5 }),
  },
  {
    key: 'math_genius',
    icon: 'Calculator',
    tier: 'gold',
    color: '#10B981',
    title: {
      en: 'Math Genius',
      uz: 'Matematika Dahosi',
      ru: 'Гений математики',
    },
    description: {
      en: 'Reach Skill Level 5 in Mathematics.',
      uz: 'Matematika fanidan 5-darajaga (Level 5) yeting.',
      ru: 'Достигните 5-го уровня мастерства в Математике.',
    },
    check: (stats) => (stats.subjectLevels?.math || 1) >= 5,
    getProgress: (stats) => ({ current: Math.min(5, stats.subjectLevels?.math || 1), target: 5 }),
  },
  {
    key: 'language_expert',
    icon: 'Globe2',
    tier: 'gold',
    color: '#8B5CF6',
    title: {
      en: 'Language Expert',
      uz: 'Til Eksperti',
      ru: 'Эксперт по языкам',
    },
    description: {
      en: 'Reach Skill Level 5 in English or Russian.',
      uz: 'Ingliz tili yoki Rus tilidan 5-darajaga yeting.',
      ru: 'Достигните 5-го уровня в Английском или Русском языке.',
    },
    check: (stats) =>
      (stats.subjectLevels?.english || 1) >= 5 || (stats.subjectLevels?.russian || 1) >= 5,
    getProgress: (stats) => ({
      current: Math.min(
        5,
        Math.max(stats.subjectLevels?.english || 1, stats.subjectLevels?.russian || 1)
      ),
      target: 5,
    }),
  },
  {
    key: 'dedicated_learner',
    icon: 'BookCheck',
    tier: 'silver',
    color: '#3B82F6',
    title: {
      en: 'Dedicated Learner',
      uz: 'Faol Bilimdon',
      ru: 'Прилежный ученик',
    },
    description: {
      en: 'Complete 10 quizzes across any topics.',
      uz: 'Istalgan mavzularda 10 ta viktorinani yakunlang.',
      ru: 'Завершите 10 викторин по любым темам.',
    },
    check: (stats) => stats.completedQuizzes >= 10,
    getProgress: (stats) => ({ current: Math.min(10, stats.completedQuizzes), target: 10 }),
  },
  {
    key: 'quiz_champion',
    icon: 'Trophy',
    tier: 'platinum',
    color: '#D97706',
    title: {
      en: 'Quiz Champion',
      uz: 'Viktorina Chempioni',
      ru: 'Чемпион викторин',
    },
    description: {
      en: 'Complete 50 quizzes across the platform.',
      uz: 'Platformada jami 50 ta viktorinani yakunlang.',
      ru: 'Завершите 50 викторин на платформе.',
    },
    check: (stats) => stats.completedQuizzes >= 50,
    getProgress: (stats) => ({ current: Math.min(50, stats.completedQuizzes), target: 50 }),
  },
  {
    key: 'global_competitor',
    icon: 'Crown',
    tier: 'platinum',
    color: '#4F46E5',
    title: {
      en: 'Global Competitor',
      uz: 'Global Raqobatchi',
      ru: 'Глобальный участник',
    },
    description: {
      en: 'Reach Overall Level 10 (400+ XP) and unlock the Global Leaderboard.',
      uz: '10-darajaga (400+ XP) yeting va Global Reytingni oching.',
      ru: 'Достигните 10-го уровня (400+ XP) и откройте Глобальный рейтинг.',
    },
    check: (stats) => stats.currentLevel >= 10,
    getProgress: (stats) => ({ current: Math.min(10, stats.currentLevel), target: 10 }),
  },
];

