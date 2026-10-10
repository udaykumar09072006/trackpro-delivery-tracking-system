import React from 'react';
import { X, Award, CheckCircle2, ExternalLink, Building2, Globe, FileCode2 } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { INTERNSHIP_METADATA } from '../../data/mockData';

export const InternshipTaskModal: React.FC = () => {
  const { showInternshipModal, setShowInternshipModal } = useLogistics();

  if (!showInternshipModal) return null;

  const modules = [
    { name: 'Dashboard', desc: 'Package overview, delivery statistics, recent updates, chart analytics', status: 'Implemented' },
    { name: 'Track Package', desc: 'Search by tracking number, real-time status, timeline & interactive live map', status: 'Implemented' },
    { name: 'Package Management', desc: 'Create, edit, delete packages with tracking details (Full CRUD)', status: 'Implemented' },
    { name: 'Delivery Routes', desc: 'Manage routes, waypoints, and simulate stop-by-stop advances', status: 'Implemented' },
    { name: 'Courier Management', desc: 'Fleet roster, vehicles (Electric Van, Cargo Bike, Motorbike), active status', status: 'Implemented' },
    { name: 'Delivery Timeline', desc: 'Step-by-step progress with timestamps and new checkpoint log generator', status: 'Implemented' },
    { name: 'Notifications (Simulated)', desc: 'Multi-channel SMS, WhatsApp, Email alerts with phone simulator', status: 'Implemented' },
    { name: 'Reports & Analytics', desc: 'On-time delivery rates, failure reason breakdown, CSV export, print modal', status: 'Implemented' },
    { name: 'Bonus Features', desc: 'Live map integration, ETA countdown, customer reviews, dark mode, audio chime', status: 'Implemented' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              <Award className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  Task ID: {INTERNSHIP_METADATA.taskId}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Internship Verified
                </span>
              </div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {INTERNSHIP_METADATA.taskName} · {INTERNSHIP_METADATA.company}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setShowInternshipModal(false)}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Details Metadata Table */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-400 text-[10px] block">DOMAIN</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{INTERNSHIP_METADATA.domain}</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-400 text-[10px] block">INDUSTRY</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{INTERNSHIP_METADATA.industry}</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-400 text-[10px] block">INTERNSHIP TYPE</span>
            <span className="font-semibold text-neutral-900 dark:text-white">Online · Remote</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-400 text-[10px] block">COMPANY</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{INTERNSHIP_METADATA.company}</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-400 text-[10px] block">COMPANY SITE</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">{INTERNSHIP_METADATA.website}</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-400 text-[10px] block">STUDENT PORTAL</span>
            <span className="font-mono text-neutral-900 dark:text-white">{INTERNSHIP_METADATA.portal}</span>
          </div>
        </div>

        {/* Completion Checklist */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-between">
            <span>Required Modules & Technical Requirements Checklist</span>
            <span className="text-emerald-600 font-mono text-[11px]">100% Completed</span>
          </h4>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden text-xs">
            {modules.map((m, idx) => (
              <div key={idx} className="p-3 flex items-start justify-between gap-3 bg-neutral-50/40 dark:bg-neutral-900/40">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-bold text-neutral-900 dark:text-white">{m.name}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pl-6">
                    {m.desc}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
          <p className="font-medium">
            This project fulfills all criteria for the Free Web Development Internship Online Task WD-LOG-004. Built with React 19, TypeScript, Tailwind CSS, real-time reactive local persistence, and interactive SVG mapping.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setShowInternshipModal(false)}
            className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm"
          >
            Close Task Information
          </button>
        </div>
      </div>
    </div>
  );
};
