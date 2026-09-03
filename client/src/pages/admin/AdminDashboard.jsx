import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Bike,
  Sparkles,
  ShoppingBag,
  CheckCircle,
  MessageSquare,
  Plus,
  ArrowRight,
  Clock,
  Layers,
  Phone,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import Spinner from '../../components/common/Spinner';
import VehicleFormModal from '../../components/admin/VehicleFormModal';
import { statsAPI, vehicleAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchStats = async () => {
    try {
      const res = await statsAPI.getStats();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreateVehicle = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await vehicleAPI.create(formData);
      if (res.data.success) {
        setIsAddModalOpen(false);
        setToastMessage('Vehicle successfully added to inventory!');
        setTimeout(() => setToastMessage(''), 3000);
        fetchStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard Overview">
        <div className="py-20">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Showroom Dashboard Overview">
      <div className="space-y-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg font-bold text-xs uppercase tracking-wider flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-white">✕</button>
          </div>
        )}

        {/* Top Banner & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-navy-950 font-display">
              साईबाबा मोटर्स Showroom Control
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Live vehicle inventory and customer inquiries for Kasba Walve dealership.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* 8 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Inventory"
            value={stats?.totalVehicles || 0}
            icon={Layers}
            color="navy"
            subtitle={`${stats?.availableVehicles || 0} currently active`}
          />
          <StatCard
            title="Total Cars"
            value={stats?.totalCars || 0}
            icon={Car}
            color="blue"
            subtitle="Four-wheelers on lot"
          />
          <StatCard
            title="Total Bikes"
            value={stats?.totalBikes || 0}
            icon={Bike}
            color="purple"
            subtitle="Two-wheelers on lot"
          />
          <StatCard
            title="Featured Vehicles"
            value={stats?.featuredVehicles || 0}
            icon={Sparkles}
            color="gold"
            subtitle="Highlighted on Home"
          />
          <StatCard
            title="Sold Vehicles"
            value={stats?.soldVehicles || 0}
            icon={CheckCircle}
            color="emerald"
            subtitle="Completed deals"
          />
          <StatCard
            title="Active Listings"
            value={stats?.availableVehicles || 0}
            icon={Car}
            color="navy"
            subtitle="Available for buyers"
          />
          <StatCard
            title="Customer Enquiries"
            value={stats?.totalEnquiries || 0}
            icon={MessageSquare}
            color="gold"
            subtitle={`${stats?.newEnquiries || 0} new leads`}
          />
          <StatCard
            title="Vehicle Sell Requests"
            value={stats?.totalSellRequests || 0}
            icon={ShoppingBag}
            color="emerald"
            subtitle={`${stats?.newSellRequests || 0} pending review`}
          />
        </div>

        {/* Recent Enquiries & Recent Sell Requests Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Customer Enquiries */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-navy-950 font-display flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gold-600" />
                <span>Recent Customer Enquiries</span>
              </h3>
              <Link
                to="/admin/enquiries"
                className="text-xs font-bold text-navy-900 hover:text-gold-600 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {stats?.recentEnquiries && stats.recentEnquiries.length > 0 ? (
              <div className="space-y-3">
                {stats.recentEnquiries.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-slate-500 mt-0.5">{item.phone}</p>
                      {item.vehicleSnapshot?.title && (
                        <p className="text-navy-900 font-semibold mt-1">
                          Vehicle: {item.vehicleSnapshot.title}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No customer enquiries yet.
              </p>
            )}
          </div>

          {/* Recent Sell Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-navy-950 font-display flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-gold-600" />
                <span>Recent Sell Vehicle Requests</span>
              </h3>
              <Link
                to="/admin/sell-requests"
                className="text-xs font-bold text-navy-900 hover:text-gold-600 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {stats?.recentSellRequests && stats.recentSellRequests.length > 0 ? (
              <div className="space-y-3">
                {stats.recentSellRequests.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-slate-500 mt-0.5">{item.phone}</p>
                      <p className="text-navy-900 font-semibold mt-1">
                        {item.year} {item.brand} {item.model} • Expected: {formatPrice(item.expectedPrice)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No sell requests yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <VehicleFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateVehicle}
        isSubmitting={isSubmitting}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
