'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data)); // Keep this line
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
      
      <div className="w-full max-w-md p-8 waterdrop rounded-[2.5rem] relative z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl mb-5 shadow-inner border border-white/10">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">Join the investment network</p>
        </div>
        
        <form className="space-y-5" onSubmit={handleRegister}>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <input
                name="username"
                type="text"
                required
                className="w-full px-5 py-4 bg-black/30 backdrop-blur-md shadow-inner border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                className="w-full px-5 py-4 bg-black/30 backdrop-blur-md shadow-inner border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-5 py-4 bg-black/30 backdrop-blur-md shadow-inner border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 pr-12"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div>
              <input
                name="referralCode"
                type="text"
                className="w-full px-5 py-4 bg-black/30 backdrop-blur-md shadow-inner border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300"
                placeholder="Referral Code (Optional)"
                value={formData.referralCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 rounded-2xl text-[15px] font-bold text-white waterdrop-button transition-all duration-300 hover:brightness-110 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </div>
          
          <div className="text-center pt-4">
            <Link href="/login" className="text-[13px] font-semibold text-gray-400 hover:text-white transition-colors">
              Already have an account? <span className="text-cyan-400 hover:text-cyan-300">Sign in</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
