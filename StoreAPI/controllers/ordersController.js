const { db } = require('../db'); // Sequelize models
const Utils = require('./utils'); // Any utility functions if needed

// Get all orders
exports.getAll = async (req, res) => {
    try {
        const orders = await db.orders.findAll({
            include: [
                {
                    model: db.customers,
                    as: "customer", // Include customer data
                    attributes: ["id", "name", "email"]
                },
                {
                    model: db.drinks,
                    as: "drinks", // Include drinks associated with the order
                    attributes: ["id", "name", "price"]
                }
            ]
        });
        res.send(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

// Get order by ID
exports.getById = async (req, res) => {
    try {
        const order = await findOrderById(req);
        if (!order) {
            return;
        }
        res.send(order);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
};

// Create a new order
exports.create = async (req, res) => {
    const { customer_id, order_date, drink_ids } = req.body;

    // Validate the incoming data
    if (!customer_id || !order_date) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    // Check if the customer exists
    const customer = await db.customers.findByPk(customer_id);
    if (!customer) {
        return res.status(404).send({ error: 'Customer not found' });
    }

    // Create a new order
    const newOrder = await db.orders.create({
        customer_id,
        order_date
    });

    // Associate drinks with the order if provided
    if (drink_ids && drink_ids.length > 0) {
        const drinks = await db.drinks.findAll({
            where: {
                id: drink_ids
            }
        });
        await newOrder.setDrinks(drinks); // Establish many-to-many relationship with drinks
    }

    res.status(201).json({ id: newOrder.id });
};

// Update an order
exports.editById = async (req, res) => {
    try {
        const order = await findOrderById(req);
        if (!order) {
            return res.status(404).send({ error: "Order not found" });
        }

        // Destructure updated values from request body
        const { customer_id, order_date, drink_ids } = req.body;

        // Update the order
        order.customer_id = customer_id;
        order.order_date = order_date;

        // Save the updated order
        await order.save();

        // Update associated drinks if provided
        if (drink_ids && drink_ids.length > 0) {
            const drinks = await db.drinks.findAll({
                where: {
                    id: drink_ids
                }
            });
            await order.setDrinks(drinks);
        }

        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Delete an order by ID
exports.deleteById = async (req, res) => {
    try {
        const order = await findOrderById(req);
        if (!order) {
            return;
        }
        await order.destroy();
        res.status(204).send(); // No content
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
};

// Helper function to find an order by ID
const findOrderById = async (req) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).send({ error: `Invalid order ID ${req.params.id}` });
    }
    const order = await db.orders.findByPk(id, {
        include: [
            {
                model: db.customers,
                as: "customer"
            },
            {
                model: db.drinks,
                as: "drinks"
            }
        ]
    });

    if (!order) {
        res.status(404).send({ error: "Order not found" });
        return null;
    }

    return order;
};
