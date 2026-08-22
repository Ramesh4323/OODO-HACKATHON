import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Check, X, Download, Filter } from 'lucide-react';

const AdminLeaves = () => {
  const { showToast } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [commentModal, setCommentModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves');
      setLeaves(res.data);
    } catch (err) {
      console.error('Fetch all leaves error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async () => {
    if (!commentModal) return;
    setActionLoading(true);
    const { id, action, comment } = commentModal;
    try {
      if (action === 'APPROVE') {
        await api.put(`/leaves/${id}/approve`, { admin_comment: comment || 'Approved' });
        showToast('Leave request approved successfully!', 'success');
      } else {
        await api.put(`/leaves/${id}/reject`, { admin_comment: comment || 'Rejected' });
        showToast('Leave request rejected.', 'info');
      }
      setCommentModal(null);
      fetchLeaves();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error processing request', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Admin Comment'];
    const rows = filtered.map(item => [
      `"${item.employee_id || ''}"`,
      `"${item.employee_name || ''}"`,
      `"${item.department || ''}"`,
      `"${item.leave_type || ''}"`,
      `"${item.start_date || ''}"`,
      `"${item.end_date || ''}"`,
      `"${item.reason || ''}"`,
      `"${item.status || ''}"`,
      `"${item.admin_comment || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Dayflow_Leave_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = leaves.filter((leave) => {
    if (statusFilter === 'ALL') return true;
    return leave.status.toUpperCase() === statusFilter;
  });

  return (
    <div className="space-y-6 relative pb-10">
      {/* Background Orbs */}
      <div className="fixed top-12 right-1/4 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leave Approvals & Management</h1>
          <p className="text-xs text-slate-500 font-semibold">Review, approve, or reject employee leave applications</p>
        </div>

        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="px-6 py-3 cloud-button-3d text-xs uppercase tracking-wider flex items-center gap-2 self-start disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export Leave Report
        </button>
      </div>

      {/* Filter Tabs Card */}
      <div className="cloud-card p-4 flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-black uppercase text-slate-700 tracking-wider">Filter Status:</span>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 text-xs font-black rounded-xl transition ${
                statusFilter === st ? 'cloud-button-3d text-white' : 'bg-sky-50/80 text-slate-600 hover:bg-sky-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leaves Table Card */}
      <div className="cloud-card p-6 md:p-8 relative z-10">
        {loading ? (
          <p className="text-xs text-sky-600 font-semibold py-4">Loading leave applications...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 bg-sky-50/50 rounded-2xl border border-sky-100">
            <p className="text-xs font-bold text-slate-600">No leave applications found matching filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-xs font-black uppercase text-sky-600/70">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Admin Comment</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-xs">
                {filtered.map((leave) => (
                  <tr key={leave.id} className="hover:bg-sky-50/60 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 leading-snug">{leave.employee_name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{leave.employee_id} • {leave.department}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{leave.leave_type}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      {leave.start_date} to {leave.end_date}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600 max-w-xs">{leave.reason}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-3.5 py-1 text-xs font-black rounded-full ${
                          leave.status === 'Approved'
                            ? 'pill-teal'
                            : leave.status === 'Rejected'
                            ? 'pill-pink'
                            : 'pill-amber'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-semibold italic">
                      {leave.admin_comment || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {leave.status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              setCommentModal({ id: leave.id, action: 'APPROVE', comment: '' })
                            }
                            className="px-3.5 py-1.5 cloud-button-3d text-[11px] uppercase tracking-wider flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> APPROVE
                          </button>
                          <button
                            onClick={() =>
                              setCommentModal({ id: leave.id, action: 'REJECT', comment: '' })
                            }
                            className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-full text-[11px] uppercase tracking-wider shadow-sm flex items-center gap-1 transition"
                          >
                            <X className="w-3.5 h-3.5" /> REJECT
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400 italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Action Comment Modal */}
      {commentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="cloud-card max-w-md w-full p-8 space-y-4 animate-spring relative overflow-hidden">
            <h3 className="text-lg font-black text-slate-900">
              {commentModal.action === 'APPROVE' ? 'Approve Leave Request' : 'Reject Leave Request'}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Add an optional note or comment for the employee:</p>

            <textarea
              rows="3"
              value={commentModal.comment}
              onChange={(e) => setCommentModal({ ...commentModal, comment: e.target.value })}
              placeholder="e.g. Approved for requested dates..."
              className="w-full p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCommentModal(null)}
                className="px-4 py-2.5 cloud-button-secondary text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white rounded-full shadow-md transition ${
                  commentModal.action === 'APPROVE' ? 'cloud-button-3d' : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                {actionLoading ? 'Processing...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaves;
