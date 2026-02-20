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
    const { username, email, password, referralCode } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Please add all fields' }, { status: 400 });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    const newReferralCode = username + Math.floor(1000 + Math.random() * 9000);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy
    });

    if (user) {
      return NextResponse.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode,
        balance: user.balance,
        token: generateToken(user._id),
      }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
