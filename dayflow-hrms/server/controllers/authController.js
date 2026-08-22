const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration
exports.register = async (req, res) => {
  try {
    const { employee_id, name, email, password, role } = req.body;

    if (!employee_id || !name || !email || !password) {
      return res.status(400).json({ message: 'All required fields (Employee ID, Name, Email, Password) must be provided.' });
    }

    const userRole = role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE';

    // Check existing email or employee_id
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ? OR employee_id = ?',
      [email, employee_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'User with this Email or Employee ID already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.execute(
      'INSERT INTO users (employee_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [employee_id, name, email, hashedPassword, userRole]
    );

    // Create corresponding employee profile
    await db.execute(
      'INSERT INTO employees (employee_id, name, email, department, designation, salary) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, name, email, 'General', 'Staff Member', 30000.00]
    );

    return res.status(201).json({
      message: 'Registration successful! You can now log in.'
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      id: user.id,
      userId: user.id,
      employeeId: user.employee_id,
      role: user.role,
      name: user.name,
      email: user.email
    };

    const secret = process.env.JWT_SECRET || 'dayflow_super_secret_jwt_key_2026';
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        employee_id: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

// Get current user details
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, employee_id, name, email, role, created_at FROM users WHERE employee_id = ?',
      [req.user.employeeId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];

    const [empRows] = await db.execute(
      'SELECT * FROM employees WHERE employee_id = ?',
      [req.user.employeeId]
    );

    const employeeProfile = empRows.length > 0 ? empRows[0] : null;

    return res.json({
      user,
      employee: employeeProfile
    });
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ message: 'Server error fetching user details.' });
  }
};
