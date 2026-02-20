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
    <div className="waterdrop rounded-[2rem] p-6 relative overflow-hidden group">
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xl font-bold text-white tracking-tight">Invest</h3>
        <span className="text-[13px] font-semibold text-emerald-400 waterdrop-badge px-3 py-1 rounded-full">
          {currentPlan.roi} Daily ROI
        </span>
      </div>
      
      <form onSubmit={handleInvest} className="space-y-5 relative z-10">
        {error && <div className="p-3 text-[13px] text-red-400 bg-red-400/10 border border-red-500/20 rounded-xl font-medium">{error}</div>}
        
        {/* Segmented Control for Plans */}
        <div className="bg-black/30 backdrop-blur-md shadow-inner p-1.5 rounded-2xl flex items-center justify-between border border-white/10">
          {Object.keys(plans).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlan(p)}
              className={`flex-1 py-2 text-[13px] font-semibold rounded-xl transition-all duration-300 ${
                plan === p
                  ? 'bg-white/10 text-white shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Minimal Amount Input */}
        <div>          
          <div className="relative flex items-center bg-black/30 backdrop-blur-md shadow-inner border border-white/10 rounded-2xl overflow-hidden focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300">
             <div className="pl-5 pr-2 text-gray-400 font-medium text-lg">$</div>
             <input
                type="number"
                min={currentPlan.min}
                required
                className="w-full py-4 bg-transparent text-white placeholder-gray-600 text-xl font-bold focus:outline-none"
                placeholder={`Min ${currentPlan.min}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="pr-5 text-[13px] font-bold text-gray-500 uppercase tracking-wider">USD</div>
          </div>
          <div className="mt-3 text-[13px] text-gray-400 flex justify-between px-2 font-medium">
             <span>Lock-in: <span className="text-white">{currentPlan.duration}</span></span>
             {amount && Number(amount) >= currentPlan.min ? (
                <span className="text-emerald-400">Est. Daily: ${((Number(amount) * parseFloat(currentPlan.roi)) / 100).toFixed(2)}</span>
             ) : (
                <span>Dynamic Est.</span>
             )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-4 rounded-2xl text-[15px] font-bold text-white waterdrop-button transition-all duration-300 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed group mt-4 active:scale-[0.98]"
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
