const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/stats', roleMiddleware('ADMIN'), dashboardController.getAdminStats);
router.get('/employee-stats', dashboardController.getEmployeeStats);

module.exports = router;
