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
      className={`bg-gradient-to-b from-slate-950 via-purple-950/80 to-slate-950 text-purple-100 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } min-h-screen flex flex-col border-r border-purple-800/30`}
    >
      <div className="p-6 border-b border-purple-800/30 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm">
        <h2 className={`font-black text-2xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent ${isOpen ? 'block' : 'hidden'} tracking-tight`}>
          LoL
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-purple-800/40 transition-all duration-200 hover:border-l-2 hover:border-amber-400 group"
          >
            <item.icon className="text-lg flex-shrink-0 text-purple-400/70 group-hover:text-amber-400 transition-colors" />
            <span className={`${isOpen ? 'block' : 'hidden'} text-purple-200 group-hover:text-amber-300 font-medium`}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-purple-800/30 bg-gradient-to-r from-slate-950 to-purple-950/50 backdrop-blur-sm">
        <button className="flex items-center gap-4 px-4 py-3 w-full rounded-lg hover:bg-red-900/30 transition-all duration-200 hover:text-red-400 text-purple-300 group">
          <FiLogOut className="text-lg flex-shrink-0 group-hover:text-red-400 transition-colors" />
          <span className={isOpen ? 'block' : 'hidden'}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
