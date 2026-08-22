import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Sparkles, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.employee_id || !formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#d0e8ff] via-[#e6f2ff] to-[#f5f9ff] p-4 md:p-8 items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 relative z-10">

        {/* Left Hero Card */}
        <div className="w-full md:w-1/2 cloud-card p-8 md:p-12 flex flex-col justify-between min-h-[500px]">
          <div className="w-full h-56 rounded-[24px] bg-gradient-to-b from-[#70c3ff] via-[#38a5ff] to-[#0088ff] p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30 transform hover:scale-110 transition duration-300">
              <Rocket className="w-14 h-14 text-white drop-shadow-md" />
            </div>

            <div className="mt-4 px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Dayflow Workday
            </div>
          </div>

          <div className="space-y-4 pt-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Create your workspace profile
            </h1>
            <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
              Get started with instant attendance tracking, leave applications, and transparent salary management.
            </p>
          </div>

          <p className="text-center text-xs font-bold text-sky-600 tracking-wider uppercase pt-4">
            Dayflow HRMS • 3D Sky-Blue Workspace
          </p>
        </div>

        {/* Right Form Card */}
        <div className="w-full md:w-1/2 cloud-card p-8 md:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create an account</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Register to access your workspace dashboard.</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-bold">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-sky-50 border border-sky-200 text-sky-700 text-xs rounded-2xl font-bold">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                placeholder="EMP001"
                className="w-full px-4 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Work Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter work email"
                className="w-full px-4 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 transition"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">HR Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 cloud-button-3d text-xs font-black uppercase tracking-wider mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 font-bold">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-sky-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
