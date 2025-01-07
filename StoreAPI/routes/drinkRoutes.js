const drinksController = require('../controllers/drinksController');
const { verifyAdmin } = require('../middleware/authMiddleware'); // Import verifyAdmin

module.exports = (app) => {
    // Route for getting all drinks: Open to everyone
    app.route('/drinks')
        .get(drinksController.getAll)  // No admin check needed for GET requests
        .post(verifyAdmin, drinksController.create); // Only admins can create drinks

    // Routes for drink by ID: Admin access for editing and deleting
    app.route('/drinks/:id')
        .get(drinksController.getById)  // No admin check needed for GET request
        .put(verifyAdmin, drinksController.editById)  // Only admins can edit drinks
        .delete(verifyAdmin, drinksController.deleteById);  // Only admins can delete drinks
}
