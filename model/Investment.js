const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    goalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    expectedROI: {
        type: Number,
        required: true,
        default: 0
    },
    investors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['available', 'investing', 'funded', 'completed'],
        default: 'available'
    },
    type: {
        type: String,
        enum: ['apartment', 'house', 'commercial', 'land'],
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
// This code defines a Mongoose schema for a Property model in a Node.js application.
// The schema includes fields for title, description, goalAmount, currentAmount, expectedROI, investors, status, type, images, and createdAt timestamp.
// The title, description, goalAmount, expectedROI, type, and images fields are required.
// The goalAmount field represents the total amount needed for the investment.
// The currentAmount field tracks the amount currently raised.
// The expectedROI field represents the expected return on investment.
// The investors field is an array of ObjectIds referencing the User model, representing users who have invested in the property.
// The status field can be one of 'available', 'investing', 'funded', or 'completed'.
// The type field can be one of 'apartment', 'house', 'commercial', or 'land'.
// The images field is an array of strings representing image URLs.
// The createdAt field defaults to the current date and time when a new property is created.
// Finally, the Property model is exported for use in other parts of the application.
// This code is typically used in a Node.js application that uses MongoDB as its database.
// Mongoose is a popular ODM (Object Data Modeling) library for MongoDB and Node.js.
// The schema helps in defining the structure of the property documents in the MongoDB collection.
// This code is typically placed in a separate file (e.g., model/Property.js) to keep the code organized.
// It can be used in conjunction with other parts of the application, such as routes and controllers,
// to handle property-related operations like creating, reading, updating, and deleting properties.
// The Property model can be used to create, read, update, and delete property documents in the MongoDB database.
// This code is essential for building property management features in a web application.
// It ensures that property data is stored in a structured way, making it easier to query and manipulate.
// The use of Mongoose allows for validation and type checking, ensuring data integrity.
// This code is typically placed in a separate file (e.g., model/Investment.js) to keep the code organized.
// It can be used in conjunction with other parts of the application, such as routes and controllers,
// to handle investment-related operations like creating, reading, updating, and deleting investments.
// The Property model can be used to create, read, update, and delete property documents in the MongoDB database.
// This code is essential for building property management features in a web application.
// It ensures that property data is stored in a structured way, making it easier to query and manipulate.
// The use of Mongoose allows for validation and type checking, ensuring data integrity.