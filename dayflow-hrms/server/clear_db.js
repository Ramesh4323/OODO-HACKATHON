const mysql = require('mysql2/promise');
require('dotenv').config();

async function clearDatabase() {
  let connection;
  try {
    console.log('🧹 Connecting to MySQL server to clear all users & demo data...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ramesh7945',
      database: process.env.DB_NAME || 'dayflow'
    });

    console.log('🗑️  Clearing all tables...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE payroll');
    await connection.query('TRUNCATE TABLE leaves');
    await connection.query('TRUNCATE TABLE attendance');
    await connection.query('TRUNCATE TABLE employees');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ All users and demo credentials have been successfully removed!');
    console.log('✨ Database is clean and ready for real registration.');
  } catch (err) {
    console.error('❌ Error clearing database:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

clearDatabase();
