import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { UserPlus, Search, Edit2, Trash2, Eye, X } from 'lucide-react';

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
    <div className="space-y-6 animate-neu-slide">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Employee Directory</h1>
          <p className="text-xs text-slate-500 font-semibold">Manage employee accounts, roles, departments, and salaries</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 neu-btn-primary text-xs flex items-center gap-1.5 self-start"
        >
          <UserPlus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Search Input */}
      <div className="neu-card p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, ID, or department..."
          className="w-full text-xs bg-transparent border-none focus:outline-none font-semibold text-slate-800"
        />
      </div>

      {/* Employees Table Card */}
      <div className="neu-card p-6">
        {loading ? (
          <p className="text-xs text-slate-500 font-semibold py-4">Loading employees...</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center neu-inset font-bold">No employees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-xs font-black uppercase text-slate-400">
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Name & Email</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Salary</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 text-sm">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-200/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 text-xs">{emp.employee_id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 leading-snug">{emp.name}</p>
                      <p className="text-xs text-slate-500 font-semibold">{emp.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-700">{emp.department || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">{emp.designation || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-xs font-black text-emerald-700">
                      ₹{Number(emp.salary || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(emp)}
                          className="p-2 neu-btn text-slate-700"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-2 neu-btn text-blue-600"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.employee_id, emp.name)}
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
          <div className="neu-card max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-300/60">
              <h3 className="text-base font-black text-slate-800">
                {modalMode === 'ADD' && 'Add New Employee'}
                {modalMode === 'EDIT' && `Edit Employee: ${selectedEmp?.name}`}
                {modalMode === 'VIEW' && `Employee Details: ${selectedEmp?.name}`}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalMode === 'VIEW' ? (
              <div className="space-y-3 text-xs font-semibold text-slate-700">
                <p><strong>Employee ID:</strong> {selectedEmp?.employee_id}</p>
                <p><strong>Name:</strong> {selectedEmp?.name}</p>
                <p><strong>Email:</strong> {selectedEmp?.email}</p>
                <p><strong>Phone:</strong> {selectedEmp?.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedEmp?.address || 'N/A'}</p>
                <p><strong>Department:</strong> {selectedEmp?.department}</p>
                <p><strong>Designation:</strong> {selectedEmp?.designation}</p>
                <p><strong>Salary:</strong> ₹{Number(selectedEmp?.salary).toLocaleString('en-IN')}</p>
                <p><strong>Role:</strong> {selectedEmp?.role}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={form.employee_id}
                      onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                      disabled={modalMode === 'EDIT'}
                      className="w-full p-2.5 neu-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Role</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full p-2.5 neu-input"
                    >
                      <option value="EMPLOYEE">EMPLOYEE</option>
                      <option value="ADMIN">ADMIN / HR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-2.5 neu-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full p-2.5 neu-input"
                      required
                    />
                  </div>
                </div>

                {modalMode === 'ADD' && (
                  <div>
                    <label className="block text-slate-600 mb-1">Initial Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full p-2.5 neu-input"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Department</label>
                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full p-2.5 neu-input"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Designation</label>
                    <input
                      type="text"
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                      className="w-full p-2.5 neu-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Salary (₹)</label>
                    <input
                      type="number"
                      value={form.salary}
                      onChange={(e) => setForm({ ...form, salary: e.target.value })}
                      className="w-full p-2.5 neu-input"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Joining Date</label>
                    <input
                      type="date"
                      value={form.joining_date}
                      onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
                      className="w-full p-2.5 neu-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 neu-btn-primary text-xs font-black uppercase tracking-wider mt-2"
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
