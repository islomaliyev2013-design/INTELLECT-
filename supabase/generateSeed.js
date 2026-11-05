import fs from 'fs';
import { getAllCatalogRecords } from '../src/data/questions/index.js';

const { categories, topics, questions, answerOptions } = getAllCatalogRecords();
const esc = (s) => String(s ?? '').replace(/'/g, "''");

let sql = '-- =============================================================================\n';
sql += '-- NEUROQUIZ GLOBAL: SEED DATA\n';
sql += '-- 4 Categories, 53 Topics, 530 Multilingual Questions, 2120 Answer Options\n';
sql += '-- =============================================================================\n\n';

for (const c of categories) {
  sql += `INSERT INTO public.quiz_categories (id, slug, icon_name, accent_color, title_en, title_uz, title_ru, description_en, description_uz, description_ru, display_order) VALUES ('${esc(c.id)}', '${esc(c.slug)}', '${esc(c.icon_name)}', '${esc(c.accent_color)}', '${esc(c.title_en)}', '${esc(c.title_uz)}', '${esc(c.title_ru)}', '${esc(c.description_en)}', '${esc(c.description_uz)}', '${esc(c.description_ru)}', ${c.display_order}) ON CONFLICT (id) DO NOTHING;\n`;
}

sql += '\n';

for (const t of topics) {
  sql += `INSERT INTO public.quiz_topics (id, category_id, subject_id, subject_name_en, subject_name_uz, subject_name_ru, slug, title_en, title_uz, title_ru, description_en, description_uz, description_ru, difficulty_tier, question_count, display_order) VALUES ('${esc(t.id)}', '${esc(t.category_id)}', '${esc(t.subject_id)}', '${esc(t.subject_name_en)}', '${esc(t.subject_name_uz)}', '${esc(t.subject_name_ru)}', '${esc(t.slug)}', '${esc(t.title_en)}', '${esc(t.title_uz)}', '${esc(t.title_ru)}', '${esc(t.description_en)}', '${esc(t.description_uz)}', '${esc(t.description_ru)}', '${esc(t.difficulty_tier)}', ${t.question_count}, ${t.display_order}) ON CONFLICT (id) DO NOTHING;\n`;
}

sql += '\n';

for (const q of questions) {
  sql += `INSERT INTO public.questions (id, topic_id, question_number, difficulty, difficulty_weight, question_text_en, question_text_uz, question_text_ru, explanation_en, explanation_uz, explanation_ru) VALUES ('${esc(q.id)}', '${esc(q.topic_id)}', ${q.question_number}, '${esc(q.difficulty)}', ${q.difficulty_weight}, '${esc(q.question_text_en)}', '${esc(q.question_text_uz)}', '${esc(q.question_text_ru)}', '${esc(q.explanation_en)}', '${esc(q.explanation_uz)}', '${esc(q.explanation_ru)}') ON CONFLICT (id) DO NOTHING;\n`;
}

sql += '\n';

for (const o of answerOptions) {
  sql += `INSERT INTO public.answer_options (id, question_id, option_index, option_text_en, option_text_uz, option_text_ru, is_correct) VALUES ('${esc(o.id)}', '${esc(o.question_id)}', ${o.option_index}, '${esc(o.option_text_en)}', '${esc(o.option_text_uz)}', '${esc(o.option_text_ru)}', ${o.is_correct}) ON CONFLICT (id) DO NOTHING;\n`;
}

fs.writeFileSync('./supabase/seed.sql', sql, 'utf8');
console.log('Successfully generated supabase/seed.sql with', questions.length, 'questions and', answerOptions.length, 'options.');

