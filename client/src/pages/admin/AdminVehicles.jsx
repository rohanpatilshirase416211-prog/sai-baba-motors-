import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Car,
  Bike,
  Gauge,
  MapPin,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import VehicleFormModal from '../../components/admin/VehicleFormModal';
import Spinner from '../../components/common/Spinner';
import { vehicleAPI } from '../../services/api';
import { formatPrice, formatKm } from '../../utils/formatters';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const params = {
        status: 'all', // admin views all
        type: filterType,
        search: searchTerm,
        limit: 100,
      };
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      const res = await vehicleAPI.getAll(params);
      if (res.data.success) {
        setVehicles(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin vehicles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filterType, filterStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  // Save vehicle (Create or Update)
  const handleSaveVehicle = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedVehicle) {
        // Update existing vehicle
        const res = await vehicleAPI.update(selectedVehicle._id, formData);
        if (res.data.success) {
          showToast(`Vehicle "${formData.brand} ${formData.model}" updated successfully!`);
          setIsModalOpen(false);
          fetchVehicles();
        }
      } else {
        // Create new vehicle
        const res = await vehicleAPI.create(formData);
        if (res.data.success) {
          showToast(`New vehicle "${formData.brand} ${formData.model}" added to inventory!`);
          setIsModalOpen(false);
          fetchVehicles();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete vehicle with confirmation
  const handleDelete = async (vehicle) => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${vehicle.year} ${vehicle.brand} ${vehicle.model}? This action cannot be undone.`
    );
    if (!confirm) return;

    try {
      const res = await vehicleAPI.delete(vehicle._id);
      if (res.data.success) {
        showToast('Vehicle deleted successfully.');
        fetchVehicles();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  // Toggle vehicle status (available <-> sold)
  const handleToggleSold = async (vehicle) => {
    const nextStatus = vehicle.status === 'sold' ? 'available' : 'sold';
    try {
      const res = await vehicleAPI.updateStatus(vehicle._id, nextStatus);
      if (res.data.success) {
        showToast(`Vehicle marked as ${nextStatus.toUpperCase()}`);
        fetchVehicles();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (vehicle) => {
    try {
      const res = await vehicleAPI.toggleFeatured(vehicle._id);
      if (res.data.success) {
        showToast(
          vehicle.featured
            ? 'Vehicle removed from featured showcase'
            : 'Vehicle marked as Featured on Home page!'
        );
        fetchVehicles();
      }
    } catch (err) {
      alert('Failed to toggle featured flag');
    }
  };

  return (
    <AdminLayout title="Vehicle Inventory Management">
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg font-bold text-xs uppercase tracking-wider flex items-center justify-between animate-fadeIn">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-white">✕</button>
          </div>
        )}

        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search brand, model..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </form>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="all">All Vehicle Types</option>
              <option value="car">Cars Only</option>
              <option value="bike">Bikes Only</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Only</option>
              <option value="sold">Sold Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-md transition-all self-start lg:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>

        {/* Vehicles Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-20">
              <Spinner size="lg" />
            </div>
          ) : vehicles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-navy-950 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Vehicle</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Running & Passing</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-center">Featured</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicles.map((v) => {
                    const isSold = v.status === 'sold';
                    const coverImg =
                      v.primaryImage ||
                      (v.images && v.images.length > 0 ? v.images[0] : null) ||
                      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80';

                    return (
                      <tr key={v._id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Vehicle Thumbnail & Title */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img
                                src={coverImg}
                                alt={v.model}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-sm">
                                  {v.year} {v.brand} {v.model}
                                </span>
                                {v.vehicleType === 'car' ? (
                                  <Car className="w-3.5 h-3.5 text-slate-400" />
                                ) : (
                                  <Bike className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 block">
                                {v.variant || v.fuelType} • {v.ownership}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4">
                          <span className="font-bold text-sm text-navy-950">
                            {formatPrice(v.price)}
                          </span>
                        </td>

                        {/* Running & Passing */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <span className="font-medium text-slate-800 flex items-center gap-1">
                              <Gauge className="w-3 h-3 text-slate-400" />
                              <span>{formatKm(v.running)}</span>
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-700 rounded border border-slate-200">
                              {v.passing}
                            </span>
                          </div>
                        </td>

                        {/* Status Toggle Badge */}
                        <td className="py-4 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSold(v)}
                            title="Click to toggle Available / Sold"
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider transition-colors ${
                              isSold
                                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                          >
                            {v.status}
                          </button>
                        </td>

                        {/* Featured Star Toggle */}
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(v)}
                            title={v.featured ? 'Featured on Home' : 'Not Featured'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              v.featured
                                ? 'bg-gold-100 text-gold-600 hover:bg-gold-200'
                                : 'text-slate-300 hover:text-slate-500'
                            }`}
                          >
                            <Sparkles className="w-4 h-4 fill-current" />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/vehicle/${v._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View on Public Website"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(v)}
                              title="Edit Vehicle Details, Price & Photos"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(v)}
                              title="Delete Vehicle"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-600">No vehicles found in inventory.</p>
              <button
                onClick={handleOpenAdd}
                className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 bg-gold-400"
              >
                Add Your First Vehicle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Add / Edit Modal */}
      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveVehicle}
        initialData={selectedVehicle}
        isSubmitting={isSubmitting}
      />
    </AdminLayout>
  );
};

export default AdminVehicles;
