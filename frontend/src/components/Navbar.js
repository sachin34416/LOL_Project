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
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-600 hover:text-gray-900 text-xl"
        >
          <FiMenu />
        </button>
        <h1 className="text-2xl font-bold text-indigo-600">Tournament Manager</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-600 hover:text-gray-900">
          <FiBell className="text-xl" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FiUser className="text-xl" />
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
            <FiChevronDown className={`text-sm transition ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
              >
                <FiUser className="text-sm" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition flex items-center gap-2"
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
