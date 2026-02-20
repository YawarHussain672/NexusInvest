import mongoose from 'mongoose';

const InvestmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an investment amount']
  },
  plan: {
    type: String,
    required: [true, 'Please specify an investment plan'],
    enum: ['Basic', 'Pro', 'Elite']
  },
  dailyRoiRate: {
    type: Number,
    required: [true, 'Please specify daily ROI rate in percentage']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Please specify an end date for the investment']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
});

export default mongoose.models.Investment || mongoose.model('Investment', InvestmentSchema);
