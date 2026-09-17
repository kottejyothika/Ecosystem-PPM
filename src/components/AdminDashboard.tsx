import React, { useState } from 'react';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  Users,
  Building2,
  Layers,
  Recycle,
  CheckCircle2,
  FileText,
  BarChart3,
  Bell,
  RefreshCw,
  PlusCircle,
  Clock,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { WEEKLY_ANALYTICS_DATA } from '../data/initialData';

export const AdminDashboard: React.FC = () => {
  const {
    stations,
    collections,
    users,
    segregationStats,
    setCurrentView,
    resetStation,
    setToast,
  } = useEcoCampus();

  const totalCollected = collections.reduce((a, b) => a + b.quantity, 0).toFixed(1);
  const totalRecycled = segregationStats.reduce((a, b) => a + b.recycled, 0).toFixed(1);
  const studentCount = users.filter((u) => u.role === 'student').length * 45;
  const criticalStations = stations.filter((s) => s.status === 'Full' || s.status === 'Almost Full');

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setToast({ message: 'Campus telemetry sync complete. All nodes active.', type: 'info' });
    }, 400);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Campus Sustainability Operations Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Institutional Monitoring Console
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Live environmental audit dashboard for administrative leads, green cell coordinators, and
            sanitation directors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Sync Telemetry</span>
          </button>
          <button
            onClick={() => setCurrentView('reports')}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Download Audit Report</span>
          </button>
        </div>
      </div>

      {/* Main 6 KPI Metric Cards (Prompt Section 9) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Total Plastic Collected */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-600">Total Collected</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              🗑️
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            {totalCollected} <span className="text-xs font-normal">kg</span>
          </p>
          <p className="text-[10px] text-emerald-700 font-medium mt-1">Target: 1,500 kg</p>
        </div>

        {/* 2. Total Plastic Recycled */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-600">Total Recycled</span>
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
              ♻️
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            {totalRecycled} <span className="text-xs font-normal">kg</span>
          </p>
          <p className="text-[10px] text-teal-700 font-medium mt-1">Processed yield</p>
        </div>

        {/* 3. Plastic Reduction */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-600">Plastic Reduction</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
              📉
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            32<span className="text-sm font-semibold">%</span>
          </p>
          <p className="text-[10px] text-cyan-700 font-medium mt-1">Single-use decrease</p>
        </div>

        {/* 4. Active Students */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-600">Active Students</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              👥
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            {studentCount}
          </p>
          <p className="text-[10px] text-emerald-700 font-medium mt-1">Across 8 faculties</p>
        </div>

        {/* 5. Collection Stations */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-600">Collection Stations</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              📍
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            24 <span className="text-xs font-normal text-gray-500">({stations.length} IoT)</span>
          </p>
          <p className="text-[10px] text-amber-700 font-medium mt-1">Campus drop points</p>
        </div>

        {/* 6. Recycling Rate */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-600">Recycling Rate</span>
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
              🏆
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            {totalCollected > 0 ? Math.round((parseFloat(totalRecycled) / parseFloat(totalCollected)) * 100) : 78}
            <span className="text-sm font-semibold">%</span>
          </p>
          <p className="text-[10px] text-teal-700 font-medium mt-1">Target: 75% met</p>
        </div>
      </div>

      {/* Critical Station Urgent Actions Bar (If Any) */}
      {criticalStations.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950">
                Automated High-Capacity Dispatch Alert
              </h3>
              <p className="text-xs text-rose-800/90 mt-0.5">
                The following bins exceed 80% capacity:{' '}
                <strong>{criticalStations.map((s) => `${s.station_id} (${s.name})`).join(', ')}</strong>.
                Sanitation team assigned for priority clearance.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('smart-collection')}
            className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Open Station Map
          </button>
        </div>
      )}

      {/* Station Monitoring Table */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold font-serif text-emerald-950">
              Live Station Status & Worker Assignments
            </h3>
            <p className="text-xs text-gray-500">Real-time IoT load sensors across university zones</p>
          </div>
          <button
            onClick={() => setCurrentView('stations-management')}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            Manage Stations & Workers <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-2.5 px-3">Station</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Load / Capacity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Worker In-Charge</th>
                <th className="py-2.5 px-3">Last Pickup</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stations.map((st) => {
                const fillPct = Math.round((st.current_quantity / st.capacity) * 100);
                return (
                  <tr key={st.station_id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-emerald-950">
                      <span className="font-mono text-emerald-800 mr-2">{st.station_id}</span>
                      {st.name}
                    </td>
                    <td className="py-3 px-3 text-gray-600">{st.location}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              st.status === 'Full'
                                ? 'bg-rose-500'
                                : st.status === 'Almost Full'
                                ? 'bg-amber-500'
                                : 'bg-emerald-600'
                            }`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <span className="font-bold text-gray-800 text-[11px]">{fillPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.status === 'Full'
                            ? 'bg-rose-100 text-rose-800'
                            : st.status === 'Almost Full'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-700">{st.assigned_worker}</td>
                    <td className="py-3 px-3 text-gray-500">{st.last_collection}</td>
                    <td className="py-3 px-3 text-right">
                      {st.current_quantity > 0 ? (
                        <button
                          onClick={() => resetStation(st.station_id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-semibold"
                        >
                          Clear & Reset
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Empty</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Bar Chart Simulation */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Weekly Plastic Inflow (kg)
            </h3>
            <span className="text-xs text-gray-400">Past 7 Days</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-gray-100">
            {WEEKLY_ANALYTICS_DATA.map((day) => {
              const maxDay = 45;
              const barHeightPct = Math.round((day.total / maxDay) * 100);
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-[10px] px-2 py-1 rounded pointer-events-none transition-opacity">
                    {day.total} kg
                  </div>
                  <div className="w-full bg-emerald-100 hover:bg-emerald-200 rounded-t-lg transition-all relative overflow-hidden h-36 flex items-end">
                    <div
                      className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-t-lg transition-all"
                      style={{ height: `${barHeightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600">{day.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span>Peak Day: Thursday (39.5 kg)</span>
            <span className="text-emerald-800 font-semibold">Average: 30.1 kg/day</span>
          </div>
        </div>

        {/* Segregation Stream Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Resin Type Breakdown
            </h3>
            <button
              onClick={() => setCurrentView('segregation')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Detailed Sorting
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {segregationStats.map((item) => {
              const pct = Math.round(
                (item.collected / segregationStats.reduce((a, b) => a + b.collected, 0)) * 100
              );
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-700">{item.category}</span>
                    <span className="font-bold text-gray-900">
                      {item.collected} kg ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              94.2% purity achieved across PET and container streams. Zero heavy contamination flags.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
