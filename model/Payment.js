const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purpose: {
        type: String,
        enum: ['investment', 'booking', 'service_fee'],
        required: true
    },
    paymentRef: {
        type: String,
        required: true,
        unique: true
    },
    gatewayResponse: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
// This code defines a Mongoose schema for a Payment model in a Node.js application.
// The schema includes fields for user, amount, purpose, paymentRef, gatewayResponse, status, and createdAt timestamp.
// The user field is a reference to the User model, indicating which user made the payment.
// The amount field represents the payment amount.
// The purpose field indicates the reason for the payment, which can be 'investment', 'booking', or 'service_fee'.
// The paymentRef field is a unique reference for the payment, ensuring no two payments have the same reference.
// The gatewayResponse field stores the response from the payment gateway.
// The status field indicates the payment status, which can be 'pending', 'completed', or 'failed', with a default value of 'pending'.
// The createdAt field defaults to the current date and time when a new payment is created.
// Finally, the Payment model is exported for use in other parts of the application.
// This code is typically used in a Node.js application that uses MongoDB as its database.
// Mongoose is a popular ODM (Object Data Modeling) library for MongoDB and Node.js.
// The schema helps in defining the structure of the payment documents in the MongoDB collection.
// This code is typically placed in a separate file (e.g., model/Payment.js) to keep the code organized.
// It can be used in conjunction with other parts of the application, such as routes and controllers,
// to handle payment-related operations like creating, reading, updating, and deleting payments.
// The Payment model can be used to create, read, update, and delete payment documents in the MongoDB database.
// This code is essential for building payment processing features in a web application.
// It ensures that payment data is stored in a structured way, making it easier to query and manipulate.
// The use of Mongoose allows for validation and type checking, ensuring data integrity.