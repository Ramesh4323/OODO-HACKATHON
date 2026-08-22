import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';

const EmployeePayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await api.get('/payroll/my');
        setPayrolls(res.data);
      } catch (err) {
        console.error('Fetch payroll error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl relative pb-10">
      {/* Background Orbs */}
      <div className="fixed top-12 left-1/3 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Payroll & Payslips</h1>
        <p className="text-xs text-slate-500 font-semibold">View monthly payslips, allowances, deductions, and net payouts</p>
      </div>

      {loading ? (
        <p className="text-xs text-sky-600 font-semibold py-6">Loading salary records...</p>
      ) : payrolls.length === 0 ? (
        <div className="cloud-card p-10 text-center relative z-10">
          <CreditCard className="w-12 h-12 text-sky-400 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-900">No payroll records found</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Payslips will appear here once issued by HR.</p>
        </div>
      ) : (
        <div className="space-y-5 relative z-10">
          {payrolls.map((payroll) => (
            <div key={payroll.id} className="cloud-card p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 pill-purple rounded-2xl flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5 text-[#5b46e5]" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">{payroll.month}</h2>
                    <p className="text-[11px] text-slate-500 font-bold">Verified Payslip</p>
                  </div>
                </div>

                <span className="px-4 py-1.5 pill-teal text-xs font-black rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ISSUED
                </span>
              </div>

              {/* Salary Breakdown Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-sky-50/60 rounded-2xl border border-sky-100">
                <div>
                  <p className="text-[11px] font-black text-sky-600/80 uppercase tracking-wider">Basic Salary</p>
                  <p className="text-base font-black text-slate-900 mt-1">₹{Number(payroll.basic_salary).toLocaleString('en-IN')}</p>
                </div>

                <div>
                  <p className="text-[11px] font-black text-sky-600/80 uppercase tracking-wider">Allowances</p>
                  <p className="text-base font-black text-emerald-600 mt-1">+ ₹{Number(payroll.allowances).toLocaleString('en-IN')}</p>
                </div>

                <div>
                  <p className="text-[11px] font-black text-sky-600/80 uppercase tracking-wider">Deductions</p>
                  <p className="text-base font-black text-rose-600 mt-1">- ₹{Number(payroll.deductions).toLocaleString('en-IN')}</p>
                </div>

                <div>
                  <p className="text-[11px] font-black text-sky-600 uppercase tracking-wider">Net Payout</p>
                  <p className="text-lg font-black text-sky-600 mt-0.5">₹{Number(payroll.net_salary).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-semibold italic text-right">
                Formula: Net Payout = Basic Salary + Allowances - Deductions
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeePayroll;
