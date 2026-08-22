import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { UserPlus, Search, Edit2, Trash2, Eye, X, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, ShieldCheck, Award } from 'lucide-react';

const AdminEmployees = () => {
  const { showToast } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('ADD');
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [form, setForm] = useState({
    employee_id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    joining_date: new Date().toISOString().split('T')[0],
    salary: '40000',
    role: 'EMPLOYEE'
  });

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Fetch employees error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openAddModal = () => {
    setModalMode('ADD');
    const nextNum = employees.length + 1;
    const formattedId = `EMP${String(nextNum).padStart(3, '0')}`;
    setForm({
      employee_id: formattedId,
      name: '',
      email: '',
      password: 'password123',
      phone: '',
      address: '',
      department: 'Engineering',
      designation: 'Software Engineer',
      joining_date: new Date().toISOString().split('T')[0],
      salary: '40000',
      role: 'EMPLOYEE'
    });
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setModalMode('EDIT');
    setSelectedEmp(emp);
    setForm({
      employee_id: emp.employee_id,
      name: emp.name,
      email: emp.email,
      password: '',
      phone: emp.phone || '',
      address: emp.address || '',
      department: emp.department || '',
      designation: emp.designation || '',
      joining_date: emp.joining_date || '',
      salary: emp.salary || 0,
      role: emp.role || 'EMPLOYEE'
    });
    setShowModal(true);
  };

  const openViewModal = (emp) => {
    setModalMode('VIEW');
    setSelectedEmp(emp);
    setShowModal(true);
  };

  const handleDelete = async (empId, name) => {
    if (!window.confirm(`Are you sure you want to delete employee "${name}" (${empId})?`)) return;

    try {
      await api.delete(`/employees/${empId}`);
      showToast(`Employee ${name} deleted.`, 'success');
      fetchEmployees();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete employee', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'ADD') {
        await api.post('/employees', form);
        showToast('Employee created successfully!', 'success');
      } else if (modalMode === 'EDIT') {
        await api.put(`/employees/${selectedEmp.employee_id}`, form);
        showToast('Employee updated successfully!', 'success');
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving employee', 'error');
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative pb-10">
      {/* Background Orbs */}
      <div className="fixed top-12 right-1/4 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-xs text-slate-500 font-semibold">View complete employee details, roles, salaries & performance ranks</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3 cloud-button-3d text-xs uppercase tracking-wider flex items-center gap-1.5 self-start"
        >
          <UserPlus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Search Input */}
      <div className="cloud-card p-4 flex items-center gap-3 relative z-10">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search employee by name, ID, or department..."
          className="w-full text-xs bg-transparent border-none focus:outline-none font-semibold text-slate-800"
        />
      </div>

      {/* Employees Table Card */}
      <div className="cloud-card p-6 md:p-8 relative z-10">
        {loading ? (
          <p className="text-xs text-sky-600 font-semibold py-4">Loading employees...</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center font-bold">No employees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-xs font-black uppercase text-sky-600/70">
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Name & Email</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Base Salary</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-sm">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-sky-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600 text-xs">{emp.employee_id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 leading-snug">{emp.name}</p>
                      <p className="text-xs text-slate-500 font-semibold">{emp.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-800">{emp.department || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">{emp.designation || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-xs font-black text-emerald-700">
                      ₹{Number(emp.salary || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(emp)}
                          className="p-2 rounded-xl cloud-card text-sky-600 hover:bg-sky-100 transition"
                          title="View Full Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-2 rounded-xl cloud-card text-blue-600 hover:bg-blue-50 transition"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.employee_id, emp.name)}
                          className="p-2 rounded-xl cloud-card text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Employee"
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
          <div className="cloud-card max-w-xl w-full p-8 space-y-6 animate-spring relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-sky-100">
              <h3 className="text-lg font-black text-slate-900">
                {modalMode === 'ADD' && 'Add New Employee'}
                {modalMode === 'EDIT' && `Edit Employee: ${selectedEmp?.name}`}
                {modalMode === 'VIEW' && `Full Profile Details: ${selectedEmp?.name}`}
              </h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalMode === 'VIEW' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-sky-50/80 rounded-2xl border border-sky-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0099ff] to-[#0077ff] text-white font-black flex items-center justify-center text-lg shadow-md">
                    {selectedEmp?.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">{selectedEmp?.name}</h4>
                    <p className="text-xs font-bold text-sky-600">ID: {selectedEmp?.employee_id} • {selectedEmp?.role || 'EMPLOYEE'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                  <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
                    <span className="text-[10px] font-black uppercase text-sky-600">Email</span>
                    <p className="font-bold text-slate-900 truncate mt-0.5">{selectedEmp?.email}</p>
                  </div>

                  <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
                    <span className="text-[10px] font-black uppercase text-sky-600">Phone</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedEmp?.phone || 'N/A'}</p>
                  </div>

                  <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
                    <span className="text-[10px] font-black uppercase text-sky-600">Department</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedEmp?.department || 'N/A'}</p>
                  </div>

                  <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
                    <span className="text-[10px] font-black uppercase text-sky-600">Designation</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedEmp?.designation || 'N/A'}</p>
                  </div>

                  <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
                    <span className="text-[10px] font-black uppercase text-sky-600">Base Salary</span>
                    <p className="font-extrabold text-emerald-700 mt-0.5">₹{Number(selectedEmp?.salary || 0).toLocaleString('en-IN')}</p>
                  </div>

                  <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
                    <span className="text-[10px] font-black uppercase text-sky-600">Joining Date</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedEmp?.joining_date || 'N/A'}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
                  <span className="text-[10px] font-black uppercase text-sky-600">Residential Address</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedEmp?.address || 'No residential address recorded.'}</p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 cloud-button-secondary text-xs uppercase tracking-wider"
                >
                  Close Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={form.employee_id}
                      onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                      disabled={modalMode === 'EDIT'}
                      className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Role</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold"
                    >
                      <option value="EMPLOYEE">EMPLOYEE</option>
                      <option value="ADMIN">ADMIN / HR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold"
                      required
                    />
                  </div>
                </div>

                {modalMode === 'ADD' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Initial Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Department</label>
                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Designation</label>
                    <input
                      type="text"
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Salary (₹)</label>
                    <input
                      type="number"
                      value={form.salary}
                      onChange={(e) => setForm({ ...form, salary: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Joining Date</label>
                    <input
                      type="date"
                      value={form.joining_date}
                      onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 cloud-button-3d text-xs font-black uppercase tracking-wider mt-2"
                >
                  {modalMode === 'ADD' ? 'CREATE EMPLOYEE' : 'SAVE CHANGES'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;
