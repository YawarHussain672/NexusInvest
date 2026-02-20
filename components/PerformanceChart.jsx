'use client';
import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '@/lib/api';

const PerformanceChart = ({ refreshKey = 0 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data: investments } = await api.get('/investments');
        
        // Transform recent investments into chartable data points (last 7 days simulation)
        const chartData = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() - i);
          
          let dailyInvested = 0;
          let expectedRoi = 0;
          
          // Sum up investments that started on or before this day
          investments.forEach(inv => {
             const invDate = new Date(inv.startDate);
             if (invDate <= targetDate) {
                 dailyInvested += inv.amount;
                 expectedRoi += (inv.amount * inv.dailyRoiRate) / 100;
             }
          });

          chartData.push({
            name: targetDate.toLocaleDateString('en-US', { weekday: 'short' }),
            Invested: dailyInvested,
            ROI: expectedRoi.toFixed(2)
          });
        }
        
        setData(chartData);
      } catch (error) {
        console.error('Failed to fetch chart data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="waterdrop rounded-[2rem] p-6 shadow-xl h-[300px] flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-700 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-700 rounded col-span-2"></div>
                <div className="h-2 bg-gray-700 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="waterdrop rounded-[2rem] p-6 relative overflow-hidden h-[320px] flex flex-col z-10">
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <h3 className="text-xl font-bold text-white tracking-tight">7-Day Growth Overview</h3>
      </div>
      
      {data.length === 0 || data.every(d => d.Invested === 0) ? (
        <div className="flex-1 flex items-center justify-center text-gray-300 bg-black/30 backdrop-blur-md shadow-inner border border-white/10 rounded-2xl z-10 relative">
          <p>No investment data to chart yet.</p>
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(30,30,32,0.6)', 
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '1rem',
                  color: '#fff',
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                itemStyle={{ color: '#fff', fontWeight: '500' }}
              />
              <Area 
                type="monotone" 
                dataKey="Invested" 
                stroke="#06b6d4" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorInvested)" 
              />
              <Area 
                type="monotone" 
                dataKey="ROI" 
                stroke="#a855f7" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRoi)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
