const port = 8080;
const app = require('express')();
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');
const express = require('express');

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(express.json());

const drinks = [{ id: 1, name: 'Laua Viin', expiration_date: null, price: 2, description: '' },
{ id: 2, name: 'Põhja Viin', expiration_date: null, price: 1.5, description: '' },
{ id: 3, name: 'Võõra Viin', expiration_date: null, price: 3, description: '' },
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
        name: req.body.name,
        expiration_date: null,
        price: req.body.price,
        description: req.body.description
    };
    drinks.push(newDrink);
    res.status(201).location(`${getBaseURL(req)}/games/$(games.length)`).send(newDrink);
});

app.listen(port, () => {
    console.log(`API up at http://localhost:${port}`)
});

function getBaseURL(req) {
    return req.connection && req.connection.encrypted? 
    "https" : "http" + `://${req.headers.host}`;
}
