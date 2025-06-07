const Payment = require('../model/Payment');


const createPayment = async (req, res) => {
    const { bookingId, amount, paymentMethod } = req.body;

    try {
        // Create a new payment
        const newPayment = new Payment({
            bookingId,
            amount,
            paymentMethod
        });

        // Save the payment to the database
        await newPayment.save();
        res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyPayment = async (req, res) => {
    const { paymentId } = req.body;
    try {
        // Verify payment by ID
        const payment = await Payment({ id: paymentId });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        // Assuming payment verification logic here
        payment.verified = true; // Example of setting a verified flag
        await payment.save();
        res.status(200).json({ message: 'Payment verified successfully', payment });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getAllPayments = async (req, res) => {
    try {
        // Fetch all payments from the database
        const payments = await Payment.find().populate('bookingId');
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getPaymentById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch payment by ID
        const payment = await Payment.findById(id).populate('bookingId');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const updatePayment = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Update payment by ID
        const updatedPayment = await Payment.findByIdAndUpdate(id, updates, { new: true }).populate('bookingId');
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const deletePayment = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete payment by ID
        const deletedPayment = await Payment.findByIdAndDelete(id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getPaymentsByBookingId = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Fetch payments by booking ID
        const payments = await Payment.find({ bookingId }).populate('bookingId');
        if (payments.length === 0) {
            return res.status(404).json({ message: 'No payments found for this booking' });
        }
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments by booking ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getPaymentsByUserId = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in req.user after authentication

    try {
        // Fetch payments by user ID
        const payments = await Payment.find({ userId }).populate('bookingId');
        if (payments.length === 0) {
            return res.status(404).json({ message: 'No payments found for this user' });
        }
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments by user ID:', error);
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
//     const bookings = await Booking.find({ userId }).populate('propertyId');