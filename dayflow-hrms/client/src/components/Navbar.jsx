import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Bell, Menu, Megaphone, CheckCheck, X, Trash2 } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, showToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [todayCheckedOut, setTodayCheckedOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
      setUnreadCount(res.data.length);
    } catch (err) {
      console.error('Fetch announcements error:', err);
    }
  };

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
      fetchAnnouncements();
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

  const markAllRead = () => {
    setUnreadCount(0);
    showToast('All company updates marked as read.', 'info');
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      showToast('Announcement deleted.', 'info');
      fetchAnnouncements();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete announcement', 'error');
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

        {/* Right: Check In / Check Out button & Company Updates Bell */}
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

          {/* Bell Icon with Real-Time Dynamic Company Updates */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-11 h-11 rounded-2xl cloud-card flex items-center justify-center text-slate-700 hover:bg-sky-50 transition relative"
              title="Company Updates & Announcements"
            >
              <Bell className="w-5 h-5 text-sky-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* DYNAMIC COMPANY UPDATES DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 cloud-card p-6 shadow-2xl z-50 animate-spring space-y-4 border border-sky-200">
                <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-sky-600" />
                    <h3 className="text-sm font-black text-slate-900">Company Announcements</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="w-6 h-6 rounded-full bg-sky-50 text-slate-400 flex items-center justify-center hover:text-slate-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dynamic Updates List */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {announcements.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center font-bold">No company announcements posted yet.</p>
                  ) : (
                    announcements.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-sky-50/70 hover:bg-sky-100/60 rounded-2xl border border-sky-100 transition space-y-1.5 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900">{item.title}</span>
                          {user?.role === 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteAnnouncement(item.id)}
                              className="text-rose-500 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-rose-50 rounded-lg"
                              title="Delete announcement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-600 leading-relaxed">{item.description}</p>
                        <p className="text-[10px] font-bold text-sky-600 pt-1">
                          Posted: {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 text-center border-t border-sky-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dayflow HR Official Feed</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
