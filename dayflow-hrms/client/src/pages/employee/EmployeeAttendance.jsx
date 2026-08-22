import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LogIn, LogOut, Clock, CalendarCheck } from 'lucide-react';

const EmployeeAttendance = () => {
  const { showToast } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewFilter, setViewFilter] = useState('ALL');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = history.find((r) => r.date === todayStr);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/attendance/my');
      setHistory(res.data);
    } catch (err) {
      console.error('Fetch attendance error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await api.post('/attendance/checkin');
      showToast(res.data.message || 'Checked in successfully!', 'success');
      fetchHistory();
    } catch (err) {
      const msg = err.response?.data?.message || 'Check-in failed.';
      showToast(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await api.put('/attendance/checkout');
      showToast(res.data.message || 'Checked out successfully!', 'success');
      fetchHistory();
    } catch (err) {
      const msg = err.response?.data?.message || 'Check-out failed.';
      showToast(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getFilteredHistory = () => {
    const now = new Date();
    if (viewFilter === 'TODAY') {
      return history.filter(r => r.date === todayStr);
    }
    if (viewFilter === 'WEEK') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return history.filter(r => new Date(r.date) >= sevenDaysAgo);
    }
    return history;
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className="space-y-6 max-w-5xl relative pb-10">
      {/* Background Orbs */}
      <div className="fixed top-12 left-1/4 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Tracker</h1>
        <p className="text-xs text-slate-500 font-semibold">Record your daily work attendance and view past history</p>
      </div>

      {/* Today Action Card (3D Cloud Card) */}
      <div className="cloud-card p-6 space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-600">Today's Date</span>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mt-0.5">
              <CalendarCheck className="w-5 h-5 text-sky-600" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <span
              className={`px-4 py-1 text-xs font-black rounded-full ${
                todayRecord?.check_out
                  ? 'pill-purple'
                  : todayRecord?.check_in
                  ? 'pill-teal'
                  : 'pill-amber'
              }`}
            >
              {todayRecord?.check_out
                ? 'Checked Out'
                : todayRecord?.check_in
                ? 'Present'
                : 'Not Checked In'}
            </span>
          </div>
        </div>

        {/* Timings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black text-sky-600 uppercase tracking-wider">Check-In Time</p>
              <p className="text-xl font-black text-slate-900 mt-1 font-mono">
                {todayRecord?.check_in || '--:--:--'}
              </p>
            </div>
            <Clock className="w-8 h-8 text-sky-500/40" />
          </div>

          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black text-sky-600 uppercase tracking-wider">Check-Out Time</p>
              <p className="text-xl font-black text-slate-900 mt-1 font-mono">
                {todayRecord?.check_out || '--:--:--'}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500/40" />
          </div>
        </div>

        {/* 3D Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={handleCheckIn}
            disabled={actionLoading || (todayRecord && !!todayRecord.check_in)}
            className="flex-1 py-4 px-6 cloud-button-3d text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {todayRecord?.check_in ? 'ALREADY CHECKED IN' : 'CHECK IN NOW'}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={actionLoading || !todayRecord?.check_in || !!todayRecord?.check_out}
            className="flex-1 py-4 px-6 cloud-button-secondary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {todayRecord?.check_out ? 'ALREADY CHECKED OUT' : 'CHECK OUT NOW'}
          </button>
        </div>
      </div>

      {/* History Table Card */}
      <div className="cloud-card p-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-black text-slate-900">Attendance History</h2>

          <div className="flex items-center p-1.5 bg-sky-50 rounded-2xl border border-sky-100 text-xs font-bold">
            <button
              onClick={() => setViewFilter('TODAY')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                viewFilter === 'TODAY' ? 'cloud-button-3d text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewFilter('WEEK')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                viewFilter === 'WEEK' ? 'cloud-button-3d text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                viewFilter === 'ALL' ? 'cloud-button-3d text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-sky-600 font-semibold">Loading history...</p>
        ) : filteredHistory.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center font-bold">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-xs font-black uppercase text-sky-600/70">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-sm">
                {filteredHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-sky-50/50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{record.date}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-xs font-semibold">{record.check_in || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-xs font-semibold">{record.check_out || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-extrabold rounded-full ${
                          record.status === 'Present'
                            ? 'pill-teal'
                            : record.status === 'Half-day'
                            ? 'pill-amber'
                            : 'pill-pink'
                        }`}
                      >
                        {record.status}
                      </span>
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

export default EmployeeAttendance;
