import React from 'react';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

const Navbar = ({ onToggleSidebar }) => {
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
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <FiUser className="text-xl" />
          <span className="text-sm font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
