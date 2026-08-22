const db = require('../config/db');

// Employee: View Own Payroll
exports.getMyPayroll = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const [rows] = await db.execute(
      'SELECT * FROM payroll WHERE employee_id = ? ORDER BY created_at DESC',
      [employeeId]
    );
    return res.json(rows);
  } catch (err) {
    console.error('Get my payroll error:', err);
    return res.status(500).json({ message: 'Error fetching payroll history.' });
  }
};

// Admin: View All Payroll Records
exports.getAllPayroll = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, e.name as employee_name, e.department, e.designation
      FROM payroll p
      JOIN employees e ON p.employee_id = e.employee_id
      ORDER BY p.created_at DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.error('Get all payroll error:', err);
    return res.status(500).json({ message: 'Error fetching payroll records.' });
  }
};

// Admin: Create Payroll Record
exports.createPayroll = async (req, res) => {
  try {
    const { employee_id, month, basic_salary, allowances, deductions } = req.body;

    if (!employee_id || !month) {
      return res.status(400).json({ message: 'Employee ID and Month are required.' });
    }

    const basic = parseFloat(basic_salary) || 0;
    const allow = parseFloat(allowances) || 0;
    const ded = parseFloat(deductions) || 0;
    const net = basic + allow - ded;

    await db.execute(
      `INSERT INTO payroll (employee_id, month, basic_salary, allowances, deductions, net_salary)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employee_id, month, basic, allow, ded, net]
    );

    return res.status(201).json({ message: 'Payroll record created successfully.' });
  } catch (err) {
    console.error('Create payroll error:', err);
    return res.status(500).json({ message: 'Error creating payroll record.' });
  }
};

// Admin: Update Payroll Record
exports.updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, basic_salary, allowances, deductions } = req.body;

    const basic = parseFloat(basic_salary) || 0;
    const allow = parseFloat(allowances) || 0;
    const ded = parseFloat(deductions) || 0;
    const net = basic + allow - ded;

    const [existing] = await db.execute('SELECT id FROM payroll WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Payroll record not found.' });
    }

    await db.execute(
      `UPDATE payroll 
       SET month = ?, basic_salary = ?, allowances = ?, deductions = ?, net_salary = ?
       WHERE id = ?`,
      [month, basic, allow, ded, net, id]
    );

    return res.json({ message: 'Payroll updated successfully.' });
  } catch (err) {
    console.error('Update payroll error:', err);
    return res.status(500).json({ message: 'Error updating payroll record.' });
  }
};

// Admin: Delete Payroll Record
exports.deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM payroll WHERE id = ?', [id]);
    return res.json({ message: 'Payroll record deleted successfully.' });
  } catch (err) {
    console.error('Delete payroll error:', err);
    return res.status(500).json({ message: 'Error deleting payroll record.' });
  }
};
