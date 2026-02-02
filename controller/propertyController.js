const Property = require('../model/Property');
const cloudinary = require('cloudinary').v2;
const User = require('../model/User');

// Cloudinary config
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

// Create a new property
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
      createdBy: req.user.id, // track property owner
    });

    await newProperty.save();

    res.status(201).json({ message: 'Property created successfully', property: newProperty });
  } catch (error) {
    console.error('Error creating property:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch property by ID
const getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update property
const updateProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProperty) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
  } catch (error) {
    console.error('Error updating property:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch properties by user (saved properties)
const getPropertiesByUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedProperties');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.savedProperties || user.savedProperties.length === 0) {
      return res.status(404).json({ message: 'No saved properties found for this user' });
    }
    res.status(200).json(user.savedProperties);
  } catch (error) {
    console.error('Error fetching saved properties:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Other filters (type, status, location, price, title) remain the same
const getPropertiesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const properties = await Property.find({ type });
    if (!properties.length) return res.status(404).json({ message: 'No properties found for this type' });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties by type:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPropertiesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const properties = await Property.find({ status });
    if (!properties.length) return res.status(404).json({ message: 'No properties found for this status' });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties by status:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPropertiesByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const properties = await Property.find({ location: new RegExp(location, 'i') });
    if (!properties.length) return res.status(404).json({ message: 'No properties found for this location' });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties by location:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPropertiesByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    const properties = await Property.find({
      price: { $gte: minPrice, $lte: maxPrice }
    });
    if (!properties.length) return res.status(404).json({ message: 'No properties found in this price range' });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties by price range:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPropertiesByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const properties = await Property.find({ title: new RegExp(title, 'i') });
    if (!properties.length) return res.status(404).json({ message: 'No properties found with this title' });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties by title:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPropertyCount = async (req, res) => {
  try {
    const count = await Property.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting properties:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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
