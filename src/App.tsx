/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { TrackPackageView } from './components/views/TrackPackageView';
import { PackageManagementView } from './components/views/PackageManagementView';
import { DeliveryRoutesView } from './components/views/DeliveryRoutesView';
import { CourierManagementView } from './components/views/CourierManagementView';
import { DeliveryTimelineView } from './components/views/DeliveryTimelineView';
import { NotificationsView } from './components/views/NotificationsView';
import { ReportsView } from './components/views/ReportsView';
import { AddPackageModal } from './components/modals/AddPackageModal';
import { AddCourierModal } from './components/modals/AddCourierModal';
import { CustomerFeedbackModal } from './components/modals/CustomerFeedbackModal';
import { InternshipTaskModal } from './components/modals/InternshipTaskModal';
import { 
  LayoutDashboard, 
  Search, 
  Package, 
  MapPin, 
  RotateCcw, 
  Award, 
  ShieldCheck 
} from 'lucide-react';
import { INTERNSHIP_METADATA } from './data/mockData';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, resetAllData, setShowInternshipModal } = useLogistics();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'track':
        return <TrackPackageView />;
      case 'packages':
        return <PackageManagementView />;
      case 'routes':
        return <DeliveryRoutesView />;
      case 'couriers':
        return <CourierManagementView />;
      case 'timeline':
        return <DeliveryTimelineView />;
      case 'notifications':
        return <NotificationsView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Header */}
      <Navbar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Content Viewport */}
        <main className="flex-1 p-4 lg:p-8 min-w-0 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}

            {/* Footer Information */}
            <footer className="pt-8 pb-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">TrackPro Delivery Systems</span>
                <span aria-hidden="true">·</span>
                <span>Data Alcott Systems ({INTERNSHIP_METADATA.website})</span>
                <span aria-hidden="true">·</span>
                <span>Task ID: {INTERNSHIP_METADATA.taskId}</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowInternshipModal(true)}
                  className="hover:text-amber-600 dark:hover:text-amber-400 font-medium cursor-pointer"
                >
                  Internship Task Details
                </button>
                <button
                  onClick={() => {
                    if (confirm('Reset system data back to default demo records?')) {
                      resetAllData();
                    }
                  }}
                  className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Reset Demo Records"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-2 py-1.5 flex items-center justify-around text-[10px]">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'track', label: 'Track', icon: Search },
          { id: 'packages', label: 'Packages', icon: Package },
          { id: 'routes', label: 'Routes', icon: MapPin },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modals */}
      <AddPackageModal />
      <AddCourierModal />
      <CustomerFeedbackModal />
      <InternshipTaskModal />
    </div>
  );
};

export default function App() {
  return (
    <LogisticsProvider>
      <AppContent />
    </LogisticsProvider>
  );
}
