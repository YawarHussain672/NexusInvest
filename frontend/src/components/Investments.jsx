import React, { useEffect, useState } from 'react';
import api from '../api';
import { CheckCircle2, Clock } from 'lucide-react';

const Investments = ({ preview = false }) => {
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
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-gray-800 rounded-xl"></div>;

  const displayInvestments = preview ? investments.slice(0, 3) : investments;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Your Investments</h3>
      </div>
      {investments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No investments found. Start investing to earn daily ROI!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400/80 text-sm">
                <th className="pb-3 font-medium">Plan</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Daily ROI</th>
                <th className="pb-3 font-medium">Start Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {displayInvestments.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-700/20 transition-colors">
                  <td className="py-4 font-medium text-white">{inv.plan}</td>
                  <td className="py-4 text-indigo-300 font-semibold">${inv.amount}</td>
                  <td className="py-4 text-gray-300">{inv.dailyRoiRate}%</td>
                  <td className="py-4 text-gray-400 text-sm">
                    {new Date(inv.startDate).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === 'active' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {inv.status === 'active' ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
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
