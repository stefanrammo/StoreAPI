const express = require('express');
const { login, signup } = require('../controllers/authController');
const { verifyAdmin } = require('../middleware/authMiddleware'); // Import the admin verification middleware
const router = express.Router();

// Login and signup routes (no need for admin verification)
router.post('/login', login);
router.post('/signup', signup);

// Example of a protected route that only the admin can access
router.get('/admin/dashboard', verifyAdmin, (req, res) => {
    // This will be accessible only to the admin
    res.status(200).send({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router;
