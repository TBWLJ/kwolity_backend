const router = require('express').Router();
const {createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking, getBookingsByUser} = require('../controller/bookingController');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken')

// Create a new booking (requires authentication)
router.post('/', verifyToken, createBooking);

// Get bookings by user (requires authentication)
router.get('/user', verifyToken, getBookingsByUser);

// Get all bookings (requires admin authentication)
router.get('/', verifyTokenAndAdmin, getAllBookings);

// Get booking by ID (requires authentication)
router.get('/:id', verifyToken, getBookingById);

// Update booking by ID (requires admin authentication)
router.put('/:id', verifyTokenAndAdmin, updateBooking);

// Delete booking by ID (requires admin authentication)
router.delete('/:id', verifyTokenAndAdmin, deleteBooking);



// Export the router
module.exports = router;


// This code defines the booking routes for creating, retrieving, updating, and deleting bookings.
// It uses Express.js to create a router and applies middleware for authentication and authorization.
// The routes are protected by authentication and admin checks where necessary.
// The router is then exported for use in the main application file.
// This code is typically placed in a separate file (e.g., routes/bookingRoute.js) to keep the code organized.
// It can be used in conjunction with other parts of the application, such as controllers and models,
// to handle booking-related operations in a web application.
// The createBooking route allows authenticated users to create a new booking.
// The getAllBookings route allows admin users to retrieve all bookings.
// The getBookingById route allows authenticated users to retrieve a specific booking by its ID.
// The updateBooking route allows admin users to update a specific booking by its ID.   
// The deleteBooking route allows admin users to delete a specific booking by its ID.
// This code is essential for building booking management features in a web application.
// It ensures that booking data is handled securely and efficiently, allowing for operations like creating,
// retrieving, updating, and deleting bookings.
// The use of middleware for authentication and authorization ensures that only authorized users can perform certain actions.
// This code is typically used in a Node.js application that uses MongoDB as its database.