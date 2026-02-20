import User from '@/lib/models/User';
import LevelIncome from '@/lib/models/LevelIncome';

const LEVEL_PERCENTAGES = [5, 3, 1];

export const distributeLevelIncome = async (fromUserId, investmentId, investmentAmount) => {
  try {
    let currentUser = await User.findById(fromUserId);
    
    for (let i = 0; i < LEVEL_PERCENTAGES.length; i++) {
      if (!currentUser.referredBy) {
        break; 
      }

      const uplineUser = await User.findById(currentUser.referredBy);
      if (!uplineUser) {
        break;
      }

      const percentage = LEVEL_PERCENTAGES[i];
      const incomeAmount = (investmentAmount * percentage) / 100;

      await LevelIncome.create({
        userId: uplineUser._id,
        fromUserId: fromUserId,
        investmentId: investmentId,
        amount: incomeAmount,
        level: i + 1,
      });

      uplineUser.balance += incomeAmount;
      uplineUser.totalLevelIncome += incomeAmount;
      await uplineUser.save();

      currentUser = uplineUser;
    }
  } catch (error) {
    console.error('Error distributing level income:', error);
  }
};
