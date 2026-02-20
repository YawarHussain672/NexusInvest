'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CheckCircle2, Clock } from 'lucide-react';

const Investments = ({ preview = false, refreshKey = 0 }) => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const { data } = await api.get('/investments');
        setInvestments(data);
      } catch (error) {
        console.error('Failed to fetch investments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestments();
  }, [refreshKey]);

  if (loading) return <div className="animate-pulse h-32 waterdrop rounded-[2rem]"></div>;

  const displayInvestments = preview ? investments.slice(0, 5) : investments;

  return (
    <div className="waterdrop rounded-[2rem] p-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Your Investments</h3>
        {preview && investments.length > 5 && (
          <span className="text-[13px] font-medium bg-black/30 backdrop-blur-md shadow-inner border border-white/10 text-gray-300 px-3 py-1 rounded-full">
            Showing latest 5 of {investments.length}
          </span>
        )}
      </div>
      {investments.length === 0 ? (
        <div className="text-center py-12 bg-black/30 rounded-[1.5rem] shadow-inner border border-white/5">
          <Clock className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-200 font-medium">No investments found.</p>
          <p className="text-[13px] text-gray-400 mt-1">Start investing to earn daily ROI!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[13px]">
                <th className="pb-3 font-medium">Plan</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Daily ROI</th>
                <th className="pb-3 font-medium">Start Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayInvestments.map((inv) => (
                <tr key={inv._id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 font-semibold text-white group-hover:text-cyan-300 transition-colors dropdown">{inv.plan}</td>
                  <td className="py-4 text-emerald-400 font-bold">${inv.amount}</td>
                  <td className="py-4 text-gray-300 font-medium">{inv.dailyRoiRate}%</td>
                  <td className="py-4 text-gray-400 text-[13px] font-medium">
                    {new Date(inv.startDate).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      inv.status === 'active' 
                        ? 'waterdrop-badge text-emerald-400' 
                        : 'bg-black/30 border border-white/10 text-gray-400 shadow-inner'
                    }`}>
                      {inv.status === 'active' ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Investments;
