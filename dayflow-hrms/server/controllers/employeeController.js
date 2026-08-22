const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all employees (Admin Only)
exports.getAllEmployees = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT e.*, u.role 
      FROM employees e
      JOIN users u ON e.employee_id = u.employee_id
      ORDER BY e.created_at DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.error('Get employees error:', err);
    return res.status(500).json({ message: 'Error fetching employees.' });
  }
};

// Get single employee by ID or Employee ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if req.user is an employee trying to read someone else's private data
    if (req.user.role !== 'ADMIN' && req.user.employeeId !== id) {
      return res.status(403).json({ message: 'Access denied to view other employee details.' });
    }

    const [rows] = await db.execute(
      `SELECT e.*, u.role 
       FROM employees e
       JOIN users u ON e.employee_id = u.employee_id
       WHERE e.employee_id = ? OR e.id = ?`,
      [id, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Get employee error:', err);
    return res.status(500).json({ message: 'Error fetching employee details.' });
  }
};

// Create new employee (Admin Only)
exports.createEmployee = async (req, res) => {
  try {
    const { employee_id, name, email, password, phone, address, department, designation, joining_date, salary, role } = req.body;

    if (!employee_id || !name || !email || !password) {
      return res.status(400).json({ message: 'Employee ID, Name, Email, and Password are required.' });
    }

    const userRole = role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE';

    // Check existing
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ? OR employee_id = ?', [email, employee_id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User with this Email or Employee ID already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.execute(
      'INSERT INTO users (employee_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [employee_id, name, email, hashedPassword, userRole]
    );

    // Insert employee
    await db.execute(
      `INSERT INTO employees (employee_id, name, email, phone, address, department, designation, joining_date, salary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, name, email, phone || '', address || '', department || 'General', designation || 'Staff', joining_date || new Date(), salary || 0.00]
    );

    return res.status(201).json({ message: 'Employee created successfully.' });
  } catch (err) {
    console.error('Create employee error:', err);
    return res.status(500).json({ message: 'Error creating employee.' });
  }
};

// Update full employee (Admin Only)
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Can be employee_id
    const { name, email, phone, address, department, designation, joining_date, salary, role } = req.body;

    const [empRows] = await db.execute('SELECT employee_id FROM employees WHERE employee_id = ? OR id = ?', [id, id]);
    if (empRows.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    const empId = empRows[0].employee_id;

    // Update employees table
    await db.execute(
      `UPDATE employees 
       SET name = ?, email = ?, phone = ?, address = ?, department = ?, designation = ?, joining_date = ?, salary = ?
       WHERE employee_id = ?`,
      [name, email, phone, address, department, designation, joining_date, salary, empId]
    );

    // Update users table (name, email, role if provided)
    if (role) {
      const userRole = role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE';
      await db.execute('UPDATE users SET name = ?, email = ?, role = ? WHERE employee_id = ?', [name, email, userRole, empId]);
    } else {
      await db.execute('UPDATE users SET name = ?, email = ? WHERE employee_id = ?', [name, email, empId]);
    }

    return res.json({ message: 'Employee updated successfully.' });
  } catch (err) {
    console.error('Update employee error:', err);
    return res.status(500).json({ message: 'Error updating employee.' });
  }
};

// Employee Limited Profile Edit
exports.updateEmployeeProfile = async (req, res) => {
  try {
    const { id } = req.params; // employee_id
    const { phone, address, profile_image } = req.body;

    // Security check: Employee can only edit their own profile unless Admin
    if (req.user.role !== 'ADMIN' && req.user.employeeId !== id) {
      return res.status(403).json({ message: 'Forbidden. You can only update your own profile.' });
    }

    const [empRows] = await db.execute('SELECT employee_id FROM employees WHERE employee_id = ? OR id = ?', [id, id]);
    if (empRows.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    const empId = empRows[0].employee_id;

    await db.execute(
      `UPDATE employees 
       SET phone = COALESCE(?, phone), 
           address = COALESCE(?, address), 
           profile_image = COALESCE(?, profile_image)
       WHERE employee_id = ?`,
      [phone, address, profile_image, empId]
    );

    return res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: 'Error updating profile.' });
  }
};

// Delete employee (Admin Only)
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [empRows] = await db.execute('SELECT employee_id FROM employees WHERE employee_id = ? OR id = ?', [id, id]);
    if (empRows.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    const empId = empRows[0].employee_id;

    // Deleting from users will cascade delete employee, attendance, leaves, payroll due to foreign key cascade
    await db.execute('DELETE FROM users WHERE employee_id = ?', [empId]);

    return res.json({ message: 'Employee deleted successfully.' });
  } catch (err) {
    console.error('Delete employee error:', err);
    return res.status(500).json({ message: 'Error deleting employee.' });
  }
};
