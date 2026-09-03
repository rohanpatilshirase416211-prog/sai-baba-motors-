import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Trash2, CheckCircle2, Clock, Check, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Spinner from '../../components/common/Spinner';
import { enquiryAPI } from '../../services/api';
import { formatDate, getCallLink, getWhatsAppLink } from '../../utils/formatters';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const res = await enquiryAPI.getAll({ status: filterStatus });
      if (res.data.success) {
        setEnquiries(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await enquiryAPI.updateStatus(id, status);
      if (res.data.success) {
        setToastMessage(`Status updated to ${status}`);
        setTimeout(() => setToastMessage(''), 2500);
        fetchEnquiries();
      }
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer enquiry?')) return;
    try {
      const res = await enquiryAPI.delete(id);
      if (res.data.success) {
        setToastMessage('Enquiry deleted.');
        setTimeout(() => setToastMessage(''), 2500);
        fetchEnquiries();
      }
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <AdminLayout title="Customer Vehicle Enquiries">
      <div className="space-y-6">
        {toastMessage && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg font-bold text-xs uppercase tracking-wider">
            {toastMessage}
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-500">Filter By Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="all">All Enquiries</option>
              <option value="New">New Only</option>
              <option value="Contacted">Contacted Only</option>
              <option value="Closed">Closed Only</option>
            </select>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {enquiries.length} Enquiries Found
          </span>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-20">
              <Spinner size="lg" />
            </div>
          ) : enquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-navy-950 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-4">Contact</th>
                    <th className="py-4 px-4">Inquired Vehicle</th>
                    <th className="py-4 px-4">Message</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enquiries.map((enq) => (
                    <tr key={enq._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                        {enq.name}
                      </td>

                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={getCallLink(enq.phone)}
                            className="font-semibold text-navy-900 hover:text-gold-600 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-gold-600" />
                            <span>{enq.phone}</span>
                          </a>
                          <a
                            href={getWhatsAppLink(enq.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline text-[11px] font-bold"
                          >
                            WA
                          </a>
                        </div>
                        {enq.email && (
                          <span className="text-[11px] text-slate-400 block">{enq.email}</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        {enq.vehicleSnapshot?.title ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 block">
                              {enq.vehicleSnapshot.title}
                            </span>
                            {enq.vehicleId && (
                              <a
                                href={`/vehicle/${enq.vehicleId._id || enq.vehicleId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-gold-600 hover:underline flex items-center gap-0.5"
                              >
                                <span>View Vehicle</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">General Showroom Query</span>
                        )}
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-700">
                          {enq.message || 'No specific question entered.'}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-slate-400">
                        {formatDate(enq.createdAt)}
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer border ${
                            enq.status === 'New'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : enq.status === 'Contacted'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(enq._id)}
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
              No enquiries recorded.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;
