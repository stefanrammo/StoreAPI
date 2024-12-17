const customersController = require('../controllers/customersController');

module.exports = (app) => {
    app.route('/customers')
        .get(customersController.getAll) // Get all customers
        .post(customersController.create); // Create a new customer
    
    app.route('/customers/:id')
        .get(customersController.getById) // Get customer by ID
        .put(customersController.editById) // Edit customer by ID
        .delete(customersController.deleteById); // Delete customer by ID
};
