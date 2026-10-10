import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Clock, 
  Filter,
  CheckCheck
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { AppNotification } from '../../types/logistics';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    packages, 
    sendNotification, 
    markNotificationAsRead,
    setSelectedPackageId,
    setActiveTab 
  } = useLogistics();

  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [selectedPkgId, setSelectedPkgId] = useState<string>(packages[0]?.id || '');
  const [targetChannel, setTargetChannel] = useState<'SMS' | 'WhatsApp' | 'Email' | 'Push'>('SMS');
  const [customMsg, setCustomMsg] = useState('');
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const selectedPkg = packages.find(p => p.id === selectedPkgId) || packages[0];

  const filteredNotifs = notifications.filter(n => {
    return channelFilter === 'All' || n.channel === channelFilter;
  });

  const handleSendSimulated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;

    const defaultMsg = targetChannel === 'WhatsApp' 
      ? `Hello ${selectedPkg.receiverName}, your TrackPro package ${selectedPkg.id} is currently ${selectedPkg.status}. Track live at trackpro.in/${selectedPkg.id}`
      : `TrackPro Alert: Shipment ${selectedPkg.id} update: ${selectedPkg.status}. Estimated: ${new Date(selectedPkg.estimatedDelivery).toLocaleDateString()}`;

    const textToSend = customMsg.trim() || defaultMsg;

    sendNotification(
      selectedPkg.id,
      `${selectedPkg.receiverName} (${selectedPkg.receiverPhone})`,
      targetChannel,
      `${targetChannel} Dispatch Broadcast`,
      textToSend
    );

    setSentNotice(`Simulated ${targetChannel} dispatched successfully!`);
    setCustomMsg('');
    setTimeout(() => setSentNotice(null), 3500);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'SMS': return Smartphone;
      case 'WhatsApp': return MessageSquare;
      case 'Email': return Mail;
      default: return Bell;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'WhatsApp': return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      case 'SMS': return 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800';
      case 'Email': return 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800';
      default: return 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Customer Delivery Notifications (Simulated)
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Automated SMS, WhatsApp, and Email triggers dispatched to consignees upon tracking status changes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              notifications.forEach(n => markNotificationAsRead(n.id));
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Columns: Notifications Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Channel Filters */}
          <div className="flex items-center gap-2 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-500 font-medium mr-1">Filter Channel:</span>
            {['All', 'SMS', 'WhatsApp', 'Email', 'Push'].map((ch) => (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  channelFilter === ch
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map(notif => {
                const ChannelIcon = getChannelIcon(notif.channel);
                const channelStyle = getChannelColor(notif.channel);

                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                      notif.read
                        ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                        : 'border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg border shrink-0 ${channelStyle}`}>
                          <ChannelIcon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                              {notif.title}
                            </span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${channelStyle}`}>
                              {notif.channel}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPackageId(notif.packageId);
                                setActiveTab('track');
                              }}
                              className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                            >
                              {notif.packageId}
                            </button>
                          </div>
                          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-1">
                            <span>To: {notif.recipient}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{notif.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-400">
                <Bell className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No notifications in this filter category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Send Simulated Notification & Phone Preview */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-100 dark:border-neutral-800">
              Simulate Dispatch Alert
            </h3>

            <form onSubmit={handleSendSimulated} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Target Shipment
                </label>
                <select
                  value={selectedPkgId}
                  onChange={(e) => setSelectedPkgId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.receiverName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Delivery Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['SMS', 'WhatsApp', 'Email'] as const).map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setTargetChannel(ch)}
                      className={`py-1.5 rounded-lg font-medium border text-center transition-colors ${
                        targetChannel === ch
                          ? 'bg-amber-500 text-neutral-950 font-bold border-amber-600'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Custom Notification Message (Optional)
                </label>
                <textarea
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Leave blank for automatic smart status template..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Simulated Alert</span>
              </button>

              {sentNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{sentNotice}</span>
                </div>
              )}
            </form>
          </div>

          {/* Interactive Phone Screen Preview */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white shadow-sm space-y-3">
            <div className="flex items-center justify-between text-neutral-400 text-[11px]">
              <span>Customer Device Preview</span>
              <span className="font-mono">Carrier: 5G AIR</span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-800/90 border border-neutral-700 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Bell className="w-3 h-3" />
                  <span>TrackPro Express</span>
                </span>
                <span className="text-[10px] text-neutral-400">now</span>
              </div>
              <p className="text-neutral-200 leading-snug text-[11px]">
                {selectedPkg?.receiverName ? `Dear ${selectedPkg.receiverName}, ` : ''}
                Your shipment {selectedPkg?.id} is {selectedPkg?.status}. 
                {selectedPkg?.status === 'Delivered' 
                  ? ' Signed handover confirmed.' 
                  : ` Scheduled with courier ${selectedPkg?.assignedCourierName}.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
