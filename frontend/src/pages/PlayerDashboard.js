import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMatchStore } from '../store/matchStore';
import { matchAPI } from '../services/api';
import { FiCalendar, FiTrendingUp, FiUser, FiAward } from 'react-icons/fi';

const PlayerDashboard = () => {
  const { user } = useAuthStore();
  const [myMatches, setMyMatches] = useState([]);
  const [myStats, setMyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      
      // Fetch all matches and filter for player's matches
      const matchesResponse = await matchAPI.getAllMatches();
      const playerMatches = matchesResponse.data.data.filter(match => 
        match.players.some(player => player.playerId === user?.playerId)
      );
      setMyMatches(playerMatches);

      // Fetch player stats if player has a playerId
      if (user?.playerId) {
        // This would be a real API call to get player stats
        // const statsResponse = await playerAPI.getPlayerStats(user.playerId);
        // setMyStats(statsResponse.data);
        
        // Mock data for demonstration
        setMyStats({
          totalMatches: 5,
          wins: 3,
          losses: 2,
          winPercentage: 60,
          favoriteGame: 'Chess'
        });
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-purple-300">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
          Player Dashboard
        </h1>
        <p className="text-purple-200">Welcome back, {user?.name}!</p>
      </div>

      {/* Player Stats Cards */}
      {myStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 border border-purple-700/50">
            <div className="flex items-center justify-between mb-2">
              <FiCalendar className="text-amber-400 text-2xl" />
              <span className="text-2xl font-bold text-amber-300">{myStats.totalMatches}</span>
            </div>
            <p className="text-purple-300">Total Matches</p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 border border-purple-700/50">
            <div className="flex items-center justify-between mb-2">
              <FiAward className="text-green-400 text-2xl" />
              <span className="text-2xl font-bold text-green-300">{myStats.wins}</span>
            </div>
            <p className="text-purple-300">Wins</p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 border border-purple-700/50">
            <div className="flex items-center justify-between mb-2">
              <FiTrendingUp className="text-blue-400 text-2xl" />
              <span className="text-2xl font-bold text-blue-300">{myStats.winPercentage}%</span>
            </div>
            <p className="text-purple-300">Win Rate</p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 border border-purple-700/50">
            <div className="flex items-center justify-between mb-2">
              <FiUser className="text-purple-400 text-2xl" />
              <span className="text-lg font-bold text-purple-300">{myStats.favoriteGame}</span>
            </div>
            <p className="text-purple-300">Favorite Game</p>
          </div>
        </div>
      )}

      {/* My Matches */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg border border-purple-700/50 p-6">
        <h2 className="text-xl font-bold text-amber-300 mb-4">My Matches</h2>
        
        {myMatches.length > 0 ? (
          <div className="space-y-4">
            {myMatches.map((match) => (
              <div key={match._id} className="border border-purple-700/50 bg-slate-700/20 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-amber-300">{match.gameName}</p>
                    <p className="text-sm text-purple-300 mt-1">
                      {match.players.map(p => p.playerName).join(' vs ')}
                    </p>
                    <p className="text-xs text-purple-400 mt-1">
                      {new Date(match.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                      match.status === 'ongoing'
                        ? 'bg-green-500/30 text-green-200 border border-green-500/50'
                        : match.status === 'completed'
                        ? 'bg-blue-500/30 text-blue-200 border border-blue-500/50'
                        : 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                    }`}
                  >
                    {match.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiCalendar className="text-purple-400 text-4xl mx-auto mb-4" />
            <p className="text-purple-300">No matches found</p>
            <p className="text-purple-400 text-sm mt-2">You haven't been registered for any matches yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;
