import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { CalendarDays, Send } from 'lucide-react';

const EmployeeLeave = () => {
  const { showToast } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    leave_type: 'Sick',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves/my');
      setLeaves(res.data);
    } catch (err) {
      console.error('Fetch leaves error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.leave_type || !form.start_date || !form.end_date || !form.reason) {
      showToast('Please fill in all leave request fields.', 'error');
      return;
    }

    if (new Date(form.end_date) < new Date(form.start_date)) {
      showToast('End date cannot be before start date.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/leaves', form);
      showToast(res.data.message || 'Leave request submitted successfully!', 'success');
      setForm({ leave_type: 'Sick', start_date: '', end_date: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit leave application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl relative pb-10">
      {/* Background Orbs */}
      <div className="fixed top-12 right-1/3 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leave Management</h1>
        <p className="text-xs text-slate-500 font-semibold">Apply for time-off and track approval status</p>
      </div>

      {/* Application Form Card */}
      <div className="cloud-card p-6 md:p-8 space-y-5 relative z-10">
        <div className="flex items-center gap-2 pb-3 border-b border-sky-100">
          <CalendarDays className="w-5 h-5 text-sky-600" />
          <h2 className="text-base font-black text-slate-900">Apply for Leave</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Leave Type
              </label>
              <select
                value={form.leave_type}
                onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              >
                <option value="Paid">Paid Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Leave
            </label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows="3"
              placeholder="Provide a clear description of your leave request..."
              className="w-full px-4 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="py-3.5 px-8 cloud-button-3d text-xs font-black uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'APPLY LEAVE'}
          </button>
        </form>
      </div>

      {/* Leave History Card */}
      <div className="cloud-card p-6 md:p-8 relative z-10">
        <h2 className="text-base font-black text-slate-900 mb-4">Leave Application History</h2>

        {loading ? (
          <p className="text-xs text-sky-600 font-semibold">Loading leave requests...</p>
        ) : leaves.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center font-bold">No leave applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-xs font-black uppercase text-sky-600/70">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">End Date</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Admin Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-sm">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-sky-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{leave.leave_type}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">{leave.start_date}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">{leave.end_date}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600 max-w-xs truncate">{leave.reason}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-3.5 py-1 text-xs font-extrabold rounded-full ${
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
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-semibold italic">
                      {leave.admin_comment || '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeave;
