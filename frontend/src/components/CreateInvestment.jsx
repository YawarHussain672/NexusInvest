import React, { useState } from 'react';
import api from '../api';

const CreateInvestment = ({ onInvested }) => {
  const [amount, setAmount] = useState('');
  const [plan, setPlan] = useState('Basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plans = {
    Basic: { roi: '1.0%', duration: '30 Days', min: 100 },
    Pro: { roi: '1.5%', duration: '60 Days', min: 1000 },
    Elite: { roi: '2.0%', duration: '90 Days', min: 5000 },
  };

  const currentPlan = plans[plan];

  const handleInvest = async (e) => {
    e.preventDefault();
    if (Number(amount) < currentPlan.min) {
      setError(`Minimum investment for ${plan} is $${currentPlan.min}`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/investments', { amount: Number(amount), plan });
      setAmount('');
      if (onInvested) onInvested();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl"></div>
      
      <h3 className="text-xl font-semibold text-white mb-6 relative z-10">New Investment</h3>
      
      <form onSubmit={handleInvest} className="space-y-5 relative z-10">
        {error && <div className="p-2 text-sm text-red-400 bg-red-400/10 rounded">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Select Plan</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(plans).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlan(p)}
                className={`py-2 px-1 text-sm font-medium rounded-lg border transition-all ${
                  plan === p
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Daily ROI:</span>
            <span className="text-green-400 font-medium">{currentPlan.roi}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Duration:</span>
            <span className="text-white font-medium">{currentPlan.duration}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Amount (USD)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              min={currentPlan.min}
              required
              className="block w-full pl-7 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder={`Min ${currentPlan.min}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Invest Now'}
        </button>
      </form>
    </div>
  );
};

export default CreateInvestment;
