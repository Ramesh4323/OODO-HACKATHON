import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

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

  const calculatedNet =
    (parseFloat(form.basic_salary) || 0) +
    (parseFloat(form.allowances) || 0) -
    (parseFloat(form.deductions) || 0);

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
      showToast(err.response?.data?.message || 'Error processing payroll', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-neu-slide">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payroll Management</h1>
          <p className="text-xs text-slate-500 font-semibold">Calculate net salary, allowances, and issue monthly payslips</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 neu-btn-primary text-xs flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" /> Issue Payroll
        </button>
      </div>

      <div className="neu-card p-6">
        {loading ? (
          <p className="text-xs text-slate-500 font-semibold py-4">Loading payroll records...</p>
        ) : payrolls.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center neu-inset font-bold">No payroll records generated yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-xs font-black uppercase text-slate-400">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Basic Salary</th>
                  <th className="py-3 px-4">Allowances</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Salary</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 text-sm">
                {payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-200/40 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 leading-snug">{p.employee_name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{p.employee_id} • {p.department}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700 text-xs">{p.month}</td>
                    <td className="py-3.5 px-4 text-xs font-mono font-bold text-slate-700">₹{Number(p.basic_salary).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-xs font-mono font-bold text-emerald-600">+₹{Number(p.allowances).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-xs font-mono font-bold text-rose-600">-₹{Number(p.deductions).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-xs font-black text-blue-700">₹{Number(p.net_salary).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 neu-btn text-blue-600"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.employee_name, p.month)}
                          className="p-2 neu-btn text-rose-600"
                          title="Delete"
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
          <div className="neu-card max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-300/60">
              <h3 className="text-base font-black text-slate-800">
                {modalMode === 'ADD' ? 'Issue New Payroll' : 'Edit Payroll Record'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs font-semibold">
              {modalMode === 'ADD' && (
                <div>
                  <label className="block text-slate-600 mb-1">Select Employee</label>
                  <select
                    value={form.employee_id}
                    onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                    className="w-full p-2.5 neu-input"
                    required
                  >
                    {employees.map((emp) => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.name} ({emp.employee_id}) - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-600 mb-1">Payroll Month</label>
                <input
                  type="text"
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  placeholder="August 2026"
                  className="w-full p-2.5 neu-input"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Basic (₹)</label>
                  <input
                    type="number"
                    value={form.basic_salary}
                    onChange={(e) => setForm({ ...form, basic_salary: e.target.value })}
                    className="w-full p-2 neu-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Allowances (₹)</label>
                  <input
                    type="number"
                    value={form.allowances}
                    onChange={(e) => setForm({ ...form, allowances: e.target.value })}
                    className="w-full p-2 neu-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Deductions (₹)</label>
                  <input
                    type="number"
                    value={form.deductions}
                    onChange={(e) => setForm({ ...form, deductions: e.target.value })}
                    className="w-full p-2 neu-input"
                  />
                </div>
              </div>

              <div className="p-3 neu-inset flex items-center justify-between">
                <span className="font-bold text-slate-700">Calculated Net Salary:</span>
                <span className="text-base font-black text-blue-700">₹{calculatedNet.toLocaleString('en-IN')}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 neu-btn-primary text-xs font-black uppercase tracking-wider mt-2"
              >
                {modalMode === 'ADD' ? 'GENERATE PAYSLIP' : 'UPDATE PAYROLL'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayroll;
