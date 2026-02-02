const Investment = require('../model/Investment');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create new investment
const createInvestment = async (req, res) => {
  const { title, description, goalAmount, currentAmount, expectedROI, status } = req.body;
  let images = req.body.images || [];

  try {
    let imageUrls = [];

    if (images.length > 0) {
      const uploadPromises = images.map(async (img) => {
        const uploadResponse = await cloudinary.uploader.upload(img, { folder: 'investments' });
        return uploadResponse.secure_url;
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    const newInvestment = new Investment({
      title,
      description,
      goalAmount,
      currentAmount,
      expectedROI,
      status: status || 'available',
      images: imageUrls,
    });

    await newInvestment.save();
    res.status(201).json({ message: 'Investment created successfully', investment: newInvestment });
  } catch (error) {
    console.error('Error creating investment:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all investments
const getAllInvestments = async (req, res) => {
  try {
    const investments = await Investment.find();
    res.status(200).json(investments);
  } catch (error) {
    console.error('Error fetching investments:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get investment by ID
const getInvestmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const investment = await Investment.findById(id);
    if (!investment) return res.status(404).json({ message: 'Investment not found' });
    res.status(200).json(investment);
  } catch (error) {
    console.error('Error fetching investment:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update investment
const updateInvestment = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedInvestment = await Investment.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedInvestment) return res.status(404).json({ message: 'Investment not found' });
    res.status(200).json({ message: 'Investment updated successfully', investment: updatedInvestment });
  } catch (error) {
    console.error('Error updating investment:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete investment
const deleteInvestment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedInvestment = await Investment.findByIdAndDelete(id);
    if (!deletedInvestment) return res.status(404).json({ message: 'Investment not found' });
    res.status(200).json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Error deleting investment:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Invest in a property
const investInProperty = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { amount } = req.body;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const investment = await Investment.findById(id);
    if (!investment) return res.status(404).json({ message: 'Investment not found' });

    if (investment.status !== 'investing') {
      return res.status(400).json({ message: 'Investment is not open for funding' });
    }

    investment.currentAmount += amount;

    if (!investment.investors.includes(userId)) {
      investment.investors.push(userId);
    }

    if (investment.currentAmount >= investment.goalAmount) {
      investment.status = 'funded';
    }

    await investment.save();
    res.status(200).json({ message: 'Investment successful', investment });
  } catch (error) {
    console.error('Error investing in property:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get investments by the current user
const getInvestmentsByUser = async (req, res) => {
  const userId = req.user.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const investments = await Investment.find({ investors: userId });
    res.status(200).json(investments);
  } catch (error) {
    console.error('Error fetching user investments:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get investment count
const getInvestmentCount = async (req, res) => {
  try {
    const count = await Investment.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching investment count:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createInvestment,
  getAllInvestments,
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
  investInProperty,
  getInvestmentsByUser,
  getInvestmentCount,
};
