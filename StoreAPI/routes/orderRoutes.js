const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const { verifyCustomer } = require('../middleware/authMiddleware');

// Get all orders (Admin only)
router.get('/orders', ordersController.getAll);

// Get order by ID (Admin or owner)
router.get('/orders/:id', verifyCustomer, ordersController.getById);

// Create a new order (Customer only)
router.post('/orders', verifyCustomer, ordersController.create);

// Edit an existing order (Admin or owner)
router.put('/orders/:id', verifyCustomer, ordersController.editById);

// Delete an order by ID (Admin only)
router.delete('/orders/:id', verifyCustomer, ordersController.deleteById);

module.exports = router;
