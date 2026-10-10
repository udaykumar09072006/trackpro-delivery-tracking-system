import React from 'react';
import { 
  Package as PackageIcon, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  Search, 
  Plus, 
  FileText,
  Navigation,
  ChevronRight
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { TrackingStatus } from '../../types/logistics';
import fleetHubImg from '../../assets/images/logistics_fleet_hub_1791624972355.jpg';

export const DashboardView: React.FC = () => {
  const { 
    packages, 
    couriers, 
    routes, 
    setActiveTab, 
    setSelectedPackageId, 
    setShowAddPackageModal,
    exportPackagesCSV 
  } = useLogistics();

  // Metrics
  const totalCount = packages.length;
  const pendingCount = packages.filter(p => p.status === 'Pending').length;
  const inTransitCount = packages.filter(p => p.status === 'In Transit').length;
  const outForDeliveryCount = packages.filter(p => p.status === 'Out for Delivery').length;
  const deliveredCount = packages.filter(p => p.status === 'Delivered').length;
  const failedCount = packages.filter(p => p.status === 'Failed').length;

  const successRate = totalCount > 0 ? ((deliveredCount / (deliveredCount + failedCount || 1)) * 100).toFixed(1) : '100';

  // Recent timeline events aggregate
  const recentEvents = packages
    .flatMap(pkg => pkg.timeline.map(event => ({ ...event, packageId: pkg.id, recipient: pkg.receiverName })))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 6);

  // Status badge styling helper (subtle, accessible, zero-pill clean text + icon)
  const getStatusDisplay = (status: TrackingStatus) => {
    switch (status) {
      case 'Pending':
        return { text: 'Pending', icon: Clock, color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
      case 'In Transit':
        return { text: 'In Transit', icon: Truck, color: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' };
      case 'Out for Delivery':
        return { text: 'Out for Delivery', icon: Navigation, color: 'text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700' };
      case 'Delivered':
        return { text: 'Delivered', icon: CheckCircle2, color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
      case 'Failed':
        return { text: 'Delivery Failed', icon: AlertTriangle, color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with Logistics Facility Backdrop */}
      <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-900 text-white shadow-sm">
        <div className="absolute inset-0">
          <img 
            src={fleetHubImg} 
            alt="TrackPro Logistics Distribution Center"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-transparent" />
        </div>

        <div className="relative p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
              <span className="font-mono">LIVE DISPATCH OPERATIONS</span>
              <span aria-hidden="true">·</span>
              <span>Regional Hub: Chennai & South Corridor</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Logistics Delivery & Fleet Overview
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Track packages in real-time, monitor active couriers across zones, resolve delivery exceptions, and maintain high on-time delivery rates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('track')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Track Shipment by ID</span>
            </button>
            <button
              onClick={() => setShowAddPackageModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Consignment</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Statistics Strip - Strictly zero-pill & tabular numbers */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Total Packages</span>
            <PackageIcon className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
            {totalCount}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            Active in database
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Pending Intake</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {pendingCount}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            Awaiting line pickup
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>In Transit</span>
            <Truck className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400">
            {inTransitCount}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            Inter-hub freight
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Out for Delivery</span>
            <Navigation className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {outForDeliveryCount}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            Final mile couriers
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {deliveredCount}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            Rate: {successRate}%
          </div>
        </div>

        {/* Metric 6 */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Exceptions</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {failedCount}
          </div>
          <div className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
            Reattempt scheduled
          </div>
        </div>
      </div>

      {/* Analytics & Volume Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Delivery Volume Interactive Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Weekly Delivery Volume & Fulfillment Rate
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Processed packages vs successful on-time delivery across previous 7 days
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-neutral-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span>Dispatched</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>Delivered</span>
              </span>
            </div>
          </div>

          {/* SVG Visualizer */}
          <div className="relative pt-4">
            <svg viewBox="0 0 700 200" className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="40" y1="20" x2="680" y2="20" stroke="currentColor" className="text-neutral-100 dark:text-neutral-800" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="680" y2="70" stroke="currentColor" className="text-neutral-100 dark:text-neutral-800" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="680" y2="120" stroke="currentColor" className="text-neutral-100 dark:text-neutral-800" strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="680" y2="170" stroke="currentColor" className="text-neutral-200 dark:text-neutral-700" />

              {/* Day Bars (Mon-Sun) */}
              {[
                { day: 'Mon', dispatched: 145, delivered: 142, x: 70 },
                { day: 'Tue', dispatched: 182, delivered: 178, x: 160 },
                { day: 'Wed', dispatched: 210, delivered: 206, x: 250 },
                { day: 'Thu', dispatched: 195, delivered: 191, x: 340 },
                { day: 'Fri', dispatched: 240, delivered: 236, x: 430 },
                { day: 'Sat', dispatched: 280, delivered: 272, x: 520 },
                { day: 'Sun (Today)', dispatched: 198, delivered: 190, x: 610 },
              ].map((item, idx) => {
                const maxVal = 300;
                const barHeight = (item.dispatched / maxVal) * 130;
                const delHeight = (item.delivered / maxVal) * 130;
                const yPos = 170 - barHeight;
                const yDel = 170 - delHeight;

                return (
                  <g key={idx} className="group cursor-pointer">
                    {/* Dispatched Bar */}
                    <rect
                      x={item.x - 14}
                      y={yPos}
                      width="12"
                      height={barHeight}
                      rx="3"
                      className="fill-amber-400/80 group-hover:fill-amber-400 transition-colors"
                    />
                    {/* Delivered Bar */}
                    <rect
                      x={item.x + 2}
                      y={yDel}
                      width="12"
                      height={delHeight}
                      rx="3"
                      className="fill-emerald-500/80 group-hover:fill-emerald-500 transition-colors"
                    />
                    {/* Label */}
                    <text
                      x={item.x}
                      y="190"
                      textAnchor="middle"
                      className="text-[11px] font-sans fill-neutral-500 dark:fill-neutral-400"
                    >
                      {item.day}
                    </text>
                    {/* Tooltip text on hover */}
                    <text
                      x={item.x}
                      y={Math.min(yPos, yDel) - 8}
                      textAnchor="middle"
                      className="text-[10px] font-mono font-semibold fill-neutral-700 dark:fill-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {item.dispatched}pkgs
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
            <span>Average transit duration: <strong className="font-mono text-neutral-800 dark:text-neutral-200">18.4 hours</strong></span>
            <span>Total weekly delivered: <strong className="font-mono text-neutral-800 dark:text-neutral-200">1,415 packages</strong></span>
          </div>
        </div>

        {/* Fleet & Route Operational Status */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Active Routes & Courier Fleet
              </h2>
              <button 
                onClick={() => setActiveTab('routes')}
                className="text-xs text-amber-600 dark:text-amber-400 font-medium hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Real-time delivery progress across active zones
            </p>

            <div className="space-y-3.5">
              {routes.map(route => {
                const pct = Math.round((route.completedStops / route.totalStops) * 100);
                return (
                  <div key={route.id} className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-900 dark:text-white truncate">{route.name}</span>
                      <span className="font-mono text-neutral-500 text-[11px]">{route.completedStops}/{route.totalStops} stops</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span>Courier: {route.courierName}</span>
                      <span className="font-mono">{pct}%</span>
                    </div>
                    <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          pct === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Active couriers on duty</span>
            <span className="font-mono font-semibold text-neutral-900 dark:text-white">
              {couriers.filter(c => c.status === 'On Route').length} of {couriers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Bottom Section: Live Operations Feed & Recent Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Consignments Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Recent Shipments & Tracking Records
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Click any shipment to inspect real-time timeline & GPS route map
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportPackagesCSV}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                View all ({packages.length})
              </button>
            </div>
          </div>

          {/* High-density Data Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase text-[11px] font-semibold tracking-wider">
                  <th className="py-2.5 pr-3 font-semibold">Tracking ID</th>
                  <th className="py-2.5 px-3 font-semibold">Recipient</th>
                  <th className="py-2.5 px-3 font-semibold">Destination</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Weight</th>
                  <th className="py-2.5 pl-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {packages.slice(0, 5).map(pkg => {
                  const statusInfo = getStatusDisplay(pkg.status);
                  const Icon = statusInfo.icon;
                  return (
                    <tr 
                      key={pkg.id} 
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedPackageId(pkg.id);
                        setActiveTab('track');
                      }}
                    >
                      <td className="py-3 pr-3 font-mono font-semibold text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-600 dark:text-amber-400">{pkg.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[140px]">
                          {pkg.receiverName}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate max-w-[140px]">
                          {pkg.receiverPhone}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300 truncate max-w-[150px]">
                        {pkg.receiverCity}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${statusInfo.color}`}>
                          <Icon className="w-3 h-3" />
                          <span>{statusInfo.text}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                        {pkg.weightKg} kg
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPackageId(pkg.id);
                            setActiveTab('track');
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700"
                        >
                          <span>Track</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Real-time Dispatch Live Feed */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Live Checkpoint Stream
              </h2>
              <span className="text-[11px] font-mono text-neutral-400">Simulated GPS</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Real-time audit log of barcoded handoffs and deliveries
            </p>

            <div className="space-y-4">
              {recentEvents.map((evt, idx) => (
                <div 
                  key={evt.id || idx}
                  onClick={() => {
                    setSelectedPackageId(evt.packageId);
                    setActiveTab('track');
                  }}
                  className="flex items-start gap-3 text-xs group cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                  <div className="space-y-0.5 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 text-[11px]">
                        {evt.packageId}
                      </span>
                      <span className="text-neutral-400 text-[10px] font-mono">
                        {evt.timestamp}
                      </span>
                    </div>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {evt.title}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {evt.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => setActiveTab('timeline')}
              className="w-full py-2 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              View Full Checkpoint Audit Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
