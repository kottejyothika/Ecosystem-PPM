import React, { useState } from 'react';
import {
  Users,
  Search,
  Award,
  Sparkles,
  CheckCircle2,
  Mail,
  Building,
  Plus,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';

export const StudentsManagementPage: React.FC = () => {
  const { users, currentUser, setToast } = useEcoCampus();
  const [search, setSearch] = useState('');

  const students = users
    .filter((u) => u.role === 'student')
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.department && u.department.toLowerCase().includes(search.toLowerCase()))
    );

  const handleAwardBonus = (studentName: string) => {
    setToast({
      message: `Awarded +50 green points bonus to ${studentName} for campus clean-up initiative!`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Participant Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Student Eco-Directory
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Monitor individual student contributions, review drop-off frequency, and grant faculty
            commendation bonuses.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search students by name, email, or dept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 text-gray-900"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
              <th className="py-2.5 px-3">Student</th>
              <th className="py-2.5 px-3">Department</th>
              <th className="py-2.5 px-3">Collected (kg)</th>
              <th className="py-2.5 px-3">Reduced (kg)</th>
              <th className="py-2.5 px-3">Reward Points</th>
              <th className="py-2.5 px-3 text-right">Faculty Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((student) => (
              <tr key={student.user_id} className="hover:bg-emerald-50/40 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{student.avatar}</span>
                    <div>
                      <p className="font-bold text-emerald-950">{student.name}</p>
                      <p className="text-[10px] text-gray-500">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-600">{student.department || 'Undergraduate'}</td>
                <td className="py-3 px-3 font-semibold text-emerald-900">
                  {student.plasticCollectedKg.toFixed(1)} kg
                </td>
                <td className="py-3 px-3 text-teal-800">
                  {student.plasticReducedKg.toFixed(1)} kg
                </td>
                <td className="py-3 px-3">
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-xs">
                    {student.reward_points} pts
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => handleAwardBonus(student.name)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Bonus +50 Pts</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
