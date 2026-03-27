import React, { useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useTournamentStore } from '../store/tournamentStore';
import { useMatchStore } from '../store/matchStore';
import { FiUsers, FiAward, FiCalendar, FiBarChart2 } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="text-2xl text-white" />
    </div>
    <div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your tournament overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FiUsers}
          label="Registered Players"
          value={players.length}
          color="bg-blue-500"
        />
        <StatCard
          icon={FiAward}
          label="Active Tournaments"
          value={activeTournaments}
          color="bg-green-500"
        />
        <StatCard
          icon={FiCalendar}
          label="Scheduled Matches"
          value={matches.filter(m => m.status === 'scheduled').length}
          color="bg-yellow-500"
        />
        <StatCard
          icon={FiBarChart2}
          label="Completed Matches"
          value={completedMatches}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Matches */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Matches</h2>
          <div className="space-y-3">
            {todaysMatches.length > 0 ? (
              todaysMatches.slice(0, 5).map((match) => (
                <div key={match._id} className="border border-gray-200 rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{match.gameName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(match.scheduledAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      match.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      match.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No matches scheduled for today</p>
            )}
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Players</h2>
          <div className="space-y-3">
            {players.slice(0, 5).map((player, index) => (
              <div key={player._id} className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{player.name}</p>
                  <p className="text-sm text-gray-600">
                    {player.stats.wins} Wins • {player.stats.winPercentage}%
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
