import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Sparkles, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both your work email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email.trim(), password);
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#d0e8ff] via-[#e6f2ff] to-[#f5f9ff] p-4 md:p-8 items-center justify-center relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none animate-orb-2"></div>

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
              Plan and manage your day
            </h1>
            <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
              Create and track daily tasks, attendance, leave applications, and payslips on your workspace.
            </p>
          </div>

          <p className="text-center text-xs font-bold text-sky-600 tracking-wider uppercase pt-4">
            Dayflow HRMS • Cloud Workspace
          </p>
        </div>

        {/* Right Form Card */}
        <div className="w-full md:w-1/2 cloud-card p-8 md:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Sign in with your work account to continue.</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter work email"
                className="w-full px-4 py-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 transition"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 cloud-button-3d text-xs font-black uppercase tracking-wider mt-2 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 font-bold">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-sky-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
