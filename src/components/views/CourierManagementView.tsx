import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  Star, 
  Truck, 
  Bike, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Edit,
  X
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { Courier } from '../../types/logistics';

export const CourierManagementView: React.FC = () => {
  const { couriers, addCourier, updateCourier, setShowAddCourierModal } = useLogistics();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [vehicleFilter, setVehicleFilter] = useState<string>('All');
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);

  const filteredCouriers = couriers.filter(c => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesVehicle = vehicleFilter === 'All' || c.vehicleType === vehicleFilter;
    return matchesStatus && matchesVehicle;
  });

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'Cargo Bike':
      case 'Motorcycle':
        return Bike;
      default:
        return Truck;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      case 'On Route':
        return 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
      case 'On Break':
        return 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800';
      case 'Off Duty':
        return 'text-neutral-500 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Courier Fleet Management
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage field couriers, monitor active duty status, and assign delivery zones
          </p>
        </div>

        <button
          onClick={() => setShowAddCourierModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Courier</span>
        </button>
      </div>

      {/* Fleet KPI Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-neutral-500 text-xs block">Total Fleet Size</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
            {couriers.length} Drivers
          </span>
          <span className="text-[11px] text-neutral-400 block mt-0.5">Active profiles</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-neutral-500 text-xs block">Active On Route</span>
          <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {couriers.filter(c => c.status === 'On Route').length}
          </span>
          <span className="text-[11px] text-amber-600/80 block mt-0.5">Currently delivering</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-neutral-500 text-xs block">Available for Dispatch</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {couriers.filter(c => c.status === 'Available').length}
          </span>
          <span className="text-[11px] text-emerald-600/80 block mt-0.5">Ready for assignment</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-neutral-500 text-xs block">Fleet Avg Rating</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <span>4.88</span>
          </span>
          <span className="text-[11px] text-neutral-400 block mt-0.5">98.4% on-time SLA</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Route">On Route</option>
            <option value="On Break">On Break</option>
            <option value="Off Duty">Off Duty</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Vehicle:</span>
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            <option value="All">All Vehicle Types</option>
            <option value="Electric Van">Electric Van</option>
            <option value="Cargo Bike">Cargo Bike</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Heavy Van">Heavy Van</option>
          </select>
        </div>
      </div>

      {/* Courier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCouriers.map(courier => {
          const VehicleIcon = getVehicleIcon(courier.vehicleType);
          const statusStyle = getStatusColor(courier.status);

          return (
            <div
              key={courier.id}
              className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4 hover:border-amber-400 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-700 shrink-0">
                    <img
                      src={courier.avatar}
                      alt={courier.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {courier.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      {courier.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingCourier(courier)}
                    title="Edit Courier"
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${statusStyle}`}>
                    {courier.status}
                  </span>
                </div>
              </div>

              {/* Courier Zone & Vehicle Details */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{courier.currentZone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                  <VehicleIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{courier.vehicleType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-neutral-500">{courier.vehiclePlate}</span>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs">
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 block">Rating</span>
                  <span className="font-bold font-mono text-neutral-900 dark:text-white flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                    <span>{courier.rating}</span>
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 block">Deliveries</span>
                  <span className="font-bold font-mono text-neutral-900 dark:text-white">
                    {courier.deliveriesCount}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 block">On-Time</span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {courier.onTimeRate}%
                  </span>
                </div>
              </div>

              {/* Quick Status Toggle */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-neutral-400 text-[11px]">Set Status:</span>
                <select
                  value={courier.status}
                  onChange={(e) => updateCourier(courier.id, { status: e.target.value as Courier['status'] })}
                  className="px-2 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                >
                  <option value="Available">Available</option>
                  <option value="On Route">On Route</option>
                  <option value="On Break">On Break</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Courier Modal */}
      {editingCourier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Edit Courier: {editingCourier.name}
              </h3>
              <button
                onClick={() => setEditingCourier(null)}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingCourier.name}
                  onChange={(e) => setEditingCourier({ ...editingCourier, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editingCourier.phone}
                  onChange={(e) => setEditingCourier({ ...editingCourier, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Assigned Operating Zone
                </label>
                <input
                  type="text"
                  value={editingCourier.currentZone}
                  onChange={(e) => setEditingCourier({ ...editingCourier, currentZone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={editingCourier.vehicleType}
                    onChange={(e) => setEditingCourier({ ...editingCourier, vehicleType: e.target.value as Courier['vehicleType'] })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Electric Van">Electric Van</option>
                    <option value="Cargo Bike">Cargo Bike</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Heavy Van">Heavy Van</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                    Vehicle Plate #
                  </label>
                  <input
                    type="text"
                    value={editingCourier.vehiclePlate}
                    onChange={(e) => setEditingCourier({ ...editingCourier, vehiclePlate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setEditingCourier(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateCourier(editingCourier.id, editingCourier);
                  setEditingCourier(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg"
              >
                Save Courier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
