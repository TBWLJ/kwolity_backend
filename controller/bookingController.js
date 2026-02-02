const Booking = require('../model/Booking');

// Create a new booking
const createBooking = async (req, res) => {
  const userId = req.user.id; // JWT-authenticated user
  const { propertyId, startDate, endDate, totalAmount } = req.body;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

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
    console.error('Error creating booking:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all bookings (admin only or public if needed)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('propertyId')
      .populate('userId');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch a booking by ID
const getBookingById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id)
      .populate('propertyId')
      .populate('userId');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only allow access if owner or admin
    if (booking.userId._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update booking
const updateBooking = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true })
      .populate('propertyId')
      .populate('userId');

    res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get bookings by current user
const getBookingsByUser = async (req, res) => {
  const userId = req.user.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const bookings = await Booking.find({ userId })
      .populate('propertyId');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error.message);
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
};
