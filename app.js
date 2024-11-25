const port = 8080;
const app = require('express')();
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

const drinks = [{ id: 1, name: 'Laua Viin', expiration_date: null, price: 2, description: '' },
    { id: 2, name: 'Põhja Viin', expiration_date: null, price: 1.5, description: '' },
    { id: 3, name: 'Võõra Viin', expiration_date: null, price: 3, description: '' },
];

app.get('/drinks', (req, res) => { res.send
(drinks)    // Add more drinks here...
});

app.get('/drinks/:id', (req, res) => {
    if (typeof drinks[req.params.id - 1] === 'undefined') {
        res.status(404).send({error: 'Drink not found'})
    };
    if (req.params.id == null) {
        return res.status(400).send({error: 'Invalid drink ID'})
    };
    res.send(drinks[req.params.id - 1])});

app.listen(port, () => {
    console.log(`API up at http://localhost:${port}`)});

