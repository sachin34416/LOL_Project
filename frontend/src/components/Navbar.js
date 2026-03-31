import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-red-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-700 hover:text-red-600 text-xl transition-colors duration-300"
        >
          <FiMenu />
        </button>
        <h1 className="text-2xl font-black text-red-600 tracking-tight">
          League of Legends
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-700 hover:text-red-600 transition-colors">
          <FiBell className="text-xl" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
        </button>

        {/* User Name and Logout Button */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="flex items-center gap-2">
            <FiUser className="text-xl text-gray-700" />
            <span className="text-sm font-semibold text-gray-800">{user?.name || 'User'} ({user?.role})</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300 border border-red-700"
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
