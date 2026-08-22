const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.post('/checkin', attendanceController.checkIn);
router.put('/checkout', attendanceController.checkOut);
router.get('/my', attendanceController.getMyAttendance);
router.get('/all', roleMiddleware('ADMIN'), attendanceController.getAllAttendance);
router.get('/today', attendanceController.getTodayAttendance);

module.exports = router;
