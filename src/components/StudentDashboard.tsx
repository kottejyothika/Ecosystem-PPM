import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Recycle,
  TrendingUp,
  Leaf,
  ArrowUpRight,
  Gift,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Award,
  ChevronRight,
  Calendar,
  Layers,
  Clock,
  PlusCircle,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { INITIAL_ACHIEVEMENTS, INITIAL_ECO_TIPS } from '../data/initialData';

interface StudentDashboardProps {
  onOpenReportModal: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenReportModal }) => {
  const {
    currentUser,
    users,
    collections,
    setCurrentView,
    rewards,
    redeemedRewards,
    campaigns,
  } = useEcoCampus();

  const myCollections = collections.filter((c) => c.user_id === currentUser.user_id);
  const studentLeaderboard = users
    .filter((u) => u.role === 'student')
    .sort((a, b) => b.reward_points - a.reward_points);

  const myRank =
    studentLeaderboard.findIndex((u) => u.user_id === currentUser.user_id) + 1 || 1;

  // Environmental Impact Calculations based on student plastic collected + reduced
  const totalKg = currentUser.plasticCollectedKg + currentUser.plasticReducedKg;
  const co2SavedKg = (totalKg * 1.8).toFixed(1); // 1.8 kg CO2 eq saved per kg plastic diverted
  const treesEquivalent = (totalKg * 0.12).toFixed(1);
  const bottlesAvoided = Math.round(totalKg * 25);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Quick Action Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-8 opacity-5 pointer-events-none">
          <Recycle className="w-64 h-64 text-emerald-950" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <span>🌱 Campus Sustainability Champion</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Rank #{myRank} of {studentLeaderboard.length} Students</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Hello, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Track your campus plastic reduction, report segregated drop-offs, and unlock eco-rewards
            for your contributions.
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <button
            id="btn-quick-report-plastic"
            onClick={onOpenReportModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Plastic Drop</span>
          </button>
          <button
            onClick={() => setCurrentView('rewards')}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Gift className="w-4 h-4 text-amber-700" />
            <span>Redeem Rewards</span>
          </button>
        </div>
      </div>

      {/* Top 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Plastic Collected */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-800/80">Plastic Collected</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              🗑️
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            {currentUser.plasticCollectedKg.toFixed(1)}{' '}
            <span className="text-xs font-medium text-emerald-700">kg</span>
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Deposited at campus smart stations</p>
        </div>

        {/* Plastic Reduced */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-teal-800/80">Plastic Reduced</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              🌱
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            {currentUser.plasticReducedKg.toFixed(1)}{' '}
            <span className="text-xs font-medium text-teal-700">kg</span>
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Saved through reusable alternatives</p>
        </div>

        {/* Reward Points */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/70 shadow-xs hover:shadow-sm transition-shadow bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-amber-900/80">Reward Points</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              🏆
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-amber-950">
            {currentUser.reward_points}{' '}
            <span className="text-xs font-semibold text-amber-700">pts</span>
          </p>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">Ready to claim university vouchers</p>
        </div>

        {/* Recycling Contributions */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-800/80">Recycling Batches</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              ♻️
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            {currentUser.recyclingContributions}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Verified clean segregated entries</p>
        </div>
      </div>

      {/* Main Grid: My Plastic Impact & Rewards Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section: My Plastic Impact (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif text-emerald-950 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                My Plastic Impact Dashboard
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Calculated environmental savings from your personal collection & reduction habits.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('impact')}
              className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              Full Impact Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Graphical Representation Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
              <span className="text-2xl">🌍</span>
              <p className="text-xl font-extrabold text-emerald-950 mt-1">{co2SavedKg} kg</p>
              <p className="text-[11px] font-medium text-emerald-800">CO₂e Emissions Prevented</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Equivalent to 42km car travel</p>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
              <span className="text-2xl">🌳</span>
              <p className="text-xl font-extrabold text-teal-950 mt-1">{treesEquivalent}</p>
              <p className="text-[11px] font-medium text-teal-800">Tree Carbon Offset Equivalent</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Young sapling absorption</p>
            </div>
            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-center">
              <span className="text-2xl">🧴</span>
              <p className="text-xl font-extrabold text-cyan-950 mt-1">{bottlesAvoided}</p>
              <p className="text-[11px] font-medium text-cyan-800">Single-Use Bottles Diverted</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Kept out of local landfills</p>
            </div>
          </div>

          {/* Progress Bar of Target */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-800 mb-1.5">
              <span>Semester Zero-Waste Goal: 30 kg Diverted</span>
              <span className="text-emerald-700 font-bold">
                {Math.round((totalKg / 30) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalKg / 30) * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              You are only {(30 - totalKg).toFixed(1)} kg away from the Green Campus Hero Gold Tier!
            </p>
          </div>

          {/* Recent Activity List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Recent Eco Activities
              </h3>
              <span className="text-[11px] text-gray-400">Past 7 Days</span>
            </div>
            <div className="space-y-2">
              {myCollections.length > 0 ? (
                myCollections.slice(0, 4).map((c) => (
                  <div
                    key={c.collection_id}
                    className="p-3 rounded-xl bg-gray-50/80 hover:bg-emerald-50/40 border border-gray-100 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        ♻️
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-950">
                          {c.plastic_type} submitted ({c.quantity} kg)
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {c.stationName} • {c.date}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full text-[11px]">
                      +{c.pointsAwarded} pts
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 text-center text-xs text-gray-500">
                  No drops reported yet. Drop your first plastic bottle at any station to earn points!
                </div>
              )}
              {/* Campaign / Pledge activities simulated */}
              <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    🌱
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-950">Pledged Reusable Steel Bottle</p>
                    <p className="text-[10px] text-gray-500">Eco Alternatives Pledge</p>
                  </div>
                </div>
                <span className="font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full text-[11px]">
                  +30 pts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Reward Points & Quick Redeem */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
              <Gift className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Reward Points Balance
              </span>
              <p className="text-4xl font-extrabold font-serif mt-1">
                {currentUser.reward_points} <span className="text-lg font-normal text-emerald-300">pts</span>
              </p>
              <p className="text-xs text-emerald-100/80 mt-1">
                Earned from verified plastic drops, segregation, and campaign drives.
              </p>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                <p className="text-[11px] font-medium text-emerald-200">Available to Redeem Now:</p>
                {rewards.slice(0, 2).map((r) => (
                  <div
                    key={r.reward_id}
                    className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-between text-xs hover:bg-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{r.icon}</span>
                      <span className="text-xs font-semibold truncate max-w-[140px]">
                        {r.reward_name}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-300">{r.points_required} pts</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCurrentView('rewards')}
                className="mt-5 w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Open Rewards Center</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Student Leaderboard Widget */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Campus Eco Leaderboard
              </h3>
              <button
                onClick={() => setCurrentView('leaderboard')}
                className="text-[11px] text-emerald-700 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {studentLeaderboard.slice(0, 5).map((student, idx) => (
                <div
                  key={student.user_id}
                  className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                    student.user_id === currentUser.user_id
                      ? 'bg-emerald-100/70 border border-emerald-300 font-semibold'
                      : 'bg-gray-50 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950'
                          : idx === 1
                          ? 'bg-gray-300 text-gray-800'
                          : idx === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-emerald-950 truncate max-w-[120px]">
                      {student.name} {student.user_id === currentUser.user_id && '(You)'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-800">{student.reward_points} pts</p>
                    <p className="text-[10px] text-gray-500">{student.plasticCollectedKg} kg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Eco Tips & Badges Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eco Tips Section */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Daily Eco Tips for Students
            </h3>
            <button
              onClick={() => setCurrentView('eco-tips')}
              className="text-[11px] text-emerald-700 font-semibold hover:underline"
            >
              Browse All
            </button>
          </div>

          <div className="space-y-3">
            {INITIAL_ECO_TIPS.slice(0, 3).map((tip) => (
              <div
                key={tip.id}
                className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 flex items-start gap-3"
              >
                <span className="text-2xl mt-0.5">{tip.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-emerald-950">{tip.title}</p>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white text-emerald-700 border border-emerald-200">
                      {tip.impactLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              My Eco Achievements
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              3 of 5 Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INITIAL_ACHIEVEMENTS.slice(0, 4).map((ach) => (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border transition-all ${
                  ach.unlocked
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-gray-50/60 border-gray-200/80 opacity-60 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl">{ach.icon}</span>
                  {ach.unlocked ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[9px] text-gray-400">Locked</span>
                  )}
                </div>
                <p className="text-xs font-bold">{ach.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
