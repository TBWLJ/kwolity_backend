const Payment = require('../model/Payment');

// Create a new payment
const createPayment = async (req, res) => {
    const userId = req.user.id;
    const { bookingId, amount, paymentMethod } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const newPayment = new Payment({
            bookingId,
            amount,
            paymentMethod,
            userId, // track which user made the payment
        });

        await newPayment.save();
        res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
    } catch (error) {
        console.error('Error creating payment:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify a payment
const verifyPayment = async (req, res) => {
    const { paymentId } = req.body;

    try {
        const payment = await Payment.findById(paymentId);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        payment.verified = true;
        await payment.save();

        res.status(200).json({ message: 'Payment verified successfully', payment });
    } catch (error) {
        console.error('Error verifying payment:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('bookingId');
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findById(id).populate('bookingId');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update payment
const updatePayment = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedPayment = await Payment.findByIdAndUpdate(id, updates, { new: true }).populate('bookingId');
        if (!updatedPayment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
    } catch (error) {
        console.error('Error updating payment:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete payment
const deletePayment = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPayment = await Payment.findByIdAndDelete(id);
        if (!deletedPayment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get payments by booking ID
const getPaymentsByBookingId = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const payments = await Payment.find({ bookingId }).populate('bookingId');
        if (payments.length === 0) return res.status(404).json({ message: 'No payments found for this booking' });
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments by booking ID:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get payments by user ID
const getPaymentsByUserId = async (req, res) => {
    const userId = req.user.id;

    try {
        const payments = await Payment.find({ userId }).populate('bookingId');
        if (payments.length === 0) return res.status(404).json({ message: 'No payments found for this user' });
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments by user ID:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createPayment,
    verifyPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    getPaymentsByBookingId,
    getPaymentsByUserId
};
