'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { LogOut, LayoutDashboard, DollarSign, Activity, Users, PlusCircle, TrendingUp } from 'lucide-react';
import Investments from '@/components/Investments';
import ReferralTree from '@/components/ReferralTree';
import CreateInvestment from '@/components/CreateInvestment';

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
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
          <div className="text-xs sm:text-sm flex items-center w-full justify-between sm:justify-start">
            <span className="text-gray-400 mr-2 whitespace-nowrap">Ref Code:</span>
            <span className="font-mono bg-gray-700 px-2 py-1 rounded text-indigo-300 select-all break-all text-[10px] sm:text-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            value={`$${stats?.balance?.toFixed(2) || '0.00'}`}
            icon={<DollarSign className="h-8 w-8 text-green-400" />}
            gradient="from-green-500/10 to-transparent border-green-500/20"
          />
          <StatCard
            title="Total Invested"
            value={`$${stats?.totalInvested?.toFixed(2) || '0.00'}`}
            icon={<TrendingUp className="h-8 w-8 text-indigo-400" />}
            gradient="from-indigo-500/10 to-transparent border-indigo-500/20"
          />
          <StatCard
            title="Total ROI"
            value={`$${stats?.totalROI?.toFixed(2) || '0.00'}`}
            icon={<Activity className="h-8 w-8 text-purple-400" />}
            subtitle={`+ $${stats?.todayRoi?.toFixed(2) || '0.00'} today`}
            gradient="from-purple-500/10 to-transparent border-purple-500/20"
          />
          <StatCard
            title="Level Income"
            value={`$${stats?.totalLevelIncome?.toFixed(2) || '0.00'}`}
            icon={<Users className="h-8 w-8 text-blue-400" />}
            subtitle={`+ $${stats?.todayLevelIncome?.toFixed(2) || '0.00'} today`}
            gradient="from-blue-500/10 to-transparent border-blue-500/20"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6 overflow-x-auto hide-scrollbar">
          <nav className="-mb-px flex space-x-6 sm:space-x-8 min-w-max pb-1">
            {['overview', 'investments', 'network'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
              <div className="col-span-1 xl:col-span-2 order-2 xl:order-1">
                 <Investments preview={true} refreshKey={refreshKey} />
              </div>
              <div className="col-span-1 order-1 xl:order-2">
                 <CreateInvestment onInvested={handleInvestmentCreated} />
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

const StatCard = ({ title, value, icon, subtitle, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} border rounded-2xl p-6 shadow-lg backdrop-blur-xl`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-xs text-indigo-300 mt-2">{subtitle}</p>}
      </div>
      <div className="p-3 bg-gray-800/50 rounded-xl">
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;
