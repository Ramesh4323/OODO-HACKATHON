const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware('ADMIN'), employeeController.getAllEmployees);
router.post('/', roleMiddleware('ADMIN'), employeeController.createEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', roleMiddleware('ADMIN'), employeeController.updateEmployee);
router.put('/profile/:id', employeeController.updateEmployeeProfile);
router.delete('/:id', roleMiddleware('ADMIN'), employeeController.deleteEmployee);

module.exports = router;
