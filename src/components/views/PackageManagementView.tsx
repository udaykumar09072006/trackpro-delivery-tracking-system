import React, { useState } from 'react';
import { 
  Package as PackageIcon, 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit, 
  ArrowUpRight, 
  Download, 
  CheckSquare, 
  Square,
  Clock,
  Truck,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  X
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { TrackingStatus, PackagePriority, Package } from '../../types/logistics';

export const PackageManagementView: React.FC = () => {
  const { 
    packages, 
    couriers, 
    deletePackage, 
    updatePackageStatus, 
    updatePackage,
    setSelectedPackageId, 
    setActiveTab, 
    setShowAddPackageModal,
    exportPackagesCSV 
  } = useLogistics();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [courierFilter, setCourierFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered packages
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.id.toLowerCase().includes(search.toLowerCase()) ||
      pkg.receiverName.toLowerCase().includes(search.toLowerCase()) ||
      pkg.senderName.toLowerCase().includes(search.toLowerCase()) ||
      pkg.receiverCity.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || pkg.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || pkg.priority === priorityFilter;
    const matchesCourier = courierFilter === 'All' || pkg.assignedCourierId === courierFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCourier;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPackages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPackages.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchStatus = (newStatus: TrackingStatus) => {
    selectedIds.forEach(id => updatePackageStatus(id, newStatus, 'Batch status update applied.'));
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected packages?`)) {
      selectedIds.forEach(id => deletePackage(id));
      setSelectedIds([]);
    }
  };

  const getStatusBadge = (status: TrackingStatus) => {
    switch (status) {
      case 'Pending':
        return { text: 'Pending', icon: Clock, style: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
      case 'In Transit':
        return { text: 'In Transit', icon: Truck, style: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' };
      case 'Out for Delivery':
        return { text: 'Out for Delivery', icon: Navigation, style: 'text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700' };
      case 'Delivered':
        return { text: 'Delivered', icon: CheckCircle2, style: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
      case 'Failed':
        return { text: 'Failed', icon: AlertTriangle, style: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Package Consignment Management
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Create, update tracking status, assign couriers, and manage consignments
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={exportPackagesCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddPackageModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Package</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, recipient, city..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All">All Statuses ({packages.length})</option>
            <option value="Pending">Pending ({packages.filter(p => p.status === 'Pending').length})</option>
            <option value="In Transit">In Transit ({packages.filter(p => p.status === 'In Transit').length})</option>
            <option value="Out for Delivery">Out for Delivery ({packages.filter(p => p.status === 'Out for Delivery').length})</option>
            <option value="Delivered">Delivered ({packages.filter(p => p.status === 'Delivered').length})</option>
            <option value="Failed">Failed / Exceptions ({packages.filter(p => p.status === 'Failed').length})</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Standard">Standard</option>
            <option value="Express">Express</option>
            <option value="Overnight">Overnight</option>
            <option value="Fragile">Fragile</option>
          </select>

          {/* Courier Filter */}
          <select
            value={courierFilter}
            onChange={(e) => setCourierFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All">All Couriers</option>
            {couriers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.vehicleType})</option>
            ))}
          </select>
        </div>

        {/* Batch Operations Toolbar when items selected */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-lg text-xs">
            <span className="font-semibold text-amber-900 dark:text-amber-200">
              {selectedIds.length} packages selected
            </span>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 text-[11px]">Batch Status:</span>
              <button
                onClick={() => handleBatchStatus('In Transit')}
                className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-sky-600 font-medium hover:bg-neutral-50"
              >
                In Transit
              </button>
              <button
                onClick={() => handleBatchStatus('Out for Delivery')}
                className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-amber-600 font-medium hover:bg-neutral-50"
              >
                Out for Delivery
              </button>
              <button
                onClick={() => handleBatchStatus('Delivered')}
                className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-emerald-600 font-medium hover:bg-neutral-50"
              >
                Delivered
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-2 py-1 bg-rose-50 text-rose-600 rounded border border-rose-200 font-medium hover:bg-rose-100"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Packages Table */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/40 text-neutral-500 uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-3 px-3 w-10">
                  <button 
                    onClick={toggleSelectAll} 
                    className="text-neutral-400 hover:text-neutral-600 flex items-center"
                  >
                    {selectedIds.length === filteredPackages.length && filteredPackages.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 pr-3 font-semibold">Tracking Number</th>
                <th className="py-3 px-3 font-semibold">Recipient & Destination</th>
                <th className="py-3 px-3 font-semibold">Status & Quick Update</th>
                <th className="py-3 px-3 font-semibold">Priority & Weight</th>
                <th className="py-3 px-3 font-semibold">Assigned Courier</th>
                <th className="py-3 pl-3 pr-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredPackages.length > 0 ? (
                filteredPackages.map(pkg => {
                  const statusInfo = getStatusBadge(pkg.status);
                  const Icon = statusInfo.icon;
                  const isChecked = selectedIds.includes(pkg.id);

                  return (
                    <tr 
                      key={pkg.id} 
                      className={`hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors ${
                        isChecked ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <button 
                          onClick={() => toggleSelectOne(pkg.id)}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-amber-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 pr-3 font-mono">
                        <div className="flex flex-col">
                          <button
                            onClick={() => {
                              setSelectedPackageId(pkg.id);
                              setActiveTab('track');
                            }}
                            className="font-bold text-amber-600 dark:text-amber-400 hover:underline text-left"
                          >
                            {pkg.id}
                          </button>
                          <span className="text-[11px] text-neutral-400 font-sans">
                            {new Date(pkg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-neutral-900 dark:text-white truncate max-w-[180px]">
                          {pkg.receiverName}
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
                          {pkg.receiverAddress}, {pkg.receiverCity}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        {/* Interactive Status Selector Dropdown */}
                        <div className="flex items-center gap-1.5">
                          <select
                            value={pkg.status}
                            onChange={(e) => updatePackageStatus(pkg.id, e.target.value as TrackingStatus)}
                            className={`px-2 py-1 text-[11px] font-medium rounded border focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer ${statusInfo.style}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">
                            {pkg.priority}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-400 block">
                            {pkg.weightKg} kg · {pkg.dimensions}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">
                        <p className="font-medium truncate max-w-[150px]">{pkg.assignedCourierName}</p>
                        <span className="text-[10px] text-neutral-400 font-mono">{pkg.routeId}</span>
                      </td>
                      <td className="py-3 pl-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedPackageId(pkg.id);
                              setActiveTab('track');
                            }}
                            title="Track Live"
                            className="p-1.5 text-neutral-500 hover:text-amber-600 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingPackage(pkg)}
                            title="Edit Consignment"
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(pkg.id)}
                            title="Delete Consignment"
                            className="p-1.5 text-neutral-500 hover:text-rose-600 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <PackageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-neutral-600 dark:text-neutral-300">No packages match the selected criteria</p>
                    <p className="text-xs text-neutral-400 mt-1">Try resetting the filters or add a new consignment</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Delete Shipment {deleteConfirmId}?
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              This will permanently remove the consignment record, GPS tracking timeline, and assigned route details from the system.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deletePackage(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-mono">
                Edit Consignment: {editingPackage.id}
              </h3>
              <button
                onClick={() => setEditingPackage(null)}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={editingPackage.receiverName}
                  onChange={(e) => setEditingPackage({ ...editingPackage, receiverName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Recipient Phone
                </label>
                <input
                  type="text"
                  value={editingPackage.receiverPhone}
                  onChange={(e) => setEditingPackage({ ...editingPackage, receiverPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={editingPackage.receiverAddress}
                  onChange={(e) => setEditingPackage({ ...editingPackage, receiverAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                    City / Pincode
                  </label>
                  <input
                    type="text"
                    value={editingPackage.receiverCity}
                    onChange={(e) => setEditingPackage({ ...editingPackage, receiverCity: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPackage.weightKg}
                    onChange={(e) => setEditingPackage({ ...editingPackage, weightKg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Courier Assignment
                </label>
                <select
                  value={editingPackage.assignedCourierId}
                  onChange={(e) => {
                    const c = couriers.find(cr => cr.id === e.target.value);
                    setEditingPackage({
                      ...editingPackage,
                      assignedCourierId: e.target.value,
                      assignedCourierName: c ? c.name : editingPackage.assignedCourierName
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  {couriers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.vehicleType})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                  Handling Instructions / Notes
                </label>
                <textarea
                  value={editingPackage.notes || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setEditingPackage(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updatePackage(editingPackage.id, editingPackage);
                  setEditingPackage(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
