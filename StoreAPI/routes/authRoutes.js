// src/routes/authRoutes.js
const express = require('express');
const { login, signup } = require('../controllers/authController');
const router = express.Router();

// Use '/login' for login POST route
router.post('/login', login);
router.post('/signup', signup);

module.exports = router;
