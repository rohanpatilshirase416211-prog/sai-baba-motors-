import React, { useState, useEffect } from 'react';
import { ShoppingBag, Phone, Image, Trash2, CheckCircle2, Car, Bike, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Spinner from '../../components/common/Spinner';
import { sellRequestAPI } from '../../services/api';
import { formatDate, formatPrice, formatKm, getCallLink, getWhatsAppLink } from '../../utils/formatters';

const AdminSellRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [previewImages, setPreviewImages] = useState(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await sellRequestAPI.getAll({ status: filterStatus });
      if (res.data.success) {
        setRequests(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch sell requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await sellRequestAPI.updateStatus(id, status);
      if (res.data.success) {
        setToastMessage(`Status updated to ${status}`);
        setTimeout(() => setToastMessage(''), 2500);
        fetchRequests();
      }
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sell request?')) return;
    try {
      const res = await sellRequestAPI.delete(id);
      if (res.data.success) {
        setToastMessage('Sell request deleted.');
        setTimeout(() => setToastMessage(''), 2500);
        fetchRequests();
      }
    } catch {
      alert('Failed to delete');
    }
  };

  const statusOptions = ['New', 'Contacted', 'Purchased', 'Rejected', 'Closed'];

  return (
    <AdminLayout title="Vehicle Sell Submissions">
      <div className="space-y-6">
        {toastMessage && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg font-bold text-xs uppercase tracking-wider">
            {toastMessage}
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="all">All Sell Requests</option>
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st} Only
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {requests.length} Requests Found
          </span>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-20">
              <Spinner size="lg" />
            </div>
          ) : requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-navy-950 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Seller Details</th>
                    <th className="py-4 px-4">Vehicle Offered</th>
                    <th className="py-4 px-4">Expected Price</th>
                    <th className="py-4 px-4">Running & Reg</th>
                    <th className="py-4 px-4">Photos</th>
                    <th className="py-4 px-4">Notes</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900 text-sm">{req.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={getCallLink(req.phone)}
                            className="text-navy-900 hover:text-gold-600 font-semibold flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-gold-600" />
                            <span>{req.phone}</span>
                          </a>
                          <a
                            href={getWhatsAppLink(req.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 font-bold"
                          >
                            WA
                          </a>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          {req.vehicleType === 'car' ? (
                            <Car className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <Bike className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>
                            {req.year} {req.brand} {req.model}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-sm text-navy-950">
                          {formatPrice(req.expectedPrice)}
                        </span>
                      </td>

                      <td className="py-4 px-4 space-y-0.5">
                        <p className="font-medium text-slate-700">{formatKm(req.running)}</p>
                        {req.registration && (
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            {req.registration}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        {req.images && req.images.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => setPreviewImages(req.images)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-50 text-navy-900 rounded-lg font-bold text-[10px] hover:bg-navy-100"
                          >
                            <Image className="w-3 h-3 text-gold-600" />
                            <span>{req.images.length} Photos</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">No photos</span>
                        )}
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-700 text-[11px]">
                          {req.additionalInformation || 'None'}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={req.status}
                          onChange={(e) => handleStatusChange(req._id, e.target.value)}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer border bg-white"
                        >
                          {statusOptions.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold">
              No sell requests found.
            </div>
          )}
        </div>
      </div>

      {/* Photo Preview Modal */}
      {previewImages && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImages(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-navy-950">Customer Vehicle Photos</h3>
              <button
                onClick={() => setPreviewImages(null)}
                className="text-xs font-bold text-slate-500 hover:text-navy-950"
              >
                Close (✕)
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previewImages.map((img, idx) => (
                <div key={idx} className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={img}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSellRequests;
