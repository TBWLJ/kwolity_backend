const router = require('express').Router();
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken')
const {createInvestment, getAllInvestments, getInvestmentById, updateInvestment, deleteInvestment, getInvestmentsByUser, getInvestmentCount} = require('../controller/investmentController');

// Investment creation route (requires admin authentication)
router.post('/', verifyTokenAndAdmin, createInvestment);

// Get all investments route
router.get('/', getAllInvestments);

// Get investment by ID route
router.get('/:id', getInvestmentById);

// Update investment by ID route (requires admin authentication)
router.put('/:id', verifyTokenAndAdmin, updateInvestment);

// Delete investment by ID route (requires admin authentication)
router.delete('/:id', verifyTokenAndAdmin, deleteInvestment);

// Get investments by user route
router.get('/user', verifyToken, getInvestmentsByUser);

// Get investment count route
router.get('/count', getInvestmentCount);

// Export the router
module.exports = router;


// This code defines the investment routes for creating, retrieving, updating, and deleting investments.
// It uses Express.js to create a router and applies middleware for authentication and authorization.
// The routes are protected by authentication and admin checks where necessary.
// The router is then exported for use in the main application file.
// This code is typically placed in a separate file (e.g., routes/investmentRoute.js) to keep the code organized.
// It can be used in conjunction with other parts of the application, such as controllers and models,
// to handle investment-related operations in a web application.
// The createInvestment route allows admin users to create a new investment.
// The getAllInvestments route allows anyone to retrieve all investments.
// The getInvestmentById route allows anyone to retrieve a specific investment by its ID.
// The updateInvestment route allows admin users to update a specific investment by its ID.
// The deleteInvestment route allows admin users to delete a specific investment by its ID.
// The getInvestmentsByUser route allows authenticated users to retrieve investments associated with a specific user.
// The getInvestmentCount route allows anyone to retrieve the total count of investments.
// This code is essential for building investment management features in a web application.
// It ensures that investment data is handled securely and efficiently, allowing for operations like creating,
// retrieving, updating, and deleting investments.
// The use of middleware for authentication and authorization ensures that only authorized users can perform certain actions.
// This code is typically used in a Node.js application that uses MongoDB as its database.
// It is essential for building investment management features in a web application.