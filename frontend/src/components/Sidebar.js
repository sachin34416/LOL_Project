import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
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
  FiUser,
  FiSettings,
} from 'react-icons/fi';

const Sidebar = ({ isOpen }) => {
  const { user, logout, isAdmin, isOrganizer, isPlayer, canManagePlayers, canManageTournaments, canManageGames, canManageMatches } = useAuthStore();

  // Admin/Organizer menu items
  const adminMenuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiUsers, label: 'Players', path: '/players', requiredRole: 'managePlayers' },
    { icon: FiUserPlus, label: 'Teams', path: '/teams', requiredRole: 'managePlayers' },
    { icon: FiAward, label: 'Tournaments', path: '/tournaments', requiredRole: 'manageTournaments' },
    { icon: FiGrid, label: 'Games', path: '/games', requiredRole: 'manageGames' },
    { icon: FiCalendar, label: 'Matches', path: '/matches', requiredRole: 'manageMatches' },
    { icon: FiBarChart2, label: 'Live Scoring', path: '/live-scoring', requiredRole: 'manageMatches' },
    { icon: FiTrendingUp, label: 'Leaderboard', path: '/leaderboard' },
    { icon: FiPieChart, label: 'Analytics', path: '/analytics' },
    { icon: FiSettings, label: 'Settings', path: '/settings', adminOnly: true },
  ];

  // Player menu items
  const playerMenuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiUser, label: 'My Profile', path: '/my-profile' },
    { icon: FiCalendar, label: 'My Matches', path: '/my-matches' },
    { icon: FiTrendingUp, label: 'Leaderboard', path: '/leaderboard' },
    { icon: FiBarChart2, label: 'My Stats', path: '/my-stats' },
  ];

  // Select menu based on user role
  const menuItems = isAdmin(user) || isOrganizer(user) ? adminMenuItems : playerMenuItems;

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && !isAdmin(user)) return false;
    if (item.requiredRole === 'managePlayers' && !canManagePlayers(user)) return false;
    if (item.requiredRole === 'manageTournaments' && !canManageTournaments(user)) return false;
    if (item.requiredRole === 'manageGames' && !canManageGames(user)) return false;
    if (item.requiredRole === 'manageMatches' && !canManageMatches(user)) return false;
    return true;
  });

  const handleLogout = async () => {
    await logout();
  };

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
        {isOpen && user && (
          <div className="mt-2 text-xs text-purple-300">
            <span className="capitalize">{user.role}</span>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => (
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
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-lg hover:bg-red-900/30 transition-all duration-200 hover:text-red-400 text-purple-300 group"
        >
          <FiLogOut className="text-lg flex-shrink-0 group-hover:text-red-400 transition-colors" />
          <span className={isOpen ? 'block' : 'hidden'}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
