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
 * Normalizes a compact question tuple into a structured question object
 * matching the Supabase `questions` and `answer_options` relational schema.
 */
export function normalizeQuestionTuple(topicId, tuple, idx) {
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

  const questionId = `${topicId}-q${idx + 1}`;
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
 * Returns the 10 structured multilingual questions for any topic ID
 */
export function getQuestionsForTopic(topicId) {
  const rawList = RAW_QUESTION_BANK[topicId] || [];
  return rawList.slice(0, 10).map((tuple, idx) => normalizeQuestionTuple(topicId, tuple, idx));
}

/**
 * Returns all normalized questions and options across all 53 topics
 */
export function getAllCatalogRecords() {
  const questions = [];
  const answerOptions = [];

  for (const topic of TOPICS) {
    const topicQuestions = getQuestionsForTopic(topic.id);
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

