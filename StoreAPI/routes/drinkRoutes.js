const DrinksController = require('../controllers/DrinksController');

module.exports = (app) => {
    app.route('/drinks')
        .get(DrinksController.getAllDrinks) 
        .post(DrinksController.create)
    app.route('/drinks/:id')
        .get(DrinksController.getDrinkById)
        .put(DrinksController.editById)
        .delete(DrinksController.deleteById)
        }