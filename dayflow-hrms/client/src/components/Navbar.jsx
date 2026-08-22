import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Bell, Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, showToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [todayCheckedOut, setTodayCheckedOut] = useState(false);

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const checkTodayStatus = async () => {
    try {
      const res = await api.get('/attendance/today');
      if (res.data) {
        if (res.data.check_in) setTodayCheckedIn(true);
        if (res.data.check_out) setTodayCheckedOut(true);
      }
    } catch (err) {
      console.error('Check today status error:', err);
    }
  };

  useEffect(() => {
    if (user) {
      checkTodayStatus();
    }
  }, [user]);

  const handleQuickCheckIn = async () => {
    setLoading(true);
    try {
      if (!todayCheckedIn) {
        try {
          const res = await api.post('/attendance/checkin');
          showToast(res.data.message || 'Checked in successfully!', 'success');
          setTodayCheckedIn(true);
          setTodayCheckedOut(false);
        } catch (err) {
          const msg = err.response?.data?.message || '';
          if (msg.includes('Already checked in')) {
            setTodayCheckedIn(true);
            // Now attempt checkout if already checked in
            const res = await api.put('/attendance/checkout');
            showToast(res.data.message || 'Checked out successfully!', 'success');
            setTodayCheckedOut(true);
          } else {
            showToast(msg || 'Check in failed', 'error');
          }
        }
      } else if (!todayCheckedOut) {
        const res = await api.put('/attendance/checkout');
        showToast(res.data.message || 'Checked out successfully!', 'success');
        setTodayCheckedOut(true);
      } else {
        showToast('You have already completed your shift today.', 'info');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Check out failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-transparent px-4 sm:px-6 md:px-8 py-5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Greeting & Date */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2.5 rounded-2xl cloud-card focus:outline-none"
          >
            <Menu className="w-5 h-5 text-sky-800" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Good morning, {firstName}
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Right: Check In / Check Out button & Notification Bell */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleQuickCheckIn}
            disabled={loading || todayCheckedOut}
            className={`px-6 py-2.5 cloud-button-3d text-xs font-black uppercase tracking-wider ${
              todayCheckedOut ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading
              ? 'Processing...'
              : todayCheckedOut
              ? 'Shift Completed'
              : todayCheckedIn
              ? 'Check out'
              : 'Check in'}
          </button>

          {/* Bell Icon in Cloud Card */}
          <div className="relative">
            <button className="w-11 h-11 rounded-2xl cloud-card flex items-center justify-center text-slate-700 hover:bg-sky-50 transition">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-slate-900 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              3
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
