import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Clock,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Camera,
  Upload,
  User,
  Sparkles,
  Info,
  Building2,
  Search,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { PlasticType, StationStatus, CollectionStation } from '../types';

interface SmartCollectionPageProps {
  initialReportModalOpen?: boolean;
}

export const SmartCollectionPage: React.FC<SmartCollectionPageProps> = ({
  initialReportModalOpen = false,
}) => {
  const { stations, reportCollection, currentRole, workerCollect } = useEcoCampus();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<CollectionStation | null>(stations[0] || null);

  // Modal State
  const [isReportOpen, setIsReportOpen] = useState(initialReportModalOpen);
  const [modalStationId, setModalStationId] = useState<string>(stations[0]?.station_id || 'ST-01');
  const [modalPlasticType, setModalPlasticType] = useState<PlasticType>('PET Bottles');
  const [modalQuantity, setModalQuantity] = useState<string>('1.5');
  const [modalPhoto, setModalPhoto] = useState<string | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Worker Modal
  const [isWorkerCollectOpen, setIsWorkerCollectOpen] = useState(false);
  const [workerQuantity, setWorkerQuantity] = useState<string>('');
  const [workerCategory, setWorkerCategory] = useState<PlasticType>('PET Bottles');

  const filteredStations = stations.filter((st) => {
    const matchesFilter = filterStatus === 'All' || st.status === filterStatus;
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.station_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: StationStatus) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Available
          </span>
        );
      case 'Almost Full':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Almost Full (&gt;80%)
          </span>
        );
      case 'Full':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            Full (100%)
          </span>
        );
      case 'Collected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Collected
          </span>
        );
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSubmitting(true);
    const qty = parseFloat(modalQuantity);
    setTimeout(() => {
      reportCollection(modalStationId, modalPlasticType, qty, modalPhoto || undefined);
      setModalSubmitting(false);
      setIsReportOpen(false);
      setModalQuantity('1.5');
      setModalPhoto(null);
    }, 400);
  };

  const handleWorkerCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation) return;
    const qty = parseFloat(workerQuantity) || selectedStation.current_quantity;
    workerCollect(selectedStation.station_id, qty, workerCategory);
    setIsWorkerCollectOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Campus IoT Waste Grid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Smart Plastic Collection Stations
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Real-time capacity tracking across all 6 smart campus bins. Locate the nearest drop-off
            point and log your collection to earn reward points.
          </p>
        </div>
        <button
          id="btn-report-collection-primary"
          onClick={() => {
            setModalStationId(selectedStation?.station_id || stations[0]?.station_id || 'ST-01');
            setIsReportOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Plastic Collection</span>
        </button>
      </div>

      {/* Campus Map & Station Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Campus Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold font-serif text-emerald-950">
                  Interactive Campus Map View
                </h2>
                <p className="text-xs text-gray-500">Click any pin to inspect station status</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> &gt;80%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Full
                </span>
              </div>
            </div>

            {/* Campus Layout Canvas Simulation */}
            <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-stone-100 border border-emerald-200/80 overflow-hidden shadow-inner p-4">
              {/* Campus Grid Pathways */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

              {/* Campus Landmark zones */}
              <div className="absolute top-4 left-6 p-2 rounded-lg bg-white/70 backdrop-blur-xs border border-emerald-100 text-[10px] font-semibold text-emerald-800 pointer-events-none">
                ☕ Canteen & Food Plaza
              </div>
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 p-2 rounded-lg bg-white/70 backdrop-blur-xs border border-emerald-100 text-[10px] font-semibold text-emerald-800 pointer-events-none">
                🏛️ Central Library Quad
              </div>
              <div className="absolute bottom-6 left-6 p-2 rounded-lg bg-white/70 backdrop-blur-xs border border-emerald-100 text-[10px] font-semibold text-emerald-800 pointer-events-none">
                🔬 Engineering & Tech Labs
              </div>
              <div className="absolute top-4 right-6 p-2 rounded-lg bg-white/70 backdrop-blur-xs border border-emerald-100 text-[10px] font-semibold text-emerald-800 pointer-events-none">
                ⚽ Stadium & Sports Complex
              </div>
              <div className="absolute bottom-6 right-8 p-2 rounded-lg bg-white/70 backdrop-blur-xs border border-emerald-100 text-[10px] font-semibold text-emerald-800 pointer-events-none">
                🏡 Student Hostels
              </div>

              {/* Station Map Pins */}
              {stations.map((st) => {
                const isSelected = selectedStation?.station_id === st.station_id;
                const fillPct = Math.round((st.current_quantity / st.capacity) * 100);
                const pinColor =
                  st.status === 'Full'
                    ? 'bg-rose-500'
                    : st.status === 'Almost Full'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600';

                return (
                  <button
                    key={st.station_id}
                    onClick={() => setSelectedStation(st)}
                    style={{ left: `${st.mapCoords.x}%`, top: `${st.mapCoords.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all shadow-md group ${
                      isSelected
                        ? 'ring-4 ring-emerald-400/70 scale-125 z-30'
                        : 'hover:scale-110 z-20'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full ${pinColor} text-white flex items-center justify-center font-bold text-[10px] shadow-sm`}
                    >
                      {st.station_id.replace('ST-', '')}
                    </div>
                    {/* Tooltip on hover/selected */}
                    <div
                      className={`absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md text-[10px] font-semibold text-white bg-gray-900/90 shadow-lg pointer-events-none transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {st.name} ({fillPct}%)
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs text-gray-500">
            <span>6 IoT-Integrated Stations Monitored</span>
            <span className="font-semibold text-emerald-800">
              Campus Coverage: 100% of Quads & Cafeterias
            </span>
          </div>
        </div>

        {/* Selected Station Deep-Dive (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex flex-col justify-between">
          {selectedStation ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {selectedStation.station_id}
                    </span>
                    <span className="text-xs font-medium text-gray-500">{selectedStation.zone}</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-emerald-950 mt-1">
                    {selectedStation.name}
                  </h3>
                  <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    {selectedStation.location}
                  </p>
                </div>
                {getStatusBadge(selectedStation.status)}
              </div>

              {/* Capacity Progress Gauge */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-700">Fill Level & Capacity</span>
                  <span className="font-bold text-emerald-900">
                    {selectedStation.current_quantity.toFixed(1)} / {selectedStation.capacity} kg (
                    {Math.round((selectedStation.current_quantity / selectedStation.capacity) * 100)}
                    %)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedStation.status === 'Full'
                        ? 'bg-rose-500'
                        : selectedStation.status === 'Almost Full'
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedStation.current_quantity / selectedStation.capacity) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last Pickup: {selectedStation.last_collection}
                  </span>
                  <span>Assigned: {selectedStation.assigned_worker}</span>
                </div>
              </div>

              {/* Accepted Plastics */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Accepted Plastic Types
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStation.acceptedTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium"
                    >
                      ✓ {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Smart Alert trigger warning */}
              {selectedStation.status === 'Full' && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>Urgent:</strong> Bin is at 100% capacity! Sanitation worker has been notified for pickup.
                  </span>
                </div>
              )}
              {selectedStation.status === 'Almost Full' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Capacity exceeds 80%. Scheduled for upcoming collection run.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    setModalStationId(selectedStation.station_id);
                    setIsReportOpen(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Drop Plastic Here</span>
                </button>
                {currentRole === 'worker' && (
                  <button
                    onClick={() => {
                      setWorkerQuantity(selectedStation.current_quantity.toString());
                      setIsWorkerCollectOpen(true);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Empty Station</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-gray-500">
              Select a station on the map to see details.
            </div>
          )}
        </div>
      </div>

      {/* Station Cards Grid & Search / Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search station ID, name, or zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-gray-900"
            />
          </div>
          {/* Status Filter buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Available', 'Almost Full', 'Full', 'Collected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStations.map((station) => (
            <div
              key={station.station_id}
              onClick={() => setSelectedStation(station)}
              className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer hover:shadow-md ${
                selectedStation?.station_id === station.station_id
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-emerald-100 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                  {station.station_id}
                </span>
                {getStatusBadge(station.status)}
              </div>
              <h4 className="text-sm font-bold text-emerald-950 font-serif">{station.name}</h4>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{station.location}</p>

              {/* Fill bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 mb-1">
                  <span>Current Load</span>
                  <span>
                    {station.current_quantity} / {station.capacity} kg (
                    {Math.round((station.current_quantity / station.capacity) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      station.status === 'Full'
                        ? 'bg-rose-500'
                        : station.status === 'Almost Full'
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{
                      width: `${Math.min(100, (station.current_quantity / station.capacity) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Worker: {station.assigned_worker.split(' ')[0]}</span>
                <span>{station.last_collection}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Plastic Waste Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-serif text-emerald-950">
              Report Plastic Collection
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Enter your deposit details. You will automatically receive +20 Reward Points per kg!
            </p>

            <form onSubmit={handleReportSubmit} className="mt-5 space-y-4">
              {/* Station Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Collection Station ID
                </label>
                <select
                  value={modalStationId}
                  onChange={(e) => setModalStationId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white"
                >
                  {stations.map((st) => (
                    <option key={st.station_id} value={st.station_id}>
                      {st.station_id} – {st.name} ({st.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Plastic Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Plastic Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['PET Bottles', 'Plastic Bags', 'Plastic Containers', 'Other Plastic'] as PlasticType[]).map(
                    (type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setModalPlasticType(type)}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          modalPlasticType === type
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {type === 'PET Bottles' && '🧴 '}
                        {type === 'Plastic Bags' && '🛍️ '}
                        {type === 'Plastic Containers' && '🥡 '}
                        {type === 'Other Plastic' && '📑 '}
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Quantity in kg */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Quantity (kg)
                  </label>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    +{Math.round((parseFloat(modalQuantity) || 0) * 20)} Reward Points
                  </span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="20"
                  required
                  value={modalQuantity}
                  onChange={(e) => setModalQuantity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
              </div>

              {/* Date / Time */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Deposit Date & Time
                </label>
                <input
                  type="text"
                  disabled
                  value={new Date().toLocaleString()}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 text-gray-500"
                />
              </div>

              {/* Optional Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Optional Photo Verification
                </label>
                <div
                  onClick={() =>
                    setModalPhoto(
                      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&auto=format&fit=crop&q=80'
                    )
                  }
                  className="border-2 border-dashed border-emerald-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-emerald-50/40 transition-colors"
                >
                  {modalPhoto ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Photo Attached (Verification Ready)</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 text-xs">
                      <Camera className="w-6 h-6 text-emerald-600 mb-1" />
                      <span>Click to attach sample bin drop photo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{modalSubmitting ? 'Logging...' : 'Submit & Earn Points'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Worker Collect Modal */}
      {isWorkerCollectOpen && selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
            <h3 className="text-xl font-bold font-serif text-blue-950">Empty Collection Station</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Confirm waste clearance for {selectedStation.name} ({selectedStation.station_id}).
            </p>

            <form onSubmit={handleWorkerCollectSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Quantity Collected (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={workerQuantity}
                  onChange={(e) => setWorkerQuantity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Primary Plastic Type
                </label>
                <select
                  value={workerCategory}
                  onChange={(e) => setWorkerCategory(e.target.value as PlasticType)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white"
                >
                  <option value="PET Bottles">PET Bottles</option>
                  <option value="Plastic Bags">Plastic Bags</option>
                  <option value="Plastic Containers">Plastic Containers</option>
                  <option value="Other Plastic">Other Plastic</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900">
                ✓ Resets station capacity to 0 kg.<br />
                ✓ Updates status to 'Collected'.<br />
                ✓ Automatically queues batch into Segregation Management.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWorkerCollectOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Confirm Clearance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
