const {db} = require('../db');
const Utils = require('./utils');


exports.getAll = async (req, res) => {
    res.send(await Promise.resolve(drinks.map(({ id, name }) => ({ id, name }))));
/*     const drinks = await db.drinks.findAll();
    res.send(drinks.map(({id, name}) => {return {id, name}})); */
};

exports.getById = async (req, res) => {
    try {
        const drink = await findDrinkById(req.params.id);
        res.send(drink);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
};

exports.create = async (req, res) => {
    const { name, price, description } = req.body;
    if (!name || !price || !description) {
        return res.status(400).send({ error: 'Missing required fields' });
    }
    const existingDrink = drinks.find(d => d.name.toLowerCase() === name.toLowerCase());
    if (existingDrink) return res.status(409).send({ error: 'Drink with the same name already exists' });

    const newDrink = {
        order_id: null,
        name,
        expiration_date: null,
        price,
        description,
    };
    const createdDrink = await db.drinks.create(newDrink);
    res.status(201).location(`${Utils.getBaseURL(req)}/drinks/${createdDrink.id}`).send(createdDrink.id);
}

exports.deleteById = async (req, res) => {
    try {
        const drink = await findDrinkById(req.params.id);
        const index = drinks.indexOf(drink);
        await drink.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
}

exports.editById = async (req, res) => {
    try {
        const drink = await findDrinkById(req.params.id);
        const { name, price, description, expiration_date, order_id } = req.body;
        Object.assign(drink, { name, price, description, expiration_date, order_id });
        res.status(200).send(drink);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
}

async function findDrinkById(id) {
    const drink = drinks.find(d => d.id === parseInt(id));
    if (isNaN(drink.id)) {
        throw new Error('Invalid drink id'); //400
    }
    if (!drink) {
        throw new Error('Drink not found'); //404
    }
    return drink;
}