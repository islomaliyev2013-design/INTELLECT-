import { HTML_QUESTIONS } from './htmlQuestions.js';
import { CSS_QUESTIONS } from './cssQuestions.js';
import { REACT_QUESTIONS } from './reactQuestions.js';
import { RUSSIAN_QUESTIONS } from './russianQuestions.js';
import { ENGLISH_QUESTIONS } from './englishQuestions.js';
import { MATH_QUESTIONS } from './mathQuestions.js';
import { DIFFICULTY_WEIGHTS } from '../../utils/levelSystem.js';
import { CATEGORIES, SUBJECTS, TOPICS } from '../curriculum.js';

export const RAW_QUESTION_BANK = {
  ...HTML_QUESTIONS,
  ...CSS_QUESTIONS,
  ...REACT_QUESTIONS,
  ...RUSSIAN_QUESTIONS,
  ...ENGLISH_QUESTIONS,
  ...MATH_QUESTIONS,
};

/**
 * Extra question bank so topics (especially English Grammar & core topics)
 * have a deep rotation pool of fresh, non-repeating trilingual questions.
 */
const EXTRA_QUESTION_BANK = {
  'en-grammar': [
    [
      'basic',
      'Which sentence uses the correct form of the verb "to be" in the Present Simple?',
      'Qaysi gapda "to be" fe\'lining Present Simple shakli to\'g\'ri qo\'llangan?',
      'В каком предложении правильно использована форма глагола "to be" в Present Simple?',
      ['They are my best friends.', 'They is my best friends.', 'They am my best friends.', 'They be my best friends.'],
      ['They are my best friends.', 'They is my best friends.', 'They am my best friends.', 'They be my best friends.'],
      ['They are my best friends.', 'They is my best friends.', 'They am my best friends.', 'They be my best friends.'],
      0,
      'With the plural pronoun "they", we always use "are" in the Present Simple.',
      '"They" ko\'plik olmoshi bilan Present Simple zamonida "are" ishlatiladi.',
      'С местоимением множественного числа "they" в Present Simple всегда используется "are".',
    ],
    [
      'basic',
      'Choose the correct plural form of the noun "child":',
      '"Child" (bola) otining to\'g\'ri ko\'plik shaklini toping:',
      'Выберите правильную форму множественного числа существительного "child":',
      ['children', 'childs', 'childes', 'childrens'],
      ['children', 'childs', 'childes', 'childrens'],
      ['children', 'childs', 'childes', 'childrens'],
      0,
      '"Child" is an irregular noun whose plural form is "children".',
      '"Child" noto\'g\'ri ko\'plik hosil qiluvchi ot bo\'lib, ko\'plikda "children" bo\'ladi.',
      '"Child" — существительное-исключение, множественное число — "children".',
    ],
    [
      'intermediate',
      'Fill in the blank: "She has lived in Tashkent ___ 2019."',
      'Bo\'sh joyni to\'ldiring: "She has lived in Tashkent ___ 2019."',
      'Заполните пропуск: "She has lived in Tashkent ___ 2019."',
      ['since', 'for', 'during', 'from'],
      ['since', 'for', 'during', 'from'],
      ['since', 'for', 'during', 'from'],
      0,
      'We use "since" with a specific starting point in time (2019) in the Present Perfect.',
      'Aniq boshlanish vaqti (2019-yil) ko\'rsatilganda Present Perfect zamonida "since" ishlatiladi.',
      'С конкретной точкой начала действия (2019 год) в Present Perfect используется "since".',
    ],
    [
      'intermediate',
      'Which modal verb expresses strong obligation or necessity?',
      'Qaysi modal fe\'l kuchli majburiyat yoki zaruratni ifodalaydi?',
      'Какой модальный глагол выражает строгую обязанность или необходимость?',
      ['must', 'might', 'could', 'may'],
      ['must', 'might', 'could', 'may'],
      ['must', 'might', 'could', 'may'],
      0,
      '"Must" expresses strong obligation, necessity, or a rule.',
      '"Must" modal fe\'li qat\'iy majburiyat yoki qoidani bildiradi.',
      'Модальный глагол "must" выражает строгую необходимость или обязанность.',
    ],
    [
      'basic',
      'Select the correct comparative form of the adjective "good":',
      '"Good" (yaxshi) sifatining qiyosiy darajasini (yaxshiroq) tanlang:',
      'Выберите правильную сравнительную степень прилагательного "good":',
      ['better', 'gooder', 'more good', 'best'],
      ['better', 'gooder', 'more good', 'best'],
      ['better', 'gooder', 'more good', 'best'],
      0,
      '"Good" has an irregular comparative form: good -> better -> the best.',
      '"Good" sifatining darajalari noto\'g\'ri usulda yasaladi: good -> better -> the best.',
      'Прилагательное "good" образует степени сравнения не по правилам: good -> better -> the best.',
    ],
    [
      'intermediate',
      'Choose the correct question tag: "You speak English, ___?"',
      'So\'roq dumini (question tag) to\'g\'ri tanlang: "You speak English, ___?"',
      'Выберите правильный разделительный вопрос: "You speak English, ___?"',
      ["don't you", "aren't you", "doesn't you", 'do you'],
      ["don't you", "aren't you", "doesn't you", 'do you'],
      ["don't you", "aren't you", "doesn't you", 'do you'],
      0,
      'A positive Present Simple statement with "you" takes the negative tag "don\'t you?".',
      'Bo\'lishli Present Simple gapidan so\'ng "you" uchun inkor so\'roq dumi "don\'t you?" qo\'yiladi.',
      'После утвердительного предложения в Present Simple с "you" используется "don\'t you?".',
    ],
    [
      'intermediate',
      'Which preposition is correct: "He is very interested ___ learning programming."',
      'To\'g\'ri predlogni tanlang: "He is very interested ___ learning programming."',
      'Выберите правильный предлог: "He is very interested ___ learning programming."',
      ['in', 'on', 'at', 'for'],
      ['in', 'on', 'at', 'for'],
      ['in', 'on', 'at', 'for'],
      0,
      'The adjective "interested" always takes the preposition "in" (interested in something).',
      '"Interested" sifatidan keyin doim "in" predlogi ishlatiladi (interested in).',
      'После прилагательного "interested" всегда используется предлог "in".',
    ],
    [
      'advanced',
      'Which sentence is a Second Conditional (unreal present/future) sentence?',
      'Qaysi gap Second Conditional (hozirgi/kelasi zamondagi noreal shart) qoidasiga mos?',
      'Какое предложение относится ко второму типу условных предложений (Second Conditional)?',
      [
        'If I had more free time, I would learn a third language.',
        'If I have free time, I will call you.',
        'If it rains, water freezes.',
        'If I had known, I would have helped.',
      ],
      [
        'If I had more free time, I would learn a third language.',
        'If I have free time, I will call you.',
        'If it rains, water freezes.',
        'If I had known, I would have helped.',
      ],
      [
        'If I had more free time, I would learn a third language.',
        'If I have free time, I will call you.',
        'If it rains, water freezes.',
        'If I had known, I would have helped.',
      ],
      0,
      'Second Conditional uses "If + Past Simple, ... would + base verb".',
      'Second Conditional tuzilmasi: "If + Past Simple, ... would + V1".',
      'Формула Second Conditional: "If + Past Simple, ... would + инфинитив без to".',
    ],
    [
      'basic',
      'Choose the correct possessive pronoun: "This laptop belongs to me. It is ___."',
      'To\'g\'ri egalik olmoshini tanlang: "This laptop belongs to me. It is ___."',
      'Выберите правильное притяжательное местоимение: "This laptop belongs to me. It is ___."',
      ['mine', 'my', 'me', 'myself'],
      ['mine', 'my', 'me', 'myself'],
      ['mine', 'my', 'me', 'myself'],
      0,
      '"Mine" is an independent possessive pronoun used without a following noun.',
      'Otdan keyin mustaqil qo\'llanadigan egalik olmoshi — "mine" (meniki).',
      'Абсолютная форма притяжательного местоимения (без существительного после него) — "mine".',
    ],
    [
      'intermediate',
      'After the verb "enjoy", which verb form must be used? ("I enjoy ___ books.")',
      '"Enjoy" fe\'lidan keyin fe\'lning qaysi shakli keladi? ("I enjoy ___ books.")',
      'Какая форма глагола используется после "enjoy"? ("I enjoy ___ books.")',
      ['reading (Gerund / V-ing)', 'to read', 'read', 'readed'],
      ['reading (Gerundiy / V-ing)', 'to read', 'read', 'readed'],
      ['reading (Герундий / V-ing)', 'to read', 'read', 'readed'],
      0,
      'The verb "enjoy" is always followed by a gerund (verb + -ing), never an infinitive.',
      '"Enjoy" fe\'lidan so\'ng doim gerundiy (-ing qo\'shimchali fe\'l) ishlatiladi.',
      'После глагола "enjoy" всегда употребляется герундий (глагол с окончанием -ing).',
    ],
  ],
};

// In-memory and localStorage tracker for question rotation per topic
const ROTATION_STORAGE_KEY = 'neuroquiz_question_rotation_v3';
const memoryRotationMap = {};

function getTopicRotationHistory(topicId) {
  let store = memoryRotationMap;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(ROTATION_STORAGE_KEY);
      if (raw) {
        store = { ...memoryRotationMap, ...JSON.parse(raw) };
      }
    }
  } catch (e) {}

  return (
    store[topicId] || {
      recentFirstIds: [],
      seenIds: [],
      lastBatchIds: [],
      runs: 0,
    }
  );
}

function saveTopicRotationHistory(topicId, data) {
  memoryRotationMap[topicId] = data;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(ROTATION_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[topicId] = data;
      window.localStorage.setItem(ROTATION_STORAGE_KEY, JSON.stringify(parsed));
    }
  } catch (e) {}
}

/**
 * Fisher-Yates unbiased array shuffle
 */
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

/**
 * Shuffles the 4 answer options (A, B, C, D) of a normalized question
 * and updates `correctIndex` so options don't stay in a fixed position.
 */
function shuffleQuestionOptions(question, displayIndex) {
  const shuffledOpts = shuffleArray(question.options);
  let newCorrectIndex = 0;

  const remappedOptions = shuffledOpts.map((opt, idx) => {
    if (opt.isCorrect) {
      newCorrectIndex = idx;
    }
    return {
      ...opt,
      index: idx,
    };
  });

  return {
    ...question,
    questionNumber: displayIndex + 1,
    options: remappedOptions,
    correctIndex: newCorrectIndex,
  };
}

/**
 * Normalizes a compact question tuple into a structured question object
 * matching the Supabase `questions` and `answer_options` relational schema.
 */
export function normalizeQuestionTuple(topicId, tuple, idx, idPrefix = topicId) {
  const [
    difficulty = 'basic',
    q_en = '',
    q_uz = '',
    q_ru = '',
    opts_en = [],
    opts_uz = [],
    opts_ru = [],
    correctIndex = 0,
    exp_en = '',
    exp_uz = '',
    exp_ru = '',
  ] = tuple;

  const questionId = `${idPrefix}-q${idx + 1}`;
  const weight = DIFFICULTY_WEIGHTS[difficulty] || 1.0;

  const options = [0, 1, 2, 3].map((optIdx) => ({
    id: `${questionId}-opt${optIdx}`,
    questionId,
    index: optIdx,
    text: {
      en: opts_en[optIdx] ?? `Option ${optIdx + 1}`,
      uz: opts_uz[optIdx] ?? opts_en[optIdx] ?? `Variant ${optIdx + 1}`,
      ru: opts_ru[optIdx] ?? opts_en[optIdx] ?? `Вариант ${optIdx + 1}`,
    },
    isCorrect: optIdx === correctIndex,
  }));

  return {
    id: questionId,
    topicId,
    questionNumber: idx + 1,
    difficulty,
    difficultyWeight: weight,
    question: {
      en: q_en,
      uz: q_uz || q_en,
      ru: q_ru || q_en,
    },
    options,
    correctIndex,
    explanation: {
      en: exp_en,
      uz: exp_uz || exp_en,
      ru: exp_ru || exp_en,
    },
  };
}

/**
 * Builds the complete candidate pool for a topic:
 * 1. Primary topic questions + extra topic questions
 * 2. Related questions from sibling topics in the same subject so the user
 *    always gets fresh, non-repeating questions across multiple runs.
 */
function buildCandidatePoolForTopic(topicId) {
  const primaryRaw = RAW_QUESTION_BANK[topicId] || [];
  const extraRaw = EXTRA_QUESTION_BANK[topicId] || [];

  const primaryPool = [
    ...primaryRaw.map((tuple, idx) =>
      normalizeQuestionTuple(topicId, tuple, idx, topicId)
    ),
    ...extraRaw.map((tuple, idx) =>
      normalizeQuestionTuple(topicId, tuple, primaryRaw.length + idx, `${topicId}-extra`)
    ),
  ];

  // Also gather sibling topic questions from the same subject as a secondary pool
  const topicMeta = TOPICS.find((t) => t.id === topicId);
  const siblingPool = [];
  if (topicMeta) {
    const siblingTopics = TOPICS.filter(
      (t) => t.subjectId === topicMeta.subjectId && t.id !== topicId
    );
    siblingTopics.forEach((sib) => {
      const sibRaw = RAW_QUESTION_BANK[sib.id] || [];
      sibRaw.forEach((tuple, idx) => {
        siblingPool.push(
          normalizeQuestionTuple(topicId, tuple, idx, `${sib.id}-rel`)
        );
      });
    });
  }

  return { primaryPool, siblingPool };
}

/**
 * Returns 10 structured multilingual questions for any topic ID.
 * When `options.shuffle !== false` (the default for all live quizzes):
 * - Prioritizes questions NOT seen in previous attempts
 * - Shuffles question order and option order (A, B, C, D)
 * - Guarantees Question #1 is ALWAYS different from previous attempts
 */
export function getQuestionsForTopic(topicId, options = {}) {
  const shouldShuffle = options.shuffle !== false;
  const rawList = RAW_QUESTION_BANK[topicId] || [];

  if (!shouldShuffle) {
    return rawList
      .slice(0, 10)
      .map((tuple, idx) => normalizeQuestionTuple(topicId, tuple, idx));
  }

  const { primaryPool, siblingPool } = buildCandidatePoolForTopic(topicId);
  const fullPool = [...primaryPool, ...siblingPool];
  if (fullPool.length === 0) return [];

  const history = getTopicRotationHistory(topicId);
  const recentFirstSet = new Set(history.recentFirstIds || []);
  const lastBatchSet = new Set(history.lastBatchIds || []);
  let seenSet = new Set(history.seenIds || []);

  // Partition primary pool into unseen vs seen
  let unseenPrimary = shuffleArray(
    primaryPool.filter((q) => !seenSet.has(q.id) && !lastBatchSet.has(q.id))
  );
  let unseenSiblings = shuffleArray(
    siblingPool.filter((q) => !seenSet.has(q.id) && !lastBatchSet.has(q.id))
  );

  // If the user has exhausted most primary questions, reset seenSet while still avoiding lastBatchSet & recentFirstSet
  if (unseenPrimary.length < 6) {
    seenSet = new Set(history.lastBatchIds || []);
    unseenPrimary = shuffleArray(
      primaryPool.filter((q) => !lastBatchSet.has(q.id))
    );
    if (unseenPrimary.length === 0) {
      unseenPrimary = shuffleArray(primaryPool);
    }
  }

  // Assemble 10 fresh questions: mostly unseen primary, supplemented by unseen sibling questions or remaining primary
  const chosen = [];
  const chosenIds = new Set();

  const addCandidates = (list, maxCount) => {
    for (const q of list) {
      if (chosen.length >= maxCount) break;
      if (!chosenIds.has(q.id)) {
        chosen.push(q);
        chosenIds.add(q.id);
      }
    }
  };

  // Take up to 7 unseen primary questions, then mix in up to 3 fresh sibling/bonus questions, then fill to 10
  addCandidates(unseenPrimary, 7);
  addCandidates(unseenSiblings, 10);
  addCandidates(shuffleArray(primaryPool), 10);
  addCandidates(shuffleArray(siblingPool), 10);

  // Final shuffle of the 10 chosen questions
  let finalTen = shuffleArray(chosen.slice(0, 10));

  // STRICT GUARANTEE: Question #1 must NEVER match any recent Question #1
  if (finalTen.length > 1 && recentFirstSet.has(finalTen[0].id)) {
    const swapIdx = finalTen.findIndex((q) => !recentFirstSet.has(q.id));
    if (swapIdx > 0) {
      const temp = finalTen[0];
      finalTen[0] = finalTen[swapIdx];
      finalTen[swapIdx] = temp;
    } else {
      // Find any question in fullPool that wasn't a recent #1
      const freshFirst = shuffleArray(fullPool).find(
        (q) => !recentFirstSet.has(q.id)
      );
      if (freshFirst) {
        finalTen[0] = freshFirst;
      }
    }
  }

  // Persist updated rotation history immediately so the very next start gets a new Question #1
  const newFirstId = finalTen[0]?.id;
  const updatedRecentFirstIds = [
    newFirstId,
    ...(history.recentFirstIds || []).filter((id) => id !== newFirstId),
  ].slice(0, 12);

  const currentBatchIds = finalTen.map((q) => q.id);
  const updatedSeenIds = Array.from(
    new Set([...Array.from(seenSet), ...currentBatchIds])
  ).slice(-60);

  saveTopicRotationHistory(topicId, {
    recentFirstIds: updatedRecentFirstIds,
    seenIds: updatedSeenIds,
    lastBatchIds: currentBatchIds,
    runs: (history.runs || 0) + 1,
  });

  // Shuffle the 4 options (A, B, C, D) for each question and number them 1..10
  return finalTen.map((q, idx) => shuffleQuestionOptions(q, idx));
}

/**
 * Returns all normalized questions and options across all 53 topics
 */
export function getAllCatalogRecords() {
  const questions = [];
  const answerOptions = [];

  for (const topic of TOPICS) {
    const topicQuestions = getQuestionsForTopic(topic.id, { shuffle: false });
    for (const q of topicQuestions) {
      questions.push({
        id: q.id,
        topic_id: q.topicId,
        question_number: q.questionNumber,
        difficulty: q.difficulty,
        difficulty_weight: q.difficultyWeight,
        question_text_en: q.question.en,
        question_text_uz: q.question.uz,
        question_text_ru: q.question.ru,
        explanation_en: q.explanation.en,
        explanation_uz: q.explanation.uz,
        explanation_ru: q.explanation.ru,
      });

      for (const opt of q.options) {
        answerOptions.push({
          id: opt.id,
          question_id: q.id,
          option_index: opt.index,
          option_text_en: opt.text.en,
          option_text_uz: opt.text.uz,
          option_text_ru: opt.text.ru,
          is_correct: opt.isCorrect,
        });
      }
    }
  }

  const categories = CATEGORIES.map((c, idx) => ({
    id: c.id,
    slug: c.slug,
    icon_name: c.icon,
    accent_color: c.accentColor,
    title_en: c.title.en,
    title_uz: c.title.uz,
    title_ru: c.title.ru,
    description_en: c.description.en,
    description_uz: c.description.uz,
    description_ru: c.description.ru,
    display_order: idx + 1,
  }));

  const topics = TOPICS.map((t) => {
    const subj = SUBJECTS[t.subjectId];
    return {
      id: t.id,
      category_id: t.categoryId,
      subject_id: t.subjectId,
      subject_name_en: subj?.name?.en || t.subjectId,
      subject_name_uz: subj?.name?.uz || t.subjectId,
      subject_name_ru: subj?.name?.ru || t.subjectId,
      slug: t.id,
      title_en: t.title.en,
      title_uz: t.title.uz,
      title_ru: t.title.ru,
      description_en: t.description.en,
      description_uz: t.description.uz,
      description_ru: t.description.ru,
      difficulty_tier: t.difficultyTier,
      question_count: 10,
      display_order: t.order,
    };
  });

  return { categories, topics, questions, answerOptions };
}
