import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import connectDB from '@/lib/db';

export async function protect(req) {
  await connectDB();
  
  const authHeader = req.headers.get('authorization');
  let token;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      return user;
    } catch (error) {
      return null;
    }
  }

  return null;
}
