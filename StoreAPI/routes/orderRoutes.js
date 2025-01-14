const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const { verifyCustomer } = require('../middleware/authMiddleware');

// Get all orders (Admin only)
router.get('/', ordersController.getAll);

// Get order by ID (Admin or owner)
router.get('/:id', verifyCustomer, ordersController.getById);

// Create a new order (Customer only)
router.post('/', verifyCustomer, ordersController.create);

// Edit an existing order (Admin or owner)
router.put('/:id', verifyCustomer, ordersController.editById);

// Delete an order by ID (Admin only)
router.delete('/:id', verifyCustomer, ordersController.deleteById);

module.exports = (app) => {
    app.use('/api/orders', router); // Ensure all routes are prefixed with /api/orders
};
