const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['tenant', 'landlord', 'admin'],
        default: 'tenant'
    },
    phone: {
        type: String,
        trim: true
    },
    savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// use userId as the unique identifier for the user instead of _id
userSchema.virtual('userId').get(function() {
    return this._id.toString();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
// This code defines a Mongoose schema for a User model in a Node.js application.
// The schema includes fields for name, email, password, and createdAt timestamp.
// The name and email fields are required, with the email field being unique.
// The password field is also required and must be at least 6 characters long.
// The createdAt field defaults to the current date and time when a new user is created.
// Finally, the User model is exported for use in other parts of the application.
// This code is typically used in a Node.js application that uses MongoDB as its database.
// Mongoose is a popular ODM (Object Data Modeling) library for MongoDB and Node.js.
// The schema helps in defining the structure of the user documents in the MongoDB collection.
// This code is typically placed in a separate file (e.g., model/User.js) to keep the code organized.
// It can be used in conjunction with other parts of the application, such as routes and controllers,
// to handle user-related operations like registration, login, and profile management.
// The User model can be used to create, read, update, and delete user documents in the MongoDB database.
// This code is essential for building user authentication and management features in a web application.
// It ensures that user data is stored in a structured way, making it easier to query and manipulate.
// The use of Mongoose allows for validation and type checking, ensuring data integrity.