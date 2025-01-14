require('dotenv').config();

const port = process.env.PORT || 8080;
const host = 'localhost';
const express = require('express');
const cors = require('cors');
const app = express();
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');
const { sync } = require('./db');

// Middleware
app.use(cors());
app.use(express.json());

// API Documentation
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Health Check Route
app.get('/', (req, res) => {
    res.send(`Server running. Documentation at <a href="http://${host}:${port}/docs">/docs</a>`);
});

// Register Routes
require('./routes/drinkRoutes')(app);
require('./routes/customerRoutes')(app);
require('./routes/orderRoutes')(app); // Register order routes

// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // Prefix auth routes with /api/auth

// Start Server
app.listen(port, async () => {
    if (process.env.SYNC === 'true') {
        await sync();
    }
    console.log(`API up at http://${host}:${port}`);
});
