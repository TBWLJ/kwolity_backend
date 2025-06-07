const router = require('express').Router();
const { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty, getPropertiesByStatus, getPropertiesByLocation, getPropertiesByPriceRange, getPropertiesByTitle, getPropertiesByUser, getPropertyCount } = require('../controller/propertyController');
const { verifyToken, isAdmin } = require('../middleware/auth');


// Property creation route (requires admin authentication)
router.post('/', verifyToken, isAdmin, createProperty);
// Get all properties route
router.get('/', getAllProperties);
// Get property by ID route
router.get('/:id', getPropertyById);
// Update property by ID route (requires admin authentication)
router.put('/:id', verifyToken, isAdmin, updateProperty);
// Delete property by ID route (requires admin authentication)
router.delete('/:id', verifyToken, isAdmin, deleteProperty);
// Get properties by status route
router.get('/status/:status', getPropertiesByStatus);
// Get properties by location route
router.get('/location/:location', getPropertiesByLocation);
// Get properties by price range route
router.get('/price', getPropertiesByPriceRange);
// Get properties by title route
router.get('/title/:title', getPropertiesByTitle);
// Get properties by user route
router.get('/user/:userId', getPropertiesByUser);
// Get property count route
router.get('/count', getPropertyCount);

// Export the router
module.exports = router;