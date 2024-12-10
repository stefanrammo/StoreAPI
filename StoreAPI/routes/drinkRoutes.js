const DrinksController = require('../controllers/DrinksController');

module.exports = (app) => {
    app.route('/drinks')
        .get(DrinksController.getAll) 
        .post(DrinksController.create)
    app.route('/drinks/:id')
        .get(DrinksController.getById)
        .put(DrinksController.editById)
        .delete(DrinksController.deleteById)
        }