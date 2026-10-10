import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Package, 
  MapPin, 
  Users, 
  Clock, 
  Bell, 
  BarChart3, 
  Award,
  ExternalLink
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { INTERNSHIP_METADATA } from '../../data/mockData';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, setShowInternshipModal, notifications, packages } = useLogistics();

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const inTransitCount = packages.filter(p => p.status === 'In Transit' || p.status === 'Out for Delivery').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'track', label: 'Track Package', icon: Search, badge: 'Live GPS' },
    { id: 'packages', label: 'Package Management', icon: Package, count: packages.length },
    { id: 'routes', label: 'Delivery Routes', icon: MapPin },
    { id: 'couriers', label: 'Courier Fleet', icon: Users },
    { id: 'timeline', label: 'Delivery Timeline', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell, unread: unreadNotifs },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-57px)]">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Logistics Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && (
                  <span className="text-[11px] font-mono tabular-nums text-neutral-400">
                    {item.count}
                  </span>
                )}
                {item.unread !== undefined && item.unread > 0 && (
                  <span className="text-[10px] font-mono font-semibold text-white bg-amber-600 px-1.5 py-0.2 rounded-full">
                    {item.unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Fleet Quick Status Card */}
        <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span>Active Shipments</span>
            <span className="font-mono font-semibold text-neutral-900 dark:text-white">{inTransitCount} moving</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (inTransitCount / packages.length) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            Real-time GPS dispatch connected
          </p>
        </div>
      </div>

      {/* Internship Project Footer Badge */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={() => setShowInternshipModal(true)}
          className="w-full p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/20 text-left hover:border-amber-300 dark:hover:border-amber-700 transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-semibold text-xs">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{INTERNSHIP_METADATA.company}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-amber-600/70 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="mt-1 text-[11px] text-amber-900/80 dark:text-amber-400/80 font-medium">
            Task {INTERNSHIP_METADATA.taskId} · {INTERNSHIP_METADATA.taskName}
          </p>
          <p className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
            Free Web Dev Internship Online
          </p>
        </button>
      </div>
    </aside>
  );
};
