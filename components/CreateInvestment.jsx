'use client';
import React, { useState } from 'react';
import api from '@/lib/api';

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
    <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Subtle modern glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 className="text-lg font-bold text-white tracking-tight">Invest</h3>
        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
          {currentPlan.roi} Daily ROI
        </span>
      </div>
      
      <form onSubmit={handleInvest} className="space-y-4 relative z-10">
        {error && <div className="p-2.5 text-xs text-red-400 bg-red-400/10 rounded-lg border border-red-400/20">{error}</div>}
        
        {/* Segmented Control for Plans */}
        <div className="bg-gray-900/50 p-1 rounded-xl flex items-center justify-between border border-gray-700/50">
          {Object.keys(plans).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlan(p)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                plan === p
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Minimal Amount Input */}
        <div>          
          <div className="relative flex items-center bg-gray-900/30 border border-gray-700/50 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
             <div className="pl-4 pr-2 text-gray-500 font-medium">$</div>
             <input
                type="number"
                min={currentPlan.min}
                required
                className="w-full py-3 bg-transparent text-white placeholder-gray-600 text-lg font-semibold focus:outline-none"
                placeholder={`Min ${currentPlan.min}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">USD</div>
          </div>
          <div className="mt-2 text-[11px] text-gray-500 flex justify-between px-1">
             <span>Lock-in: {currentPlan.duration}</span>
             {amount && Number(amount) >= currentPlan.min ? (
                <span className="text-indigo-400 font-medium">Est. Daily: ${((Number(amount) * parseFloat(currentPlan.roi)) / 100).toFixed(2)}</span>
             ) : (
                <span>Dynamic Est.</span>
             )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Confirm Investment
              <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateInvestment;
