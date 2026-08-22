import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Search } from 'lucide-react';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('ALL');

  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        const res = await api.get('/attendance/all');
        setAttendance(res.data);
      } catch (err) {
        console.error('Fetch all attendance error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAttendance();
  }, []);

  const filtered = attendance.filter((item) => {
    const matchesSearch =
      item.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = dateFilter ? item.date === dateFilter : true;
    if (viewMode === 'TODAY') {
      const todayStr = new Date().toISOString().split('T')[0];
      matchesDate = matchesDate && item.date === todayStr;
    } else if (viewMode === 'WEEK') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesDate = matchesDate && new Date(item.date) >= sevenDaysAgo;
    }
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 animate-neu-slide">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Organization Attendance Log</h1>
        <p className="text-xs text-slate-500 font-semibold">Monitor check-in and check-out logs across all employees</p>
      </div>

      {/* Filters Card */}
      <div className="neu-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center p-1 neu-inset text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setViewMode('TODAY')}
            className={`px-3.5 py-2 rounded-xl transition ${
              viewMode === 'TODAY' ? 'neu-btn-primary text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode('WEEK')}
            className={`px-3.5 py-2 rounded-xl transition ${
              viewMode === 'WEEK' ? 'neu-btn-primary text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setViewMode('ALL')}
            className={`px-3.5 py-2 rounded-xl transition ${
              viewMode === 'ALL' ? 'neu-btn-primary text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Logs
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3.5 py-2.5 neu-input w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employee..."
              className="text-xs bg-transparent border-none focus:outline-none w-full font-semibold"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs neu-input px-3 py-2 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Attendance Table Card */}
      <div className="neu-card p-6">
        {loading ? (
          <p className="text-xs text-slate-500 font-semibold py-4">Loading attendance records...</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center neu-inset font-bold">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-xs font-black uppercase text-slate-400">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-200/40 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 leading-snug">{item.employee_name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{item.employee_id} • {item.department}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-700">{item.date}</td>
                    <td className="py-3.5 px-4 text-xs font-mono font-semibold text-slate-600">{item.check_in || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-xs font-mono font-semibold text-slate-600">{item.check_out || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-3 py-0.5 text-xs font-bold ${
                          item.status === 'Present'
                            ? 'neu-badge-approved'
                            : item.status === 'Half-day'
                            ? 'neu-badge-pending'
                            : 'neu-badge-rejected'
                        }`}
                      >
                        {item.status}
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

export default AdminAttendance;
