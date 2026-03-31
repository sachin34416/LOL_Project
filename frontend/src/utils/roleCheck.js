export const roleCheck = {
  isAdmin: (user) => user?.role === 'admin',
  isOrganizer: (user) => user?.role === 'organizer' || user?.role === 'admin',
  isFranchiseOwner: (user) => user?.role === 'franchise_owner' || user?.role === 'admin',
  isPlayer: (user) => user?.role === 'player',
  canEditMatches: (user) => user?.role === 'organizer' || user?.role === 'admin',
  canEditScores: (user) => user?.role === 'organizer' || user?.role === 'admin',
  canManageTournaments: (user) => user?.role === 'organizer' || user?.role === 'admin',
  canManageGames: (user) => user?.role === 'admin',
  canViewTeam: (user, teamOwnerId) => 
    user?.role === 'admin' || user?.role === 'organizer' || user?._id === teamOwnerId || user?.role === 'franchise_owner',
  canEditTeam: (user, teamOwnerId) =>
    user?.role === 'admin' || user?._id === teamOwnerId,
  canViewAnalytics: (user, ownerId) =>
    user?.role === 'admin' || user?._id === ownerId,
};

export const getAccessiblePages = (user) => {
  const basePages = [
    { icon: 'FiHome', label: 'Dashboard', path: '/', roles: ['player', 'organizer', 'admin', 'franchise_owner'] },
    { icon: 'FiUsers', label: 'Players', path: '/players', roles: ['player', 'organizer', 'admin', 'franchise_owner'] },
    { icon: 'FiCalendar', label: 'Matches', path: '/matches', roles: ['player', 'organizer', 'admin', 'franchise_owner'] },
    { icon: 'FiBarChart2', label: 'Live Scoring', path: '/live-scoring', roles: ['player', 'organizer', 'admin'] },
  ];

  const ownerPages = [
    { icon: 'FiUserPlus', label: 'Teams', path: '/teams', roles: ['franchise_owner', 'organizer', 'admin'] },
    { icon: 'FiAward', label: 'Tournaments', path: '/tournaments', roles: ['organizer', 'admin'] },
  ];

  const adminPages = [
    { icon: 'FiGrid', label: 'Games', path: '/games', roles: ['admin'] },
    { icon: 'FiTrendingUp', label: 'Leaderboard', path: '/leaderboard', roles: ['admin', 'organizer'] },
    { icon: 'FiPieChart', label: 'Analytics', path: '/analytics', roles: ['admin', 'organizer', 'franchise_owner'] },
  ];

  const allPages = [...basePages, ...ownerPages, ...adminPages];
  
  return allPages.filter(page => page.roles.includes(user?.role));
};
