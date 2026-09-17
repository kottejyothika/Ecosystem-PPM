import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  MapPin,
  Clock,
  User,
  Trash2,
  Edit2,
  Layers,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { CollectionStation, PlasticType } from '../types';

export const StationsManagementPage: React.FC = () => {
  const { stations, addStation, resetStation, setToast } = useEcoCampus();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [stationName, setStationName] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('Central Campus');
  const [capacity, setCapacity] = useState('25');
  const [worker, setWorker] = useState('Ramesh Kumar');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ST-0${stations.length + 1}`;
    addStation({
      station_id: newId,
      name: stationName,
      location,
      zone,
      capacity: parseFloat(capacity),
      current_quantity: 0,
      acceptedTypes: ['PET Bottles', 'Plastic Bags', 'Plastic Containers'],
      last_collection: 'Just now',
      assigned_worker: worker,
      status: 'Available',
      mapCoords: { x: Math.floor(Math.random() * 60) + 20, y: Math.floor(Math.random() * 60) + 20 },
    });
    setIsAddOpen(false);
    setStationName('');
    setLocation('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Infrastructure Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Collection Stations Management
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Configure IoT smart bins, calibrate load threshold sensors, and reassign sanitation route
            workers across campus zones.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Provision New Smart Station</span>
        </button>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((st) => {
          const fillPct = Math.round((st.current_quantity / st.capacity) * 100);

          return (
            <div
              key={st.station_id}
              className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
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
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  {st.location} ({st.zone})
                </p>

                {/* Capacity Fill */}
                <div className="mt-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Current Load</span>
                    <span>
                      {st.current_quantity} / {st.capacity} kg ({fillPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
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
                </div>

                <div className="mt-3 space-y-1 text-xs text-gray-600">
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>In-Charge: <strong>{st.assigned_worker}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Last Clearance: {st.last_collection}</span>
                  </p>
                </div>
              </div>

              {/* Station Operations */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => resetStation(st.station_id)}
                  className="flex-1 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors"
                >
                  Clear Capacity
                </button>
                <button
                  onClick={() =>
                    setToast({
                      message: `Alert dispatched to worker ${st.assigned_worker} for ${st.station_id}.`,
                      type: 'info',
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors"
                >
                  Send Ping
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Provision Station Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
            <h3 className="text-xl font-bold font-serif text-emerald-950">
              Provision Smart Collection Bin
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Deploy a new IoT load-sensing station to the campus grid.
            </p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Station Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Block North Gate Bin"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Physical Campus Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Quad, Ground Floor Entrance"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Campus Zone</label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white"
                  >
                    <option value="Central Campus">Central Campus</option>
                    <option value="Academic Block">Academic Block</option>
                    <option value="Hostel Zone">Hostel Zone</option>
                    <option value="Sports Zone">Sports Zone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Max Capacity (kg)
                  </label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Assigned Worker
                </label>
                <input
                  type="text"
                  value={worker}
                  onChange={(e) => setWorker(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Deploy Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
