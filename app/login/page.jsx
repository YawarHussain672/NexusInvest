'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
      
      <div className="w-full max-w-md p-8 waterdrop rounded-[2.5rem] relative z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl mb-5 shadow-inner border border-white/10">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to your investment dashboard</p>
        </div>
        
        <form className="space-y-5" onSubmit={handleLogin}>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="sr-only" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-5 py-4 bg-black/30 backdrop-blur-md shadow-inner border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="sr-only" htmlFor="password">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-5 py-4 bg-black/30 backdrop-blur-md shadow-inner border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 pr-12"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 rounded-2xl text-[15px] font-bold text-white waterdrop-button transition-all duration-300 hover:brightness-110 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center pt-4">
            <Link href="/register" className="text-[13px] font-semibold text-gray-400 hover:text-white transition-colors">
              Don't have an account? <span className="text-cyan-400 hover:text-cyan-300">Register</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
