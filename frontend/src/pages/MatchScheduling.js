import React, { useEffect, useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { useTournamentStore } from '../store/tournamentStore';
import { usePlayerStore } from '../store/playerStore';
import { matchAPI, tournamentAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiPlay } from 'react-icons/fi';
import toastr from 'toastr';

// Configure toastr
toastr.options = {
  closeButton: true,
  progressBar: false,
  timeOut: 4000,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
};

const MatchScheduling = () => {
  const matches = useMatchStore((state) => state.matches);
  const fetchAllMatches = useMatchStore((state) => state.fetchAllMatches);
  const addMatch = useMatchStore((state) => state.addMatch);
  const removeMatch = useMatchStore((state) => state.removeMatch);
  const updateMatch = useMatchStore((state) => state.updateMatch);

  const tournaments = useTournamentStore((state) => state.tournaments);
  const fetchAllTournaments = useTournamentStore((state) => state.fetchAllTournaments);

  const players = usePlayerStore((state) => state.players);
  const fetchAllPlayers = usePlayerStore((state) => state.fetchAllPlayers);

  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await matchAPI.createMatch(formData);
      addMatch(response.data.data);
      toastr.success('Match scheduled successfully!');
      setShowModal(false);
      setFormData({
        tournamentId: '',
        gameId: '',
        gameName: '',
        players: [{ playerId: '', playerName: '' }, { playerId: '', playerName: '' }],
        scheduledAt: '',
        court: '',
      });
    } catch (error) {
      toastr.error(error.response?.data?.message || 'Error scheduling match');
    }
  };

  const handleStartMatch = async (matchId) => {
    try {
      const response = await matchAPI.startMatch(matchId);
      updateMatch(matchId, response.data.data);
      toastr.success('Match started!');
    } catch (error) {
      toastr.error('Error starting match');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMatches =
    selectedStatus === 'all'
      ? matches
      : matches.filter((m) => m.status === selectedStatus);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Match Scheduling</h1>
          <p className="text-gray-600 mt-2">Schedule and manage tournament matches</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <FiPlus /> Schedule Match
        </button>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'scheduled', 'ongoing', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              selectedStatus === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {status === 'all' ? 'All Matches' : status}
          </button>
        ))}
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Game</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Players</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Scheduled At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Court</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMatches.map((match) => (
              <tr key={match._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{match.gameName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {match.players.map((p) => p.playerName).join(' vs ')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(match.scheduledAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{match.court || '-'}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(match.status)}`}>
                    {match.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  {match.status === 'scheduled' && (
                    <button
                      onClick={() => handleStartMatch(match._id)}
                      className="text-green-600 hover:text-green-900"
                      title="Start Match"
                    >
                      <FiPlay />
                    </button>
                  )}
                  {match.status !== 'completed' && (
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
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

      {/* Create Match Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule New Match</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tournament *</label>
                <select
                  name="tournamentId"
                  value={formData.tournamentId}
                  onChange={handleTournamentSelect}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Court/Venue</label>
                <input
                  type="text"
                  name="court"
                  value={formData.court}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Players</h3>
                {formData.players.map((player, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Player {index + 1} *
                    </label>
                    <select
                      value={player.playerId}
                      onChange={(e) => handlePlayerChange(index, 'playerId', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a player</option>
                      {players.map((p) => (
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
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Schedule Match
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 font-medium"
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
