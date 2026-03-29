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
} from 'react-icons/fi';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiUsers, label: 'Players', path: '/players' },
    { icon: FiAward, label: 'Tournaments', path: '/tournaments' },
    { icon: FiGrid, label: 'Games', path: '/games' },
    { icon: FiCalendar, label: 'Matches', path: '/matches' },
    { icon: FiBarChart2, label: 'Live Scoring', path: '/live-scoring' },
    { icon: FiTrendingUp, label: 'Leaderboard', path: '/leaderboard' },
    { icon: FiPieChart, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } min-h-screen flex flex-col border-r border-emerald-900/30`}
    >
      <div className="p-6 border-b border-emerald-900/30 bg-gradient-to-r from-emerald-900/20 to-teal-900/20">
        <h2 className={`font-bold text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent ${isOpen ? 'block' : 'hidden'}`}>
          TM
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-emerald-900/30 transition-all duration-200 hover:border-l-2 hover:border-emerald-400"
          >
            <item.icon className="text-lg flex-shrink-0 text-emerald-400/80 group-hover:text-emerald-400" />
            <span className={`${isOpen ? 'block' : 'hidden'} text-white/90 hover:text-white`}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-900/30 bg-gradient-to-r from-slate-900 to-slate-800/50">
        <button className="flex items-center gap-4 px-4 py-3 w-full rounded-lg hover:bg-red-900/30 transition-all duration-200 hover:text-red-400">
          <FiLogOut className="text-lg flex-shrink-0" />
          <span className={isOpen ? 'block' : 'hidden'}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
