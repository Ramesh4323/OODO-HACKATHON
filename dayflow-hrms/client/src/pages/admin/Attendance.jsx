import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Search, Download, Clock, UserCheck } from 'lucide-react';

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

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['Date', 'Employee ID', 'Employee Name', 'Department', 'Check In', 'Check Out', 'Status'];
    const rows = filtered.map(item => [
      `"${item.date || ''}"`,
      `"${item.employee_id || ''}"`,
      `"${item.employee_name || ''}"`,
      `"${item.department || ''}"`,
      `"${item.check_in || 'N/A'}"`,
      `"${item.check_out || 'N/A'}"`,
      `"${item.status || 'Present'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Dayflow_Attendance_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = attendance.filter((item) => {
    const matchesSearch =
      item.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = dateFilter ? item.date === dateFilter : true;
    if (viewMode === 'TODAY') {
      const d = new Date();
      const todayStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      matchesDate = matchesDate && item.date === todayStr;
    } else if (viewMode === 'WEEK') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesDate = matchesDate && new Date(item.date) >= sevenDaysAgo;
    }
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 relative pb-10">
      {/* Background Orbs */}
      <div className="fixed top-12 left-1/4 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organization Attendance Log</h1>
          <p className="text-xs text-slate-500 font-semibold">Monitor real-time check-in and check-out logs across all employees</p>
        </div>

        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="px-6 py-3 cloud-button-3d text-xs uppercase tracking-wider flex items-center gap-2 self-start disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Filters Card */}
      <div className="cloud-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center p-1 bg-sky-50/80 rounded-2xl border border-sky-100 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setViewMode('TODAY')}
            className={`px-4 py-2 rounded-xl transition ${
              viewMode === 'TODAY' ? 'cloud-button-3d text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode('WEEK')}
            className={`px-4 py-2 rounded-xl transition ${
              viewMode === 'WEEK' ? 'cloud-button-3d text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setViewMode('ALL')}
            className={`px-4 py-2 rounded-xl transition ${
              viewMode === 'ALL' ? 'cloud-button-3d text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Logs
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-50/60 border border-sky-100 w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employee or department..."
              className="text-xs bg-transparent border-none focus:outline-none w-full font-semibold text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs px-3.5 py-2.5 rounded-2xl bg-sky-50/60 border border-sky-100 font-semibold text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Attendance Table Card */}
      <div className="cloud-card p-6 md:p-8 relative z-10">
        {loading ? (
          <p className="text-xs text-sky-600 font-semibold py-4">Loading attendance logs...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 bg-sky-50/50 rounded-2xl border border-sky-100">
            <p className="text-xs font-bold text-slate-600">No attendance logs found matching filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-xs font-black uppercase text-sky-600/70">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-xs">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-sky-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{item.date}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 leading-snug">{item.employee_name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{item.employee_id}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{item.department || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700">
                      {item.check_in ? item.check_in : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-600">
                      {item.check_out ? item.check_out : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-3.5 py-1 text-xs font-black rounded-full ${
                          item.status === 'Present'
                            ? 'pill-teal'
                            : item.status === 'Half-day'
                            ? 'pill-amber'
                            : 'pill-pink'
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
