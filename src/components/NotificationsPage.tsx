import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Megaphone,
  Info,
  Check,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationsRead } = useEcoCampus();
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read_status;
    if (filter === 'alerts') return n.type === 'station_alert' || n.type === 'alert';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'station_alert':
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'reward_earned':
      case 'reward':
        return <Gift className="w-4 h-4 text-amber-600" />;
      case 'campaign':
        return <Megaphone className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5 text-emerald-600" />
            <span>Activity Logs & Automated Pings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Notifications & Priority Alerts
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Real-time messages on smart bin fill warnings (&gt;80% and 100%), point awards, campaign
            announcements, and logistics dispatches.
          </p>
        </div>

        <button
          onClick={() => markNotificationsRead()}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'unread', 'alerts'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f} {f === 'unread' && `(${notifications.filter((n) => !n.read_status).length})`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-emerald-100 text-center">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700 font-serif">No Notifications</p>
            <p className="text-xs text-gray-500 mt-0.5">You are all caught up on campus alerts!</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.notification_id}
              onClick={() => markNotificationsRead(item.notification_id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                item.read_status
                  ? 'bg-white border-gray-100 opacity-80'
                  : 'bg-emerald-50/50 border-emerald-200 ring-1 ring-emerald-300/30'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'station_alert' || item.type === 'alert'
                      ? 'bg-rose-100'
                      : item.type === 'reward_earned' || item.type === 'reward'
                      ? 'bg-amber-100'
                      : item.type === 'campaign'
                      ? 'bg-emerald-100'
                      : 'bg-blue-100'
                  }`}
                >
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-emerald-950 font-serif">{item.title}</h4>
                    {!item.read_status && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-gray-400 mt-1 inline-block">{item.timestamp}</span>
                </div>
              </div>

              {!item.read_status && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationsRead(item.notification_id);
                  }}
                  className="text-[11px] text-emerald-700 font-semibold hover:underline shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
