import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Medal,
  Users,
  Building2,
  Sparkles,
  TrendingUp,
  Leaf,
  Filter,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { DEPARTMENT_IMPACT_DATA } from '../data/initialData';

export const LeaderboardPage: React.FC = () => {
  const { users, currentUser } = useEcoCampus();
  const [tab, setTab] = useState<'students' | 'departments'>('students');
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');

  const students = users
    .filter((u) => u.role === 'student')
    .sort((a, b) => b.reward_points - a.reward_points);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-extrabold flex items-center justify-center text-xs shadow-sm ring-2 ring-amber-300">
            🥇 1
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-800 font-extrabold flex items-center justify-center text-xs shadow-sm ring-2 ring-gray-200">
            🥈 2
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm ring-2 ring-amber-500">
            🥉 3
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-xs">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Campus Sustainability Hall of Fame</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            EcoCampus Leaderboards
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Celebrating the individuals and departments turning the campus plastic-free through
            daily drop-offs, segregation, and reusable pledges.
          </p>
        </div>

        {/* Tab & Timeframe selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTab('students')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tab === 'students' ? 'bg-white text-emerald-950 shadow-2xs' : 'text-gray-600'
              }`}
            >
              Top Students
            </button>
            <button
              onClick={() => setTab('departments')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tab === 'departments' ? 'bg-white text-emerald-950 shadow-2xs' : 'text-gray-600'
              }`}
            >
              Departments
            </button>
          </div>
        </div>
      </div>

      {tab === 'students' ? (
        /* Student Leaderboard */
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Student Zero-Waste Champions
            </h3>
            <span className="text-xs text-gray-500">{students.length} Participating Students</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Plastic Diverted</th>
                  <th className="py-2.5 px-3">Batches</th>
                  <th className="py-2.5 px-3 text-right">Reward Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((student, idx) => {
                  const isCurrent = student.user_id === currentUser.user_id;
                  const totalKg = student.plasticCollectedKg + student.plasticReducedKg;

                  return (
                    <tr
                      key={student.user_id}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-emerald-50/80 font-semibold border-l-4 border-emerald-600'
                          : 'hover:bg-gray-50/80'
                      }`}
                    >
                      <td className="py-3 px-3">{getRankBadge(idx + 1)}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{student.avatar}</span>
                          <div>
                            <p className="font-bold text-emerald-950">
                              {student.name} {isCurrent && '(You)'}
                            </p>
                            <p className="text-[10px] text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{student.department || 'General Studies'}</td>
                      <td className="py-3 px-3 font-bold text-emerald-900">{totalKg.toFixed(1)} kg</td>
                      <td className="py-3 px-3 text-gray-600">{student.recyclingContributions}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-block font-extrabold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full text-xs">
                          {student.reward_points} pts
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Department Leaderboard */
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Department Waste Reduction Trophies
            </h3>
            <span className="text-xs text-gray-500">Ranked by Reduction Rate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEPARTMENT_IMPACT_DATA.map((dept, idx) => (
              <div
                key={dept.department}
                className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/80 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Rank #{idx + 1}
                    </span>
                    <span className="text-xs text-gray-500">{dept.studentsCount} Students Active</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-emerald-950">
                    {dept.department}
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium mt-1">
                    Plastic Collected: <strong>{dept.collectedKg} kg</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">
                    Reduction Rate
                  </span>
                  <span className="text-xl font-extrabold font-serif text-emerald-800">
                    {dept.reductionRate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
