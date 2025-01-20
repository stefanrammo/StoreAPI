// routes/orders.js

const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const { verifyAdmin, verifyCustomer, verifyAdminOrCustomer } = require('../middleware/authMiddleware');

// Get all orders (Admin or Customer)
router.get('/', verifyAdminOrCustomer, ordersController.getAll);

// Get order by ID (Admin or owner)
router.get('/:id', verifyAdminOrCustomer, ordersController.getById);

// Create a new order (Customer only)
router.post('/', verifyCustomer, ordersController.create);

// Edit an existing order (Admin or owner)
router.put('/:id', verifyAdminOrCustomer, ordersController.editById);

// Delete an order by ID (Admin or owner)
router.delete('/:id', verifyAdminOrCustomer, ordersController.deleteById);

module.exports = (app) => {
    app.use('/api/orders', router); // Ensure all routes are prefixed with /api/orders
};
