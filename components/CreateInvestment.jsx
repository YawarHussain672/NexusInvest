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
    <div className="bg-[#1C1C1E] border border-[#38383A]/60 rounded-3xl p-6 relative overflow-hidden">
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xl font-bold text-white tracking-tight">Invest</h3>
        <span className="text-[13px] font-semibold text-[#30D158] bg-[#30D158]/10 px-3 py-1 rounded-full">
          {currentPlan.roi} Daily ROI
        </span>
      </div>
      
      <form onSubmit={handleInvest} className="space-y-5 relative z-10">
        {error && <div className="p-3 text-[13px] text-red-500 bg-red-500/10 rounded-xl font-medium">{error}</div>}
        
        {/* Segmented Control for Plans */}
        <div className="bg-black/50 p-1 rounded-xl flex items-center justify-between border border-[#38383A]/50">
          {Object.keys(plans).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlan(p)}
              className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
                plan === p
                  ? 'bg-[#38383A] text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Minimal Amount Input */}
        <div>          
          <div className="relative flex items-center bg-black/40 border border-[#38383A] rounded-2xl overflow-hidden focus-within:border-[#0A84FF] focus-within:ring-1 focus-within:ring-[#0A84FF] transition-all">
             <div className="pl-5 pr-2 text-gray-500 font-medium text-lg">$</div>
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
          <div className="mt-3 text-[13px] text-gray-500 flex justify-between px-2 font-medium">
             <span>Lock-in: <span className="text-white">{currentPlan.duration}</span></span>
             {amount && Number(amount) >= currentPlan.min ? (
                <span className="text-[#30D158]">Est. Daily: ${((Number(amount) * parseFloat(currentPlan.roi)) / 100).toFixed(2)}</span>
             ) : (
                <span>Dynamic Est.</span>
             )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-4 rounded-2xl text-[15px] font-bold text-white bg-[#0A84FF] hover:bg-[#0A84FF]/90 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-4 active:scale-[0.98]"
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
