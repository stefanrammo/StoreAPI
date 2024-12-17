const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// Get all orders
router.get('/orders', ordersController.getAll);

// Get order by ID
router.get('/orders/:id', ordersController.getById);

// Create a new order
router.post('/orders', ordersController.create);

// Edit an existing order
router.put('/orders/:id', ordersController.editById);

// Delete an order by ID
router.delete('/orders/:id', ordersController.deleteById);

module.exports = router;
