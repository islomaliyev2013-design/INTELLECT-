# NeuroQuiz Global — Interactive Quiz & Learning Platform

A modern, full-featured global educational quiz and learning platform where learners test their knowledge, earn XP, build subject-specific skill levels, unlock achievements, and compete in a worldwide Level 10+ leaderboard.

---

## 1. Technology Stack

- **Frontend Architecture**: React 18, React Native Web (`react-native-web`), HTML5, JavaScript (ES Modules)
- **Styling & Design System**: Tailwind CSS (with NativeWind-compatible utility system, soft lavender `#F8F7FF` canvas, deep navy `#0F172A` typography, indigo/blue gradients)
- **Animations & Icons**: Framer Motion (`framer-motion`), Lucide Icons (`lucide-react`), Canvas Confetti
- **Backend & Cloud Services**:
  - **Supabase Authentication** (`@supabase/supabase-js`)
  - **Supabase PostgreSQL Database** (`supabase/schema.sql` with 9 relational tables & Row Level Security)
  - **Supabase Storage** (`avatars` bucket for profile picture uploads)
  - **Hybrid Relational Persistence**: Automatically syncs with your live Supabase project when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured (via `.env` or the in-app **Settings** page), and provides a zero-config local relational PostgreSQL adapter out-of-the-box.

---

## 2. Four Main Learning Categories & 53 Topics (530 Multilingual Questions)

Every topic contains **10 authentic educational questions** written in **Uzbek (`O'zbekcha`)**, **English (`English`)**, and **Russian (`Русский`)**:

1. **Programming (26 Topics • 260 Questions)**
   - **HTML (8 Topics)**: HTML Basics, HTML Tags, Forms and Inputs, Semantic HTML, Tables, Links and Images, HTML Attributes, Advanced HTML
   - **CSS (8 Topics)**: CSS Basics, Selectors, Colors and Backgrounds, Flexbox, CSS Grid, Positioning, Animations, Responsive Design
   - **React JS (10 Topics)**: React Basics, Components, JSX, Props, State, useState, useEffect, React Router, Events, Advanced React
2. **Russian Language (8 Topics • 80 Questions)**
   - Russian Alphabet, Basic Vocabulary, Grammar, Verbs, Nouns, Sentence Construction, Reading Comprehension, Advanced Russian
3. **English Language (9 Topics • 90 Questions)**
   - English Alphabet, Basic Vocabulary, Grammar, Tenses, Verbs, Pronouns, Sentence Construction, Reading Comprehension, Advanced English
4. **Mathematics (10 Topics • 100 Questions)**
   - Fractions, Addition, Subtraction, Multiplication, Division, Percentages, Algebra, Equations, Geometry, Advanced Mathematics

---

## 3. Smart Level System & Subject-Specific Skill Levels

- **New Account Isolation**: Every new user account starts at **Level 1 with 0 XP**, 0 completed quizzes, and independent progress.
- **Overall Level Progression**:
  - Level 1: `0–9 XP`
  - Level 2: `10–24 XP`
  - Level 3: `25–49 XP`
  - Level 4: `50–79 XP`
  - Level 5: `80–119 XP`
  - Level 6: `120–169 XP`
  - Level 7: `170–229 XP`
  - Level 8: `230–299 XP`
  - Level 9: `300–399 XP`
  - Level 10: `400+ XP` (Unlocks the Global Competitive Leaderboard & continues beyond Level 10)
- **Independent Subject & Topic Skill Levels**:
  - Separate skill levels for **HTML**, **CSS**, **React JS**, **Russian Language**, **English Language**, and **Mathematics**, weighted by question difficulty (`basic = 1.0x`, `intermediate = 1.5x`, `advanced = 2.2x`).

---

## 4. Supabase Database Setup

1. Open your Supabase project's **SQL Editor** and execute [`supabase/schema.sql`](./supabase/schema.sql).
2. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or enter them directly in the platform's **Settings** page).
3. Click **"Seed 530 Multilingual Questions to Supabase"** in the **Settings** page to populate `quiz_categories`, `quiz_topics`, `questions`, and `answer_options`.

---

## 5. Running Locally

```bash
npm install
npm run dev
```

