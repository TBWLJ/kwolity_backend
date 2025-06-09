const Booking = require('../model/Booking');

const createBooking = async (req, res) => {
    const userId = req.session.userId;
    const { propertyId, startDate, endDate, totalAmount } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const newBooking = new Booking({
            propertyId,
            userId,
            startDate,
            endDate,
            totalAmount
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


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
    const userId = req.session.userId;

    try {
        const booking = await Booking.findById(id).populate('propertyId').populate('userId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only allow access if user is the owner or an admin
        if (booking.userId._id.toString() !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateBooking = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const updates = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true }).populate('propertyId').populate('userId');

        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const deleteBooking = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await Booking.findByIdAndDelete(id);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const getBookingsByUser = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const bookings = await Booking.find({ userId }).populate('propertyId');
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    getBookingsByUser
}