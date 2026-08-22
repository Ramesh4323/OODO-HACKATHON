const db = require('../config/db');

// Helper to get local date string YYYY-MM-DD
function getLocalDateStr(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Check-in
exports.checkIn = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const now = new Date();
    const dateStr = getLocalDateStr(now);
    const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS

    // Check if already checked in today
    const [existing] = await db.execute(
      'SELECT id, check_in FROM attendance WHERE employee_id = ? AND date = ?',
      [employeeId, dateStr]
    );

    if (existing.length > 0 && existing[0].check_in) {
      return res.status(400).json({ message: 'Already checked in today.' });
    }

    if (existing.length > 0) {
      // Update check_in if record existed without check_in
      await db.execute(
        'UPDATE attendance SET check_in = ?, status = ? WHERE id = ?',
        [timeStr, 'Present', existing[0].id]
      );
    } else {
      // Insert new check-in record
      await db.execute(
        'INSERT INTO attendance (employee_id, date, check_in, status) VALUES (?, ?, ?, ?)',
        [employeeId, dateStr, timeStr, 'Present']
      );
    }

    return res.json({ message: 'Checked in successfully.', check_in: timeStr, date: dateStr });
  } catch (err) {
    console.error('Check-in error:', err);
    return res.status(500).json({ message: 'Server error during check-in.' });
  }
};

// Check-out
exports.checkOut = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const now = new Date();
    const dateStr = getLocalDateStr(now);
    const timeStr = now.toTimeString().split(' ')[0];

    // Find today's record
    const [existing] = await db.execute(
      'SELECT id, check_in, check_out FROM attendance WHERE employee_id = ? AND date = ?',
      [employeeId, dateStr]
    );

    if (existing.length === 0 || !existing[0].check_in) {
      return res.status(400).json({ message: 'Please check in first.' });
    }

    await db.execute(
      'UPDATE attendance SET check_out = ? WHERE id = ?',
      [timeStr, existing[0].id]
    );

    return res.json({ message: 'Checked out successfully.', check_out: timeStr });
  } catch (err) {
    console.error('Check-out error:', err);
    return res.status(500).json({ message: 'Server error during check-out.' });
  }
};

// Get today's attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const dateStr = getLocalDateStr();
    const [rows] = await db.execute(
      'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
      [employeeId, dateStr]
    );
    return res.json(rows[0] || null);
  } catch (err) {
    console.error('Get today attendance error:', err);
    return res.status(500).json({ message: 'Error fetching today attendance.' });
  }
};

// Get current employee's attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const [rows] = await db.execute(
      'SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC',
      [employeeId]
    );
    return res.json(rows);
  } catch (err) {
    console.error('Get my attendance error:', err);
    return res.status(500).json({ message: 'Error fetching attendance records.' });
  }
};

// Get all attendance (Admin Only)
exports.getAllAttendance = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.*, e.name as employee_name, e.department, e.designation
      FROM attendance a
      JOIN employees e ON a.employee_id = e.employee_id
      ORDER BY a.date DESC, a.check_in DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.error('Get all attendance error:', err);
    return res.status(500).json({ message: 'Error fetching all attendance.' });
  }
};
