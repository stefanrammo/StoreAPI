const { db } = require('../db');
const Utils = require('./utils');

// Get all customers
exports.getAll = async (req, res) => {
    try {
        const customers = await db.customers.findAll(); // Fetch customers from the database
        res.send(customers.map(({ id, name, email, password, age }) => ({
            id, name, email, password, age
        })));
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

// Get customer by ID
exports.getById = async (req, res) => {
    try {
        const customer = await findCustomerById(req); // Use helper function to find customer
        if (!customer) {
            return res.status(404).send({ error: 'Customer not found' });
        }
        res.send(customer); // Send the customer data
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
};

const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
    const { name, email, age, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !age || !password) {
        return res.status(400).send({ error: 'Missing required fields: name, email, age, or password' });
    }

    try {
        // Check if a customer with the same name already exists in the database
        const existingCustomer = await db.customers.findOne({
            where: {
                name: name.toLowerCase(), // Case-insensitive comparison
            },
        });

        if (existingCustomer) {
            return res.status(409).send({ error: 'Customer with the same name already exists' });
        }

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare new customer data
        const newCustomer = { 
            name, 
            email, 
            age, 
            password: hashedPassword, 
        };

        // Create a new customer in the database
        const createdCustomer = await db.customers.create(newCustomer);

        // Respond with the ID of the newly created customer
        res.status(201).json({ id: createdCustomer.id });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};



// Delete a customer by ID
exports.deleteById = async (req, res) => {
    try {
        const customer = await findCustomerById(req);
        if (!customer) {
            return res.status(404).send({ error: 'Customer not found' });
        }
        await customer.destroy(); // Delete the customer from the database
        res.status(204).send(); // No content to return after deletion
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
};

// Edit a customer by ID
exports.editById = async (req, res) => {
    try {
        const customer = await findCustomerById(req);
        if (!customer) {
            return res.status(404).send({ error: 'Customer not found' });
        }

        const { name, email, password, age } = req.body;

        // Update the customer fields if provided
        if (name) customer.name = name;
        if (email) customer.email = email;
        if (password) customer.password = password;
        if (age) customer.age = age;

        // Save the updated customer to the database
        await customer.save();

        res.status(200).send(customer); // Send the updated customer
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Helper function to find a customer by ID
const findCustomerById = async (req) => {
    const idNumber = parseInt(req.params.id, 10); // Ensure parsing the id as an integer
    if (isNaN(idNumber)) {
        res.status(400).send({ error: `Invalid customer ID ${req.params.id}` });
        return null;
    }
    const customer = await db.customers.findByPk(idNumber); // Retrieve the customer using the primary key
    if (!customer) {
        res.status(404).send({ error: "Customer not found" });
        return null;
    }
    return customer; // Return the customer if found
};
