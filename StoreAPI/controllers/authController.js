// src/controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db'); // assuming db is your database setup

// Login method
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ error: 'Email and password are required' });
    }

    try {
        // Check if email belongs to the admin (id=1)
        if (email === "admin@example.com") {
            const adminPassword = process.env.ADMIN_PASSWORD; // Use an environment variable for the admin password
            if (password !== adminPassword) {
                return res.status(401).send({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: 1, role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1h' });
            return res.status(200).send({ message: 'Admin login successful', token });
        }

        const customer = await db.customers.findOne({ where: { email } });

        if (!customer) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: customer.id, email: customer.email, role: 'customer' }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).send({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};



// Create user method
exports.signup = async (req, res) => {
    const { name, email, password, age } = req.body;

    if (!name || !email || !password || !age) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    try {
        const existingUser = await db.customers.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).send({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { name, email, password: hashedPassword, age };
        const createdUser = await db.customers.create(newUser);

        res.status(201).json({ id: createdUser.id, message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

