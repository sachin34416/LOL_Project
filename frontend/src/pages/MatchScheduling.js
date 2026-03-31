import React, { useEffect, useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { useTournamentStore } from '../store/tournamentStore';
import { useTeamStore } from '../store/teamStore';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';
import { matchAPI, tournamentAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiPlay } from 'react-icons/fi';
import useToastStore from '../store/toastStore';
import { roleCheck } from '../utils/roleCheck';

const MatchScheduling = () => {
  const { user } = useAuthStore();
  const matches = useMatchStore((state) => state.matches);
  const fetchAllMatches = useMatchStore((state) => state.fetchAllMatches);
  const addMatch = useMatchStore((state) => state.addMatch);
  const removeMatch = useMatchStore((state) => state.removeMatch);
  const updateMatch = useMatchStore((state) => state.updateMatch);

  const tournaments = useTournamentStore((state) => state.tournaments);
  const fetchAllTournaments = useTournamentStore((state) => state.fetchAllTournaments);

  const teams = useTeamStore((state) => state.teams);
  const fetchAllTeams = useTeamStore((state) => state.fetchAllTeams);

  const players = usePlayerStore((state) => state.players);
  const fetchAllPlayers = usePlayerStore((state) => state.fetchAllPlayers);

  const addToast = useToastStore((state) => state.addToast);

  // Role-based checks
  const canScheduleMatches = roleCheck.canEditMatches(user);

  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTeams, setSelectedTeams] = useState(['', '']); // Teams for player 1 and 2
  const [formData, setFormData] = useState({
    tournamentId: '',
    gameId: '',
    gameName: '',
    players: [{ playerId: '', playerName: '' }, { playerId: '', playerName: '' }],
    scheduledAt: '',
    court: '',
  });

  useEffect(() => {
    fetchAllMatches();
    fetchAllTournaments();
    fetchAllTeams();
    fetchAllPlayers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTournamentSelect = (e) => {
    const tournamentId = e.target.value;
    const tournament = tournaments.find((t) => t._id === tournamentId);
    setFormData((prev) => ({
      ...prev,
      tournamentId,
      gameId: tournament._id,
      gameName: tournament.gameName,
    }));
  };

  const handleTeamChange = (index, teamId) => {
    const newTeams = [...selectedTeams];
    newTeams[index] = teamId;
    setSelectedTeams(newTeams);
    // Reset player selection when team changes
    const newPlayers = [...formData.players];
    newPlayers[index] = { playerId: '', playerName: '' };
    setFormData((prev) => ({ ...prev, players: newPlayers }));
  };

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...formData.players];
    if (field === 'playerId') {
      const player = players.find((p) => p._id === value);
      newPlayers[index] = { playerId: value, playerName: player?.name };
    } else {
      newPlayers[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, players: newPlayers }));
  };

  const getTeamPlayers = (teamId) => {
    if (!teamId) return [];
    const team = teams.find((t) => t._id === teamId);
    if (!team || !team.members || team.members.length === 0) return [];
    
    return team.members
      .map((member) => {
        // Members are already full objects from backend population
        if (typeof member === 'object' && member._id && member.name) {
          return member;
        }
        // Fallback: if member is just an ID, find it in players array
        const id = typeof member === 'string' ? member : member._id;
        return players.find((p) => p._id === id || p._id?.toString() === id?.toString());
      })
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await matchAPI.createMatch(formData);
      addMatch(response.data.data);
      addToast('Match scheduled successfully!', 'success');
      setShowModal(false);
      setSelectedTeams(['', '']);
      setFormData({
        tournamentId: '',
        gameId: '',
        gameName: '',
        players: [{ playerId: '', playerName: '' }, { playerId: '', playerName: '' }],
        scheduledAt: '',
        court: '',
      });
    } catch (error) {
      addToast(error.response?.data?.message || 'Error scheduling match', 'error');
    }
  };

  const handleStartMatch = async (matchId) => {
    try {
      const response = await matchAPI.startMatch(matchId);
      updateMatch(matchId, response.data.data);
      addToast('Match started!', 'success');
    } catch (error) {
      addToast('Error starting match', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'ongoing':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const filteredMatches =
    selectedStatus === 'all'
      ? matches
      : matches.filter((m) => m.status === selectedStatus);

  return (
    <div className="p-8 bg-white min-h-screen overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-8 bg-red-50 rounded-lg p-6 shadow border border-red-200">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Match Scheduling</h1>
          <p className="text-gray-700 mt-2">Schedule and manage tournament matches</p>
        </div>
        {canScheduleMatches && (
          <button
            onClick={() => {
              setShowModal(true);
              setSelectedTeams(['', '']);
            }}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center gap-2 shadow transition-all hover:shadow-lg"
          >
            <FiPlus /> Schedule Match
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'scheduled', 'ongoing', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              selectedStatus === status
                ? 'bg-red-600 text-white shadow border border-red-700'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {status === 'all' ? 'All Matches' : status}
          </button>
        ))}
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-y-auto flex-1 flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="bg-red-600 text-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Game</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Players</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Scheduled At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Court</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMatches.map((match) => (
                <tr key={match._id} className="hover:bg-gray-50 transition-colors bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-red-600">{match.gameName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {match.players.map((p) => p.playerName).join(' vs ')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(match.scheduledAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{match.court || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(match.status)}`}>
                      {match.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    {canScheduleMatches && match.status === 'scheduled' && (
                      <button
                        onClick={() => handleStartMatch(match._id)}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="Start Match"
                      >
                        <FiPlay />
                      </button>
                    )}
                    {canScheduleMatches && match.status !== 'completed' && (
                      <button
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="Edit Match"
                      >
                        <FiEdit2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Match Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white backdrop-blur-xl rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent mb-6">Schedule New Match</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tournament *</label>
                <select
                  name="tournamentId"
                  value={formData.tournamentId}
                  onChange={handleTournamentSelect}
                  required
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select a tournament</option>
                  {tournaments.map((tournament) => (
                    <option key={tournament._id} value={tournament._id}>
                      {tournament.name} ({tournament.gameName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time *</label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Court/Venue</label>
                <input
                  type="text"
                  name="court"
                  value={formData.court}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div className="border-t border-purple-700/30 pt-4">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Players</h3>
                {formData.players.map((player, index) => (
                  <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Player {index + 1} Team *
                    </label>
                    <select
                      value={selectedTeams[index]}
                      onChange={(e) => handleTeamChange(index, e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent mb-4"
                    >
                      <option value="">Select a team</option>
                      {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.name} ({team.members.length} members)
                        </option>
                      ))}
                    </select>

                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Player {index + 1} *
                    </label>
                    <select
                      value={player.playerId}
                      onChange={(e) => handlePlayerChange(index, 'playerId', e.target.value)}
                      required
                      disabled={!selectedTeams[index]}
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!selectedTeams[index] ? 'Select a team first' : 'Select a player'}
                      </option>
                      {selectedTeams[index] && getTeamPlayers(selectedTeams[index]).map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 font-medium transition-all"
                >
                  Schedule Match
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedTeams(['', '']);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium transition-all border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScheduling;
