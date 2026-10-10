import React, { useState } from 'react';
import { X, Package as PackageIcon, Truck, MapPin } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { PackagePriority } from '../../types/logistics';

export const AddPackageModal: React.FC = () => {
  const { showAddPackageModal, setShowAddPackageModal, addPackage, couriers, setSelectedPackageId, setActiveTab } = useLogistics();

  const [senderName, setSenderName] = useState('Data Alcott Systems Logistics');
  const [senderAddress, setSenderAddress] = useState('Industrial Technology Park, Guindy');
  const [senderCity, setSenderCity] = useState('Chennai, TN');
  const [receiverName, setReceiverName] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverCity, setReceiverCity] = useState('Chennai, TN 600028');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [priority, setPriority] = useState<PackagePriority>('Express');
  const [weightKg, setWeightKg] = useState(2.0);
  const [dimensions, setDimensions] = useState('30 x 20 x 15 cm');
  const [serviceType, setServiceType] = useState('Same-Day Regional Air');
  const [assignedCourierId, setAssignedCourierId] = useState(couriers[0]?.id || 'CR-101');
  const [notes, setNotes] = useState('Signature required upon arrival.');

  if (!showAddPackageModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverName.trim() || !receiverAddress.trim() || !receiverPhone.trim()) return;

    const courier = couriers.find(c => c.id === assignedCourierId);

    const newPkg = addPackage({
      senderName,
      senderAddress,
      senderCity,
      receiverName,
      receiverAddress,
      receiverCity,
      receiverPhone,
      receiverEmail: receiverEmail || `${receiverName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      priority,
      weightKg: Number(weightKg) || 1.5,
      dimensions,
      serviceType,
      assignedCourierId,
      assignedCourierName: courier ? courier.name : 'Rajesh Kumar',
      routeId: 'RT-OMR-01',
      notes,
    });

    setShowAddPackageModal(false);
    setSelectedPackageId(newPkg.id);
    setActiveTab('track');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              <PackageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Create New Consignment
              </h3>
              <p className="text-xs text-neutral-500">
                Book airway bill, assign courier, and issue real-time tracking
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddPackageModal(false)}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Sender Details */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2">
            <span className="font-semibold text-neutral-600 dark:text-neutral-300 block">
              1. Shipper / Origin Facility
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Sender Name</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Origin City</label>
                <input
                  type="text"
                  required
                  value={senderCity}
                  onChange={(e) => setSenderCity(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Receiver Details */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2">
            <span className="font-semibold text-neutral-600 dark:text-neutral-300 block">
              2. Consignee / Destination Recipient
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Receiver Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Balaji"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98401 XXXXX"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-500 block mb-0.5">Complete Street Address *</label>
              <input
                type="text"
                required
                placeholder="Door No, Street Name, Landmark"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Destination City & Pincode</label>
                <input
                  type="text"
                  required
                  value={receiverCity}
                  onChange={(e) => setReceiverCity(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="recipient@domain.com"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Package Logistics Details */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2">
            <span className="font-semibold text-neutral-600 dark:text-neutral-300 block">
              3. Shipment Specifications & Dispatch Assignment
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PackagePriority)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Overnight">Overnight</option>
                  <option value="Fragile">Fragile</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Dimensions</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Assign Fleet Courier</label>
                <select
                  value={assignedCourierId}
                  onChange={(e) => setAssignedCourierId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  {couriers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.vehicleType})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="Same-Day Regional Air">Same-Day Regional Air</option>
                  <option value="Priority Ground Express">Priority Ground Express</option>
                  <option value="Standard Surface Cargo">Standard Surface Cargo</option>
                  <option value="Cold-Chain Medical">Cold-Chain Medical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-500 block mb-0.5">Delivery Notes & Instructions</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setShowAddPackageModal(false)}
              className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm"
            >
              Generate Airway Bill & Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
