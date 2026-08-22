import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Phone, MapPin, Briefcase, Calendar, DollarSign, Edit3, Save, Sparkles, ShieldCheck } from 'lucide-react';

const EmployeeProfile = () => {
  const { user, showToast } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    profile_image: ''
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      const emp = res.data.employee || {};
      setProfile(emp);
      setFormData({
        phone: emp.phone || '',
        address: emp.address || '',
        profile_image: emp.profile_image || ''
      });
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/employees/profile/${user.employee_id}`, formData);
      showToast('Profile updated successfully!', 'success');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-xs font-bold text-sky-600 py-6">Loading profile data...</p>;
  }

  return (
    <div className="max-w-4xl space-y-6 relative pb-10">
      {/* Background Orbs */}
      <div className="fixed top-12 right-1/4 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>

      {/* Header Card (3D Cloud Style) */}
      <div className="cloud-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#0099ff] to-[#0077ff] text-white font-black flex items-center justify-center text-3xl overflow-hidden flex-shrink-0 shadow-lg shadow-blue-500/30 border-4 border-white">
          {formData.profile_image ? (
            <img src={formData.profile_image} alt={user?.name} className="w-full h-full object-cover" />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 pill-teal text-[11px] font-extrabold rounded-full mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Employee Profile
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{profile?.name || user?.name}</h1>
          <p className="text-xs font-bold text-sky-600 mt-0.5">{profile?.designation} • {profile?.department}</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Employee ID: <span className="font-mono font-bold text-slate-900">{user?.employee_id}</span></p>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-6 py-3 cloud-button-3d text-xs uppercase tracking-wider"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <button
            onClick={() => setEditing(false)}
            className="px-6 py-3 cloud-button-secondary text-xs uppercase tracking-wider"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Personal Info Card */}
        <div className="cloud-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-sky-100">
            <User className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-black text-slate-900">Personal Information</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={profile?.name || user?.name || ''}
                disabled
                className="w-full px-4 py-3 rounded-2xl bg-sky-50/50 border border-sky-100 text-sm font-bold text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                value={profile?.email || user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-2xl bg-sky-50/50 border border-sky-100 text-sm font-bold text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Phone Number {editing && <span className="text-sky-600 text-[10px] lowercase">(editable)</span>}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Residential Address {editing && <span className="text-sky-600 text-[10px] lowercase">(editable)</span>}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!editing}
                  rows="3"
                  placeholder="Enter full residential address"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>

            {editing && (
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 cloud-button-3d text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            )}
          </form>
        </div>

        {/* Job Information Card */}
        <div className="cloud-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-sky-100">
            <Briefcase className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-black text-slate-900">Job Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Department</label>
              <div className="p-3.5 pill-purple rounded-2xl text-xs font-bold flex items-center justify-between">
                <span>{profile?.department || 'Engineering'}</span>
                <span className="text-[10px] uppercase font-black tracking-wider">ACTIVE</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Designation</label>
              <div className="p-3.5 pill-teal rounded-2xl text-xs font-bold">
                {profile?.designation || 'Software Engineer'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Joining Date</label>
              <div className="p-3.5 bg-sky-50 rounded-2xl text-xs font-bold text-slate-800 flex items-center gap-2 border border-sky-100">
                <Calendar className="w-4 h-4 text-sky-600" />
                {profile?.joining_date ? profile.joining_date : 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Monthly Base Salary</label>
              <div className="p-3.5 pill-emerald rounded-2xl text-sm font-black flex items-center gap-1">
                <DollarSign className="w-4.5 h-4.5 text-emerald-600" />
                ₹{Number(profile?.salary || 71100).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
