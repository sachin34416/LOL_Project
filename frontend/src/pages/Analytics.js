import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useMatchStore } from '../store/matchStore';
import { FiBarChart2, FiTrendingUp, FiUsers, FiTarget } from 'react-icons/fi';

const Analytics = () => {
  const players = usePlayerStore((state) => state.players);
  const matches = useMatchStore((state) => state.matches);
  const fetchAllPlayers = usePlayerStore((state) => state.fetchAllPlayers);
  const fetchAllMatches = useMatchStore((state) => state.fetchAllMatches);

  const [selectedStat, setSelectedStat] = useState('winRate');

  useEffect(() => {
    fetchAllPlayers();
    fetchAllMatches();
  }, [fetchAllPlayers, fetchAllMatches]);

  const StatCard = ({ icon: Icon, label, value, unit, trend, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-lg shadow-md p-6 flex items-center gap-4 text-white`}>
      <div className="p-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm">
        <Icon className="text-2xl" />
      </div>
      <div>
        <p className="text-white text-opacity-80 text-sm font-medium">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-white text-opacity-80">{unit}</p>
        </div>
        {trend && (
          <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
    </div>
  );

  // Calculate statistics
  const totalMatches = matches.length;
  const completedMatches = matches.filter((m) => m.status === 'completed').length;
  const avgPlayersPerMatch = totalMatches > 0 ? (players.length / totalMatches).toFixed(1) : 0;
  const totalWins = players.reduce((sum, p) => sum + (p.stats?.wins || 0), 0);
  const overallWinRate =
    totalMatches > 0 ? ((totalWins / (totalMatches * 2)) * 100).toFixed(1) : 0;

  // Top performers
  const topWinners = [...players]
    .sort((a, b) => (b.stats?.wins || 0) - (a.stats?.wins || 0))
    .slice(0, 5);

  const mostConsistent = [...players]
    .filter((p) => ((p.stats?.wins || 0) + (p.stats?.losses || 0)) > 0)
    .sort((a, b) => (b.stats?.winPercentage || 0) - (a.stats?.winPercentage || 0))
    .slice(0, 5);

  // Game statistics
  const matchesByStatus = {
    scheduled: matches.filter((m) => m.status === 'scheduled').length,
    ongoing: matches.filter((m) => m.status === 'ongoing').length,
    completed: completedMatches,
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="mb-8 bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 shadow-lg border border-purple-700/50">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
          📊 Analytics & Statistics
        </h1>
        <p className="text-purple-200">Tournament-wide performance metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FiUsers}
          label="Total Players"
          value={players.length}
          unit="players"
          color="from-amber-600 to-amber-400"
        />
        <StatCard
          icon={FiTarget}
          label="Total Matches"
          value={totalMatches}
          unit="matches"
          color="from-purple-600 to-purple-400"
        />
        <StatCard
          icon={FiBarChart2}
          label="Overall Win Rate"
          value={overallWinRate}
          unit="%"
          color="from-orange-600 to-orange-400"
        />
        <StatCard
          icon={FiTrendingUp}
          label="Completed Matches"
          value={completedMatches}
          unit="matches"
          color="from-purple-600 to-pink-500"
        />
      </div>

      {/* Match Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Scheduled', value: matchesByStatus.scheduled, color: 'from-purple-600 to-purple-400' },
          { label: 'Ongoing', value: matchesByStatus.ongoing, color: 'from-orange-600 to-orange-400' },
          { label: 'Completed', value: matchesByStatus.completed, color: 'from-amber-600 to-amber-400' },
        ].map((status) => (
          <div key={status.label} className={`bg-gradient-to-br ${status.color} rounded-lg shadow-lg p-6 text-white`}>
            <p className="text-white text-opacity-80 text-sm font-medium mb-2">{status.label}</p>
            <p className="text-4xl font-bold">{status.value}</p>
            <p className="text-sm text-white text-opacity-70 mt-2">
              {totalMatches > 0 ? ((status.value / totalMatches) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
        ))}
      </div>

      {/* Performance Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2">
        {/* Most Wins */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg p-6 border border-purple-700/50">
          <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <span className="text-3xl">🏆</span> Top Winners
          </h3>
          <div className="space-y-3">
            {topWinners.map((player, idx) => {
              const stats = player.stats || { wins: 0 };
              return (
                <div key={player._id} className="flex items-center justify-between p-4 bg-amber-900/30 rounded-lg hover:bg-amber-800/30 transition-colors border border-amber-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-amber-300">{player.name}</p>
                      <p className="text-xs text-purple-300">{player.email}</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-amber-500/30 text-amber-200 rounded-full font-bold text-lg border border-amber-500/50">
                    {stats.wins || 0}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Consistent */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg p-6 border border-purple-700/50">
          <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
            <span className="text-3xl">⭐</span> Most Consistent
          </h3>
          <div className="space-y-3">
            {mostConsistent.map((player, idx) => {
              const stats = player.stats || { winPercentage: 0 };
              return (
                <div key={player._id} className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg hover:bg-purple-800/30 transition-colors border border-purple-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-purple-300">{player.name}</p>
                      <p className="text-xs text-purple-400">{player.email}</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-purple-500/30 text-purple-200 rounded-full font-bold text-lg border border-purple-500/50">
                    {stats.winPercentage || 0}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Win Distribution Chart */}
      <div className="mt-8 bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg p-6 border border-purple-700/50 max-h-64 overflow-y-auto">
        <h3 className="text-2xl font-bold text-amber-400 mb-6">📈 Win Distribution</h3>
        <div className="space-y-4">
          {[...players]
            .sort((a, b) => (b.stats?.wins || 0) - (a.stats?.wins || 0))
            .slice(0, 8)
            .map((player) => {
              const stats = player.stats || { wins: 0 };
              const maxWins = Math.max(...players.map((p) => p.stats?.wins || 0), 1);
              const percentage = (stats.wins / maxWins) * 100;

              return (
                <div key={player._id} className="flex items-center gap-4">
                  <div className="w-32">
                    <p className="font-semibold text-purple-200 truncate">{player.name}</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-8 bg-slate-700/50 rounded-lg overflow-hidden border border-purple-700/20">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-end pr-3 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 15 && <span className="text-white font-bold text-sm">{stats.wins}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <p className="font-bold text-amber-400">{stats.wins}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
