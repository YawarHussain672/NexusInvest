import connectDB from '@/lib/db';
import Investment from '@/lib/models/Investment';
import User from '@/lib/models/User';
import { protect } from '@/lib/auth';
import { distributeLevelIncome } from '@/lib/businessLogic';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { amount, plan } = body;

    if (!amount || !plan) {
      return NextResponse.json({ message: 'Please provide amount and plan' }, { status: 400 });
    }

    let dailyRoiRate = 0;
    let durationDays = 30;

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
        return NextResponse.json({ message: 'Invalid plan selected' }, { status: 400 });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);

    const investment = await Investment.create({
      userId: user._id,
      amount,
      plan: plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase(),
      dailyRoiRate,
      startDate,
      endDate,
      status: 'active'
    });

    user.totalInvested += Number(amount);
    await user.save();

    await distributeLevelIncome(user._id, investment._id, amount);

    return NextResponse.json(investment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const investments = await Investment.find({ userId: user._id }).sort('-createdAt');
    return NextResponse.json(investments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
