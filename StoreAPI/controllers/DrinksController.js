const {db} = require('../db');
const Utils = require('./utils');


exports.getAll = async (req, res) => {
    try {
        const drinks = await db.drinks.findAll(); // Fetch data from the database
        res.send(drinks.map(({ id, name, price, description, expiration_date }) => ({
            id, name, price, description, expiration_date
          })));
              } catch (error) {
        console.error('Error fetching drinks:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

exports.getById = async (req, res) => {
    try {
        const drink = await findDrinkById(req);  // Pass req directly to findDrinkById
        if (!drink) {
            return;  // If no drink is found, do not proceed further
        }
        res.send(drink);  // Send the drink data
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
};

exports.create = async (req, res) => {
    console.log('Request Body:', req.body); // Log the incoming body

    const { name, price, description } = req.body;
    console.log('Name:', name, 'Price:', price, 'Description:', description); // Log individual fields

    if (!name || !price || !description) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    // Check if a drink with the same name already exists in the database
    const existingDrink = await db.drinks.findOne({
        where: {
            name: name.toLowerCase() // Use case-insensitive comparison
        }
    });

    if (existingDrink) {
        return res.status(409).send({ error: 'Drink with the same name already exists' });
    }

    const newDrink = {
        order_id: null,
        name,
        expiration_date: null,
        price,
        description,
    };

    // Create a new drink in the database
    const createdDrink = await db.drinks.create(newDrink);
    res.status(201).location(`${getBaseURL(req)}/drinks/${createdDrink.id}`).send(createdDrink.id);
};




exports.deleteById = async (req, res) => {
    try {
        const drink = await findDrinkById(req); // Ensure you're passing `req` here, not `req.params.id`
        if (!drink) {
            return;  // If no drink is found, exit early
        }
        await drink.destroy(); // Destroy the drink from the database
        res.status(204).send(); // Send the appropriate HTTP status (No Content)
    } catch (error) {
        res.status(404).send({ error: error.message }); // Handle any errors
    }
};


exports.editById = async (req, res) => {
    try {
        // Find the drink by ID
        const drink = await findDrinkById(req);
        
        if (!drink) {
            return res.status(404).send({ error: "Drink not found" });
        }

        // Destructure updated values from request body
        const { name, price, description, expiration_date, order_id } = req.body;

        // Update the drink object
        Object.assign(drink, { name, price, description, expiration_date, order_id });

        // Save the updated drink to the database
        await drink.save();  // Assuming you're using Sequelize or an ORM

        // Respond with the updated drink
        res.status(200).send(drink);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


const findDrinkById = async (req) => {
    const idNumber = parseInt(req.params.id, 10); // Ensure parsing the id as an integer
    if (isNaN(idNumber)) {
        res.status(400).send({ error: `Invalid drink ID ${req.params.id}` });
        return null;  // Return null if the ID is invalid
    }
    const drink = await db.drinks.findByPk(idNumber); // Retrieve the drink using the primary key
    if (!drink) {
        res.status(404).send({ error: "Drink not found" });
        return null;  // Return null if no drink is found
    }
    return drink;  // Return the drink if found
};