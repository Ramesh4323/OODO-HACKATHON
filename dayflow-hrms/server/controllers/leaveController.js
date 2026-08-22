const db = require('../config/db');

// Employee: Create Leave Request
exports.createLeave = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const { leave_type, start_date, end_date, reason } = req.body;

    if (!leave_type || !start_date || !end_date || !reason) {
      return res.status(400).json({ message: 'All fields (Leave Type, Start Date, End Date, Reason) are required.' });
    }

    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({ message: 'End date cannot be before start date.' });
    }

    const validTypes = ['Paid', 'Sick', 'Unpaid'];
    if (!validTypes.includes(leave_type)) {
      return res.status(400).json({ message: 'Invalid leave type. Must be Paid, Sick, or Unpaid.' });
    }

    await db.execute(
      `INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [employeeId, leave_type, start_date, end_date, reason]
    );

    return res.status(201).json({ message: 'Leave request submitted successfully.' });
  } catch (err) {
    console.error('Create leave error:', err);
    return res.status(500).json({ message: 'Server error creating leave request.' });
  }
};

// Employee: View Own Leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const [rows] = await db.execute(
      'SELECT * FROM leaves WHERE employee_id = ? ORDER BY created_at DESC',
      [employeeId]
    );
    return res.json(rows);
  } catch (err) {
    console.error('Get my leaves error:', err);
    return res.status(500).json({ message: 'Error fetching leave requests.' });
  }
};

// Admin: View All Leaves
exports.getAllLeaves = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT l.*, e.name as employee_name, e.department, e.designation
      FROM leaves l
      JOIN employees e ON l.employee_id = e.employee_id
      ORDER BY l.created_at DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.error('Get all leaves error:', err);
    return res.status(500).json({ message: 'Error fetching all leave requests.' });
  }
};

// Admin: Approve Leave
exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_comment } = req.body;

    const [rows] = await db.execute('SELECT * FROM leaves WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    await db.execute(
      `UPDATE leaves SET status = 'Approved', admin_comment = ? WHERE id = ?`,
      [admin_comment || 'Approved by Admin', id]
    );

    return res.json({ message: 'Leave approved successfully.' });
  } catch (err) {
    console.error('Approve leave error:', err);
    return res.status(500).json({ message: 'Error approving leave request.' });
  }
};

// Admin: Reject Leave
exports.rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_comment } = req.body;

    const [rows] = await db.execute('SELECT * FROM leaves WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    await db.execute(
      `UPDATE leaves SET status = 'Rejected', admin_comment = ? WHERE id = ?`,
      [admin_comment || 'Rejected by Admin', id]
    );

    return res.json({ message: 'Leave rejected.' });
  } catch (err) {
    console.error('Reject leave error:', err);
    return res.status(500).json({ message: 'Error rejecting leave request.' });
  }
};
