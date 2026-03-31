import React from 'react';
import { useAuthStore } from '../store/authStore';

// Higher-order component for role-based UI protection
export const withRoleProtection = (WrappedComponent, requiredRole) => {
  return function ProtectedComponent(props) {
    const { user } = useAuthStore();

    if (!user) {
      return <div>Please login to access this feature.</div>;
    }

    if (requiredRole === 'admin' && user.role !== 'admin') {
      return <div>Admin access required.</div>;
    }

    if (requiredRole === 'organizer' && !['admin', 'organizer'].includes(user.role)) {
      return <div>Organizer access required.</div>;
    }

    if (requiredRole === 'player' && user.role !== 'player') {
      return <div>Player access required.</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

// Component for conditional rendering based on role
export const RoleBasedRender = ({ 
  children, 
  requiredRole, 
  fallback = null, 
  adminOnly = false,
  organizerOnly = false,
  playerOnly = false 
}) => {
  const { user, isAdmin, isOrganizer, isPlayer, isAdminOrOrganizer } = useAuthStore();

  if (!user) {
    return fallback;
  }

  if (adminOnly && !isAdmin(user)) {
    return fallback;
  }

  if (organizerOnly && !isOrganizer(user)) {
    return fallback;
  }

  if (playerOnly && !isPlayer(user)) {
    return fallback;
  }

  if (requiredRole === 'admin' && !isAdmin(user)) {
    return fallback;
  }

  if (requiredRole === 'organizer' && !isOrganizer(user)) {
    return fallback;
  }

  if (requiredRole === 'player' && !isPlayer(user)) {
    return fallback;
  }

  if (requiredRole === 'adminOrOrganizer' && !isAdminOrOrganizer(user)) {
    return fallback;
  }

  return children;
};

// Specific permission-based components
export const AdminOnly = ({ children, fallback = null }) => (
  <RoleBasedRender adminOnly={true} fallback={fallback}>
    {children}
  </RoleBasedRender>
);

export const OrganizerOnly = ({ children, fallback = null }) => (
  <RoleBasedRender organizerOnly={true} fallback={fallback}>
    {children}
  </RoleBasedRender>
);

export const PlayerOnly = ({ children, fallback = null }) => (
  <RoleBasedRender playerOnly={true} fallback={fallback}>
    {children}
  </RoleBasedRender>
);

export const AdminOrOrganizerOnly = ({ children, fallback = null }) => (
  <RoleBasedRender requiredRole="adminOrOrganizer" fallback={fallback}>
    {children}
  </RoleBasedRender>
);

// Hook for role-based access
export const useRoleAccess = () => {
  const { user, isAdmin, isOrganizer, isPlayer, isAdminOrOrganizer, canManagePlayers, canManageTournaments, canManageGames, canManageMatches, canViewAllData } = useAuthStore();

  return {
    user,
    isAdmin: isAdmin(user),
    isOrganizer: isOrganizer(user),
    isPlayer: isPlayer(user),
    isAdminOrOrganizer: isAdminOrOrganizer(user),
    canManagePlayers: canManagePlayers(user),
    canManageTournaments: canManageTournaments(user),
    canManageGames: canManageGames(user),
    canManageMatches: canManageMatches(user),
    canViewAllData: canViewAllData(user),
  };
};

export default RoleBasedRender;
