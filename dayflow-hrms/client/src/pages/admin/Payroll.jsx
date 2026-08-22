import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Plus, Edit2, Trash2, X, Download, DollarSign, Wallet } from 'lucide-react';

const AdminPayroll = () => {
  const { showToast } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('ADD');
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    employee_id: '',
    month: 'August 2026',
    basic_salary: '40000',
    allowances: '5000',
    deductions: '2000'
  });

  const fetchData = async () => {
    try {
      const [payRes, empRes] = await Promise.all([
        api.get('/payroll'),
        api.get('/employees')
      ]);
      setPayrolls(payRes.data);
      setEmployees(empRes.data);
      if (empRes.data.length > 0 && !form.employee_id) {
        setForm((prev) => ({ ...prev, employee_id: empRes.data[0].employee_id }));
      }
    } catch (err) {
      console.error('Fetch payroll data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportCSV = () => {
    if (payrolls.length === 0) return;
    const headers = ['Payroll ID', 'Employee ID', 'Employee Name', 'Department', 'Month', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary'];
    const rows = payrolls.map(p => [
      `"${p.id || ''}"`,
      `"${p.employee_id || ''}"`,
      `"${p.employee_name || ''}"`,
      `"${p.department || ''}"`,
      `"${p.month || ''}"`,
      `"${p.basic_salary || 0}"`,
      `"${p.allowances || 0}"`,
      `"${p.deductions || 0}"`,
      `"${p.net_salary || 0}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Dayflow_Payroll_Statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculatedNet =
    (parseFloat(form.basic_salary) || 0) +
    (parseFloat(form.allowances) || 0) -
    (parseFloat(form.deductions) || 0);

  const totalDisbursed = payrolls.reduce((acc, curr) => acc + (parseFloat(curr.net_salary) || 0), 0);

  const openAddModal = () => {
    setModalMode('ADD');
    setForm({
      employee_id: employees.length > 0 ? employees[0].employee_id : '',
      month: 'August 2026',
      basic_salary: '40000',
      allowances: '5000',
      deductions: '2000'
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setModalMode('EDIT');
    setSelectedId(p.id);
    setForm({
      employee_id: p.employee_id,
      month: p.month,
      basic_salary: p.basic_salary,
      allowances: p.allowances,
      deductions: p.deductions
    });
    setShowModal(true);
  };

  const handleDelete = async (id, empName, month) => {
    if (!window.confirm(`Are you sure you want to delete payroll record for ${empName} (${month})?`)) return;

    try {
      await api.delete(`/payroll/${id}`);
      showToast('Payroll record deleted.', 'success');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete payroll', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'ADD') {
        await api.post('/payroll', form);
        showToast('Payroll issued successfully!', 'success');
      } else {
        await api.put(`/payroll/${selectedId}`, form);
        showToast('Payroll updated successfully!', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving payroll record', 'error');
    }
  };

  return (
    <div className="space-y-6 relative pb-10">
      {/* Background Orbs */}
      <div className="fixed top-12 left-1/4 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payroll Management</h1>
          <p className="text-xs text-slate-500 font-semibold">Issue, edit, and export monthly salary slips across departments</p>
        </div>

        <div className="flex gap-3 self-start">
          <button
            onClick={exportCSV}
            disabled={payrolls.length === 0}
            className="px-5 py-3 cloud-button-secondary text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={openAddModal}
            className="px-6 py-3 cloud-button-3d text-xs uppercase tracking-wider flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Issue Payroll
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="cloud-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0099ff] to-[#0077ff] text-white flex items-center justify-center shadow-md">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Total Salary Disbursed</span>
            <h2 className="text-2xl font-black text-slate-900">₹{totalDisbursed.toLocaleString('en-IN')}</h2>
          </div>
        </div>

        <div className="px-4 py-2 pill-teal rounded-full text-xs font-black">
          {payrolls.length} Payroll Records Issued
        </div>
      </div>

      {/* Payroll Table Card */}
      <div className="cloud-card p-6 md:p-8 relative z-10">
        {loading ? (
          <p className="text-xs text-sky-600 font-semibold py-4">Loading payroll records...</p>
        ) : payrolls.length === 0 ? (
          <div className="text-center py-10 bg-sky-50/50 rounded-2xl border border-sky-100">
            <p className="text-xs font-bold text-slate-600">No payroll records generated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-xs font-black uppercase text-sky-600/70">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Basic Salary</th>
                  <th className="py-3 px-4">Allowances</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Salary</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-xs">
                {payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-sky-50/60 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 leading-snug">{p.employee_name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{p.employee_id} • {p.department}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{p.month}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      ₹{Number(p.basic_salary).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                      +₹{Number(p.allowances).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                      -₹{Number(p.deductions).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-sky-700 text-sm">
                      ₹{Number(p.net_salary).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-xl cloud-card text-sky-600 hover:bg-sky-100 transition"
                          title="Edit Slip"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.employee_name, p.month)}
                          className="p-2 rounded-xl cloud-card text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Slip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="cloud-card max-w-lg w-full p-8 space-y-6 animate-spring relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-sky-100">
              <h3 className="text-lg font-black text-slate-900">
                {modalMode === 'ADD' ? 'Issue Payroll Slip' : 'Edit Payroll Record'}
              </h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Employee</label>
                <select
                  value={form.employee_id}
                  onChange={(e) => {
                    const emp = employees.find(x => x.employee_id === e.target.value);
                    setForm({
                      ...form,
                      employee_id: e.target.value,
                      basic_salary: emp ? emp.salary : form.basic_salary
                    });
                  }}
                  disabled={modalMode === 'EDIT'}
                  className="w-full p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {employees.map((e) => (
                    <option key={e.employee_id} value={e.employee_id}>
                      {e.name} ({e.employee_id}) - {e.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pay Period / Month</label>
                <input
                  type="text"
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  placeholder="e.g. August 2026"
                  className="w-full p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Basic (₹)</label>
                  <input
                    type="number"
                    value={form.basic_salary}
                    onChange={(e) => setForm({ ...form, basic_salary: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Allowances</label>
                  <input
                    type="number"
                    value={form.allowances}
                    onChange={(e) => setForm({ ...form, allowances: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Deductions</label>
                  <input
                    type="number"
                    value={form.deductions}
                    onChange={(e) => setForm({ ...form, deductions: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 pill-teal rounded-2xl flex items-center justify-between text-xs">
                <span className="font-extrabold text-emerald-900">Calculated Net Salary:</span>
                <span className="text-base font-black text-emerald-900">₹{calculatedNet.toLocaleString('en-IN')}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 cloud-button-3d text-xs font-black uppercase tracking-wider mt-2"
              >
                {modalMode === 'ADD' ? 'GENERATE SLIP' : 'SAVE PAYROLL'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayroll;
