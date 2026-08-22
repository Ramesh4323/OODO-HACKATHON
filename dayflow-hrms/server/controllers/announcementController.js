const db = require('../config/db');

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM announcements ORDER BY created_at DESC LIMIT 10'
    );
    return res.json(rows);
  } catch (err) {
    console.error('Get announcements error:', err);
    return res.status(500).json({ message: 'Error fetching company announcements.' });
  }
};

// Admin: Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const employeeId = req.user.employeeId;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const annType = type || 'GENERAL';

    await db.execute(
      'INSERT INTO announcements (title, description, type, created_by) VALUES (?, ?, ?, ?)',
      [title, description, annType, employeeId]
    );

    return res.status(201).json({ message: 'Company announcement posted successfully!' });
  } catch (err) {
    console.error('Create announcement error:', err);
    return res.status(500).json({ message: 'Error creating announcement.' });
  }
};

// Admin: Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM announcements WHERE id = ?', [id]);
    return res.json({ message: 'Announcement deleted successfully.' });
  } catch (err) {
    console.error('Delete announcement error:', err);
    return res.status(500).json({ message: 'Error deleting announcement.' });
  }
};
