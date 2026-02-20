import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  balance: {
    type: Number,
    default: 0
  },
  totalInvested: {
    type: Number,
    default: 0
  },
  totalROI: {
    type: Number,
    default: 0
  },
  totalLevelIncome: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Next.js caching workaround for Mongoose models
export default mongoose.models.User || mongoose.model('User', UserSchema);
