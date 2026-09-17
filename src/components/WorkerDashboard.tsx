import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
  RefreshCw,
  Navigation,
  ListTodo,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { PlasticType, CollectionStation } from '../types';

export const WorkerDashboard: React.FC = () => {
  const {
    currentUser,
    stations,
    workerCollect,
    workerRecycle,
    segregationStats,
    setToast,
  } = useEcoCampus();

  // Filter stations assigned to this worker or show all stations
  const myAssignedStations = stations.filter(
    (st) =>
      st.assigned_worker.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase()) ||
      st.assigned_worker === 'Ramesh Kumar'
  );

  const displayStations = myAssignedStations.length > 0 ? myAssignedStations : stations;

  // Modal State
  const [selectedStation, setSelectedStation] = useState<CollectionStation | null>(null);
  const [collectedKg, setCollectedKg] = useState<string>('');
  const [plasticCategory, setPlasticCategory] = useState<PlasticType>('PET Bottles');

  // Interactive task checklist
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Clear Main Canteen (ST-01) - Priority', done: false },
    { id: 2, text: 'Inspect Library Quad (ST-02) fill sensors', done: true },
    { id: 3, text: 'Weigh and record morning PET bottle batch', done: true },
    { id: 4, text: 'Transfer 25kg sorted HDPE to baling room', done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation) return;
    const qty = parseFloat(collectedKg) || selectedStation.current_quantity;
    workerCollect(selectedStation.station_id, qty, plasticCategory);
    setSelectedStation(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Waste Logistics & Sanitation Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Welcome, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Streamlined mobile interface for clearing smart stations, verifying bulk segregation, and
            maintaining campus circular economy hygiene.
          </p>
        </div>

        {/* Daily Target Progress */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-right min-w-[200px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
            Daily Clearance Shift Goal
          </span>
          <p className="text-2xl font-bold font-serif text-blue-950 mt-0.5">
            18.5 <span className="text-xs font-normal">/ 30.0 kg</span>
          </p>
          <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '62%' }} />
          </div>
        </div>
      </div>

      {/* Route Optimization Recommendation */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-blue-300">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
              AI-Optimized Route Dispatch
            </span>
            <h3 className="text-base font-bold font-serif">Optimal Pickup Sequence</h3>
            <p className="text-xs text-blue-100/80 mt-0.5">
              Canteen (ST-01: 90%) → Library (ST-02: 83%) → Engineering Labs (ST-03: 40%)
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            setToast({
              message: 'Route confirmed. Navigation guidance active.',
              type: 'info',
            })
          }
          className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs transition-colors shrink-0"
        >
          Start Route Run
        </button>
      </div>

      {/* Assigned Stations Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-serif text-emerald-950">
            My Assigned Collection Stations
          </h2>
          <span className="text-xs text-gray-500">{displayStations.length} Stations in Zone</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayStations.map((st) => {
            const fillPct = Math.round((st.current_quantity / st.capacity) * 100);
            const isFull = st.status === 'Full' || fillPct >= 80;

            return (
              <div
                key={st.station_id}
                className={`bg-white rounded-3xl p-6 border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 ${
                  isFull ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-emerald-100'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-800">
                      {st.station_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        st.status === 'Full'
                          ? 'bg-rose-100 text-rose-800'
                          : st.status === 'Almost Full'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-emerald-950 font-serif">{st.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    {st.location}
                  </p>

                  {/* Fill progress */}
                  <div className="mt-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                      <span>Current Weight</span>
                      <span>
                        {st.current_quantity} / {st.capacity} kg ({fillPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          fillPct >= 90
                            ? 'bg-rose-500'
                            : fillPct >= 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Last Cleared: {st.last_collection}
                    </p>
                  </div>
                </div>

                {/* Quick Action */}
                <button
                  onClick={() => {
                    setSelectedStation(st);
                    setCollectedKg(st.current_quantity.toString());
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Collect & Empty Station</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Checklist & Batch Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Shift Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-blue-600" />
              Daily Shift Checklist
            </h3>
            <span className="text-xs text-gray-500">
              {tasks.filter((t) => t.done).length} / {tasks.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  task.done
                    ? 'bg-emerald-50/50 border-emerald-200 text-gray-500'
                    : 'bg-gray-50 border-gray-200 text-emerald-950 font-medium'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                    task.done ? 'bg-emerald-600 text-white' : 'border border-gray-300 bg-white'
                  }`}
                >
                  {task.done && '✓'}
                </div>
                <span className={`text-xs ${task.done ? 'line-through' : ''}`}>{task.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sorting Station Queue Summary */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Central Sorting Center Batches
            </h3>
            <span className="text-xs text-emerald-700 font-semibold">Live Queue</span>
          </div>

          <div className="space-y-2.5">
            {segregationStats.map((item) => (
              <div
                key={item.category}
                className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-emerald-950">{item.category}</p>
                  <p className="text-[10px] text-gray-500">
                    Awaiting shredding/baling: {item.pending} kg
                  </p>
                </div>
                <button
                  onClick={() => workerRecycle(item.category, item.pending > 10 ? 10 : item.pending)}
                  disabled={item.pending <= 0}
                  className="px-3 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium text-[11px] transition-colors"
                >
                  Verify +10kg
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Worker Clearance Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
            <h3 className="text-xl font-bold font-serif text-blue-950">Record Waste Clearance</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Confirm pickup for {selectedStation.name} ({selectedStation.station_id}).
            </p>

            <form onSubmit={handleCollectSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Weighed Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={collectedKg}
                  onChange={(e) => setCollectedKg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Dominant Plastic Stream
                </label>
                <select
                  value={plasticCategory}
                  onChange={(e) => setPlasticCategory(e.target.value as PlasticType)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white"
                >
                  <option value="PET Bottles">PET Bottles</option>
                  <option value="Plastic Bags">Plastic Bags</option>
                  <option value="Plastic Containers">Plastic Containers</option>
                  <option value="Other Plastic">Other Plastic</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-1">
                <p>✓ Reset bin to 0.0 kg.</p>
                <p>✓ Set status to 'Collected'.</p>
                <p>✓ Transfer weighed load into segregation staging area.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStation(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Confirm & Reset Bin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
