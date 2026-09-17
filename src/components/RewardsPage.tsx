import React, { useState } from 'react';
import {
  Gift,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  PlusCircle,
  Tag,
  QrCode,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { Reward } from '../types';

export const RewardsPage: React.FC = () => {
  const {
    rewards,
    redeemedRewards,
    currentUser,
    redeemReward,
    addReward,
    currentRole,
  } = useEcoCampus();

  const [activeTab, setActiveTab] = useState<'catalog' | 'history'>('catalog');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New reward form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('250');
  const [category, setCategory] = useState('Merchandise');
  const [stock, setStock] = useState('20');
  const [icon, setIcon] = useState('🎁');

  const handleAddRewardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReward({
      reward_name: name,
      description,
      points_required: parseInt(points),
      category,
      stock: parseInt(stock),
      icon,
    });
    setIsAddOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold mb-2">
            <Gift className="w-3.5 h-3.5 text-amber-600" />
            <span>Campus Eco-Incentive Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Rewards & Recognition Center
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Redeem your verified eco-points for college canteen vouchers, sustainable merchandise,
            saplings, and dean-certified zero-waste leadership awards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Your Eco Balance
            </span>
            <p className="text-2xl font-extrabold font-serif text-amber-950">
              {currentUser.reward_points}{' '}
              <span className="text-xs font-semibold text-amber-700">pts</span>
            </p>
          </div>
          {currentRole === 'admin' && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Reward</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'catalog'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-900 hover:bg-emerald-50'
          }`}
        >
          Browse Rewards ({rewards.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-900 hover:bg-emerald-50'
          }`}
        >
          My Redeemed Vouchers ({redeemedRewards.length})
        </button>
      </div>

      {/* Catalog View */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = currentUser.reward_points >= reward.points_required;
            const isOutOfStock = reward.stock <= 0;

            return (
              <div
                key={reward.reward_id}
                className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{reward.icon}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {reward.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-emerald-950 font-serif">
                    {reward.reward_name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {reward.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-500 text-[11px]">Cost:</span>
                      <p className="text-lg font-extrabold font-serif text-amber-700">
                        {reward.points_required} <span className="text-xs font-normal">pts</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 text-[11px]">Availability:</span>
                      <p
                        className={`text-xs font-semibold ${
                          isOutOfStock ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        {isOutOfStock ? 'Out of Stock' : `${reward.stock} left in store`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    disabled={!canAfford || isOutOfStock}
                    onClick={() => redeemReward(reward.reward_id)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      canAfford && !isOutOfStock
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20 hover:scale-[1.02]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>
                      {isOutOfStock
                        ? 'Restocking Soon'
                        : canAfford
                        ? 'Redeem Now'
                        : `Need ${reward.points_required - currentUser.reward_points} More Pts`}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History View */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {redeemedRewards.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-emerald-100 text-center">
              <Gift className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-emerald-950 font-serif">
                No Redeemed Rewards Yet
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Participate in plastic collection and awareness drives to earn green points and unlock
                canteen treats or eco-merchandise!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redeemedRewards.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex items-start justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        VERIFIED
                      </span>
                      <span className="text-xs text-gray-500">{rec.date}</span>
                    </div>
                    <h4 className="text-base font-bold font-serif text-emerald-950">
                      {rec.reward_name}
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      Points Spent: <strong>{rec.pointsSpent} pts</strong>
                    </p>

                    <div className="mt-3 p-3 rounded-2xl bg-gray-50 border border-dashed border-gray-300 flex items-center gap-3">
                      <QrCode className="w-9 h-9 text-emerald-800 shrink-0" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                          Redemption Code
                        </span>
                        <code className="text-xs font-mono font-bold text-emerald-900">
                          {rec.redemptionCode}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Add Reward Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
            <h3 className="text-xl font-bold font-serif text-emerald-950">
              Add New Campus Reward
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Create a new student incentive item in the campus rewards catalog.
            </p>

            <form onSubmit={handleAddRewardSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reward Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Campus Honey Jar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Details & pickup location..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Points Required
                  </label>
                  <input
                    type="number"
                    required
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                  />
                </div>
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
                  Publish Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
