import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiAward,
  FiGamepad2,
  FiCalendar,
  FiBarChart2,
  FiLogOut,
} from 'react-icons/fi';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiUsers, label: 'Players', path: '/players' },
    { icon: FiAward, label: 'Tournaments', path: '/tournaments' },
    { icon: FiGamepad2, label: 'Games', path: '/games' },
    { icon: FiCalendar, label: 'Matches', path: '/matches' },
    { icon: FiBarChart2, label: 'Live Scoring', path: '/live-scoring' },
  ];

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } min-h-screen flex flex-col`}
    >
      <div className="p-6 border-b border-gray-800">
        <h2 className={`font-bold text-xl ${isOpen ? 'block' : 'hidden'}`}>TM</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <item.icon className="text-lg flex-shrink-0" />
            <span className={isOpen ? 'block' : 'hidden'}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-4 px-4 py-3 w-full rounded-lg hover:bg-gray-800 transition-colors">
          <FiLogOut className="text-lg flex-shrink-0" />
          <span className={isOpen ? 'block' : 'hidden'}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
