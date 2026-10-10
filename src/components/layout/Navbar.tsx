import React, { useState } from 'react';
import { 
  PackageSearch, 
  Plus, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Award, 
  Bell, 
  Search, 
  User, 
  CheckCircle,
  Truck
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { INTERNSHIP_METADATA } from '../../data/mockData';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    darkMode, 
    setDarkMode, 
    soundEnabled, 
    setSoundEnabled,
    setShowInternshipModal,
    setShowAddPackageModal,
    setSelectedPackageId,
    packages,
    notifications,
    user,
    setUser
  } = useLogistics();

  const [searchVal, setSearchVal] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    const cleanId = searchVal.trim().toUpperCase();
    const found = packages.find(p => p.id.toUpperCase().includes(cleanId));
    if (found) {
      setSelectedPackageId(found.id);
      setActiveTab('track');
    } else {
      setSelectedPackageId(cleanId);
      setActiveTab('track');
    }
    setSearchVal('');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md transition-colors">
      <div className="flex items-center justify-between gap-6 px-4 lg:px-8 py-3 max-w-[1720px] mx-auto">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shadow-sm">
              <Truck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white leading-none block">
                TrackPro
              </span>
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 leading-none">
                Logistics & Tracking
              </span>
            </div>
          </button>

          <button
            onClick={() => setShowInternshipModal(true)}
            title="View Data Alcott Systems Internship Task Details"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950/60 rounded-md hover:bg-amber-200/80 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Task: {INTERNSHIP_METADATA.taskId}</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean hover underlines) */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-950 dark:hover:text-white ${
              activeTab === 'dashboard' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-950 dark:hover:text-white ${
              activeTab === 'track' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
            }`}
          >
            Track Package
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-950 dark:hover:text-white ${
              activeTab === 'packages' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
            }`}
          >
            Package Management
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-950 dark:hover:text-white ${
              activeTab === 'routes' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
            }`}
          >
            Delivery Routes
          </button>
          <button
            onClick={() => setActiveTab('couriers')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-950 dark:hover:text-white ${
              activeTab === 'couriers' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
            }`}
          >
            Couriers
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-950 dark:hover:text-white ${
              activeTab === 'reports' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
            }`}
          >
            Reports
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Functional Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Tracking Search Bar */}
          <form onSubmit={handleQuickSearch} className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Quick track (e.g. TRK-8924-IN)..."
              className="pl-8 pr-3 py-1.5 w-56 lg:w-64 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
            />
          </form>

          {/* Sound alert toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Dispatch Sound Effects: On' : 'Dispatch Sound Effects: Muted'}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Dark Mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications shortcut */}
          <button
            onClick={() => setActiveTab('notifications')}
            title="Simulated Delivery Notifications"
            className="relative p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => setShowAddPackageModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Package</span>
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1 pl-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-800"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 shrink-0">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="hidden md:inline capitalize">{user.role}</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="font-semibold text-neutral-900 dark:text-white">{user.name}</p>
                  <p className="text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>Data Alcott Systems Intern</span>
                  </div>
                </div>

                <div className="px-2 py-1.5">
                  <p className="px-2 py-1 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
                    Switch Active Persona
                  </p>
                  <button
                    onClick={() => {
                      setUser({ ...user, role: 'admin', name: 'Uday Kumar (Intern Admin)' });
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                      user.role === 'admin' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>Logistics Administrator</span>
                    {user.role === 'admin' && <span className="text-[10px] text-amber-600">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      setUser({ ...user, role: 'dispatcher', name: 'Sarah Jenkins (Dispatcher)' });
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                      user.role === 'dispatcher' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>Fleet Dispatcher</span>
                    {user.role === 'dispatcher' && <span className="text-[10px] text-amber-600">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      setUser({ ...user, role: 'courier', name: 'Rajesh Kumar (Courier)' });
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                      user.role === 'courier' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>Delivery Courier Agent</span>
                    {user.role === 'courier' && <span className="text-[10px] text-amber-600">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      setUser({ ...user, role: 'customer', name: 'Priya Sundaram (Recipient)' });
                      setShowRoleMenu(false);
                      setActiveTab('track');
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                      user.role === 'customer' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>Customer / Recipient</span>
                    {user.role === 'customer' && <span className="text-[10px] text-amber-600">Active</span>}
                  </button>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-1 px-2">
                  <button
                    onClick={() => {
                      setShowInternshipModal(true);
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    Internship Task Information
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
