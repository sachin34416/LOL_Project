import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useTournamentStore } from '../store/tournamentStore';
import { playerAPI } from '../services/api';
import { FiTrendingUp, FiAward, FiTarget, FiFilter } from 'react-icons/fi';

const Leaderboard = () => {
  const players = usePlayerStore((state) => state.players);
  const fetchAllPlayers = usePlayerStore((state) => state.fetchAllPlayers);
  
  const tournaments = useTournamentStore((state) => state.tournaments);
  const fetchAllTournaments = useTournamentStore((state) => state.fetchAllTournaments);

  const [sortBy, setSortBy] = useState('wins');
  const [selectedTournament, setSelectedTournament] = useState('all');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  useEffect(() => {
    fetchAllPlayers();
    fetchAllTournaments();
  }, [fetchAllPlayers, fetchAllTournaments]);

  useEffect(() => {
    // Filter and sort players
    let sorted = [...players];

    // Filter by tournament if selected
    if (selectedTournament !== 'all') {
      sorted = sorted.filter((p) =>
        p.tournaments?.includes(selectedTournament) || true
      );
    }

    // Sort based on selected criteria
    sorted.sort((a, b) => {
      const aStats = a.stats || { wins: 0, losses: 0, winPercentage: 0 };
      const bStats = b.stats || { wins: 0, losses: 0, winPercentage: 0 };

      switch (sortBy) {
        case 'wins':
          return bStats.wins - aStats.wins;
        case 'winPercentage':
          return bStats.winPercentage - aStats.winPercentage;
        case 'matches':
          const aMatches = (aStats.wins || 0) + (aStats.losses || 0);
          const bMatches = (bStats.wins || 0) + (bStats.losses || 0);
          return bMatches - aMatches;
        default:
          return 0;
      }
    });

    setFilteredPlayers(sorted);
  }, [players, selectedTournament, sortBy]);

  const getMedalColor = (position) => {
    switch (position) {
      case 0:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 1:
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 2:
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-300';
    }
  };

  const getMedalIcon = (position) => {
    switch (position) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${position + 1}`;
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-lg shadow-md p-6 flex items-center gap-4 text-white`}>
      <div className="p-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm">
        <Icon className="text-2xl" />
      </div>
      <div>
        <p className="text-white text-opacity-80 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  const topPlayer = filteredPlayers[0];
  const totalMatches = filteredPlayers.reduce(
    (sum, p) => sum + ((p.stats?.wins || 0) + (p.stats?.losses || 0)),
    0
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-600">Global player rankings and statistics</p>
      </div>

      {/* Statistics Cards */}
      {topPlayer && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FiAward}
            label="Top Player"
            value={topPlayer.name}
            color="from-emerald-500 to-teal-500"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Total Matches"
            value={totalMatches}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={FiTarget}
            label="Average Win %"
            value={`${(
              filteredPlayers.reduce((sum, p) => sum + (p.stats?.winPercentage || 0), 0) /
              (filteredPlayers.length || 1)
            ).toFixed(1)}%`}
            color="from-purple-500 to-pink-500"
          />
        </div>
      )}

      {/* Filters */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-2">
            <FiFilter className="text-emerald-600" />
            <label className="font-semibold text-gray-700">Sort By:</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'wins', label: 'Most Wins' },
              { value: 'winPercentage', label: 'Win Percentage' },
              { value: 'matches', label: 'Most Matches' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === option.value
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <label className="font-semibold text-gray-700 mr-3">Tournament:</label>
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Tournaments</option>
              {tournaments.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Rank</th>
                <th className="px-6 py-4 text-left font-semibold">Player Name</th>
                <th className="px-6 py-4 text-center font-semibold">Wins</th>
                <th className="px-6 py-4 text-center font-semibold">Losses</th>
                <th className="px-6 py-4 text-center font-semibold">Win %</th>
                <th className="px-6 py-4 text-center font-semibold">Total Matches</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => {
                  const stats = player.stats || { wins: 0, losses: 0, winPercentage: 0 };
                  const totalMatches = (stats.wins || 0) + (stats.losses || 0);
                  const medalClass = getMedalColor(index);

                  return (
                    <tr
                      key={player._id}
                      className={`border-b border-gray-200 hover:bg-emerald-50 transition-colors ${
                        index < 3 ? 'bg-gradient-to-r from-emerald-50/50 to-teal-50/50' : ''
                      }`}
                    >
                      <td className={`px-6 py-4 font-bold text-center border-r border-gray-200 ${medalClass}`}>
                        <span className="text-lg">{getMedalIcon(index)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white font-bold">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{player.name}</p>
                            <p className="text-sm text-gray-600">{player.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                          {stats.wins || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                          {stats.losses || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold text-emerald-600">
                            {stats.winPercentage || 0}%
                          </span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                              style={{
                                width: `${stats.winPercentage || 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-900">
                        {totalMatches}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-600">
                    No players found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      {filteredPlayers.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Win Leaders */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏅</span> Most Wins
            </h3>
            <div className="space-y-3">
              {[...filteredPlayers]
                .sort((a, b) => (b.stats?.wins || 0) - (a.stats?.wins || 0))
                .slice(0, 5)
                .map((player, idx) => (
                  <div key={player._id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-emerald-600">#{idx + 1}</span>
                      <p className="font-semibold text-gray-900">{player.name}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                      {player.stats?.wins || 0}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Best Win Percentage */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">⭐</span> Best Win Percentage
            </h3>
            <div className="space-y-3">
              {[...filteredPlayers]
                .filter((p) => ((p.stats?.wins || 0) + (p.stats?.losses || 0)) > 0)
                .sort((a, b) => (b.stats?.winPercentage || 0) - (a.stats?.winPercentage || 0))
                .slice(0, 5)
                .map((player, idx) => (
                  <div key={player._id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-purple-600">#{idx + 1}</span>
                      <p className="font-semibold text-gray-900">{player.name}</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-bold">
                      {player.stats?.winPercentage || 0}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
