require('dotenv').config();

const port = process.env.PORT || 8080;
const host = 'localhost';
const express = require('express');
const cors = require('cors');
const app = express();
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');
const {sync} = require("./db");
const { db } = require('./db');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 

app.use(cors());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(express.json());

app.get("/", (req, res) => {
    res.send(`Server running. Documentation at <a href="http://${host}:${port}/docs">/docs</a>`);
})

const drinkRoutes = require('./routes/drinkRoutes')(app);
const customerRoutes = require('./routes/customerRoutes')(app);
// src/routes/authRoutes.js
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);  // Prefixing all auth routes with '/api/auth'

app.listen(port, async() => {
    if (process.env.SYNC === "true") {
        await sync();
    }
    console.log(`API up at http://localhost:${port}`)
});