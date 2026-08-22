import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { Users, UserCheck, CalendarOff, Clock, Check, X, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Fetch admin stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApprove = async (leaveId) => {
    setActionLoading(true);
    try {
      await api.put(`/leaves/${leaveId}/approve`, { admin_comment: 'Approved via Admin Dashboard' });
      showToast('Leave request approved!', 'success');
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve leave', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (leaveId) => {
    setActionLoading(true);
    try {
      await api.put(`/leaves/${leaveId}/reject`, { admin_comment: 'Rejected via Admin Dashboard' });
      showToast('Leave request rejected.', 'info');
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject leave', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative pb-10">
      {/* Background Orbs */}
      <div className="fixed top-12 left-1/4 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>

      {/* Top Banner (3D Cloud Card) */}
      <div className="cloud-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 pill-teal text-xs font-black rounded-full mb-2">
            <Shield className="w-3.5 h-3.5" /> HR Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Organization Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">Monitor workforce, daily logs, and leave requests</p>
        </div>

        <div className="flex gap-3">
          <Link to="/admin/employees" className="px-6 py-3 cloud-button-3d text-xs uppercase tracking-wider">
            Manage Employees
          </Link>
          <Link to="/admin/leaves" className="px-6 py-3 cloud-button-secondary text-xs uppercase tracking-wider">
            Leave Approvals
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        <StatCard
          title="Total Workforce"
          value={loading ? '...' : stats?.totalEmployees || 0}
          subtitle="Active employees"
          icon={Users}
        />

        <StatCard
          title="Present Today"
          value={loading ? '...' : stats?.presentToday || 0}
          subtitle="Checked in today"
          icon={UserCheck}
        />

        <StatCard
          title="On Leave Today"
          value={loading ? '...' : stats?.onLeaveToday || 0}
          subtitle="Approved leave"
          icon={CalendarOff}
        />

        <StatCard
          title="Pending Requests"
          value={loading ? '...' : stats?.pendingLeaves || 0}
          subtitle="Requires HR approval"
          icon={Clock}
        />
      </div>

      {/* Leave Approvals Table Card */}
      <div className="cloud-card p-6 md:p-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Recent Leave Submissions</h2>
            <p className="text-xs text-slate-500 font-semibold">Review employee time-off requests</p>
          </div>

          <Link to="/admin/leaves" className="text-xs font-black text-sky-600 hover:underline">
            View All Leaves →
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-sky-600 font-semibold py-6">Loading submissions...</p>
        ) : !stats?.recentLeaves || stats.recentLeaves.length === 0 ? (
          <div className="text-center py-8 bg-sky-50/50 rounded-2xl border border-sky-100">
            <p className="text-xs font-bold text-slate-600">No pending leave requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-xs font-black uppercase text-sky-600/70">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-xs">
                {stats.recentLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-sky-50/50 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 leading-snug">{leave.employee_name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{leave.employee_id} • {leave.department}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{leave.leave_type}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">
                      {leave.start_date} to {leave.end_date}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate font-semibold">{leave.reason}</td>
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
                    <td className="py-3.5 px-4 text-center">
                      {leave.status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(leave.id)}
                            disabled={actionLoading}
                            className="px-3.5 py-1.5 cloud-button-3d text-[11px] uppercase tracking-wider flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> APPROVE
                          </button>
                          <button
                            onClick={() => handleReject(leave.id)}
                            disabled={actionLoading}
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
    </div>
  );
};

export default AdminDashboard;
