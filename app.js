const port = 8080;
const app = require('express')();
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');

app.use("Idocs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

const drinks = [{ id: 1, name: 'Laua Viin', expiration_date: null, price: 2, description: '' },
    { id: 2, name: 'Põhja Viin', expiration_date: null, price: 1.5, description: '' },
    { id: 3, name: 'Võõra Viin', expiration_date: null, price: 3, description: '' },
];

app.get('/drinks', (req, res) => { res.send
(drinks)    // Add more drinks here...
});

app.get('/drinks/:id', (req, res) => {
    res.send(drinks[req.params.id - 1])});

app.listen(port, () => {
    console.log(`API up at http://localhost:${port}`)});

