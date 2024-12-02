const port = 8080;
const app = require('express')();
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');
const express = require('express');

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(express.json());

const drinks = [{ id: 1, order_id: 1, name: 'Laua Viin', expiration_date: null, price: 2, description: '' },
{ id: 2, order_id: null, name: 'Põhja Viin', expiration_date: null, price: 1.5, description: '' },
{ id: 3, order_id: null, name: 'Võõra Viin', expiration_date: null, price: 3, description: '' },
];

const customers = [{ id: 1, name: 'Alice', email: 'alice@example.com', age: '18' },
{ id: 2, name: 'Bob', email: 'bob@example.com', age: '22' },
{ id: 3, name: 'Charlie', email: 'charlie@example.com', age: '19' }
];

const order = [{ customers_id: 1, order_date: "01.01.2024" },
{ customers_id: 2, order_date: "02.02.2024" },
{ customers_id: 3, order_date: "03.03.2024" }
];

const comments = [{ customers_id: 1, drink_id: 1, comment: 'Tänan viinilt!', review_score: 5 },
{ customers_id: 2, drink_id: 2, comment: 'Kõik päris!', review_score: 4 },
{ customers_id: 3, drink_id: 3, comment: 'Mõtetu viin!', review_score: 3 }
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
    const { name, price, description } = req.body;

    // Check if all required fields are present
    if (!name || !price || !description) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    // Check if a drink with the same name already exists
    const existingDrink = drinks.find((drink) => drink.name.toLowerCase() === name.toLowerCase());
    if (existingDrink) {
        return res.status(409).send({ error: 'Drink with the same name already exists' });
    }

    // Add the new drink
    const newDrink = {
        id: drinks.length + 1,
        order_id: null,
        name,
        expiration_date: null,
        price,
        description,
    };
    drinks.push(newDrink);

    res.status(201).location(`${getBaseURL(req)}/drinks/${newDrink.id}`).send(newDrink);
});


app.delete('/drinks/:id', (req, res) => {
    if (typeof drinks[req.params.id - 1] === 'undefined') {
        res.status(404).send({ error: 'Drink not found' })
    };
    drinks.splice(req.params.id - 1, 1);
    return res.status(204).send(drinks[req.params.id - 1])
});

app.put('/drinks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const drink = drinks.find((d) => d.id === id);

    if (!drink) {
        return res.status(404).send({ error: 'Drink not found' });
    }

    const { name, price, description, expiration_date, order_id } = req.body;

    // Update the drink object
    drink.name = name;
    drink.price = price;
    drink.description = description;

    // Optional fields
    if (expiration_date !== undefined) drink.expiration_date = expiration_date;
    if (order_id !== undefined) drink.order_id = order_id;

    res.status(200).send(drink);
});

app.get('/customers', (req, res) => {
    res.send
        (customers)    // Add more customers here...
});

app.get('/customers/:id', (req, res) => {
    if (typeof customers[req.params.id - 1] === 'undefined') {
        res.status(404).send({ error: 'Customer not found' })
    };
    if (req.params.id == null) {
        return res.status(400).send({ error: 'Invalid customer ID' })
    };
    res.send(customers[req.params.id - 1])
});

app.post('/customers', (req, res) => {
    const { name, email, age } = req.body;

    // Check if all required fields are present
    if (!name || !email || !age) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    // Check if a customer with the same name already exists
    const existingCustomer = customers.find((customer) => customer.name.toLowerCase() === name.toLowerCase());
    if (existingCustomer) {
        return res.status(409).send({ error: 'Customer with the same name already exists' });
    }

    // Add the new customer
    const newCustomer = {
        id: customers.length + 1,
        name,
        email,
        age,
    };
    drinks.push(newCustomer);

    res.status(201).location(`${getBaseURL(req)}/customers/${newCustomer.id}`).send(newCustomer);
});

app.put('/customers/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const customer = customers.find((c) => c.id === id);

    if (!customer) {
        return res.status(404).send({ error: 'Customer not found' });
    }

    const { name, email, age} = req.body;

    // Update the customer object
    customer.name = name;
    customer.email = email;
    customer.age = age;

    res.status(200).send(customer);
});

app.delete('/customers/:id', (req, res) => {
    if (typeof customers[req.params.id - 1] === 'undefined') {
        res.status(404).send({ error: 'Customers not found' })
    };
    customers.splice(req.params.id - 1, 1);
    return res.status(204).send(customers[req.params.id - 1])
});

app.listen(port, () => {
    console.log(`API up at http://localhost:${port}`)
});

function getBaseURL(req) {
    return req.connection && req.connection.encrypted ?
        "https" : "http" + `://${req.headers.host}`;
}
