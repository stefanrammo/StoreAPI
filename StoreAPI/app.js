require('dotenv').config();

const port = process.env.PORT || 8080;
const host = 'localhost';
const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(express.json());
app.use(cors);

/* const drinks = [{ id: 1, order_id: 1, name: 'Laua Viin', expiration_date: null, price: 2, description: '' },
{ id: 2, order_id: null, name: 'Põhja Viin', expiration_date: null, price: 1.5, description: '' },
{ id: 3, order_id: null, name: 'Võõra Viin', expiration_date: null, price: 3, description: '' },
];

const customers = [{ id: 1, name: 'Alice', email: 'alice@example.com', age: '18' },
{ id: 2, name: 'Bob', email: 'bob@example.com', age: '22' },
{ id: 3, name: 'Charlie', email: 'charlie@example.com', age: '19' }
];

const order = [{ id: 1, customers_id: 1, order_date: "01.01.2024" },
{ id: 2, customers_id: 2, order_date: "02.02.2024" },
{ id: 3, customers_id: 3, order_date: "03.03.2024" }
];

const comments = [{id: 1, customers_id: 1, drink_id: 1, comment: 'Tänan viinilt!', review_score: 5 },
{ id: 2, customers_id: 2, drink_id: 2, comment: 'Kõik päris!', review_score: 4 },
{ id: 3, customers_id: 3, drink_id: 3, comment: 'Mõtetu viin!', review_score: 3 }
];
 */




app.get('/customers', async (req, res) => {
    res.send(await Promise.resolve(customers));
});

app.get('/customers/:id', async (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).send({ error: 'Customer not found' });
    res.send(await Promise.resolve(customer));
});

app.post('/customers', async (req, res) => {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
        return res.status(400).send({ error: 'Missing required fields' });
    }
    const existingCustomer = customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existingCustomer) return res.status(409).send({ error: 'Customer with the same name already exists' });

    const newCustomer = { id: customers.length + 1, name, email, age };
    customers.push(newCustomer);
    res.status(201).location(`${getBaseURL(req)}/customers/${newCustomer.id}`).send(await Promise.resolve(newCustomer));
});

app.delete('/customers/:id', async (req, res) => {
    const index = customers.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send({ error: 'Customer not found' });

    customers.splice(index, 1);
    res.status(204).send();
});

app.post('/orders', (req, res) => {
    const { customer_id, order_date } = req.body;

    // Check if all required fields are present
    if (!order_date || !customer_id) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    // Add the new order
    const newOrder = {
        id: customers.length + 1,
        order_date,
        customers_id
    };
    orders.push(newOrder);

    res.status(201).location(`${getBaseURL(req)}/orders/${newOrder.id}`).send(newOrder);
});

app.get('/orders/:id', (req, res) => {
    if (typeof orders[req.params.id - 1] === 'undefined') {
        res.status(404).send({ error: 'Order not found' })
    };
    if (req.params.id == null) {
        return res.status(400).send({ error: 'Invalid order ID' })
    };
    res.send(orders[req.params.id - 1])
});

app.put('/orders/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const order = orders.find((o) => o.id === id);

    if (!order) {
        return res.status(404).send({ error: 'Order not found' });
    }

    const { customer_id, order_date } = req.body;

    // Update the order object
    order.customer_id = customer_id;
    order.order_date = order_date;

    res.status(201).send(order);
}); 

app.delete('/orders/:id', (req, res) => {
    if (typeof orders[req.params.id - 1] === 'undefined') {
        res.status(404).send({ error: 'Order not found' })
    };
    orders.splice(req.params.id - 1, 1);
    return res.status(204).send(orders[req.params.id - 1])
});

app.listen(port, () => {
    console.log(`API up at http://localhost:${port}`)
});


