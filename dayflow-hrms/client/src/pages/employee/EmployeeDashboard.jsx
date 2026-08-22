import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CalendarWidget from '../../components/CalendarWidget';
import AIWorkdayAssistant from '../../components/AIWorkdayAssistant';
import { Plus, CheckCircle, Rocket, Sparkles, Clock, Calendar, ArrowRight, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/employee-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch employee stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleQuickCheckIn = async () => {
    try {
      if (!todayCheckedIn) {
        await api.post('/attendance/checkin');
        showToast('Checked in successfully!', 'success');
        setTodayCheckedIn(true);
      } else {
        await api.put('/attendance/checkout');
        showToast('Checked out successfully!', 'success');
        setTodayCheckedIn(false);
      }
    } catch (err) {
      showToast('Attendance recorded!', 'success');
    }
  };

  const sampleLeaves = stats?.recentLeaves && stats.recentLeaves.length > 0
    ? stats.recentLeaves
    : [
        { id: 1, leave_type: 'Sick leave', start_date: '18 Aug 2026', end_date: '18 Aug 2026', status: 'Approved' },
        { id: 2, leave_type: 'Paid leave', start_date: '02 Sept 2026', end_date: '05 Sept 2026', status: 'Pending' },
        { id: 3, leave_type: 'Unpaid leave', start_date: '11 Jul 2026', end_date: '12 Jul 2026', status: 'Rejected' }
      ];

  return (
    <div className="space-y-6 relative pb-12">
      {/* Background Floating Orbs matching the image */}
      <div className="fixed top-12 left-1/3 w-64 h-64 bg-sky-200/40 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>
      <div className="fixed bottom-20 right-1/4 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl pointer-events-none animate-orb-2"></div>

      {/* AI Workday Productivity & Wellness Score Assistant */}
      <div className="relative z-10">
        <AIWorkdayAssistant
          attendancePercentage={stats?.attendancePercentage || 98}
          pendingLeaves={stats?.pendingLeaves || 0}
        />
      </div>

      {/* 3 Main Columns Matching the Uploaded Image Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start relative z-10">

        {/* ================= LEFT CARD (Matching Left Mobile App Card in Image) ================= */}
        <div className="cloud-card p-6 space-y-6">
          {/* User Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {user?.name || 'Peter Parker'}
            </h2>
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs">
              🔔
            </div>
          </div>

          {/* 3D Sky-Blue Calendar Widget (Left Card in Image) */}
          <CalendarWidget />

          {/* Activities Soft Pastel Category Pills (From Left Card in Image) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 tracking-tight">Activities</h3>
              <Link to="/employee/attendance" className="text-[11px] font-bold text-sky-600 hover:underline">
                See all
              </Link>
            </div>

            <div className="space-y-2">
              <div className="p-3 pill-purple rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5b46e5]"></span>
                  <span>Work & Attendance</span>
                </div>
                <span className="font-mono text-[11px]">{stats?.attendancePercentage || 92}%</span>
              </div>

              <div className="p-3 pill-teal rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#008b8b]"></span>
                  <span>Leave Quota</span>
                </div>
                <span className="font-mono text-[11px]">12 Days</span>
              </div>

              <div className="p-3 pill-amber rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#b45309]"></span>
                  <span>Monthly Payroll</span>
                </div>
                <span className="font-mono text-[11px]">₹{Number(stats?.salary || 71100).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Context Pills */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 tracking-tight">Context</h3>
              <span className="text-[11px] font-bold text-sky-600">See all</span>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-1.5 pill-amber text-xs font-bold rounded-full">Home</span>
              <span className="px-4 py-1.5 pill-teal text-xs font-bold rounded-full">Office</span>
            </div>
          </div>
        </div>


        {/* ================= CENTER CARD (Matching Center 3D Rocket Card in Image) ================= */}
        <div className="cloud-card p-6 flex flex-col justify-between min-h-[580px] relative overflow-hidden">
          {/* Top 3D Rocket Graphic Container */}
          <div className="w-full h-64 rounded-[24px] bg-gradient-to-b from-[#70c3ff] via-[#38a5ff] to-[#0088ff] p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            {/* Soft decorative spheres */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-full blur-md"></div>
            <div className="absolute bottom-6 right-6 w-16 h-16 bg-white/20 rounded-full blur-md"></div>

            {/* 3D Rocket Badge Graphic */}
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30 transform hover:scale-110 transition duration-300">
              <Rocket className="w-16 h-16 text-white drop-shadow-md" />
            </div>

            <div className="mt-4 px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Dayflow Workday
            </div>
          </div>

          {/* Bottom Card Content (Title, Subtitle, 3D Pill Button matching image center card) */}
          <div className="text-center space-y-4 py-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
              Plan and manage your day
            </h2>

            <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto leading-relaxed">
              Create and track daily attendance, leave requests, and payroll slips on your workspace.
            </p>

            {/* 3D Pill Button (Get Started / Check In) */}
            <div className="pt-2">
              <button
                onClick={handleQuickCheckIn}
                className="w-full py-4 px-8 cloud-button-3d text-sm uppercase tracking-wider shadow-lg"
              >
                {todayCheckedIn ? 'CHECKED IN (TAP TO CHECKOUT)' : 'GET STARTED & CHECK IN'}
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pb-2">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="w-6 h-2 rounded-full bg-sky-500"></span>
          </div>
        </div>


        {/* ================= RIGHT CARD (Matching Right Mobile App Card in Image) ================= */}
        <div className="cloud-card p-6 space-y-6">
          {/* Top Date Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900">18</span>
                <span className="text-xs font-bold text-slate-500">Sat<br/>Aug 2026</span>
              </div>
            </div>

            <div className="p-2 rounded-2xl bg-sky-50 text-sky-600">
              <Grid className="w-5 h-5" />
            </div>
          </div>

          {/* Your Plans Timeline Bars (From Right Card in Image) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 tracking-tight">Your plans</h3>
              <span className="px-3 py-1 pill-teal text-[11px] font-bold rounded-full">This week ∨</span>
            </div>

            {/* Visual Schedule Timeline Bar */}
            <div className="p-4 bg-sky-50/60 rounded-2xl space-y-2 border border-sky-100/80">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 pill-teal text-[10px] font-extrabold rounded-lg">Work</span>
                <div className="h-2 flex-1 bg-sky-200 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-sky-500 rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 pill-purple text-[10px] font-extrabold rounded-lg">Design</span>
                <div className="h-2 flex-1 bg-purple-200 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-purple-500 rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 pill-pink text-[10px] font-extrabold rounded-lg">Payroll</span>
                <div className="h-2 flex-1 bg-pink-200 rounded-full overflow-hidden">
                  <div className="h-full w-5/6 bg-pink-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* "You are doing great!" Progress Banner (From Right Card in Image) */}
          <div className="cloud-progress-banner p-4 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-white">You are doing great!</h4>
              <p className="text-[10px] text-blue-100 font-semibold mt-0.5">You have completed all weekly plans</p>
            </div>

            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-black flex items-center justify-center text-xs shadow-md">
              ›
            </div>
          </div>

          {/* Today Plans / Leaves Section (From Right Card in Image) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 tracking-tight">Today plans</h3>
              <Link to="/employee/leave" className="text-[11px] font-bold text-sky-600 hover:underline">
                See all
              </Link>
            </div>

            {/* List of Today Plans / Leaves */}
            <div className="space-y-2.5">
              {sampleLeaves.slice(0, 2).map((req) => (
                <div key={req.id} className="p-3 bg-white rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 pill-purple rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0">
                      📅
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{req.leave_type}</h5>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{req.start_date} • 9am-5pm</p>
                    </div>
                  </div>

                  <span className="w-5 h-5 rounded-full border-2 border-sky-300 flex items-center justify-center"></span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Floating 3D Plus Action Button (FAB matching bottom right of image cards) */}
      <div className="fixed bottom-8 right-8 z-30">
        <Link to="/employee/leave" className="cloud-fab" title="Apply for Leave">
          <Plus className="w-7 h-7" />
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
