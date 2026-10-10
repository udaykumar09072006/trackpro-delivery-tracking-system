import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Truck, 
  TrendingUp, 
  Star,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { INTERNSHIP_METADATA } from '../../data/mockData';

export const ReportsView: React.FC = () => {
  const { packages, couriers, exportPackagesCSV } = useLogistics();

  const [dateRange, setDateRange] = useState('Today (10 Oct 2026)');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const total = packages.length;
  const delivered = packages.filter(p => p.status === 'Delivered').length;
  const failed = packages.filter(p => p.status === 'Failed').length;
  const inTransit = packages.filter(p => p.status === 'In Transit' || p.status === 'Out for Delivery').length;
  const onTimePercentage = total > 0 ? ((delivered / (delivered + failed || 1)) * 100).toFixed(1) : '100';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Delivery Operations & SLA Performance Reports
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Generate executive fulfillment reports, driver efficiency analytics, and export logistics records
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={exportPackagesCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.2]" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>On-Time SLA Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {onTimePercentage}%
          </span>
          <p className="text-[11px] text-neutral-400 mt-1">Target SLA threshold: 97.5%</p>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Avg Transit Duration</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
            18.4 hrs
          </span>
          <p className="text-[11px] text-neutral-400 mt-1">-2.1 hrs vs regional benchmark</p>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Active Pipeline</span>
            <Truck className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {inTransit} Pkgs
          </span>
          <p className="text-[11px] text-neutral-400 mt-1">Currently moving in fleet</p>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Exception Incidents</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-3xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {failed}
          </span>
          <p className="text-[11px] text-rose-600/80 mt-1">Customer unreachable / locked</p>
        </div>
      </div>

      {/* Two Column Section: Courier Leaderboard & Exception Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courier Performance Leaderboard */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Courier Performance Leaderboard
            </h2>
            <span className="text-xs text-neutral-500">Sorted by Rating</span>
          </div>

          <div className="space-y-3">
            {couriers
              .slice()
              .sort((a, b) => b.rating - a.rating)
              .map((c, index) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-mono font-bold text-xs text-neutral-400">
                      #{index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
                      <img src={c.avatar} alt={c.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{c.name}</h4>
                      <p className="text-[11px] text-neutral-500">{c.vehicleType} · {c.vehiclePlate}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="flex items-center justify-end gap-1 text-amber-500 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{c.rating}</span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {c.deliveriesCount} deliveries · {c.onTimeRate}% on-time
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Delivery Exception Categorization */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Delivery Failure Reason Breakdown
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Categorized root causes for first-attempt delivery exceptions
          </p>

          <div className="space-y-4 pt-2">
            {[
              { reason: 'Customer Unavailable / Premises Locked', pct: 64, count: '9 cases' },
              { reason: 'Address Verification / Incomplete Landmark', pct: 21, count: '3 cases' },
              { reason: 'Severe Weather / Route Roadblock', pct: 10, count: '1 case' },
              { reason: 'Customer Requested Reschedule', pct: 5, count: '1 case' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.reason}</span>
                  <span className="font-mono text-neutral-500">{item.pct}% ({item.count})</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <span className="font-bold block">Automated Dispatch Resolution Strategy</span>
            <p className="text-[11px] leading-relaxed">
              Consignments with failed initial attempts are automatically assigned to evening follow-up slots with automated WhatsApp confirmation pings.
            </p>
          </div>
        </div>
      </div>

      {/* Printable Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
                  TP
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Official Delivery Manifest Summary Report
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Generated: {new Date().toLocaleDateString()} · Data Alcott Systems
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <div>
                  <span className="text-neutral-400 block text-[10px]">TOTAL CONSIGNMENTS</span>
                  <span className="font-bold font-mono text-sm">{total}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">FULFILLED ON-TIME</span>
                  <span className="font-bold font-mono text-sm text-emerald-600">{delivered}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">SUCCESS RATE</span>
                  <span className="font-bold font-mono text-sm text-amber-600">{onTimePercentage}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white mb-2">Shipment Inventory Details</h4>
                <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Receiver</th>
                        <th className="p-2">City</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Courier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {packages.map(p => (
                        <tr key={p.id}>
                          <td className="p-2 font-mono font-semibold">{p.id}</td>
                          <td className="p-2">{p.receiverName}</td>
                          <td className="p-2">{p.receiverCity}</td>
                          <td className="p-2 font-semibold">{p.status}</td>
                          <td className="p-2">{p.assignedCourierName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
                <span>Task: {INTERNSHIP_METADATA.taskId} · {INTERNSHIP_METADATA.company}</span>
                <span>System: TrackPro v2.4</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg"
              >
                Close Preview
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Send to Printer / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
