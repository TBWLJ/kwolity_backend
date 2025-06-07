const router = require('express').Router();
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const {createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment} = require('../controller/paymentController');

// Payment creation route (requires authentication)
router.post('/', verifyToken, createPayment);

// Get all payments route (requires admin authentication)
router.get('/', verifyTokenAndAdmin, getAllPayments);

// Get payment by ID route (requires authentication)
router.get('/:id', verifyToken, getPaymentById);

// Update payment by ID route (requires admin authentication)
router.put('/:id', verifyTokenAndAdmin, updatePayment);

// Delete payment by ID route (requires admin authentication)
router.delete('/:id', verifyTokenAndAdmin, deletePayment);

// Export the router
module.exports = router;


// This code defines the payment routes for creating, retrieving, updating, and deleting payments.
// It uses Express.js to create a router and applies middleware for authentication and authorization.
// The routes are protected by authentication and admin checks where necessary.
// The router is then exported for use in the main application file.
// This code is typically placed in a separate file (e.g., routes/paymentRoute.js) to keep the code organized.
// It can be used in conjunction with other parts of the application, such as controllers and models,
// to handle payment-related operations in a web application.
// The createPayment route allows authenticated users to create a new payment.
// The getAllPayments route allows admin users to retrieve all payments.
// The getPaymentById route allows authenticated users to retrieve a specific payment by its ID.
// The updatePayment route allows admin users to update a specific payment by its ID.
// The deletePayment route allows admin users to delete a specific payment by its ID.
// This code is essential for building payment processing features in a web application.
// It ensures that payment data is handled securely and efficiently, allowing for operations like creating,
// retrieving, updating, and deleting payments.
// The use of middleware for authentication and authorization ensures that only authorized users can perform certain actions.
// This code is typically used in a Node.js application that uses MongoDB as its database.  