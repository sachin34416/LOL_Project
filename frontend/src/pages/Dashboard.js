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
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">Welcome back! Here's your tournament overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FiUsers}
          label="Registered Players"
          value={players.length}
          color="from-emerald-500 to-teal-500"
        />
        <StatCard
          icon={FiAward}
          label="Active Tournaments"
          value={activeTournaments}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={FiCalendar}
          label="Scheduled Matches"
          value={matches.filter(m => m.status === 'scheduled').length}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={FiBarChart2}
          label="Completed Matches"
          value={completedMatches}
          color="from-orange-500 to-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Matches */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Today's Matches
          </h2>
          <div className="space-y-3">
            {todaysMatches.length > 0 ? (
              todaysMatches.slice(0, 5).map((match) => (
                <div key={match._id} className="border border-emerald-200 rounded-lg p-4 hover:bg-emerald-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{match.gameName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(match.scheduledAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      match.status === 'ongoing' ? 'bg-emerald-100 text-emerald-800' :
                      match.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600 text-center py-8 bg-gray-50 rounded-lg">
                <p>No matches scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Top Players
          </h2>
          <div className="space-y-3">
            {players.slice(0, 5).map((player, index) => (
              <div key={player._id} className="flex items-center gap-4 p-3 hover:bg-emerald-50 rounded-lg transition-colors">
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  #{index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{player.name}</p>
                  <p className="text-sm text-gray-600">
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
