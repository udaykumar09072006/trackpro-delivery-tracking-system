import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  Plus, 
  AlertTriangle, 
  Navigation,
  FileCheck,
  Building
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { TrackingStatus } from '../../types/logistics';

export const DeliveryTimelineView: React.FC = () => {
  const { packages, selectedPackageId, setSelectedPackageId, addTimelineCheckpoint } = useLogistics();

  const [activePackageId, setActivePackageId] = useState<string>(selectedPackageId || packages[0]?.id || 'TRK-8924-IN');
  const [showAddCheckpoint, setShowAddCheckpoint] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TrackingStatus>('In Transit');

  const currentPkg = packages.find(p => p.id === activePackageId) || packages[0];

  const handleAddCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    addTimelineCheckpoint(
      currentPkg.id,
      title.trim(),
      description.trim() || 'Logistics facility status update.',
      location.trim(),
      status
    );

    setTitle('');
    setLocation('');
    setDescription('');
    setShowAddCheckpoint(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Delivery Timeline & Audit Checkpoints
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Immutable chain-of-custody audit log with timestamped physical handoffs
          </p>
        </div>

        {/* Package Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Select Shipment:</span>
          <select
            value={currentPkg?.id}
            onChange={(e) => {
              setActivePackageId(e.target.value);
              setSelectedPackageId(e.target.value);
            }}
            className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {packages.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.receiverName} ({p.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentPkg && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-Column: Chronological Timeline History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Consignment History
                  </span>
                  <h2 className="text-xl font-bold font-mono text-neutral-900 dark:text-white">
                    {currentPkg.id}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Destination: {currentPkg.destinationLocationName} · Courier: {currentPkg.assignedCourierName}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddCheckpoint(!showAddCheckpoint)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Log Checkpoint</span>
                </button>
              </div>

              {/* Add New Checkpoint Inline Form */}
              {showAddCheckpoint && (
                <form onSubmit={handleAddCheckpoint} className="p-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/20 space-y-3 text-xs">
                  <h4 className="font-bold text-amber-950 dark:text-amber-200">
                    Log New Facility Checkpoint / Physical Scan
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                        Checkpoint Event Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Cleared Regional Express X-Ray"
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                        Facility / Checkpoint Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Chennai Central Sort Center Bay 3"
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                        Status at this checkpoint
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TrackingStatus)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Failed">Failed / Delayed</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                        Operator Remarks / Description
                      </label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional remarks from barcode scan"
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCheckpoint(false)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                    >
                      Save & Broadcast Checkpoint
                    </button>
                  </div>
                </form>
              )}

              {/* Vertical Checkpoint Timeline */}
              <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
                {currentPkg.timeline.map((evt, idx) => {
                  return (
                    <div key={evt.id} className="relative group">
                      {/* Checkpoint Dot */}
                      <div
                        className={`absolute -left-[34px] top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          evt.completed
                            ? 'bg-amber-500 text-neutral-950 ring-4 ring-white dark:ring-neutral-900'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <span>{evt.title}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                              {evt.status}
                            </span>
                          </h4>
                          <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{evt.timestamp}</span>
                          </span>
                        </div>

                        <p className="text-xs text-neutral-600 dark:text-neutral-300">
                          {evt.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          <span>{evt.location}</span>
                        </div>

                        {evt.courierNotes && (
                          <div className="mt-2 p-2 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px] text-neutral-600 dark:text-neutral-300">
                            <strong>Agent Dispatch Remark:</strong> {evt.courierNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Waybill Details & Origin to Destination */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-100 dark:border-neutral-800">
                Waybill Route Summary
              </h3>

              <div className="space-y-4 text-xs">
                {/* Origin */}
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-neutral-400 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Origin Dispatch</span>
                    <p className="font-bold text-neutral-900 dark:text-white">{currentPkg.senderName}</p>
                    <p className="text-neutral-500">{currentPkg.senderAddress}, {currentPkg.senderCity}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="pl-1.5 text-neutral-300 dark:text-neutral-700">
                  ↓
                </div>

                {/* Destination */}
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Delivery Target</span>
                    <p className="font-bold text-neutral-900 dark:text-white">{currentPkg.receiverName}</p>
                    <p className="text-neutral-500">{currentPkg.receiverAddress}, {currentPkg.receiverCity}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                  <div className="flex justify-between text-neutral-500">
                    <span>Priority</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{currentPkg.priority}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Weight</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{currentPkg.weightKg} kg</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Service</span>
                    <span className="text-neutral-800 dark:text-neutral-200">{currentPkg.serviceType}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Created Date</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">
                      {new Date(currentPkg.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
