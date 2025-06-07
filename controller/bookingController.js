const Booking = require('../models/booking');

const createBooking = async (req, res) => {
    const { propertyId, userId, startDate, endDate, totalAmount } = req.body;

    try {
        // Create a new booking
        const newBooking = new Booking({
            propertyId,
            userId,
            startDate,
            endDate,
            totalAmount
        });

        // Save the booking to the database
        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getAllBookings = async (req, res) => {
    try {
        // Fetch all bookings from the database
        const bookings = await Booking.find().populate('propertyId').populate('userId');
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getBookingById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch booking by ID
        const booking = await Booking.findById(id).populate('propertyId').populate('userId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    }
    catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const updateBooking = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Update booking by ID
        const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true }).populate('propertyId').populate('userId');
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete booking by ID
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getBookingsByUser = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in req.user after authentication

    try {
        // Fetch bookings for the authenticated user
        const bookings = await Booking.find({ userId }).populate('propertyId');
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    getBookingsByUser
}