import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Copy, 
  Check, 
  Share2, 
  Star, 
  ShieldCheck, 
  Navigation,
  RefreshCw,
  Send,
  UserCheck
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { TrackingStatus } from '../../types/logistics';

export const TrackPackageView: React.FC = () => {
  const { 
    packages, 
    couriers, 
    selectedPackageId, 
    setSelectedPackageId, 
    updatePackageStatus,
    setFeedbackPackageId,
    sendNotification
  } = useLogistics();

  const [inputTrackId, setInputTrackId] = useState(selectedPackageId);
  const [copied, setCopied] = useState(false);
  const [isSimulatingGps, setIsSimulatingGps] = useState(false);
  const [gpsDistance, setGpsDistance] = useState(2.1);
  const [courierPosition, setCourierPosition] = useState({ x: 55, y: 62 }); // percentage in map
  const [callAlert, setCallAlert] = useState<string | null>(null);

  // Sync input when selectedPackageId changes from external click
  useEffect(() => {
    setInputTrackId(selectedPackageId);
  }, [selectedPackageId]);

  // Current package lookup
  const currentPkg = packages.find(
    p => p.id.toUpperCase() === (selectedPackageId || '').toUpperCase()
  ) || packages[0];

  const assignedCourier = couriers.find(c => c.id === currentPkg?.assignedCourierId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTrackId.trim()) return;
    const clean = inputTrackId.trim().toUpperCase();
    setSelectedPackageId(clean);
  };

  const copyTrackingId = () => {
    if (!currentPkg) return;
    navigator.clipboard.writeText(currentPkg.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate GPS refresh
  const triggerGpsPing = () => {
    setIsSimulatingGps(true);
    setTimeout(() => {
      setIsSimulatingGps(false);
      setGpsDistance(prev => Math.max(0.4, Number((prev - 0.3).toFixed(1))));
      setCourierPosition(prev => ({
        x: Math.min(85, prev.x + 4),
        y: Math.min(85, prev.y + 3)
      }));
    }, 800);
  };

  // Simulate courier call
  const handleCallCourier = () => {
    if (!assignedCourier) return;
    setCallAlert(`Initiating secure call to ${assignedCourier.name} (${assignedCourier.phone})...`);
    setTimeout(() => setCallAlert(null), 4000);
  };

  // Status step calculation (1 to 4)
  const getStepProgress = (status: TrackingStatus) => {
    switch (status) {
      case 'Pending': return 1;
      case 'In Transit': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      case 'Failed': return 3; // stopped at out for delivery attempt
    }
  };

  const currentStep = currentPkg ? getStepProgress(currentPkg.status) : 1;

  return (
    <div className="space-y-6">
      {/* Search Header & Quick Suggestions */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Real-Time Consignment & Delivery Tracking
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Enter your consignment airway bill or package tracking number for live GPS tracking
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={inputTrackId}
                onChange={(e) => setInputTrackId(e.target.value)}
                placeholder="Enter Tracking ID (e.g., TRK-8924-IN, TRK-4410-IN)..."
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
            >
              Track Package
            </button>
          </form>

          {/* Quick Select Preset Tracking IDs for testing all states */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-neutral-400 font-medium">Quick Test Sample IDs:</span>
            {packages.map(p => {
              const isSelected = p.id.toUpperCase() === currentPkg?.id.toUpperCase();
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setInputTrackId(p.id);
                    setSelectedPackageId(p.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 font-bold border-amber-600'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-amber-400'
                  }`}
                >
                  <span>{p.id}</span>
                  <span className="ml-1 opacity-75">({p.status})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {currentPkg ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-Column Area: Summary & Live Map & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Hero Card */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Tracking Number
                    </span>
                    <button
                      onClick={copyTrackingId}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy ID'}</span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                    {currentPkg.id}
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Service: <strong className="text-neutral-800 dark:text-neutral-200">{currentPkg.serviceType}</strong> · Priority: {currentPkg.priority}
                  </p>
                </div>

                <div className="text-right sm:text-right space-y-1">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
                    Estimated Delivery
                  </span>
                  <span className="text-base font-bold text-neutral-900 dark:text-white font-mono block">
                    {new Date(currentPkg.estimatedDelivery).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="inline-block text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {currentPkg.status === 'Delivered' ? 'Completed & Handed Over' : 'On Schedule'}
                  </span>
                </div>
              </div>

              {/* Progress 4-Step Track Bar */}
              <div className="py-2">
                <div className="relative">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-1 bg-neutral-200 dark:bg-neutral-800 z-0" />
                  <div 
                    className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-amber-500 transition-all duration-700 z-0"
                    style={{
                      width: currentPkg.status === 'Delivered' 
                        ? '100%' 
                        : currentPkg.status === 'Failed'
                        ? '75%'
                        : `${((currentStep - 1) / 3) * 100}%`
                    }}
                  />

                  {/* 4 Step Nodes */}
                  <div className="relative z-10 flex justify-between">
                    {[
                      { step: 1, label: 'Order Booked', icon: Clock },
                      { step: 2, label: 'In Transit', icon: Truck },
                      { step: 3, label: 'Out for Delivery', icon: Navigation },
                      { step: 4, label: 'Delivered', icon: CheckCircle2 }
                    ].map((st) => {
                      const isComplete = currentStep >= st.step || currentPkg.status === 'Delivered';
                      const isCurrent = currentStep === st.step && currentPkg.status !== 'Delivered';
                      const Icon = st.icon;

                      return (
                        <div key={st.step} className="flex flex-col items-center text-center">
                          <div 
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${
                              isComplete
                                ? 'bg-amber-500 text-neutral-950 ring-4 ring-white dark:ring-neutral-900'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-300 dark:border-neutral-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                            isCurrent ? 'text-amber-600 dark:text-amber-400' : isComplete ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'
                          }`}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Current Status Callout */}
              <div className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                currentPkg.status === 'Delivered'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                  : currentPkg.status === 'Failed'
                  ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                  : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-white">
                      Current Location & Status:
                    </span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                      {currentPkg.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300">
                    {currentPkg.currentLocationName}
                  </p>
                  {currentPkg.notes && (
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic">
                      Special Handling Note: &quot;{currentPkg.notes}&quot;
                    </p>
                  )}
                </div>

                {currentPkg.status === 'Out for Delivery' && (
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-neutral-500 block">Proximity</span>
                    <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                      ~{gpsDistance} km away
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Live GPS Route Map */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span>Live Route Visualization</span>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      GPS Telemetry Active
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Interactive route from origin depot to delivery point
                  </p>
                </div>

                <button
                  onClick={triggerGpsPing}
                  disabled={isSimulatingGps}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingGps ? 'animate-spin text-amber-500' : ''}`} />
                  <span>{isSimulatingGps ? 'Pinging GPS...' : 'Refresh GPS Ping'}</span>
                </button>
              </div>

              {/* Map SVG Canvas */}
              <div className="relative w-full h-72 rounded-xl bg-neutral-950 overflow-hidden border border-neutral-800 select-none">
                {/* Background Grid Roads */}
                <svg className="w-full h-full" viewBox="0 0 500 300">
                  <defs>
                    <pattern id="roadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262626" strokeWidth="0.8" />
                    </pattern>
                  </defs>

                  <rect width="500" height="300" fill="#171717" />
                  <rect width="500" height="300" fill="url(#roadGrid)" />

                  {/* Main Arterial Highway Paths */}
                  <path d="M 20 180 Q 140 160 220 120 T 420 80" fill="none" stroke="#333333" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 120 20 Q 220 120 340 240" fill="none" stroke="#333333" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 80 260 C 200 240, 280 180, 440 220" fill="none" stroke="#333333" strokeWidth="8" strokeLinecap="round" />

                  {/* Actual Delivery Route Path */}
                  <path 
                    d="M 60 220 C 120 180, 200 130, 280 150 S 380 200, 440 130" 
                    fill="none" 
                    stroke="#F59E0B" 
                    strokeWidth="3.5" 
                    strokeDasharray="6 3"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />

                  {/* Origin Point: Guindy/Chennai Hub */}
                  <g transform="translate(60, 220)">
                    <circle r="8" fill="#F59E0B" fillOpacity="0.3" />
                    <circle r="4.5" fill="#F59E0B" />
                    <text x="0" y="20" fill="#A3A3A3" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                      Origin Hub
                    </text>
                  </g>

                  {/* Checkpoint Hub */}
                  <g transform="translate(280, 150)">
                    <circle r="4" fill="#525252" />
                    <circle r="2" fill="#FFFFFF" />
                    <text x="0" y="-10" fill="#737373" fontSize="9" fontFamily="sans-serif" textAnchor="middle">
                      Transit Waypoint
                    </text>
                  </g>

                  {/* Destination Pin: Customer Address */}
                  <g transform="translate(440, 130)">
                    <circle r="12" fill={currentPkg.status === 'Delivered' ? '#10B981' : '#F59E0B'} fillOpacity="0.2" className="animate-ping" />
                    <circle r="7" fill={currentPkg.status === 'Delivered' ? '#10B981' : '#EF4444'} />
                    <text x="0" y="22" fill="#E5E5E5" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                      Destination
                    </text>
                  </g>

                  {/* Courier Van Live Position */}
                  <g transform={`translate(${courierPosition.x * 4.5}, ${courierPosition.y * 2.6})`}>
                    <circle r="16" fill="#F59E0B" fillOpacity="0.25" />
                    <circle r="8" fill="#F59E0B" />
                    <circle r="3" fill="#171717" />
                  </g>
                </svg>

                {/* Map Floating HUD Overlay */}
                <div className="absolute bottom-3 left-3 bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 rounded-lg p-2.5 text-xs text-white shadow-lg space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-[11px] font-mono">
                      VEHICLE: {assignedCourier?.vehiclePlate || 'TN-09-EV-4821'}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Speed: <span className="font-mono text-neutral-200">34 km/h</span> · Heading: South-East OMR
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 rounded-lg px-2.5 py-1.5 text-[11px] text-neutral-300 font-mono">
                  GPS: 12.9010° N, 80.2279° E
                </div>
              </div>
            </div>

            {/* Delivery Progress Timeline Step-by-Step */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Step-by-Step Delivery Progress
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Detailed scan history with facility locations and timestamps
                  </p>
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  {currentPkg.timeline.length} Checkpoints
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
                {currentPkg.timeline.map((evt, idx) => {
                  const isLatest = idx === currentPkg.timeline.length - 1;
                  return (
                    <div key={evt.id} className="relative group">
                      {/* Timeline circle icon */}
                      <div 
                        className={`absolute -left-[27px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          evt.completed
                            ? 'bg-amber-500 text-neutral-950 ring-4 ring-white dark:ring-neutral-900 font-bold'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {evt.completed ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                            {evt.title}
                          </h4>
                          <span className="text-[11px] font-mono text-neutral-400">
                            {evt.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300">
                          {evt.description}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>{evt.location}</span>
                        </div>
                        {evt.courierNotes && (
                          <div className="mt-1.5 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-300">
                            <strong>Agent remark:</strong> {evt.courierNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Courier Info, Recipient Details & Quick Handover Simulator */}
          <div className="space-y-6">
            {/* Courier Information Card */}
            {assignedCourier && (
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Assigned Courier
                  </span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{assignedCourier.status}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-700 shrink-0">
                    <img
                      src={assignedCourier.avatar}
                      alt={assignedCourier.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {assignedCourier.name}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {assignedCourier.currentZone}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold font-mono">{assignedCourier.rating}</span>
                      <span className="text-neutral-400">({assignedCourier.deliveriesCount} deliveries)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400 text-[10px] block">Vehicle</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">
                      {assignedCourier.vehicleType}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400 text-[10px] block">Plate #</span>
                    <span className="font-semibold font-mono text-neutral-800 dark:text-neutral-200 truncate block">
                      {assignedCourier.vehiclePlate}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={handleCallCourier}
                    className="flex-1 py-2 text-xs font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-500" />
                    <span>Call Driver</span>
                  </button>
                  <button
                    onClick={() => {
                      sendNotification(
                        currentPkg.id,
                        assignedCourier.phone,
                        'SMS',
                        'Customer Direct Ping',
                        `Recipient ${currentPkg.receiverName} requests courier confirmation for ${currentPkg.id}`
                      );
                      setCallAlert(`SMS dispatch alert forwarded to ${assignedCourier.name}!`);
                      setTimeout(() => setCallAlert(null), 3000);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                    title="Send Quick SMS"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {callAlert && (
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
                    {callAlert}
                  </div>
                )}
              </div>
            )}

            {/* Recipient & Destination Details */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-100 dark:border-neutral-800">
                Destination & Recipient
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-400 text-[11px] block">Receiver Name</span>
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {currentPkg.receiverName}
                  </p>
                  <p className="text-neutral-500 font-mono text-[11px]">
                    {currentPkg.receiverPhone}
                  </p>
                </div>

                <div>
                  <span className="text-neutral-400 text-[11px] block">Delivery Address</span>
                  <p className="text-neutral-800 dark:text-neutral-200">
                    {currentPkg.receiverAddress}
                  </p>
                  <p className="font-medium text-neutral-600 dark:text-neutral-400">
                    {currentPkg.receiverCity}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-neutral-500">
                  <span>Gross Weight</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {currentPkg.weightKg} kg
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Package Dimensions</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">
                    {currentPkg.dimensions}
                  </span>
                </div>
              </div>
            </div>

            {/* Proof of Delivery / Signature Verification / Customer Feedback */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-100 dark:border-neutral-800">
                Delivery Verification & Feedback
              </h3>

              {currentPkg.status === 'Delivered' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified E-Signature Captured</span>
                  </div>

                  {currentPkg.signatureProof && (
                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-1 text-xs">
                      <p className="text-neutral-500 text-[11px]">Signed by:</p>
                      <p className="font-semibold text-neutral-900 dark:text-white font-mono">
                        {currentPkg.signatureProof.recipientName}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        Timestamp: {currentPkg.signatureProof.signedAt}
                      </p>
                    </div>
                  )}

                  {/* Customer Rating summary or leave feedback button */}
                  {currentPkg.customerRating ? (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-amber-900 dark:text-amber-200">Customer Rating</span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: currentPkg.customerRating.score }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 italic text-[11px]">
                        &quot;{currentPkg.customerRating.comment}&quot;
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setFeedbackPackageId(currentPkg.id)}
                      className="w-full py-2.5 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Star className="w-4 h-4 fill-current" />
                      <span>Rate Delivery Experience</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Once delivered to recipient address, digital signature confirmation will appear here.
                  </p>

                  {/* Quick simulator button for demonstration */}
                  <div className="pt-2">
                    <p className="text-[11px] font-medium text-neutral-400 mb-2">Internship Simulation Shortcut:</p>
                    <button
                      onClick={() => updatePackageStatus(currentPkg.id, 'Delivered', 'Recipient confirmed handover with OTP signature')}
                      className="w-full py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Simulate Handover (Mark Delivered)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
          <Search className="w-8 h-8 text-neutral-400 mx-auto" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
            No consignment found with tracking ID &quot;{selectedPackageId}&quot;
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Please check the airway bill number or choose one of the available packages from the list.
          </p>
          <button
            onClick={() => setSelectedPackageId('TRK-8924-IN')}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 rounded-lg hover:bg-amber-400"
          >
            Load Sample Package TRK-8924-IN
          </button>
        </div>
      )}
    </div>
  );
};
