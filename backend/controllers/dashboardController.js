const User = require('../models/User');
const Investment = require('../models/Investment');
const LevelIncome = require('../models/LevelIncome');
const RoiHistory = require('../models/RoiHistory');

// @desc    Get user dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get today's ROI
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayRois = await RoiHistory.find({
      userId: req.user.id,
      date: { $gte: todayStart }
    });

    const todayRoiAmount = todayRois.reduce((acc, curr) => acc + curr.amount, 0);

    // Get today's Level Income
    const todayLevelIncomes = await LevelIncome.find({
      userId: req.user.id,
      date: { $gte: todayStart }
    });

    const todayLevelIncomeAmount = todayLevelIncomes.reduce((acc, curr) => acc + curr.amount, 0);

    res.status(200).json({
      balance: user.balance,
      totalInvested: user.totalInvested,
      totalROI: user.totalROI,
      totalLevelIncome: user.totalLevelIncome,
      todayRoi: todayRoiAmount,
      todayLevelIncome: todayLevelIncomeAmount,
      referralCode: user.referralCode
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user referral tree
// @route   GET /api/dashboard/referrals/tree
// @access  Private
const getReferralTree = async (req, res) => {
  try {
    // We will fetch up to 3 levels deep for this example
    const fetchTree = async (userId, currentLevel, maxLevel) => {
      if (currentLevel > maxLevel) return [];

      const directReferrals = await User.find({ referredBy: userId }).select('username email totalInvested createdAt');
      
      const tree = await Promise.all(directReferrals.map(async (refUser) => {
        const children = await fetchTree(refUser._id, currentLevel + 1, maxLevel);
        return {
          id: refUser._id,
          username: refUser.username,
          totalInvested: refUser.totalInvested,
          joinedAt: refUser.createdAt,
          level: currentLevel,
          children: children
        };
      }));

      return tree;
    };

    const referralTree = await fetchTree(req.user.id, 1, 3); // Fetch 3 levels

    res.status(200).json(referralTree);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getReferralTree
};
