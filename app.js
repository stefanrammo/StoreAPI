const port = 8080;
const app = require('express')();
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');
const express = require('express');

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(express.json());

const drinks = [{ id: 1, order_id: 1, name: 'Laua Viin', expiration_date: null, price: 2, description: '' },
{ id: 2, order_id: null, name: 'Põhja Viin', expiration_date: null, price: 1.5, description: '' },
{ id: 3, order_id: null, name: 'Võõra Viin', expiration_date: null, price: 3, description: '' },
];

const customers = [{ id: 1, name: 'Alice', email: 'alice@example.com', age: '18' },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: '22' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: '19' }
];

const order = [{ customers_id: 1, order_date: "01.01.2024"},
    { customers_id: 2, order_date: "02.02.2024"},
    { customers_id: 3, order_date: "03.03.2024"}
];

const comments = [{ customers_id: 1, drink_id: 1, comment: 'Tänan viinilt!', review_score: 5},
    { customers_id: 2, drink_id: 2, comment: 'Kõik päris!', review_score: 4},
    { customers_id: 3, drink_id: 3, comment: 'Mõtetu viin!', review_score: 3}
];

app.get('/drinks', (req, res) => {
    res.send
    (drinks)    // Add more drinks here...
});

app.get('/drinks/:id', (req, res) => {
    if (typeof drinks[req.params.id - 1] === 'undefined') {
        res.status(404).send({ error: 'Drink not found' })
    };
    if (req.params.id == null) {
        return res.status(400).send({ error: 'Invalid drink ID' })
    };
    res.send(drinks[req.params.id - 1])
});

app.post('/drinks', (req, res) => {
    if (req.body.name == null || req.body.price == null || req.body.description == null) {
        return res.status(400).send({ error: 'Missing required fields' })
    };
    const newDrink = {
        id: drinks.length + 1,
        order_id: null,
        name: req.body.name,
        expiration_date: null,
        price: req.body.price,
        description: req.body.description
    };
    drinks.push(newDrink);
    res.status(201).location(`${getBaseURL(req)}/games/$(games.length)`).send(newDrink);
});

app.delete('/drinks/:id', (req, res) => {
    if (typeof drinks[req.params.id - 1] === 'undefined') {
        res.status(404).send({ error: 'Drink not found' })
    };
    if (req.params.id == null) {
        return res.status(400).send({ error: 'Invalid drink ID' })
    };
    drinks.splice(req.params.id - 1, 1);
    return res.status(204).send(drinks[req.params.id - 1])});

/* app.patch('/drinks/:id', (req, res) => {
    if (typeof drinks[req.params.id - 1] === 'undefined') {
        res.status(404).send({ error: 'Drink not found' })
    };
    if (req.params.id == null) {
        return res.status(400).send({ error: 'Invalid drink ID' })
    };
    if (req.body.name == null || req.body.price == null || req.body.description == null) {
        return res.status(400).send({ error: 'Missing required fields' })
    };
    drinks[req.params.id - 1].name = req.body.name;
    drinks[req.params.id - 1].price = req.body.price;
    drinks[req.params.id - 1].description = req.body.description});
 */

app.listen(port, () => {
    console.log(`API up at http://localhost:${port}`)
});

function getBaseURL(req) {
    return req.connection && req.connection.encrypted? 
    "https" : "http" + `://${req.headers.host}`;
}
