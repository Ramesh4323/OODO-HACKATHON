const mysql = require('mysql2/promise');
require('dotenv').config();

async function initAnnouncementsTable() {
  let connection;
  try {
    console.log('🌱 Initializing announcements table in MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ramesh7945',
      database: process.env.DB_NAME || 'dayflow'
    });

    await connection.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type ENUM('GENERAL', 'HOLIDAY', 'EVENT', 'AWARD') DEFAULT 'GENERAL',
        created_by VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample announcements if empty
    const [rows] = await connection.query('SELECT id FROM announcements');
    if (rows.length === 0) {
      await connection.query(`
        INSERT INTO announcements (title, description, type, created_by) VALUES
        ('📢 Q3 Company Townhall', 'Join our Quarterly All-Hands meeting on Friday at 4:00 PM IST for product roadmap & performance milestones.', 'EVENT', 'ADM001'),
        ('🌴 Office Holiday Announcement', 'Dayflow workspace will remain closed on August 25 for National Festival. Enjoy your long weekend!', 'HOLIDAY', 'ADM001'),
        ('🏆 Top Performer Recognition', 'Congratulations to Aarav Mehta for ranking #1 in Attendance & Performance compliance this cycle!', 'AWARD', 'ADM001')
      `);
      console.log('✅ Sample announcements inserted.');
    }

    console.log('✅ Announcements table created and verified successfully!');
  } catch (err) {
    console.error('❌ Error creating announcements table:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

initAnnouncementsTable();
