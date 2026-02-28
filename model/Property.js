const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        require: true,
        unique: true,
        index: true,
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
        enum: ['available', 'rent', 'sole', 'sale'],
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