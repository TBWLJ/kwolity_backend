const router = require('express').Router();
const {createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking, getBookingsByUser} = require('../controller/bookingController');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken')

// Create a new booking (requires authentication)
router.post('/', verifyToken, createBooking);

// Get bookings by user (requires authentication)
router.get('/user', verifyToken, getBookingsByUser);

// Get all bookings (requires admin authentication)
router.get('/', verifyToken, verifyTokenAndAdmin, getAllBookings);

// Get booking by ID (requires authentication)
router.get('/:id', verifyToken, getBookingById);

// Update booking by ID (requires admin authentication)
router.put('/:id', verifyToken, verifyTokenAndAdmin, updateBooking);

// Delete booking by ID (requires admin authentication)
router.delete('/:id', verifyToken, verifyTokenAndAdmin, deleteBooking);



// Export the router
module.exports = router;

