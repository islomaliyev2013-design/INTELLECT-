import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Crown,
  Medal,
  Lock,
  Unlock,
  Flame,
  Sparkles,
  CheckCircle2,
  Play,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCountryByCode } from '../data/curriculum';

export default function LeaderboardPage() {
  const { profile, levelInfo, leaderboard, uiLang, t, navigate } = useApp();

  if (!profile || !levelInfo || !leaderboard) return null;

  const {
    competitors = [],
    topThree = [],
    isCurrentUserEligible,
    currentUserRank,
    xpNeededToUnlock,
  } = leaderboard;

  const firstPlace = topThree[0];
  const secondPlace = topThree[1];
  const thirdPlace = topThree[2];

  const userCountry = getCountryByCode(profile.country_code);
  const unlockProgressPercent = Math.min(
    100,
    Math.round((profile.total_xp / 400) * 100)
  );

  return (
    <div className="space-y-8">
      {/* HEADER & LEVEL 10 ELIGIBILITY BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-soft space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>{t.worldwideLeague}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.leaderboard.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              {t.leaderboard.subtitle}
            </p>
          </div>

          {/* Current User Rank / Unlock Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F7FF] border border-indigo-100 flex items-center gap-4 shrink-0">
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-12 h-12 rounded-xl object-cover bg-white border-2 border-indigo-200"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.leaderboard.yourRank}
              </p>
              {isCurrentUserEligible ? (
                <p className="text-2xl font-extrabold font-mono text-indigo-600">
                  #{currentUserRank} <span className="text-xs text-emerald-600">{t.liveBadge}</span>
                </p>
              ) : (
                <p className="text-sm font-extrabold text-amber-700 flex items-center gap-1.5 mt-0.5">
                  <Lock className="w-4 h-4" />
                  <span>
                    {t.leaderboard.notRankedYet} ({profile.total_xp}/400 XP)
                  </span>
                </p>
              )}
              <p className="text-xs text-slate-500">
                {userCountry.flag} @{profile.username} • {t.levelLabel} {levelInfo.level}
              </p>
            </div>
          </div>
        </div>

        {/* Eligibility Rule Notice & Progress Bar */}
        {!isCurrentUserEligible ? (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200/80 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm sm:text-base">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{t.leaderboard.lockedBannerTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.leaderboard.lockedBannerDesc}
              </p>
              <div className="pt-1">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-indigo-700">
                    {t.dashboard.currentLevel}: {levelInfo.level} ({profile.total_xp} XP)
                  </span>
                  <span className="text-slate-600">
                    {xpNeededToUnlock} {t.xpToLevelNext} 10 (400 XP)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white overflow-hidden border border-indigo-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-500"
                    style={{ width: `${Math.max(3, unlockProgressPercent)}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('Explore')}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 shrink-0 shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{t.earnXpNow}</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-emerald-950">
                  {t.leaderboard.unlockedBannerTitle}
                </h3>
                <p className="text-xs text-emerald-800">
                  {t.leaderboard.unlockedBannerDesc}
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-700 font-mono font-extrabold text-sm border border-emerald-200">
              {t.leaderboard.rank} #{currentUserRank}
            </span>
          </div>
        )}
      </div>

      {/* VISUALLY IMPRESSIVE TOP 3 PODIUM (Section 8 Requirement) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-elevated relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            {t.leaderboard.podiumTitle}
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
          {/* 2ND PLACE (SILVER - LEFT ON DESKTOP) */}
          {secondPlace && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="order-2 md:order-1 bg-white/10 backdrop-blur-md border border-slate-300/30 rounded-3xl p-6 text-center flex flex-col items-center relative"
            >
              <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-mono font-extrabold text-sm flex items-center justify-center shadow mb-3">
                #2
              </div>
              <div className="relative">
                <img
                  src={secondPlace.avatar_url}
                  alt={secondPlace.username}
                  className="w-20 h-20 rounded-2xl object-cover bg-white border-4 border-slate-300 shadow-lg"
                />
                <span className="absolute -bottom-2 -right-2 text-lg">
                  {secondPlace.countryFlag}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white mt-4 truncate max-w-full">
                {secondPlace.full_name}
              </h3>
              <p className="text-xs text-indigo-200">@{secondPlace.username}</p>

              <div className="mt-4 w-full pt-3 border-t border-white/10 flex items-center justify-around text-xs">
                <div>
                  <span className="block text-indigo-300">{t.leaderboard.level}</span>
                  <strong className="font-mono text-sm text-white">
                    {t.levelAbbr}{secondPlace.current_level}
                  </strong>
                </div>
                <div>
                  <span className="block text-indigo-300">{t.leaderboard.totalXp}</span>
                  <strong className="font-mono text-sm text-amber-300">
                    {secondPlace.total_xp} XP
                  </strong>
                </div>
              </div>
            </motion.div>
          )}

          {/* 1ST PLACE (GOLD - ELEVATED CENTER) */}
          {firstPlace && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="order-1 md:order-2 bg-gradient-to-b from-amber-400/25 via-indigo-800/40 to-indigo-900/60 backdrop-blur-md border-2 border-amber-400 rounded-3xl p-7 text-center flex flex-col items-center md:-translate-y-4 shadow-2xl"
            >
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs mb-3 shadow">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>{t.champion1}</span>
              </div>
              <div className="relative">
                <img
                  src={firstPlace.avatar_url}
                  alt={firstPlace.username}
                  className="w-24 h-24 rounded-2xl object-cover bg-white border-4 border-amber-400 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 text-xl">
                  {firstPlace.countryFlag}
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-white mt-4 truncate max-w-full">
                {firstPlace.full_name}
              </h3>
              <p className="text-xs text-amber-200">@{firstPlace.username}</p>

              <div className="mt-5 w-full pt-4 border-t border-white/15 flex items-center justify-around text-xs">
                <div>
                  <span className="block text-indigo-200">{t.leaderboard.level}</span>
                  <strong className="font-mono text-base text-white">
                    {t.levelAbbr}{firstPlace.current_level}
                  </strong>
                </div>
                <div>
                  <span className="block text-indigo-200">{t.leaderboard.totalXp}</span>
                  <strong className="font-mono text-base text-amber-300">
                    {firstPlace.total_xp} XP
                  </strong>
                </div>
                <div>
                  <span className="block text-indigo-200">{t.leaderboard.accuracy}</span>
                  <strong className="font-mono text-base text-emerald-300">
                    {firstPlace.accuracy_percentage}%
                  </strong>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3RD PLACE (BRONZE - RIGHT ON DESKTOP) */}
          {thirdPlace && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="order-3 bg-white/10 backdrop-blur-md border border-amber-600/40 rounded-3xl p-6 text-center flex flex-col items-center relative"
            >
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-mono font-extrabold text-sm flex items-center justify-center shadow mb-3">
                #3
              </div>
              <div className="relative">
                <img
                  src={thirdPlace.avatar_url}
                  alt={thirdPlace.username}
                  className="w-20 h-20 rounded-2xl object-cover bg-white border-4 border-amber-600 shadow-lg"
                />
                <span className="absolute -bottom-2 -right-2 text-lg">
                  {thirdPlace.countryFlag}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white mt-4 truncate max-w-full">
                {thirdPlace.full_name}
              </h3>
              <p className="text-xs text-indigo-200">@{thirdPlace.username}</p>

              <div className="mt-4 w-full pt-3 border-t border-white/10 flex items-center justify-around text-xs">
                <div>
                  <span className="block text-indigo-300">{t.leaderboard.level}</span>
                  <strong className="font-mono text-sm text-white">
                    {t.levelAbbr}{thirdPlace.current_level}
                  </strong>
                </div>
                <div>
                  <span className="block text-indigo-300">{t.leaderboard.totalXp}</span>
                  <strong className="font-mono text-sm text-amber-300">
                    {thirdPlace.total_xp} XP
                  </strong>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* FULL WORLDWIDE RANKINGS TABLE (Eligible Level 10+ Users) */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            {t.verifiedCompetitors}
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {competitors.length} {t.rankedScholars}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F7FF] border-b border-indigo-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">{t.leaderboard.rank}</th>
                <th className="py-3.5 px-5">{t.leaderboard.learner}</th>
                <th className="py-3.5 px-5">{t.leaderboard.country}</th>
                <th className="py-3.5 px-5">{t.leaderboard.level}</th>
                <th className="py-3.5 px-5">{t.leaderboard.completed}</th>
                <th className="py-3.5 px-5">{t.leaderboard.accuracy}</th>
                <th className="py-3.5 px-5 text-right">{t.leaderboard.totalXp}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {competitors.map((comp) => {
                const isTop3 = comp.rank <= 3;
                const rankBadgeColors = {
                  1: 'bg-amber-400 text-slate-950',
                  2: 'bg-slate-300 text-slate-900',
                  3: 'bg-amber-600 text-white',
                };

                return (
                  <tr
                    key={comp.id}
                    className={`transition-colors ${
                      comp.isCurrentUser
                        ? 'bg-indigo-50/90 font-semibold'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-mono font-extrabold text-xs ${
                          isTop3
                            ? rankBadgeColors[comp.rank]
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        #{comp.rank}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={comp.avatar_url}
                          alt={comp.username}
                          className="w-10 h-10 rounded-xl object-cover bg-indigo-50 border border-indigo-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900">
                              {comp.full_name}
                            </span>
                            {comp.isCurrentUser && (
                              <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-extrabold">
                                {t.youBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">@{comp.username}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <span className="text-base">{comp.countryFlag}</span>
                        <span>{getCountryByCode(comp.country_code, uiLang).name}</span>
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-extrabold text-xs">
                        {t.levelAbbr}{comp.current_level}
                      </span>
                    </td>

                    <td className="py-4 px-5 font-mono font-bold text-slate-700">
                      {comp.completed_quizzes}
                    </td>

                    <td className="py-4 px-5 font-mono font-bold text-emerald-600">
                      {comp.accuracy_percentage}%
                    </td>

                    <td className="py-4 px-5 text-right">
                      <span className="font-mono font-extrabold text-base text-indigo-600">
                        {comp.total_xp} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

