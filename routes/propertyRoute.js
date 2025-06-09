const router = require('express').Router();
const multer = require('multer');
const { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty, getPropertiesByStatus, getPropertiesByLocation, getPropertiesByPriceRange, getPropertiesByTitle, getPropertiesByUser, getPropertyCount } = require('../controller/propertyController');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');

const storage = multer.memoryStorage(); // Store files in memory buffer
const upload = multer({ storage });

// Property creation route (requires admin authentication)
router.post('/create', verifyTokenAndAdmin, upload.array('images', 10), createProperty);

// Get all properties route
router.get('/', getAllProperties);

// Get properties by user route
router.get('/user-properties', verifyToken, getPropertiesByUser);

// Get property by ID route
router.get('/:id', getPropertyById);

// Update property by ID route (requires admin authentication)
router.put('/:id', verifyTokenAndAdmin, updateProperty);

// Delete property by ID route (requires admin authentication)
router.delete('/:id', verifyTokenAndAdmin, deleteProperty);

// Get properties by status route
router.get('/status/:status', getPropertiesByStatus);

// Get properties by location route
router.get('/location/:location', getPropertiesByLocation);

// Get properties by price range route
router.get('/price', getPropertiesByPriceRange);

// Get properties by title route
router.get('/title/:title', getPropertiesByTitle);


// Get property count route
router.get('/count', getPropertyCount);

// Export the router
module.exports = router;