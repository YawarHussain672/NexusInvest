const User = require('../models/User');
const LevelIncome = require('../models/LevelIncome');
const Investment = require('../models/Investment');
const RoiHistory = require('../models/RoiHistory');

// Predefined Level percentages (e.g., L1: 5%, L2: 3%, L3: 1%)
const LEVEL_PERCENTAGES = [5, 3, 1];

/**
 * Distributes Level Income up the referral chain.
 * This can be triggered either on investment creation or daily on ROI (typically it's on investment creation).
 * For this dashboard, we will distribute on Investment creation.
 * 
 * @param {ObjectId} fromUserId - The user who made the investment
 * @param {ObjectId} investmentId - The ID of the investment
 * @param {Number} investmentAmount - The amount of the investment
 */
const distributeLevelIncome = async (fromUserId, investmentId, investmentAmount) => {
  try {
    let currentUser = await User.findById(fromUserId);
    
    // Distribute up to LEVEL_PERCENTAGES.length levels
    for (let i = 0; i < LEVEL_PERCENTAGES.length; i++) {
      if (!currentUser.referredBy) {
        break; // Reached the top of the chain
      }

      const uplineUser = await User.findById(currentUser.referredBy);
      if (!uplineUser) {
        break;
      }

      const percentage = LEVEL_PERCENTAGES[i];
      const incomeAmount = (investmentAmount * percentage) / 100;

      // Create LevelIncome record
      await LevelIncome.create({
        userId: uplineUser._id,
        fromUserId: fromUserId,
        investmentId: investmentId,
        amount: incomeAmount,
        level: i + 1,
      });

      // Update upline's balances
      uplineUser.balance += incomeAmount;
      uplineUser.totalLevelIncome += incomeAmount;
      await uplineUser.save();

      // Move up the chain
      currentUser = uplineUser;
    }
  } catch (error) {
    console.error('Error distributing level income:', error);
  }
};

/**
 * Calculate Daily ROI for all active investments.
 * This is intended to be run by the daily cron job.
 */
const calculateDailyROI = async () => {
    try {
      console.log('Running daily ROI calculation...');
      const activeInvestments = await Investment.find({ status: 'active' });
  
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
  
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
  
      for (const investment of activeInvestments) {
        // Check idempotency: Have we already processed ROI for this investment today?
        const existingRoi = await RoiHistory.findOne({
          investmentId: investment._id,
          date: { $gte: todayStart, $lte: todayEnd }
        });
  
        if (existingRoi) {
          console.log(`ROI already calculated for investment ${investment._id} today.`);
          continue;
        }
  
        // Check if investment is expired
        if (new Date() > investment.endDate) {
          investment.status = 'completed';
          await investment.save();
          continue;
        }
  
        const roiAmount = (investment.amount * investment.dailyRoiRate) / 100;
  
        // Create ROI record
        await RoiHistory.create({
          userId: investment.userId,
          investmentId: investment._id,
          amount: roiAmount,
          date: new Date()
        });
  
        // Update user's balances
        const user = await User.findById(investment.userId);
        if (user) {
          user.balance += roiAmount;
          user.totalROI += roiAmount;
          await user.save();
        }
      }
      console.log('Daily ROI calculation completed.');
    } catch (error) {
       console.error('Error calculating daily ROI:', error);
    }
};

module.exports = {
  distributeLevelIncome,
  calculateDailyROI
};
