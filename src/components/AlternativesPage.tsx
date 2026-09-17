import React, { useState } from 'react';
import {
  Layers,
  Leaf,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Heart,
  TrendingDown,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { ReusableAlternative } from '../types';

export const AlternativesPage: React.FC = () => {
  const { alternatives, pledgeAlternative, currentRole, setToast } = useEcoCampus();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [dispItem, setDispItem] = useState('');
  const [reuseItem, setReuseItem] = useState('');
  const [benefit, setBenefit] = useState('');
  const [reduction, setReduction] = useState('8');
  const [category, setCategory] = useState('Campus Living');

  const handleAddAlternative = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({
      message: `New alternative "${reuseItem}" added to catalog!`,
      type: 'success',
    });
    setIsAddOpen(false);
  };

  const totalReductionEstimated = alternatives.reduce(
    (acc, a) => acc + a.plasticReductionKgPerYear * a.pledgeCount,
    0
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Waste Lifestyle Adoption</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Reusable Alternatives Module
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Choose sustainable alternatives to common single-use plastics found across campus.
            Pledging awards <strong>+30 Eco Points</strong> directly to your student account!
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Campus Alternative</span>
          </button>
        )}
      </div>

      {/* Aggregate Impact Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Collective Campus Shift
          </span>
          <h2 className="text-2xl font-bold font-serif mt-1">
            {totalReductionEstimated.toLocaleString()} kg/year
          </h2>
          <p className="text-xs text-emerald-100/80 mt-0.5 max-w-md">
            Estimated single-use plastic avoided through 1,500+ student & faculty reusable pledges.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
            <p className="text-lg font-bold text-amber-300">1,582</p>
            <p className="text-[10px] text-emerald-200">Active Pledges</p>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
            <p className="text-lg font-bold text-amber-300">+30 pts</p>
            <p className="text-[10px] text-emerald-200">Bonus Per Pledge</p>
          </div>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alternatives.map((alt) => (
          <div
            key={alt.id}
            className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                  {alt.category}
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  {alt.pledgeCount} Pledged
                </span>
              </div>

              {/* Comparison Header */}
              <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-center">
                <div className="text-2xl mb-1">{alt.icon}</div>
                <div className="flex items-center justify-center gap-2 text-xs font-bold">
                  <span className="text-rose-700 line-through opacity-80">{alt.disposableItem}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-emerald-950">{alt.reusableItem}</span>
                </div>
              </div>

              {/* Environmental Benefit */}
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-600 leading-relaxed">{alt.environmentalBenefit}</p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Plastic Reduction:</span>
                  <strong className="text-emerald-800 font-bold">
                    ~{alt.plasticReductionKgPerYear} kg / student / yr
                  </strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Economic Value:</span>
                  <span className="text-gray-700 font-medium">{alt.costEstimate}</span>
                </div>
              </div>
            </div>

            {/* Choose Alternative Action */}
            <button
              onClick={() => pledgeAlternative(alt.id)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Choose Alternative (+30 Pts)</span>
            </button>
          </div>
        ))}
      </div>

      {/* Admin Add Alternative Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
            <h3 className="text-xl font-bold font-serif text-emerald-950">
              Add Reusable Alternative
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Introduce a new sustainable alternative to the campus student catalog.
            </p>

            <form onSubmit={handleAddAlternative} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Disposable Plastic Item
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Single-Use Plastic Straws"
                  value={dispItem}
                  onChange={(e) => setDispItem(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reusable Alternative
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bent Glass / Stainless Steel Straw Set"
                  value={reuseItem}
                  onChange={(e) => setReuseItem(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Environmental Benefit
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe impact..."
                  value={benefit}
                  onChange={(e) => setBenefit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Est. Plastic Reduction (kg/yr)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={reduction}
                  onChange={(e) => setReduction(e.target.value)}
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
                  Publish Alternative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
