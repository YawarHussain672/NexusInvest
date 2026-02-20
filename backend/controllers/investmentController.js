const Investment = require('../models/Investment');
const User = require('../models/User');
const { distributeLevelIncome } = require('../services/businessLogic');

// @desc    Create a new investment
// @route   POST /api/investments
// @access  Private
const createInvestment = async (req, res) => {
  try {
    const { amount, plan } = req.body;

    if (!amount || !plan) {
      return res.status(400).json({ message: 'Please provide amount and plan' });
    }

    // Determine plan properties (mock logic, can be stored in DB)
    let dailyRoiRate = 0;
    let durationDays = 30; // 30 days default duration

    switch (plan.toLowerCase()) {
      case 'basic':
        dailyRoiRate = 1.0;
        break;
      case 'pro':
        dailyRoiRate = 1.5;
        durationDays = 60;
        break;
      case 'elite':
        dailyRoiRate = 2.0;
        durationDays = 90;
        break;
      default:
        return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // Usually you'd deduct from balance here if they deposited, or just track it
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);

    const investment = await Investment.create({
      userId: req.user.id,
      amount,
      plan: plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase(),
      dailyRoiRate,
      startDate,
      endDate,
      status: 'active'
    });

    // Update user's total invested
    user.totalInvested += Number(amount);
    await user.save();

    // Trigger immediate level income distribution
    await distributeLevelIncome(user._id, investment._id, amount);

    res.status(201).json(investment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user investments
// @route   GET /api/investments
// @access  Private
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.id }).sort('-createdAt');
    res.status(200).json(investments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createInvestment,
  getInvestments
};
