import React, { useEffect, useState } from 'react';
import { useTournamentStore } from '../store/tournamentStore';
import { useGameStore } from '../store/gameStore';
import { useTeamStore } from '../store/teamStore';
import { tournamentAPI, gameAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import useToastStore from '../store/toastStore';

const TournamentManagement = () => {
  const tournaments = useTournamentStore((state) => state.tournaments);
  const fetchAllTournaments = useTournamentStore((state) => state.fetchAllTournaments);
  const addTournament = useTournamentStore((state) => state.addTournament);
  const removeTournament = useTournamentStore((state) => state.removeTournament);

  const games = useGameStore((state) => state.games);
  const fetchAllGames = useGameStore((state) => state.fetchAllGames);

  const teams = useTeamStore((state) => state.teams);
  const fetchAllTeams = useTeamStore((state) => state.fetchAllTeams);

  const addToast = useToastStore((state) => state.addToast);

  const [showModal, setShowModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gameId: '',
    gameName: '',
    startDate: '',
    location: '',
    maxPlayers: 32,
    format: 'single-elimination',
    description: '',
  });

  useEffect(() => {
    fetchAllTournaments();
    fetchAllGames();
    fetchAllTeams();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGameSelect = (e) => {
    const selectedGameId = e.target.value;
    const selectedGame = games.find((g) => g._id === selectedGameId);
    setFormData((prev) => ({
      ...prev,
      gameId: selectedGameId,
      gameName: selectedGame?.name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await tournamentAPI.createTournament(formData);
      addTournament(response.data.data);
      addToast('Tournament created successfully!', 'success');
      setShowModal(false);
      setFormData({
        name: '',
        gameId: '',
        gameName: '',
        startDate: '',
        location: '',
        maxPlayers: 32,
        format: 'single-elimination',
        description: '',
      });
    } catch (error) {
      addToast(error.response?.data?.message || 'Error creating tournament', 'error');
    }
  };

  const handleDeleteTournament = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await tournamentAPI.deleteTournament(id);
        removeTournament(id);
        addToast('Tournament deleted!', 'success');
      } catch (error) {
        addToast('Error deleting tournament', 'error');
      }
    }
  };

  const handleRegisterTeam = async (teamId) => {
    try {
      const team = teams.find((t) => t._id === teamId);
      await tournamentAPI.registerTeamToTournament(selectedTournament._id, {
        teamId,
        teamName: team.name,
        captain: team.captain,
      });
      addToast(`${team.name} registered!`, 'success');
      setShowRegistrationModal(false);
      fetchAllTournaments();
    } catch (error) {
      addToast(error.response?.data?.message || 'Error registering team', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-amber-500/30 text-amber-200 border border-amber-500/50';
      case 'ongoing':
        return 'bg-green-500/30 text-green-200 border border-green-500/50';
      case 'completed':
        return 'bg-slate-600/30 text-slate-200 border border-slate-600/50';
      default:
        return 'bg-slate-600/30 text-slate-200 border border-slate-600/50';
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-8 bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 shadow-lg border border-purple-700/50">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Tournament Management</h1>
          <p className="text-purple-200 mt-2">Create and manage tournaments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 flex items-center gap-2 shadow-lg transition-all hover:shadow-2xl"
        >
          <FiPlus /> Create Tournament
        </button>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-2">
        {tournaments.map((tournament) => (
          <div
            key={tournament._id}
            className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg p-6 border border-purple-700/50 hover:border-purple-600/50 transition-all hover:shadow-2xl"
          >
            <div className="mb-4 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-amber-300">{tournament.name}</h3>
                <p className="text-sm text-purple-300">{tournament.gameName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(tournament.status)}`}>
                {tournament.status}
              </span>
            </div>

            <p className="text-purple-200 text-sm mb-4">{tournament.description}</p>

            <div className="space-y-2 mb-4 text-sm border-y border-purple-700/30 py-4">
              <p className="text-purple-300">
                <span className="font-semibold text-amber-300">Location:</span> {tournament.location || 'TBD'}
              </p>
              <p className="text-purple-300">
                <span className="font-semibold text-amber-300">Date:</span> {new Date(tournament.startDate).toLocaleDateString()}
              </p>
              <p className="text-purple-300">
                <span className="font-semibold text-amber-300">Format:</span> {tournament.format.replace('-', ' ')}
              </p>
              <p className="text-purple-300 flex items-center gap-2">
                <FiUsers className="text-lg text-orange-400" />
                <span>{(tournament.registeredTeams || []).length}/{tournament.maxPlayers} Teams</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedTournament(tournament);
                  setShowRegistrationModal(true);
                }}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 text-sm font-medium transition-all"
              >
                Register Teams
              </button>
              <button
                onClick={() => handleDeleteTournament(tournament._id)}
                className="px-4 py-2 text-orange-400 hover:text-orange-300 border border-orange-500/50 rounded-lg hover:bg-orange-500/10 transition-colors"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Tournament Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-700/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-6">Create New Tournament</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Tournament Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Game *</label>
                  <select
                    name="gameId"
                    value={formData.gameId}
                    onChange={handleGameSelect}
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select a game</option>
                    {games.map((game) => (
                      <option key={game._id} value={game._id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Start Date *</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Max Players</label>
                  <input
                    type="number"
                    name="maxPlayers"
                    value={formData.maxPlayers}
                    onChange={handleInputChange}
                    min="2"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Format</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="single-elimination">Single Elimination</option>
                    <option value="double-elimination">Double Elimination</option>
                    <option value="round-robin">Round Robin</option>
                    <option value="group-stage">Group Stage</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 font-medium transition-all"
                >
                  Create Tournament
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

      {/* Registration Modal */}
      {showRegistrationModal && selectedTournament && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-700/50">
            <h2 className="text-2xl font-bold text-amber-300 mb-4">
              Register Teams - {selectedTournament.name}
            </h2>
            <p className="text-purple-300 mb-6">
              {(selectedTournament.registeredTeams || []).length} / {selectedTournament.maxPlayers} teams registered
            </p>

            <div className="space-y-2">
              {teams.map((team) => {
                const isRegistered = (selectedTournament.registeredTeams || []).some(
                  (t) => t.teamId?.toString() === team._id.toString()
                );
                return (
                  <div key={team._id} className="flex items-center justify-between border border-purple-700/50 bg-slate-700/20 p-4 rounded">
                    <div>
                      <p className="font-semibold text-amber-300">{team.name}</p>
                      <p className="text-sm text-purple-300">Captain: {team.captain?.name || 'N/A'} • Members: {(team.members || []).length}</p>
                    </div>
                    <button
                      onClick={() => handleRegisterTeam(team._id)}
                      disabled={isRegistered}
                      className={`px-4 py-2 rounded font-medium transition-all ${
                        isRegistered
                          ? 'bg-slate-600/30 text-slate-400 cursor-not-allowed border border-slate-600/50'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                      }`}
                    >
                      {isRegistered ? 'Registered' : 'Register'}
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowRegistrationModal(false)}
              className="mt-6 w-full bg-slate-700/50 text-purple-200 py-2 rounded-lg hover:bg-slate-600/50 font-medium transition-all border border-purple-700/50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentManagement;
