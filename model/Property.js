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
    type: {
        type: String,
        enum: ['apartment', 'house', 'commercial', 'land'],
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'rent', 'sold'],
        required: true
    },
    images: {
        type: [String],
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
// This code defines a Mongoose schema for a Property model in a Node.js application.
// The schema includes fields for title, description, type, status, images, price, location, and createdAt timestamp.
// The title, description, type, status, images, price, and location fields are required.
// The type field can be one of 'apartment', 'house', 'commercial', or 'land'.
// The status field can be one of 'available', 'rent', or 'sold'.
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
// This code is essential for building property management features in a web application.