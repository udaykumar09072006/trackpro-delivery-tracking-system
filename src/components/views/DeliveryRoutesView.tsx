import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Truck, 
  Play, 
  User, 
  ChevronRight, 
  Plus, 
  RotateCw,
  Compass
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { DeliveryRoute } from '../../types/logistics';

export const DeliveryRoutesView: React.FC = () => {
  const { routes, couriers, advanceRouteStop, setSelectedPackageId, setActiveTab } = useLogistics();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || 'RT-OMR-01');

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
  const assignedCourier = couriers.find(c => c.id === selectedRoute?.courierId);

  // Find next pending stop
  const nextPendingStop = selectedRoute?.waypoints.find(wp => wp.status === 'Pending');

  const handleSimulateStop = (outcome: 'Completed' | 'Attempted') => {
    if (!selectedRoute || !nextPendingStop) return;
    advanceRouteStop(selectedRoute.id, nextPendingStop.id, outcome);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Route Selector */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Delivery Routes & Fleet Dispatching
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Optimize route waypoints, monitor real-time delivery density, and advance route stops
          </p>
        </div>

        <div className="flex items-center gap-2">
          {routes.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                selectedRouteId === r.id
                  ? 'bg-amber-500 text-neutral-950 border-amber-600'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-amber-400'
              }`}
            >
              <span className="font-mono">{r.id}</span>
              <span className="ml-1 opacity-70">({r.completedStops}/{r.totalStops})</span>
            </button>
          ))}
        </div>
      </div>

      {selectedRoute && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-Column: Interactive SVG Route Map & Waypoints List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive SVG Route Map Canvas */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span>{selectedRoute.name}</span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      Zone: {selectedRoute.zone}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Geographic waypoint vector map with delivery stops
                  </p>
                </div>

                {nextPendingStop ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSimulateStop('Completed')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Complete Stop #{nextPendingStop.stopNumber}</span>
                    </button>
                    <button
                      onClick={() => handleSimulateStop('Attempted')}
                      className="px-2.5 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Simulate failed attempt"
                    >
                      Failed
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>All Stops Completed</span>
                  </span>
                )}
              </div>

              {/* Vector SVG Schematic Canvas */}
              <div className="relative w-full h-80 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden select-none">
                <svg className="w-full h-full" viewBox="0 0 600 320">
                  {/* Grid background lines */}
                  <defs>
                    <pattern id="routeGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#262626" strokeWidth="0.6" />
                    </pattern>
                  </defs>
                  <rect width="600" height="320" fill="#141414" />
                  <rect width="600" height="320" fill="url(#routeGrid)" />

                  {/* Connecting Route Line */}
                  <path
                    d={selectedRoute.waypoints.reduce((acc, wp, i) => {
                      const coordX = (wp.coordinates.x / 100) * 540 + 30;
                      const coordY = (wp.coordinates.y / 100) * 260 + 30;
                      return i === 0 ? `M ${coordX} ${coordY}` : `${acc} L ${coordX} ${coordY}`;
                    }, '')}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />

                  {/* Draw Waypoint Nodes */}
                  {selectedRoute.waypoints.map((wp) => {
                    const cx = (wp.coordinates.x / 100) * 540 + 30;
                    const cy = (wp.coordinates.y / 100) * 260 + 30;
                    const isDone = wp.status === 'Completed';
                    const isFailed = wp.status === 'Attempted';
                    const isNext = wp.id === nextPendingStop?.id;

                    return (
                      <g key={wp.id} className="cursor-pointer group">
                        {isNext && (
                          <circle cx={cx} cy={cy} r="18" fill="#F59E0B" fillOpacity="0.25" className="animate-ping" />
                        )}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="12"
                          fill={isDone ? '#10B981' : isFailed ? '#EF4444' : isNext ? '#F59E0B' : '#404040'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        <text
                          x={cx}
                          y={cy + 4}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {wp.stopNumber}
                        </text>
                        {/* Waypoint label tag */}
                        <text
                          x={cx}
                          y={cy - 16}
                          textAnchor="middle"
                          fill="#D4D4D4"
                          fontSize="9"
                          fontFamily="sans-serif"
                          className="opacity-90 group-hover:opacity-100"
                        >
                          {wp.recipient.slice(0, 15)}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Map Bottom Legend */}
                <div className="absolute bottom-3 left-3 flex items-center gap-4 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700 text-[11px] text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Completed</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Next Active Stop</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
                    <span>Upcoming</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Waypoint Stops Detailed Timeline */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Ordered Delivery Stops Sequence
              </h3>

              <div className="space-y-3">
                {selectedRoute.waypoints.map((wp) => {
                  const isDone = wp.status === 'Completed';
                  const isFailed = wp.status === 'Attempted';
                  const isNext = wp.id === nextPendingStop?.id;

                  return (
                    <div
                      key={wp.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                        isNext
                          ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                          : isDone
                          ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/30'
                          : isFailed
                          ? 'border-rose-200 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : isFailed
                              ? 'bg-rose-500 text-white'
                              : isNext
                              ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-300'
                              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                          }`}
                        >
                          {wp.stopNumber}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                              {wp.recipient}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedPackageId(wp.packageId);
                                setActiveTab('track');
                              }}
                              className="text-[10px] font-mono text-amber-600 dark:text-amber-400 hover:underline"
                            >
                              ({wp.packageId})
                            </button>
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {wp.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                            isDone
                              ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40'
                              : isFailed
                              ? 'text-rose-700 bg-rose-50 dark:bg-rose-950/40'
                              : isNext
                              ? 'text-amber-700 bg-amber-100 dark:bg-amber-950/60 font-semibold'
                              : 'text-neutral-400'
                          }`}
                        >
                          {wp.status}
                        </span>

                        {isNext && (
                          <button
                            onClick={() => advanceRouteStop(selectedRoute.id, wp.id, 'Completed')}
                            className="px-2.5 py-1 text-[11px] font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Route KPI Summary & Courier Details */}
          <div className="space-y-6">
            {/* Route Stats Card */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-100 dark:border-neutral-800">
                Route Statistics & Performance
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Stops Completed</span>
                  <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                    {selectedRoute.completedStops} / {selectedRoute.totalStops}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Total Distance</span>
                  <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                    {selectedRoute.distanceKm} km
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Est. Duration</span>
                  <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                    {selectedRoute.estimatedDuration}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Current Status</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {selectedRoute.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Completion Rate</span>
                  <span className="font-mono font-semibold">
                    {Math.round((selectedRoute.completedStops / selectedRoute.totalStops) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(selectedRoute.completedStops / selectedRoute.totalStops) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Assigned Courier Profile */}
            {assignedCourier && (
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Assigned Fleet Driver
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-600">
                    {assignedCourier.id}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-700 shrink-0">
                    <img
                      src={assignedCourier.avatar}
                      alt={assignedCourier.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {assignedCourier.name}
                    </h4>
                    <p className="text-xs text-neutral-500 truncate">{assignedCourier.phone}</p>
                    <p className="text-[11px] text-amber-600 font-mono">{assignedCourier.vehiclePlate}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('couriers')}
                    className="w-full py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    View All Fleet Drivers →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
