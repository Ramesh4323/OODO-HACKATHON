import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Check, X } from 'lucide-react';

const AdminLeaves = () => {
  const { showToast } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="space-y-6 animate-neu-slide">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Leave Approvals & Management</h1>
        <p className="text-xs text-slate-500 font-semibold">Approve or reject employee leave applications</p>
      </div>

      <div className="neu-card p-6">
        {loading ? (
          <p className="text-xs text-slate-500 font-semibold py-4">Loading leave applications...</p>
        ) : leaves.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center neu-inset font-bold">No leave applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-xs font-black uppercase text-slate-400">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Admin Comment</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 text-sm">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-200/40 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 leading-snug">{leave.employee_name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{leave.employee_id} • {leave.department}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{leave.leave_type}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                      {leave.start_date} to {leave.end_date}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600 max-w-xs">{leave.reason}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-3 py-0.5 text-xs font-bold ${
                          leave.status === 'Approved'
                            ? 'neu-badge-approved'
                            : leave.status === 'Rejected'
                            ? 'neu-badge-rejected'
                            : 'neu-badge-pending'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-semibold italic">
                      {leave.admin_comment || '--'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {leave.status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setCommentModal({ id: leave.id, action: 'APPROVE', comment: 'Approved' })}
                            className="px-3 py-1 neu-btn-emerald text-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> APPROVE
                          </button>
                          <button
                            onClick={() => setCommentModal({ id: leave.id, action: 'REJECT', comment: 'Rejected' })}
                            className="px-3 py-1 neu-btn-rose text-xs flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> REJECT
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          {leave.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {commentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="neu-card max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-black text-slate-800">
              {commentModal.action === 'APPROVE' ? 'Approve Leave Request' : 'Reject Leave Request'}
            </h3>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-1">
                Admin Comment (Optional)
              </label>
              <textarea
                value={commentModal.comment}
                onChange={(e) => setCommentModal({ ...commentModal, comment: e.target.value })}
                rows="3"
                placeholder="Enter feedback or explanation..."
                className="w-full p-3 neu-input text-xs font-semibold"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCommentModal(null)}
                className="px-4 py-2 neu-btn text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider ${
                  commentModal.action === 'APPROVE' ? 'neu-btn-emerald' : 'neu-btn-rose'
                }`}
              >
                Confirm {commentModal.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaves;
