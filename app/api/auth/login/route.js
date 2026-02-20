import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
      return NextResponse.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode,
        balance: user.balance,
        token: generateToken(user._id),
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
