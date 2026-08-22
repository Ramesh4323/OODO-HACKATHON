import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Clock,
  Calendar,
  CreditCard,
  Users,
  CheckSquare,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const employeeNavItems = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/employee/profile', icon: User },
    { name: 'Attendance', path: '/employee/attendance', icon: Clock },
    { name: 'Leave', path: '/employee/leave', icon: Calendar },
    { name: 'Payroll', path: '/employee/payroll', icon: CreditCard },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance', path: '/admin/attendance', icon: Clock },
    { name: 'Leaves', path: '/admin/leaves', icon: CheckSquare },
    { name: 'Payroll', path: '/admin/payroll', icon: CreditCard },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AM';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-sky-950/40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-4 left-4 z-40 h-[calc(100vh-32px)] w-64 cloud-card text-sky-950 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between p-6`}
      >
        <div className="space-y-8 overflow-y-auto">
          {/* Brand Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[#0099ff] to-[#0077ff] text-white font-black flex items-center justify-center text-xl shadow-md shadow-blue-500/30">
                D
              </div>
              <div>
                <span className="font-black text-2xl tracking-tight text-slate-900 leading-none">
                  Dayflow
                </span>
                <p className="text-[10px] font-bold text-sky-600 tracking-wider uppercase mt-0.5">WORKSPACE</p>
              </div>
            </div>

            <button onClick={onClose} className="lg:hidden text-sky-600 hover:text-sky-900 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-sky-600/70 px-3">
              MY WORKSPACE
            </p>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black transition-all duration-200 ${
                        isActive
                          ? 'cloud-button-3d text-white'
                          : 'text-slate-700 hover:bg-sky-50 hover:text-sky-600'
                      }`
                    }
                  >
                    <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0099ff] to-[#0077ff] text-white font-black flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
              {initials}
            </div>

            <div className="overflow-hidden">
              <p className="text-xs font-black text-slate-900 truncate leading-snug">{user?.name || 'Aarav Mehta'}</p>
              <p className="text-[10px] text-sky-600 truncate font-bold">
                {user?.employee_id || 'EMP001'} • {user?.role || 'Staff'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-2 px-3 cloud-button-secondary text-xs flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
