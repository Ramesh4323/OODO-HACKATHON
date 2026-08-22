import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { Users, UserCheck, CalendarOff, Clock, Check, X, Shield, Trophy, Award, Star, Eye, Phone, MapPin, Mail, Briefcase, DollarSign, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

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

  const topPerformer = stats?.topPerformer;
  const rankedEmployees = stats?.rankedEmployees || [];

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
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">Monitor workforce, top performers, employee rankings & leave logs</p>
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

      {/* 4 Analytics Cards */}
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

      {/* 🏆 TOP PERFORMER & RANKINGS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

        {/* 🏆 Rank #1 Top Performer Golden Card */}
        <div className="cloud-card p-6 md:p-8 bg-gradient-to-b from-[#fffbeb] via-[#ffffff] to-[#f0f9ff] border-2 border-amber-300 flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-200/40 rounded-full blur-xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3.5 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center gap-1.5 shadow-sm">
                <Trophy className="w-4 h-4 fill-slate-950" /> #1 TOP PERFORMER
              </span>
              <span className="text-xs font-black text-amber-700">Rank #1</span>
            </div>

            {topPerformer ? (
              <div className="space-y-4 pt-2 text-center sm:text-left">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto sm:mx-0 shadow-lg border-4 border-white">
                  {topPerformer.name.charAt(0)}
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{topPerformer.name}</h3>
                  <p className="text-xs font-bold text-sky-600 mt-0.5">{topPerformer.designation} • {topPerformer.department}</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">ID: <span className="font-mono font-bold text-slate-800">{topPerformer.employee_id}</span></p>
                </div>

                <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-900">Attendance Compliance Score:</span>
                    <span className="text-amber-800 font-black text-sm">{topPerformer.attendance_score}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-amber-200/60 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${topPerformer.attendance_score}%` }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-500 py-6">No performance logs recorded yet.</p>
            )}
          </div>

          {topPerformer && (
            <button
              onClick={() => setSelectedEmp(topPerformer)}
              className="w-full mt-6 py-3 cloud-button-3d text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4" /> View Full Profile & Rank Details
            </button>
          )}
        </div>

        {/* 🏅 Employee Leaderboard Table Card */}
        <div className="lg:col-span-2 cloud-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-sky-600" /> Employee Performance Rankings
                </h2>
                <p className="text-xs text-slate-500 font-semibold">Ranked by attendance compliance, punctuality & tenure</p>
              </div>

              <Link to="/admin/employees" className="text-xs font-black text-sky-600 hover:underline">
                View All Directory →
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-sky-600 font-semibold py-4">Loading rankings...</p>
            ) : rankedEmployees.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-bold">No employee records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-sky-100 text-xs font-black uppercase text-sky-600/70">
                      <th className="py-3 px-3">Rank</th>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Compliance Score</th>
                      <th className="py-3 px-3 text-center">Full Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100 text-xs">
                    {rankedEmployees.map((emp) => (
                      <tr key={emp.employee_id} className="hover:bg-sky-50/60 transition">
                        <td className="py-3.5 px-3">
                          {emp.rank === 1 ? (
                            <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">🥇 1</span>
                          ) : emp.rank === 2 ? (
                            <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">🥈 2</span>
                          ) : emp.rank === 3 ? (
                            <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-black flex items-center justify-center text-xs shadow-sm">🥉 3</span>
                          ) : (
                            <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs">#{emp.rank}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 leading-snug">{emp.name}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{emp.employee_id} • {emp.email}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-700">{emp.department}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sky-700 text-xs">{emp.attendance_score}%</span>
                            <div className="w-16 h-2 bg-sky-100 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${emp.attendance_score}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => setSelectedEmp(emp)}
                            className="p-2 rounded-xl cloud-card text-sky-600 hover:bg-sky-100 transition"
                            title="View Full Employee Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

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

      {/* FULL EMPLOYEE DETAILS MODAL */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="cloud-card max-w-2xl w-full p-8 space-y-6 animate-spring relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-sky-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0099ff] to-[#0077ff] text-white font-black flex items-center justify-center text-lg shadow-md">
                  {selectedEmp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-none">{selectedEmp.name}</h3>
                  <p className="text-xs text-sky-600 font-bold mt-1">ID: {selectedEmp.employee_id} • Rank #{selectedEmp.rank}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmp(null)}
                className="w-9 h-9 rounded-full bg-sky-50 text-slate-600 flex items-center justify-center hover:bg-sky-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Email Address</span>
                <p className="font-bold text-slate-900 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-sky-600" /> {selectedEmp.email}</p>
              </div>

              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Phone Number</span>
                <p className="font-bold text-slate-900 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-sky-600" /> {selectedEmp.phone || 'N/A'}</p>
              </div>

              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Department</span>
                <p className="font-bold text-slate-900 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-sky-600" /> {selectedEmp.department || 'N/A'}</p>
              </div>

              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Designation</span>
                <p className="font-bold text-slate-900 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-sky-600" /> {selectedEmp.designation || 'N/A'}</p>
              </div>

              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Base Salary</span>
                <p className="font-extrabold text-emerald-700 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-600" /> ₹{Number(selectedEmp.salary || 0).toLocaleString('en-IN')}</p>
              </div>

              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Joining Date</span>
                <p className="font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-sky-600" /> {selectedEmp.joining_date || 'N/A'}</p>
              </div>
            </div>

            <div className="p-4 pill-teal rounded-2xl flex items-center justify-between text-xs font-bold">
              <span>Performance Compliance Score:</span>
              <span className="text-base font-black text-emerald-800">{selectedEmp.attendance_score}% (Rank #{selectedEmp.rank})</span>
            </div>

            <button
              onClick={() => setSelectedEmp(null)}
              className="w-full py-3 cloud-button-secondary text-xs uppercase tracking-wider"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
