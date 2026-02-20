import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import LevelIncome from '@/lib/models/LevelIncome';
import RoiHistory from '@/lib/models/RoiHistory';
import { protect } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const user = await protect(req);
    if (!user) {
        return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayRois = await RoiHistory.find({
      userId: user.id,
      date: { $gte: todayStart }
    });
    const todayRoiAmount = todayRois.reduce((acc, curr) => acc + curr.amount, 0);

    const todayLevelIncomes = await LevelIncome.find({
      userId: user.id,
      date: { $gte: todayStart }
    });
    const todayLevelIncomeAmount = todayLevelIncomes.reduce((acc, curr) => acc + curr.amount, 0);

    return NextResponse.json({
      balance: dbUser.balance,
      totalInvested: dbUser.totalInvested,
      totalROI: dbUser.totalROI,
      totalLevelIncome: dbUser.totalLevelIncome,
      todayRoi: todayRoiAmount,
      todayLevelIncome: todayLevelIncomeAmount,
      referralCode: dbUser.referralCode
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
