import connectDB from '@/lib/db';
import Investment from '@/lib/models/Investment';
import RoiHistory from '@/lib/models/RoiHistory';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    console.log('Running Vercel Cron ROI calculation...');
    
    const activeInvestments = await Investment.find({ status: 'active' });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    let processedCount = 0;

    for (const investment of activeInvestments) {
      const existingRoi = await RoiHistory.findOne({
        investmentId: investment._id,
        date: { $gte: todayStart, $lte: todayEnd }
      });

      if (existingRoi) {
        continue;
      }

      if (new Date() > investment.endDate) {
        investment.status = 'completed';
        await investment.save();
        continue;
      }

      const roiAmount = (investment.amount * investment.dailyRoiRate) / 100;

      await RoiHistory.create({
        userId: investment.userId,
        investmentId: investment._id,
        amount: roiAmount,
        date: new Date()
      });

      const user = await User.findById(investment.userId);
      if (user) {
        user.balance += roiAmount;
        user.totalROI += roiAmount;
        await user.save();
      }
      processedCount++;
    }
    
    console.log(`Cron calculation completed. Processed ${processedCount} new ROI payments.`);
    return NextResponse.json({ success: true, processed: processedCount }, { status: 200 });
  } catch (error) {
    console.error('Error calculating daily ROI:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
