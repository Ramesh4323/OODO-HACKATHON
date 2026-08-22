const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', announcementController.getAllAnnouncements);
router.post('/', roleMiddleware('ADMIN'), announcementController.createAnnouncement);
router.delete('/:id', roleMiddleware('ADMIN'), announcementController.deleteAnnouncement);

module.exports = router;
