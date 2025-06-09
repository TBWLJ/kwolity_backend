const Property = require('../model/Property');
const cloudinary = require('cloudinary').v2;
const User = require('../model/User');

// refractor the createProperty function to include uploading to cloudinary
// and saving the image URLs in the database
// Configure cloudinary (make sure to set your credentials in env variables)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'properties' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

const createProperty = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
    const imageUrls = await Promise.all(uploadPromises);

    const newProperty = new Property({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      status: req.body.status,
      images: imageUrls,
      price: req.body.price,
      location: req.body.location,
    });

    await newProperty.save();

    res.status(201).json({ message: 'Property created successfully', property: newProperty });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const getAllProperties = async (req, res) => {
    try {
        // Fetch all properties from the database
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getPropertyById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch property by ID
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateProperty = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Update property by ID
        const updatedProperty = await Property.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete property by ID
        const deletedProperty = await Property.findByIdAndDelete(id);
        if (!deletedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getPropertiesByType = async (req, res) => {
    const { type } = req.params;

    try {
        // Fetch properties by type
        const properties = await Property.find({ type });
        if (properties.length === 0) {
            return res.status(404).json({ message: 'No properties found for this type' });
        }
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties by type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getPropertiesByStatus = async (req, res) => {
    const { status } = req.params;

    try {
        // Fetch properties by status
        const properties = await Property.find({ status });
        if (properties.length === 0) {
            return res.status(404).json({ message: 'No properties found for this status' });
        }
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties by status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getPropertiesByLocation = async (req, res) => {
    const { location } = req.params;

    try {
        // Fetch properties by location
        const properties = await Property.find({ location: new RegExp(location, 'i') }); // Case-insensitive search
        if (properties.length === 0) {
            return res.status(404).json({ message: 'No properties found for this location' });
        }
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties by location:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getPropertiesByPriceRange = async (req, res) => {
    const { minPrice, maxPrice } = req.query;

    try {
        // Fetch properties within a price range
        const properties = await Property.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
        if (properties.length === 0) {
            return res.status(404).json({ message: 'No properties found in this price range' });
        }
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties by price range:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getPropertiesByTitle = async (req, res) => {
    const { title } = req.params;

    try {
        // Fetch properties by title
        const properties = await Property.find({ title: new RegExp(title, 'i') }); // Case-insensitive search
        if (properties.length === 0) {
            return res.status(404).json({ message: 'No properties found with this title' });
        }
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties by title:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getPropertiesByUser = async (req, res) => {
  const userId = req.session.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(userId).populate('savedProperties');
    if (!user || !user.savedProperties || user.savedProperties.length === 0) {
      return res.status(404).json({ message: 'No saved properties found for this user' });
    }
    res.status(200).json(user.savedProperties);
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getPropertyCount = async (req, res) => {
    try {
        // Count total properties
        const count = await Property.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// give comments on the code
// This code defines a set of controller functions for managing properties in a real estate application.
// Each function handles a specific operation related to properties, such as creating, fetching, updating, and deleting properties.
// The functions interact with a MongoDB database using Mongoose, a popular ODM (Object Data Modeling) library for Node.js.
// The code includes error handling to ensure that appropriate responses are sent back to the client in case of errors.
// The functions are designed to be used in an Express.js application, where they can be mapped to specific routes.
// The code also includes functions to filter properties based on various criteria such as type, status, location, price range, and title.
// The `getPropertiesByUser` function retrieves properties created by the authenticated user, assuming user information is stored in `req.user`.
// The `getPropertyCount` function provides a count of total properties in the database.
// This modular approach allows for better organization and maintainability of the codebase, making it easier to manage property-related operations in the application.
module.exports = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getPropertiesByType,
    getPropertiesByStatus,
    getPropertiesByLocation,
    getPropertiesByPriceRange,
    getPropertiesByTitle,
    getPropertiesByUser,
    getPropertyCount
};
