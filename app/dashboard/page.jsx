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
    <div className="min-h-screen bg-black text-gray-100 selection:bg-indigo-500/30 font-sans">
      {/* Navbar - iOS style frosted top bar */}
      <nav className="relative z-20 sticky top-0 bg-black/70 backdrop-blur-3xl border-b border-[#38383A]/60 px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
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
          <div className="text-[13px] flex items-center w-full justify-between sm:justify-start bg-[#1C1C1E] py-1.5 px-3 rounded-full border border-[#38383A]">
            <span className="text-gray-400 mr-2 whitespace-nowrap font-medium">Ref Code:</span>
            <span className="font-mono text-indigo-400 font-semibold select-all break-all text-[11px] sm:text-[13px]">
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
        <div className="flex justify-center mb-8 relative z-10">
          <div className="bg-[#1C1C1E] p-1 rounded-xl flex space-x-1 w-full max-w-md border border-[#38383A]/50 shrink-0 overflow-x-auto hide-scrollbar">
            {['overview', 'investments', 'network'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 px-4 text-[13px] font-medium rounded-lg transition-all duration-200 capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#38383A] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
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
  <div className={`bg-[#1C1C1E] border border-[#38383A]/60 rounded-3xl p-5 transition-transform hover:scale-[1.02] duration-300 ease-out`}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-[15px] font-medium text-gray-400">{title}</p>
      <div className={`p-2 rounded-full bg-[#38383A]/40 ${colorClass}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-3xl font-bold tracking-tight text-white mb-1">{value}</p>
      {subtitle && <p className={`text-[13px] font-medium ${colorClass}`}>{subtitle}</p>}
    </div>
  </div>
);

export default Dashboard;
