const db = require('../config/db');

// Admin Analytics Stats
exports.getAdminStats = async (req, res) => {
  try {
    const dateStr = new Date().toISOString().split('T')[0];

    // Total Employees
    const [[{ totalEmployees }]] = await db.execute('SELECT COUNT(*) as totalEmployees FROM employees');

    // Present Today
    const [[{ presentToday }]] = await db.execute(
      'SELECT COUNT(*) as presentToday FROM attendance WHERE date = ? AND (status = "Present" OR status = "Half-day")',
      [dateStr]
    );

    // On Leave Today
    const [[{ onLeaveToday }]] = await db.execute(
      'SELECT COUNT(*) as onLeaveToday FROM leaves WHERE status = "Approved" AND ? BETWEEN start_date AND end_date',
      [dateStr]
    );

    // Pending Leave Requests
    const [[{ pendingLeaves }]] = await db.execute(
      'SELECT COUNT(*) as pendingLeaves FROM leaves WHERE status = "Pending"'
    );

    // Recent Leave Requests for Admin Dashboard
    const [recentLeaves] = await db.execute(`
      SELECT l.*, e.name as employee_name, e.department
      FROM leaves l
      JOIN employees e ON l.employee_id = e.employee_id
      ORDER BY l.created_at DESC
      LIMIT 5
    `);

    return res.json({
      totalEmployees: totalEmployees || 0,
      presentToday: presentToday || 0,
      onLeaveToday: onLeaveToday || 0,
      pendingLeaves: pendingLeaves || 0,
      recentLeaves
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ message: 'Error calculating dashboard analytics.' });
  }
};

// Employee Analytics Stats
exports.getEmployeeStats = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const dateStr = new Date().toISOString().split('T')[0];

    // Attendance stats
    const [[{ totalDays }]] = await db.execute(
      'SELECT COUNT(*) as totalDays FROM attendance WHERE employee_id = ?',
      [employeeId]
    );
    const [[{ presentDays }]] = await db.execute(
      'SELECT COUNT(*) as presentDays FROM attendance WHERE employee_id = ? AND (status = "Present" OR status = "Half-day")',
      [employeeId]
    );

    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    // Today's Status
    const [todayAttendance] = await db.execute(
      'SELECT check_in, check_out, status FROM attendance WHERE employee_id = ? AND date = ?',
      [employeeId, dateStr]
    );

    let todayStatus = 'Not Checked In';
    if (todayAttendance.length > 0) {
      if (todayAttendance[0].check_out) {
        todayStatus = 'Checked Out';
      } else if (todayAttendance[0].check_in) {
        todayStatus = 'Present';
      } else {
        todayStatus = todayAttendance[0].status;
      }
    }

    // Pending Leaves Count
    const [[{ pendingCount }]] = await db.execute(
      'SELECT COUNT(*) as pendingCount FROM leaves WHERE employee_id = ? AND status = "Pending"',
      [employeeId]
    );

    // Monthly Salary
    const [empSalary] = await db.execute(
      'SELECT salary FROM employees WHERE employee_id = ?',
      [employeeId]
    );
    const salary = empSalary.length > 0 ? empSalary[0].salary : 0;

    // Recent Leaves
    const [recentLeaves] = await db.execute(
      'SELECT * FROM leaves WHERE employee_id = ? ORDER BY created_at DESC LIMIT 5',
      [employeeId]
    );

    return res.json({
      attendancePercentage,
      todayStatus,
      todayCheckIn: todayAttendance.length > 0 ? todayAttendance[0].check_in : null,
      todayCheckOut: todayAttendance.length > 0 ? todayAttendance[0].check_out : null,
      pendingLeaves: pendingCount || 0,
      salary: salary || 0,
      recentLeaves
    });
  } catch (err) {
    console.error('Employee stats error:', err);
    return res.status(500).json({ message: 'Error calculating employee dashboard stats.' });
  }
};
