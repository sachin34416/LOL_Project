import React, { useEffect, useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { useTournamentStore } from '../store/tournamentStore';
import { usePlayerStore } from '../store/playerStore';
import { matchAPI, tournamentAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiPlay } from 'react-icons/fi';
import useToastStore from '../store/toastStore';

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

  const addToast = useToastStore((state) => state.addToast);

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
      addToast('Match scheduled successfully!', 'success');
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
        return 'bg-amber-500/30 text-amber-200 border border-amber-500/50';
      case 'ongoing':
        return 'bg-green-500/30 text-green-200 border border-green-500/50';
      case 'completed':
        return 'bg-slate-500/30 text-slate-200 border border-slate-500/50';
      default:
        return 'bg-slate-500/30 text-slate-200 border border-slate-500/50';
    }
  };

  const filteredMatches =
    selectedStatus === 'all'
      ? matches
      : matches.filter((m) => m.status === selectedStatus);

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-8 bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 shadow-lg border border-purple-700/50">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent\">Match Scheduling</h1>
          <p className="text-purple-200 mt-2\">Schedule and manage tournament matches</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 flex items-center gap-2 shadow-lg transition-all hover:shadow-2xl"
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
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              selectedStatus === status
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border border-amber-400/50'
                : 'bg-slate-800/40 text-purple-200 hover:bg-slate-700/40 border border-purple-700/50'
            }`}
          >
            {status === 'all' ? 'All Matches' : status}
          </button>
        ))}
      </div>

      {/* Matches Table */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg border border-purple-700/50 overflow-y-auto flex-1 flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Game</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Players</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Scheduled At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Court</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredMatches.map((match) => (
                <tr key={match._id} className="hover:bg-purple-700/30 transition-colors bg-slate-700/20">
                  <td className="px-6 py-4 text-sm font-medium text-amber-300">{match.gameName}</td>
                  <td className="px-6 py-4 text-sm text-purple-300">
                    {match.players.map((p) => p.playerName).join(' vs ')}
                  </td>
                  <td className="px-6 py-4 text-sm text-purple-300">
                    {new Date(match.scheduledAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-purple-300">{match.court || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(match.status)}`}>
                      {match.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    {match.status === 'scheduled' && (
                      <button
                        onClick={() => handleStartMatch(match._id)}
                        className="text-green-400 hover:text-green-300 transition-colors"
                        title="Start Match"
                      >
                        <FiPlay />
                      </button>
                    )}
                    {match.status !== 'completed' && (
                      <button
                        className="text-amber-400 hover:text-amber-300 transition-colors"
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
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-700/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-6">Schedule New Match</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Tournament *</label>
                <select
                  name="tournamentId"
                  value={formData.tournamentId}
                  onChange={handleTournamentSelect}
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-purple-200 mb-2">Scheduled Time *</label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Court/Venue</label>
                <input
                  type="text"
                  name="court"
                  value={formData.court}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="border-t border-purple-700/30 pt-4">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">Players</h3>
                {formData.players.map((player, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Player {index + 1} *
                    </label>
                    <select
                      value={player.playerId}
                      onChange={(e) => handlePlayerChange(index, 'playerId', e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 font-medium transition-all"
                >
                  Schedule Match
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700/50 text-purple-200 py-2 rounded-lg hover:bg-slate-600/50 font-medium transition-all border border-purple-700/50"
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
