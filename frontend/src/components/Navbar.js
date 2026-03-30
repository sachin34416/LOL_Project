import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-purple-800/30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-purple-300 hover:text-amber-400 text-xl transition-colors duration-300"
        >
          <FiMenu />
        </button>
        <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
          League of Legends
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-purple-300 hover:text-amber-400 transition-colors">
          <FiBell className="text-xl" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Name and Logout Button */}
        <div className="flex items-center gap-3 pl-4 border-l border-purple-700/50">
          <div className="flex items-center gap-2">
            <FiUser className="text-xl text-purple-300" />
            <span className="text-sm font-semibold text-purple-200">{user?.name || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition-colors duration-300 border border-red-700/30 hover:border-red-500/50"
          >
            <FiLogOut className="text-lg" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
