import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const Navbar = ({ onToggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-white via-emerald-50 to-teal-50 shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-emerald-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-600 hover:text-emerald-600 text-xl transition-colors"
        >
          <FiMenu />
        </button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Tournament Manager
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-600 hover:text-emerald-600 transition-colors">
          <FiBell className="text-xl" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-all"
          >
            <FiUser className="text-xl" />
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
            <FiChevronDown className={`text-sm transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-emerald-200 py-2 z-10">
              <div className="px-4 py-2 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 transition-colors flex items-center gap-2 hover:text-emerald-700"
              >
                <FiUser className="text-sm" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 hover:text-red-700"
              >
                <FiLogOut className="text-sm" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
