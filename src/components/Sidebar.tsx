import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Layers,
  Building2,
  Gift,
  Megaphone,
  BarChart3,
  FileText,
  Bell,
  Settings,
  LogOut,
  Trophy,
  Lightbulb,
  Leaf,
  Users,
  CheckSquare,
  History,
  UserCheck,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { currentRole, currentView, setCurrentView, logout, unreadNotificationCount } =
    useEcoCampus();

  const studentNav = [
    { id: 'student-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'smart-collection', label: 'Smart Collection', icon: MapPin },
    { id: 'impact', label: 'My Plastic Impact', icon: Leaf },
    { id: 'rewards', label: 'Rewards Center', icon: Gift },
    { id: 'campaigns', label: 'Awareness Campaigns', icon: Megaphone },
    { id: 'leaderboard', label: 'Student Leaderboard', icon: Trophy },
    { id: 'alternatives', label: 'Reusable Alternatives', icon: Layers },
    { id: 'eco-tips', label: 'Eco Tips & Habits', icon: Lightbulb },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationCount },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Monitoring Dashboard', icon: LayoutDashboard },
    { id: 'smart-collection', label: 'Live Station Map', icon: MapPin },
    { id: 'segregation', label: 'Waste Segregation', icon: Layers },
    { id: 'stations-management', label: 'Collection Stations', icon: Building2 },
    { id: 'students-list', label: 'Student Management', icon: Users },
    { id: 'rewards', label: 'Rewards Catalog', icon: Gift },
    { id: 'campaigns', label: 'Campaigns & Drives', icon: Megaphone },
    { id: 'alternatives', label: 'Reusable Alternatives', icon: Leaf },
    { id: 'analytics', label: 'Analytics & Charts', icon: BarChart3 },
    { id: 'reports', label: 'Environmental Reports', icon: FileText },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell, badge: unreadNotificationCount },
  ];

  const workerNav = [
    { id: 'worker-dashboard', label: 'Worker Dashboard', icon: LayoutDashboard },
    { id: 'smart-collection', label: 'My Assigned Stations', icon: MapPin },
    { id: 'segregation', label: 'Waste Segregation Queue', icon: Layers },
    { id: 'worker-tasks', label: 'Collection Tasks', icon: CheckSquare },
    { id: 'collections-history', label: 'Collection History', icon: History },
    { id: 'notifications', label: 'Priority Alerts', icon: Bell, badge: unreadNotificationCount },
  ];

  const navItems =
    currentRole === 'admin' ? adminNav : currentRole === 'worker' ? workerNav : studentNav;

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-white border-r border-emerald-100 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div>
        {/* Role Banner Badge */}
        <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-100/80">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
            {currentRole === 'admin'
              ? 'Institutional Portal'
              : currentRole === 'worker'
              ? 'Waste Logistics Portal'
              : 'Student Eco-Portal'}
          </p>
          <p className="text-xs font-semibold text-emerald-950 capitalize truncate">
            {currentRole} Console
          </p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'text-emerald-900/75 hover:text-emerald-950 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-emerald-800' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-emerald-100 space-y-1">
        <button
          onClick={() => setCurrentView('landing')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
        >
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Home / Overview</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
