const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAdmin() {
  let connection;
  try {
    console.log('🌱 Connecting to MySQL server to add HR Admin user...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ramesh7945',
      database: process.env.DB_NAME || 'dayflow'
    });

    const email = 'admin@dayflow.com';
    const password = 'admin123';
    const employee_id = 'ADM001';
    const name = 'Admin User';
    const role = 'ADMIN';

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length === 0) {
      await connection.query(
        'INSERT INTO users (employee_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [employee_id, name, email, hashedPassword, role]
      );

      await connection.query(
        'INSERT INTO employees (employee_id, name, email, department, designation, joining_date, salary) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
        [employee_id, name, email, 'Human Resources', 'HR Lead', 90000.00]
      );
      console.log('✅ HR Admin user created successfully!');
    } else {
      // Update password just in case
      await connection.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, email]
      );
      console.log('✅ HR Admin password updated successfully!');
    }

    console.log('\n🔑 HR Admin Credentials Registered:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}`);
  } catch (err) {
    console.error('❌ Error creating admin user:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

seedAdmin();
