'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { LogOut, LayoutDashboard, DollarSign, Activity, Users, PlusCircle, TrendingUp } from 'lucide-react';
import Investments from '@/components/Investments';
import ReferralTree from '@/components/ReferralTree';
import CreateInvestment from '@/components/CreateInvestment';
import PerformanceChart from '@/components/PerformanceChart';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const { data } = await api.get('/dashboard');
      setStats(data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleInvestmentCreated = () => {
    fetchStats();
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 selection:bg-indigo-500/30 font-sans relative overflow-x-hidden">
      {/* Dynamic colorful blobs for the waterdrop effect to distort */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-[100px] animate-pulse relative z-0" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-[100px] animate-pulse relative z-0" style={{ animationDuration: '12s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-[100px] animate-pulse relative z-0" style={{ animationDuration: '10s' }} />
      </div>

      {/* Navbar - iOS style frosted top bar */}
      <nav className="relative z-20 sticky top-0 waterdrop px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mx-4 mt-4 rounded-3xl m-auto max-w-7xl">
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-indigo-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              NexusInvest
            </span>
          </div>
          {/* Mobile Logout (Visible on small screens) */}
          <button
            onClick={handleLogout}
            className="sm:hidden flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="h-7 w-7" />
          </button>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-[13px] flex items-center w-full justify-between sm:justify-start bg-black/30 backdrop-blur-sm py-1.5 px-3 rounded-full border border-white/10 shadow-inner">
            <span className="text-gray-300 mr-2 whitespace-nowrap font-medium">Ref Code:</span>
            <span className="font-mono text-cyan-400 font-semibold select-all break-all text-[11px] sm:text-[13px]">
              {stats?.referralCode}
            </span>
          </div>
          {/* Desktop Logout */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 mr-1" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Balance"
            value={`$${stats?.balance?.toFixed(2) || '0.00'}`}
            icon={<DollarSign className="h-6 w-6 text-[#30D158]" />}
            colorClass="text-[#30D158]"
          />
          <StatCard
            title="Total Invested"
            value={`$${stats?.totalInvested?.toFixed(2) || '0.00'}`}
            icon={<TrendingUp className="h-6 w-6 text-[#0A84FF]" />}
            colorClass="text-[#0A84FF]"
          />
          <StatCard
            title="Total ROI"
            value={`$${stats?.totalROI?.toFixed(2) || '0.00'}`}
            icon={<Activity className="h-6 w-6 text-[#BF5AF2]" />}
            subtitle={`+$${stats?.todayRoi?.toFixed(2) || '0.00'}`}
            colorClass="text-[#BF5AF2]"
          />
          <StatCard
            title="Level Income"
            value={`$${stats?.totalLevelIncome?.toFixed(2) || '0.00'}`}
            icon={<Users className="h-6 w-6 text-[#FF9F0A]" />}
            subtitle={`+$${stats?.todayLevelIncome?.toFixed(2) || '0.00'}`}
            colorClass="text-[#FF9F0A]"
          />
        </div>

        {/* Tabs */}
        {/* iOS style Segmented Control Tabs */}
        <div className="flex justify-center mb-8 relative z-20">
          <div className="waterdrop p-1.5 rounded-2xl flex space-x-1 w-full max-w-md shrink-0 overflow-x-auto hide-scrollbar">
            {['overview', 'investments', 'network'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 text-[14px] font-semibold rounded-xl transition-all duration-300 capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-white/10 text-white shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative z-10">
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Top Row: Recent Investments & New Investment */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                <div className="col-span-1 xl:col-span-2 order-2 xl:order-1">
                   <Investments preview={true} refreshKey={refreshKey} />
                </div>
                <div className="col-span-1 order-1 xl:order-2">
                   <CreateInvestment onInvested={handleInvestmentCreated} />
                </div>
              </div>
              {/* Bottom Row: Performance Chart */}
              <div className="w-full">
                 <PerformanceChart refreshKey={refreshKey} />
              </div>
            </div>
          )}
          {activeTab === 'investments' && <Investments refreshKey={refreshKey} />}
          {activeTab === 'network' && <ReferralTree />}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, subtitle, colorClass }) => (
  <div className="waterdrop rounded-[2rem] p-6 transition-all hover:scale-[1.02] duration-300 ease-out group relative z-10 overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-40`} style={{ background: colorClass.includes('30D158') ? '#30D158' : colorClass.includes('0A84FF') ? '#0A84FF' : colorClass.includes('BF5AF2') ? '#BF5AF2' : '#FF9F0A' }}></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <p className="text-[15px] font-medium text-gray-300/80">{title}</p>
      <div className={`p-2.5 rounded-2xl bg-white/5 shadow-inner border border-white/10 ${colorClass}`}>
        {icon}
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-3xl font-extrabold tracking-tight text-white mb-1">{value}</p>
      {subtitle && <p className={`text-[13px] font-bold ${colorClass}`}>{subtitle}</p>}
    </div>
  </div>
);

export default Dashboard;
