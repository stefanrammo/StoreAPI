const port = 8080;
const app = require('express')();
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');

app.use("Idocs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.listen(port, () => {
    console.log(`API up at http://localhost:${port}`)});

