import React, { useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useTournamentStore } from '../store/tournamentStore';
import { useMatchStore } from '../store/matchStore';
import { FiUsers, FiAward, FiCalendar, FiBarChart2 } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-lg shadow-lg p-6 flex items-center gap-4 text-white hover:shadow-xl transition-all hover:-translate-y-1`}>
    <div className="p-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm">
      <Icon className="text-3xl" />
    </div>
    <div>
      <p className="text-white text-opacity-80 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const players = usePlayerStore((state) => state.players);
  const tournaments = useTournamentStore((state) => state.tournaments);
  const matches = useMatchStore((state) => state.matches);
  const todaysMatches = useMatchStore((state) => state.todaysMatches);

  const fetchAllPlayers = usePlayerStore((state) => state.fetchAllPlayers);
  const fetchAllTournaments = useTournamentStore((state) => state.fetchAllTournaments);
  const fetchAllMatches = useMatchStore((state) => state.fetchAllMatches);
  const fetchTodaysMatches = useMatchStore((state) => state.fetchTodaysMatches);

  useEffect(() => {
    fetchAllPlayers();
    fetchAllTournaments();
    fetchAllMatches();
    fetchTodaysMatches();
  }, []);

  const activeTournaments = tournaments.filter(t => t.status !== 'completed').length;
  const completedMatches = matches.filter(m => m.status === 'completed').length;

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-y-auto flex flex-col">
      <div className="mb-8 bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 shadow-lg border border-purple-700/50">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-purple-200">Welcome back! Here's your tournament overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FiUsers}
          label="Registered Players"
          value={players.length}
          color="from-purple-600 to-purple-400"
        />
        <StatCard
          icon={FiAward}
          label="Active Tournaments"
          value={activeTournaments}
          color="from-amber-600 to-amber-400"
        />
        <StatCard
          icon={FiCalendar}
          label="Scheduled Matches"
          value={matches.filter(m => m.status === 'scheduled').length}
          color="from-orange-600 to-orange-400"
        />
        <StatCard
          icon={FiBarChart2}
          label="Completed Matches"
          value={completedMatches}
          color="from-purple-600 to-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-y-auto pr-2">
        {/* Today's Matches */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg p-6 border border-purple-700/50 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
            Today's Matches
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {todaysMatches.length > 0 ? (
              todaysMatches.slice(0, 5).map((match) => (
                <div key={match._id} className="border border-purple-600/50 rounded-lg p-4 hover:bg-purple-700/30 transition-colors bg-slate-700/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-amber-300">{match.gameName}</p>
                      <p className="text-sm text-purple-300">
                        {new Date(match.scheduledAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      match.status === 'ongoing' ? 'bg-orange-500/30 text-orange-200 border border-orange-500/50' :
                      match.status === 'scheduled' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50' :
                      'bg-slate-500/30 text-slate-200 border border-slate-500/50'
                    }`}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-purple-300 text-center py-8 bg-slate-700/20 rounded-lg border border-purple-700/30">
                <p>No matches scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg p-6 border border-purple-700/50 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
            Top Players
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {players.slice(0, 5).map((player, index) => (
              <div key={player._id} className="flex items-center gap-4 p-3 hover:bg-purple-700/30 rounded-lg transition-colors bg-slate-700/20 border border-purple-600/30">
                <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  #{index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-amber-300">{player.name}</p>
                  <p className="text-sm text-purple-300">
                    {player.stats?.wins || 0} Wins • {player.stats?.winPercentage || 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
