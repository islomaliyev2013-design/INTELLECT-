-- =============================================================================
-- NEUROQUIZ GLOBAL — SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Tables:
--   1. profiles
--   2. quiz_categories
--   3. quiz_topics
--   4. questions
--   5. answer_options
--   6. quiz_attempts
--   7. user_answers
--   8. user_subject_progress
--   9. user_achievements
-- =============================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- =============================================================================
-- 1. PROFILES TABLE
-- Every new user starts at Level 1 with 0 XP, 0 completed quizzes, 0 correct answers
-- =============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text not null,
  email text not null,
  avatar_url text default '',
  country_code text default 'UZ',
  country_name text default 'Uzbekistan',
  bio text default 'Lifelong learner competing on NeuroQuiz Global.',
  preferred_language text default 'en' check (preferred_language in ('uz', 'en', 'ru')),
  total_xp integer not null default 0 check (total_xp >= 0),
  current_level integer not null default 1 check (current_level >= 1),
  completed_quizzes integer not null default 0 check (completed_quizzes >= 0),
  total_questions_answered integer not null default 0 check (total_questions_answered >= 0),
  correct_answers integer not null default 0 check (correct_answers >= 0),
  accuracy_percentage numeric(5,2) not null default 0.00,
  leaderboard_unlocked boolean generated always as (current_level >= 10) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- 2. QUIZ CATEGORIES TABLE
-- Four main categories: Programming, Russian Language, English Language, Mathematics
-- =============================================================================
create table if not exists public.quiz_categories (
  id text primary key,
  slug text unique not null,
  icon_name text not null,
  accent_color text not null default '#4F46E5',
  title_en text not null,
  title_uz text not null,
  title_ru text not null,
  description_en text not null,
  description_uz text not null,
  description_ru text not null,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 3. QUIZ TOPICS TABLE
-- Covers subjects (HTML, CSS, React JS, Russian, English, Mathematics) & topics
-- =============================================================================
create table if not exists public.quiz_topics (
  id text primary key,
  category_id text not null references public.quiz_categories(id) on delete cascade,
  subject_id text not null, -- 'html', 'css', 'react', 'russian', 'english', 'math'
  subject_name_en text not null,
  subject_name_uz text not null,
  subject_name_ru text not null,
  slug text unique not null,
  title_en text not null,
  title_uz text not null,
  title_ru text not null,
  description_en text default '',
  description_uz text default '',
  description_ru text default '',
  difficulty_tier text not null default 'intermediate' check (difficulty_tier in ('basic', 'intermediate', 'advanced')),
  question_count integer not null default 10,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 4. QUESTIONS TABLE
-- Multilingual questions (Uzbek, English, Russian) with difficulty weighting
-- =============================================================================
create table if not exists public.questions (
  id text primary key,
  topic_id text not null references public.quiz_topics(id) on delete cascade,
  question_number integer not null check (question_number between 1 and 10),
  difficulty text not null default 'basic' check (difficulty in ('basic', 'intermediate', 'advanced')),
  difficulty_weight numeric(3,2) not null default 1.00,
  question_text_en text not null,
  question_text_uz text not null,
  question_text_ru text not null,
  explanation_en text not null default '',
  explanation_uz text not null default '',
  explanation_ru text not null default '',
  created_at timestamptz not null default now(),
  unique(topic_id, question_number)
);

-- =============================================================================
-- 5. ANSWER OPTIONS TABLE
-- 4 options per question, multilingual, exactly 1 correct answer
-- =============================================================================
create table if not exists public.answer_options (
  id text primary key,
  question_id text not null references public.questions(id) on delete cascade,
  option_index integer not null check (option_index between 0 and 3),
  option_text_en text not null,
  option_text_uz text not null,
  option_text_ru text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now(),
  unique(question_id, option_index)
);

-- =============================================================================
-- 6. QUIZ ATTEMPTS TABLE
-- Stores every completed 10-question quiz attempt per user
-- =============================================================================
create table if not exists public.quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id text not null references public.quiz_categories(id) on delete cascade,
  subject_id text not null,
  topic_id text not null references public.quiz_topics(id) on delete cascade,
  quiz_language text not null default 'en' check (quiz_language in ('uz', 'en', 'ru')),
  total_questions integer not null default 10,
  correct_count integer not null check (correct_count between 0 and 10),
  incorrect_count integer not null check (incorrect_count between 0 and 10),
  score_points integer not null check (score_points between 0 and 10),
  earned_xp integer not null check (earned_xp >= 0),
  skill_points_earned numeric(6,2) not null default 0,
  accuracy_percentage numeric(5,2) not null,
  duration_seconds integer not null default 0,
  level_before integer not null default 1,
  level_after integer not null default 1,
  subject_level_after integer not null default 1,
  completed_at timestamptz not null default now()
);

-- =============================================================================
-- 7. USER ANSWERS TABLE
-- Stores each individual question answer for "Review Answers" and analytics
-- =============================================================================
create table if not exists public.user_answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  selected_option_index integer not null check (selected_option_index between -1 and 3),
  correct_option_index integer not null check (correct_option_index between 0 and 3),
  is_correct boolean not null default false,
  points_awarded integer not null default 0 check (points_awarded in (0, 1)),
  difficulty text not null default 'basic',
  answered_at timestamptz not null default now(),
  unique(attempt_id, question_id)
);

-- =============================================================================
-- 8. USER SUBJECT PROGRESS TABLE
-- Independent skill levels for every subject (HTML, CSS, React JS, Russian, English, Math)
-- and topic mastery tracking
-- =============================================================================
create table if not exists public.user_subject_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id text not null references public.quiz_categories(id) on delete cascade,
  subject_id text not null, -- 'html', 'css', 'react', 'russian', 'english', 'math'
  subject_xp integer not null default 0,
  weighted_skill_points numeric(8,2) not null default 0.00,
  subject_level integer not null default 1 check (subject_level >= 1),
  quizzes_completed integer not null default 0,
  questions_answered integer not null default 0,
  correct_answers integer not null default 0,
  accuracy_percentage numeric(5,2) not null default 0.00,
  best_score integer not null default 0,
  topic_progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique(user_id, subject_id)
);

-- =============================================================================
-- 9. USER ACHIEVEMENTS TABLE
-- Stores unlocked achievement badges per user
-- =============================================================================
create table if not exists public.user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_key text not null,
  title_en text not null,
  title_uz text not null,
  title_ru text not null,
  description_en text not null,
  description_uz text not null,
  description_ru text not null,
  icon_name text not null,
  badge_tier text not null default 'gold',
  unlocked_at timestamptz not null default now(),
  unique(user_id, achievement_key)
);

-- =============================================================================
-- LEVEL CALCULATION FUNCTION (Matches exact specification)
-- Level 1: 0-9 XP
-- Level 2: 10-24 XP
-- Level 3: 25-49 XP
-- Level 4: 50-79 XP
-- Level 5: 80-119 XP
-- Level 6: 120-169 XP
-- Level 7: 170-229 XP
-- Level 8: 230-299 XP
-- Level 9: 300-399 XP
-- Level 10: 400+ XP (and continues beyond Level 10)
-- =============================================================================
create or replace function public.calculate_overall_level(xp integer)
returns integer
language plpgsql
immutable
as $$
declare
  lvl integer := 10;
  threshold integer := 400;
  step_size integer := 120;
begin
  if xp < 10 then return 1;
  elsif xp < 25 then return 2;
  elsif xp < 50 then return 3;
  elsif xp < 80 then return 4;
  elsif xp < 120 then return 5;
  elsif xp < 170 then return 6;
  elsif xp < 230 then return 7;
  elsif xp < 300 then return 8;
  elsif xp < 400 then return 9;
  else
    while xp >= (threshold + step_size) loop
      threshold := threshold + step_size;
      lvl := lvl + 1;
      step_size := step_size + 20;
    end loop;
    return lvl;
  end if;
end;
$$;

-- =============================================================================
-- TRIGGER: AUTO-CREATE PROFILE ON AUTH.USERS SIGNUP
-- Every new user starts at Level 1 with 0 points
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    username,
    full_name,
    email,
    country_code,
    country_name,
    total_xp,
    current_level,
    completed_quizzes,
    total_questions_answered,
    correct_answers,
    accuracy_percentage
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'country_code', 'UZ'),
    coalesce(new.raw_user_meta_data->>'country_name', 'Uzbekistan'),
    0,
    1,
    0,
    0,
    0,
    0.00
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
alter table public.profiles enable row level security;
alter table public.quiz_categories enable row level security;
alter table public.quiz_topics enable row level security;
alter table public.questions enable row level security;
alter table public.answer_options enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.user_answers enable row level security;
alter table public.user_subject_progress enable row level security;
alter table public.user_achievements enable row level security;

-- Profiles: Users can read their own full profile, or read public leaderboard profiles (level >= 10)
create policy "Users can view own profile or eligible leaderboard profiles"
  on public.profiles for select
  using (auth.uid() = id or current_level >= 10);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update only their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Quiz Catalog (Categories, Topics, Questions, Answer Options): Readable by all authenticated & anon users
create policy "Anyone can read quiz categories"
  on public.quiz_categories for select using (true);

create policy "Anyone can read quiz topics"
  on public.quiz_topics for select using (true);

create policy "Anyone can read questions"
  on public.questions for select using (true);

create policy "Anyone can read answer options"
  on public.answer_options for select using (true);

-- Quiz Attempts: Strict per-user isolation
create policy "Users can view only their own quiz attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert only their own quiz attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

-- User Answers: Strict per-user isolation
create policy "Users can view only their own answers"
  on public.user_answers for select
  using (auth.uid() = user_id);

create policy "Users can insert only their own answers"
  on public.user_answers for insert
  with check (auth.uid() = user_id);

-- User Subject Progress: Strict per-user isolation
create policy "Users can view only their own subject progress"
  on public.user_subject_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert only their own subject progress"
  on public.user_subject_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update only their own subject progress"
  on public.user_subject_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- User Achievements: Users can view own achievements (and public profile achievements)
create policy "Users can view own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "Users can insert own achievements"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

-- =============================================================================
-- SUPABASE STORAGE BUCKET FOR AVATARS
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

