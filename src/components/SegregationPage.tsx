import React, { useState } from 'react';
import {
  Layers,
  Recycle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PackageCheck,
  TrendingUp,
  AlertCircle,
  Factory,
  Building2,
  Truck,
  Leaf,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { PlasticType } from '../types';

export const SegregationPage: React.FC = () => {
  const { segregationStats, workerRecycle, currentRole, setToast } = useEcoCampus();

  const [selectedCategory, setSelectedCategory] = useState<PlasticType>('PET Bottles');
  const [dispatchQty, setDispatchQty] = useState<string>('25');

  const totalCollected = segregationStats.reduce((a, b) => a + b.collected, 0);
  const totalSegregated = segregationStats.reduce((a, b) => a + b.segregated, 0);
  const totalRecycled = segregationStats.reduce((a, b) => a + b.recycled, 0);
  const totalPending = segregationStats.reduce((a, b) => a + b.pending, 0);

  const handleDispatchRecycling = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(dispatchQty);
    if (!qty || qty <= 0) return;
    workerRecycle(selectedCategory, qty);
    setToast({
      message: `Dispatched ${qty} kg of ${selectedCategory} to certified campus recycler!`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Waste Hierarchy Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Plastic Segregation & Processing
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Audit campus plastic streams across categories. Segregated plastics preserve high resin
            purity for circular remanufacturing and local upcycling.
          </p>
        </div>
      </div>

      {/* Visual Workflow Section: Collection → Segregation → Verification → Recycling → Impact */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <h2 className="text-sm font-bold font-serif text-emerald-950 mb-4">
          Campus Circular Workflow Pipeline
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase">Stage 01</span>
              <h3 className="text-sm font-bold text-emerald-950 mt-1 flex items-center gap-1.5">
                <span>🗑️ Collection</span>
              </h3>
              <p className="text-[11px] text-gray-600 mt-1">Smart bins record weights across zones.</p>
            </div>
            <p className="text-xs font-bold text-emerald-900 mt-3">{totalCollected.toFixed(1)} kg logged</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase">Stage 02</span>
              <h3 className="text-sm font-bold text-emerald-950 mt-1 flex items-center gap-1.5">
                <span>📑 Segregation</span>
              </h3>
              <p className="text-[11px] text-gray-600 mt-1">Sorting by resin type (PET, Bags, HDPE).</p>
            </div>
            <p className="text-xs font-bold text-teal-900 mt-3">{totalSegregated.toFixed(1)} kg sorted</p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-cyan-800 uppercase">Stage 03</span>
              <h3 className="text-sm font-bold text-emerald-950 mt-1 flex items-center gap-1.5">
                <span>🔍 Verification</span>
              </h3>
              <p className="text-[11px] text-gray-600 mt-1">Contamination checks & sanitation wash.</p>
            </div>
            <p className="text-xs font-bold text-cyan-900 mt-3">94.2% Pure Resin</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase">Stage 04</span>
              <h3 className="text-sm font-bold text-emerald-950 mt-1 flex items-center gap-1.5">
                <span>♻️ Recycling</span>
              </h3>
              <p className="text-[11px] text-gray-600 mt-1">Industrial extrusion & mechanical flake.</p>
            </div>
            <p className="text-xs font-bold text-emerald-900 mt-3">{totalRecycled.toFixed(1)} kg reprocessed</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase">Stage 05</span>
              <h3 className="text-sm font-bold text-emerald-950 mt-1 flex items-center gap-1.5">
                <span>🌱 Eco Impact</span>
              </h3>
              <p className="text-[11px] text-gray-600 mt-1">Diverted from landfills & oceans.</p>
            </div>
            <p className="text-xs font-bold text-amber-900 mt-3">{(totalRecycled * 1.8).toFixed(1)} kg CO₂e saved</p>
          </div>
        </div>
      </div>

      {/* Aggregate Volume KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Total Collected</span>
          <p className="text-2xl font-bold font-serif text-emerald-950 mt-1">
            {totalCollected.toFixed(1)} <span className="text-xs font-normal">kg</span>
          </p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
            <div className="bg-emerald-600 h-1.5 rounded-full w-full" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Total Segregated</span>
          <p className="text-2xl font-bold font-serif text-teal-950 mt-1">
            {totalSegregated.toFixed(1)} <span className="text-xs font-normal">kg</span>
          </p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
            <div
              className="bg-teal-600 h-1.5 rounded-full"
              style={{ width: `${(totalSegregated / totalCollected) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Total Recycled</span>
          <p className="text-2xl font-bold font-serif text-emerald-950 mt-1">
            {totalRecycled.toFixed(1)} <span className="text-xs font-normal">kg</span>
          </p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
            <div
              className="bg-emerald-700 h-1.5 rounded-full"
              style={{ width: `${(totalRecycled / totalCollected) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Pending Segregation</span>
          <p className="text-2xl font-bold font-serif text-amber-950 mt-1">
            {totalPending.toFixed(1)} <span className="text-xs font-normal">kg</span>
          </p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
            <div
              className="bg-amber-500 h-1.5 rounded-full"
              style={{ width: `${(totalPending / totalCollected) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categories Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {segregationStats.map((cat) => {
          const recRate = Math.round((cat.recycled / cat.collected) * 100);
          return (
            <div
              key={cat.category}
              className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    {cat.category === 'PET Bottles' && '🧴'}
                    {cat.category === 'Plastic Bags' && '🛍️'}
                    {cat.category === 'Plastic Containers' && '🥡'}
                    {cat.category === 'Other Plastic' && '📑'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-950 font-serif">{cat.category}</h3>
                    <p className="text-[11px] text-gray-500">
                      Recycling Conversion Rate: <strong className="text-emerald-800">{recRate}%</strong>
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  {cat.recycled} kg Recycled
                </span>
              </div>

              {/* Progress Flow Bars */}
              <div className="space-y-2.5 bg-gray-50 p-4 rounded-2xl">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Collected</span>
                    <span>{cat.collected} kg</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gray-600 h-2 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-teal-900 mb-1">
                    <span>Segregated & Verified</span>
                    <span>
                      {cat.segregated} kg ({Math.round((cat.segregated / cat.collected) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${(cat.segregated / cat.collected) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-emerald-900 mb-1">
                    <span>Processed into Recycled Product</span>
                    <span>
                      {cat.recycled} kg ({recRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${(cat.recycled / cat.collected) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Info & Destination */}
              <div className="text-[11px] text-gray-600 flex items-center justify-between pt-1">
                <span>
                  Pending Batch in Sorting Facility: <strong>{cat.pending} kg</strong>
                </span>
                <span className="text-emerald-700 font-medium">✓ Clean Stream Guaranteed</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recycler Dispatch Tool */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-serif text-emerald-950">
              Dispatch Segregated Batch to Certified Industrial Recycler
            </h3>
            <p className="text-xs text-gray-500">
              Log outward logistics transfer for shredded plastic flakes or palletized baled plastic.
            </p>
          </div>
        </div>

        <form onSubmit={handleDispatchRecycling} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Plastic Stream</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as PlasticType)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white text-gray-900"
            >
              {segregationStats.map((s) => (
                <option key={s.category} value={s.category}>
                  {s.category} ({s.segregated} kg available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity (kg)</label>
            <input
              type="number"
              step="1"
              min="1"
              required
              value={dispatchQty}
              onChange={(e) => setDispatchQty(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Factory className="w-4 h-4" />
              <span>Confirm Recycling Dispatch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
