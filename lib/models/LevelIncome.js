import mongoose from 'mongoose';

const LevelIncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.LevelIncome || mongoose.model('LevelIncome', LevelIncomeSchema);
