import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CreditCard, CheckCircle2, Printer, X, Shield, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EmployeePayroll = () => {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl relative pb-10">
      {/* Background Orbs */}
      <div className="fixed top-12 left-1/3 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Payroll & Payslips</h1>
        <p className="text-xs text-slate-500 font-semibold">View monthly payslips, allowances, deductions, and print official statements</p>
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

                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 pill-teal text-xs font-black rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ISSUED
                  </span>

                  <button
                    onClick={() => setSelectedSlip(payroll)}
                    className="px-4 py-1.5 cloud-button-3d text-xs uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> View / Print Slip
                  </button>
                </div>
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

      {/* OFFICIAL PRINTABLE PAYSLIP MODAL */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="cloud-card max-w-2xl w-full p-8 space-y-6 relative overflow-hidden bg-white text-slate-900">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-sky-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#70c3ff] via-[#38a5ff] to-[#0088ff] text-white flex items-center justify-center font-black shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">DAYFLOW HRMS</h2>
                  <p className="text-xs font-bold text-sky-600">Official Monthly Salary Slip • {selectedSlip.month}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSlip(null)}
                className="w-9 h-9 rounded-full bg-sky-50 text-slate-500 flex items-center justify-center hover:bg-sky-100 transition print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs font-semibold">
              <div>
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Employee Name</span>
                <p className="font-bold text-slate-900">{user?.name || 'Aarav Mehta'}</p>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Employee ID</span>
                <p className="font-mono font-bold text-slate-900">{user?.employee_id || 'EMP001'}</p>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Department</span>
                <p className="font-bold text-slate-900">{user?.employee?.department || 'General Staff'}</p>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Pay Period</span>
                <p className="font-bold text-slate-900">{selectedSlip.month}</p>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="border border-sky-100 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-sky-100/60 font-black text-sky-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Earnings / Deductions</th>
                    <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100 font-semibold">
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">Basic Salary</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold">₹{Number(selectedSlip.basic_salary).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-emerald-700">Allowances & Bonuses</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">+ ₹{Number(selectedSlip.allowances).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-rose-700">Tax & Statutory Deductions</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">- ₹{Number(selectedSlip.deductions).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-sky-50 font-black text-slate-900">
                    <td className="py-3 px-4 text-sm font-black">Total Net Payout</td>
                    <td className="py-3 px-4 text-right text-base font-black text-sky-600 font-mono">₹{Number(selectedSlip.net_salary).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Seal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-sky-100 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Shield className="w-4 h-4" /> System Verified Digital Record
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">Dayflow HR Operations</p>
                <p className="text-[10px] text-slate-400">Automated Seal</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 print:hidden">
              <button
                onClick={() => setSelectedSlip(null)}
                className="w-1/2 py-3 cloud-button-secondary text-xs uppercase tracking-wider"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="w-1/2 py-3 cloud-button-3d text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePayroll;
