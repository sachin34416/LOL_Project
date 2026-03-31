import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiAward,
  FiGrid,
  FiCalendar,
  FiBarChart2,
  FiLogOut,
  FiTrendingUp,
  FiPieChart,
  FiUserPlus,
} from 'react-icons/fi';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiUsers, label: 'Players', path: '/players' },
    { icon: FiUserPlus, label: 'Teams', path: '/teams' },
    { icon: FiAward, label: 'Tournaments', path: '/tournaments' },
    { icon: FiGrid, label: 'Games', path: '/games' },
    { icon: FiCalendar, label: 'Matches', path: '/matches' },
    { icon: FiBarChart2, label: 'Live Scoring', path: '/live-scoring' },
    { icon: FiTrendingUp, label: 'Leaderboard', path: '/leaderboard' },
    { icon: FiPieChart, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <aside
      className={`bg-white text-gray-800 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } min-h-screen flex flex-col border-r border-gray-200 shadow-sm`}
    >
      <div className="p-6 border-b border-gray-200 bg-red-600">
        <h2 className={`font-black text-2xl text-white ${isOpen ? 'block' : 'hidden'} tracking-tight`}>
          LoL
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-50 transition-all duration-200 hover:border-l-2 hover:border-red-600 group"
          >
            <item.icon className="text-lg flex-shrink-0 text-gray-600 group-hover:text-red-600 transition-colors" />
            <span className={`${isOpen ? 'block' : 'hidden'} text-gray-700 group-hover:text-red-600 font-medium`}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button className="flex items-center gap-4 px-4 py-3 w-full rounded-lg hover:bg-red-100 transition-all duration-200 hover:text-red-600 text-gray-700 group">
          <FiLogOut className="text-lg flex-shrink-0 group-hover:text-red-600 transition-colors" />
          <span className={isOpen ? 'block' : 'hidden'}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
