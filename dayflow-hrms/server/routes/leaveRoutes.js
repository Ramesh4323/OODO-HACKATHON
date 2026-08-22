const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.post('/', leaveController.createLeave);
router.get('/my', leaveController.getMyLeaves);
router.get('/', roleMiddleware('ADMIN'), leaveController.getAllLeaves);
router.put('/:id/approve', roleMiddleware('ADMIN'), leaveController.approveLeave);
router.put('/:id/reject', roleMiddleware('ADMIN'), leaveController.rejectLeave);

module.exports = router;
