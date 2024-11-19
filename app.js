const port = 8080;
const app = require('express')();
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');

app.use("Idocs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.get('/drinks', (req, res) => { res.send ([
    // { id: 1, expiration_date: 'Laua Viin', price: 2, description: '' },
    // { id: 2, expiration_date: 'Põhja Viin', price: 1.5, description: '' },
    // { id: 3, expiration_date: 'Võõra Viin', price: 3, description: '' },
["Laua Viin", "Viru Valge", "Valge Viin"]
    // Add more drinks here...
 
]) });

app.listen(port, () => {
    console.log(`API up at http://localhost:${port}`)});

