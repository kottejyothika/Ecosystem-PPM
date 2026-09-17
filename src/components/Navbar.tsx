import React, { useState } from 'react';
import {
  Recycle,
  Bell,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
  Briefcase,
  GraduationCap,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const {
    currentUser,
    currentRole,
    currentView,
    setCurrentView,
    switchRole,
    logout,
    notifications,
    unreadNotificationCount,
    markNotificationsRead,
    resetDemoData,
  } = useEcoCampus();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: any; color: string }> = {
    student: { label: 'Student', icon: GraduationCap, color: 'bg-emerald-100 text-emerald-800' },
    admin: { label: 'College Admin', icon: Shield, color: 'bg-amber-100 text-amber-900' },
    worker: { label: 'Waste Worker', icon: Briefcase, color: 'bg-blue-100 text-blue-800' },
  };

  const RoleIcon = roleLabels[currentRole]?.icon || GraduationCap;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-emerald-950 font-serif">
                  EcoCampus
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  WEBSPRINT 2026
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-700/80 hidden sm:block tracking-wide">
                Reduce • Reuse • Recycle • Reward
              </p>
            </div>
          </div>

          {/* Quick Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'landing'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-emerald-900/70 hover:text-emerald-950 hover:bg-emerald-50/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() =>
                setCurrentView(
                  currentRole === 'admin'
                    ? 'admin-dashboard'
                    : currentRole === 'worker'
                    ? 'worker-dashboard'
                    : 'student-dashboard'
                )
              }
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView.includes('dashboard')
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-emerald-900/70 hover:text-emerald-950 hover:bg-emerald-50/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('smart-collection')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'smart-collection'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-emerald-900/70 hover:text-emerald-950 hover:bg-emerald-50/50'
              }`}
            >
              Smart Collection
            </button>
            <button
              onClick={() => setCurrentView('segregation')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'segregation'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-emerald-900/70 hover:text-emerald-950 hover:bg-emerald-50/50'
              }`}
            >
              Segregation
            </button>
            <button
              onClick={() => setCurrentView('alternatives')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'alternatives'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-emerald-900/70 hover:text-emerald-950 hover:bg-emerald-50/50'
              }`}
            >
              Alternatives
            </button>
            <button
              onClick={() => setCurrentView('rewards')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'rewards'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-emerald-900/70 hover:text-emerald-950 hover:bg-emerald-50/50'
              }`}
            >
              Rewards
            </button>
            <button
              onClick={() => setCurrentView('impact')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'impact'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-emerald-900/70 hover:text-emerald-950 hover:bg-emerald-50/50'
              }`}
            >
              Impact
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Student Points Pill */}
            {currentRole === 'student' && (
              <div
                onClick={() => setCurrentView('rewards')}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100/70 hover:bg-emerald-100 border border-emerald-300/60 rounded-full text-emerald-900 text-xs font-semibold transition-colors"
                title="Your EcoCampus Reward Points"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>{currentUser.reward_points} pts</span>
              </div>
            )}

            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowNotifMenu(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  roleLabels[currentRole]?.color || 'bg-gray-100 text-gray-800'
                } border-emerald-200 shadow-2xs hover:shadow-xs`}
                title="Quick Role Switcher for Hackathon Evaluation"
              >
                <RoleIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{roleLabels[currentRole]?.label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-emerald-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 border-b border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Switch Role (Demo Mode)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      switchRole('student');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2.5 hover:bg-emerald-50 ${
                      currentRole === 'student' ? 'bg-emerald-50/80 text-emerald-900 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold">Student View</p>
                      <p className="text-[10px] text-gray-500">Aarav Sharma (Reports & Points)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2.5 hover:bg-amber-50 ${
                      currentRole === 'admin' ? 'bg-amber-50/80 text-amber-900 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold">College / Admin View</p>
                      <p className="text-[10px] text-gray-500">Dr. Sunita (Analytics & Stations)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('worker');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2.5 hover:bg-blue-50 ${
                      currentRole === 'worker' ? 'bg-blue-50/80 text-blue-900 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold">Waste Worker View</p>
                      <p className="text-[10px] text-gray-500">Ramesh Kumar (Logistics & Pickup)</p>
                    </div>
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        resetDemoData();
                        setShowRoleMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-[11px] text-gray-500 hover:text-emerald-700 flex items-center gap-1.5 hover:bg-gray-50"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Prototype Demo Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowRoleMenu(false);
                }}
                className="relative p-2 rounded-lg text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-50 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-emerald-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Notifications</h4>
                      <p className="text-[10px] text-gray-500">
                        {unreadNotificationCount} unread for {currentRole}
                      </p>
                    </div>
                    <button
                      onClick={() => markNotificationsRead()}
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.notification_id}
                        className={`p-3 text-xs transition-colors hover:bg-emerald-50/50 ${
                          !n.read_status ? 'bg-emerald-50/30' : ''
                        }`}
                        onClick={() => markNotificationsRead(n.notification_id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-emerald-950">{n.title}</p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px] mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 px-3 py-1.5 text-center">
                    <button
                      onClick={() => {
                        setCurrentView('notifications');
                        setShowNotifMenu(false);
                      }}
                      className="text-xs text-emerald-700 font-semibold hover:underline"
                    >
                      View All Notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth Action */}
            <div className="flex items-center gap-2 pl-2 border-l border-emerald-100">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-emerald-50 text-left transition-colors"
                title="Account / Switch User"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-emerald-950 truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-gray-500 capitalize">{currentRole}</p>
                </div>
              </button>

              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
