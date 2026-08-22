const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/my', payrollController.getMyPayroll);
router.get('/', roleMiddleware('ADMIN'), payrollController.getAllPayroll);
router.post('/', roleMiddleware('ADMIN'), payrollController.createPayroll);
router.put('/:id', roleMiddleware('ADMIN'), payrollController.updatePayroll);
router.delete('/:id', roleMiddleware('ADMIN'), payrollController.deletePayroll);

module.exports = router;
