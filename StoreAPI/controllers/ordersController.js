const { db } = require('../db');

// Get all orders
exports.getAll = async (req, res) => {
    try {
        const orders = await db.orders.findAll({
            include: [
                {
                    model: db.customers,
                    as: "customer",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: db.drinks,
                    as: "drinks",
                    attributes: ["id", "name", "price"],
                },
            ],
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

// Get order by ID
exports.getById = async (req, res) => {
    try {
        const order = await db.orders.findByPk(req.params.id, {
            include: [
                { model: db.customers, as: "customer" },
                { model: db.drinks, as: "drinks" },
            ],
        });

        if (!order) {
            return res.status(404).send({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

// Create a new order
exports.create = async (req, res) => {
    const { customer_id, order_date, drink_ids } = req.body;

    if (!customer_id || !order_date || !drink_ids?.length) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    try {
        const customer = await db.customers.findByPk(customer_id);
        if (!customer) {
            return res.status(404).send({ error: 'Customer not found' });
        }

        const newOrder = await db.orders.create({ customer_id, order_date });
        const drinks = await db.drinks.findAll({ where: { id: drink_ids } });
        await newOrder.setDrinks(drinks);

        res.status(201).json({ id: newOrder.order_id, message: 'Order created successfully' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

// Update an order
exports.editById = async (req, res) => {
    try {
        const { customer_id, order_date, drink_ids } = req.body;
        const order = await db.orders.findByPk(req.params.id);

        if (!order) {
            return res.status(404).send({ error: 'Order not found' });
        }

        order.customer_id = customer_id || order.customer_id;
        order.order_date = order_date || order.order_date;
        await order.save();

        if (drink_ids?.length) {
            const drinks = await db.drinks.findAll({ where: { id: drink_ids } });
            await order.setDrinks(drinks);
        }

        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

// Delete an order
exports.deleteById = async (req, res) => {
    try {
        const order = await db.orders.findByPk(req.params.id);

        if (!order) {
            return res.status(404).send({ error: 'Order not found' });
        }

        await order.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
