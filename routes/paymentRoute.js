const router = require('express').Router();
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const {createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment} = require('../controller/paymentController');

// Payment creation route (requires authentication)
router.post('/', verifyToken, createPayment);

// Get all payments route (requires admin authentication)
router.get('/', verifyToken, verifyTokenAndAdmin, getAllPayments);

// Get payment by ID route (requires authentication)
router.get('/:id', verifyToken, getPaymentById);

// Update payment by ID route (requires admin authentication)
router.put('/:id', verifyToken, verifyTokenAndAdmin, updatePayment);

// Delete payment by ID route (requires admin authentication)
router.delete('/:id', verifyToken, verifyTokenAndAdmin, deletePayment);

// Export the router
module.exports = router;

