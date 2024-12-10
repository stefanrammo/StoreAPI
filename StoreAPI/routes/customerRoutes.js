const CustomersController = require('../controllers/CustomersController');

module.exports = (app) => {
    app.route('/customers')
        .get(CustomersController.getAll) // Get all customers
        .post(CustomersController.create); // Create a new customer
    
    app.route('/customers/:id')
        .get(CustomersController.getById) // Get customer by ID
        .put(CustomersController.editById) // Edit customer by ID
        .delete(CustomersController.deleteById); // Delete customer by ID
};
