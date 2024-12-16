require('dotenv').config();

const port = process.env.PORT || 3001;
const host = 'localhost';
const express = require('express');
const cors = require('cors');
const app = express();

const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');

const {sync} = require("./db");

app.use(cors());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(express.json());


app.get("/", (req, res) => {
    res.send(`Server running. Documentation at <a href="http://${host}:${port}/docs">/docs</a>`);
})

const drinkRoutes = require('./routes/drinkRoutes')(app);
const customerRoutes = require('./routes/customerRoutes')(app);


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

app.listen(port, async() => {
    if (process.env.SYNC === "true") {
        await sync();
    }
    console.log(`API up at http://localhost:${port}`)
});


