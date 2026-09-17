import React, { useState } from 'react';
import {
  Megaphone,
  Calendar,
  Users,
  Target,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { Campaign } from '../types';

export const CampaignsPage: React.FC = () => {
  const { campaigns, joinCampaign, addCampaign, currentRole } = useEcoCampus();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('Oct 1, 2026');
  const [endDate, setEndDate] = useState('Oct 7, 2026');
  const [targetKg, setTargetKg] = useState('200');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign({
      title,
      description,
      startDate,
      endDate,
      targetKg: parseFloat(targetKg),
    });
    setIsCreateOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Megaphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Campus Mobilization & Green Drives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Awareness Campaigns & Drives
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Participate in collaborative university-wide zero-waste sprints. Joining awards{' '}
            <strong>+50 Eco Points</strong> and helps your department top the leaderboard.
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch New Campaign</span>
          </button>
        )}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => {
          const pct = Math.min(100, Math.round((camp.collectedKg / camp.targetKg) * 100));

          return (
            <div
              key={camp.campaign_id}
              className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      camp.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : camp.status === 'Upcoming'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {camp.status === 'Active' && '● Live Campaign'}
                    {camp.status === 'Upcoming' && '⏱ Coming Soon'}
                    {camp.status === 'Completed' && '✓ Completed'}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {camp.startDate} - {camp.endDate}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-emerald-950 font-serif">{camp.title}</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{camp.description}</p>

                {/* Progress Bar towards Target */}
                <div className="mt-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-emerald-700" /> Target Progress
                    </span>
                    <span className="font-bold text-emerald-900">
                      {camp.collectedKg} / {camp.targetKg} kg ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-700" />
                      {camp.participantsCount} Students & Staff Enrolled
                    </span>
                    <span className="text-emerald-700 font-semibold">Bonus: +50 Pts</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  disabled={camp.joined || camp.status === 'Completed'}
                  onClick={() => joinCampaign(camp.campaign_id)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                    camp.joined
                      ? 'bg-emerald-100 text-emerald-850 cursor-default font-bold'
                      : camp.status === 'Completed'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm hover:scale-[1.01]'
                  }`}
                >
                  {camp.joined ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Enrolled & 50 Pts Claimed</span>
                    </>
                  ) : camp.status === 'Completed' ? (
                    <span>Campaign Concluded</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Join Campaign & Claim +50 Pts</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Create Campaign Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
            <h3 className="text-xl font-bold font-serif text-emerald-950">
              Launch Awareness Campaign
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Create a targeted zero-waste initiative for campus students and faculty.
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zero-Waste Hostel Cup Challenge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description & Rules
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Goals, guidelines, and collection points..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Plastic Goal (kg)
                </label>
                <input
                  type="number"
                  required
                  value={targetKg}
                  onChange={(e) => setTargetKg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
