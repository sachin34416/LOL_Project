import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import useToastStore from '../store/toastStore';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();
  const { success, error: showError } = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      showError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      success(result.message);
      setTimeout(() => navigate('/'), 1500);
    } else {
      showError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-700/30">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2 tracking-tight">
              Tournament Manager
            </h1>
            <p className="text-purple-300 text-sm font-medium">Welcome back, champion</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-amber-400 mb-3">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-purple-400/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-purple-600/30 rounded-lg text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 backdrop-blur-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-amber-400 mb-3">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-purple-400/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-purple-600/30 rounded-lg text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 backdrop-blur-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading && <FiLoader className="animate-spin" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-purple-700/30"></div>
          <span className="text-purple-400/60 text-sm font-medium">New here?</span>
          <div className="flex-1 h-px bg-purple-700/30"></div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <Link
            to="/register"
            className="text-amber-400 hover:text-amber-300 font-semibold transition duration-200 text-sm"
          >
            Create an account →
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
