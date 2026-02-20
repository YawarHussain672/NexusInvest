import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { protect } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const user = await protect(req);
    if (!user) {
        return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

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

    const referralTree = await fetchTree(user.id, 1, 3); 

    return NextResponse.json(referralTree, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
