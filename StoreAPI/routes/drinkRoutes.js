const drinksController = require('../controllers/drinksController');

module.exports = (app) => {
    app.route('/drinks')
        .get(drinksController.getAll) 
        .post(drinksController.create)
    app.route('/drinks/:id')
        .get(drinksController.getById)
        .put(drinksController.editById)
        .delete(drinksController.deleteById)
}