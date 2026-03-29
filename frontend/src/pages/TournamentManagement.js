import React, { useEffect, useState } from 'react';
import { useTournamentStore } from '../store/tournamentStore';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { tournamentAPI, gameAPI, playerAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import toastr from 'toastr';

// Configure toastr
toastr.options = {
  closeButton: true,
  progressBar: false,
  timeOut: 4000,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
};

const TournamentManagement = () => {
  const tournaments = useTournamentStore((state) => state.tournaments);
  const fetchAllTournaments = useTournamentStore((state) => state.fetchAllTournaments);
  const addTournament = useTournamentStore((state) => state.addTournament);
  const removeTournament = useTournamentStore((state) => state.removeTournament);

  const games = useGameStore((state) => state.games);
  const fetchAllGames = useGameStore((state) => state.fetchAllGames);

  const players = usePlayerStore((state) => state.players);
  const fetchAllPlayers = usePlayerStore((state) => state.fetchAllPlayers);

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
    fetchAllPlayers();
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
    toastr.clear();
    try {
      const response = await tournamentAPI.createTournament(formData);
      addTournament(response.data.data);
      toastr.success('Tournament created successfully!');
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
      toastr.error(error.response?.data?.message || 'Error creating tournament');
    }
  };

  const handleDeleteTournament = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await tournamentAPI.deleteTournament(id);
        removeTournament(id);
        toastr.success('Tournament deleted!');
      } catch (error) {
        toastr.error('Error deleting tournament');
      }
    }
  };

  const handleRegisterPlayer = async (playerId) => {
    try {
      const player = players.find((p) => p._id === playerId);
      await tournamentAPI.registerPlayerToTournament(selectedTournament._id, {
        playerId,
        playerName: player.name,
      });
      toastr.success(`${player.name} registered!`);
      setShowRegistrationModal(false);
      fetchAllTournaments();
    } catch (error) {
      toastr.error(error.response?.data?.message || 'Error registering player');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tournament Management</h1>
          <p className="text-gray-600 mt-2">Create and manage tournaments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <FiPlus /> Create Tournament
        </button>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament._id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="mb-4 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{tournament.name}</h3>
                <p className="text-sm text-gray-600">{tournament.gameName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(tournament.status)}`}>
                {tournament.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4">{tournament.description}</p>

            <div className="space-y-2 mb-4 text-sm border-y border-gray-200 py-4">
              <p className="text-gray-700">
                <span className="font-semibold">Location:</span> {tournament.location || 'TBD'}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Date:</span> {new Date(tournament.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Format:</span> {tournament.format.replace('-', ' ')}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <FiUsers className="text-lg" />
                <span>{tournament.registeredPlayers.length}/{tournament.maxPlayers} Players</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedTournament(tournament);
                  setShowRegistrationModal(true);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                Register Players
              </button>
              <button
                onClick={() => handleDeleteTournament(tournament._id)}
                className="px-4 py-2 text-red-600 hover:text-red-900 border border-red-600 rounded-lg hover:bg-red-50"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Tournament Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Tournament</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tournament Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Game *</label>
                  <select
                    name="gameId"
                    value={formData.gameId}
                    onChange={handleGameSelect}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Players</label>
                  <input
                    type="number"
                    name="maxPlayers"
                    value={formData.maxPlayers}
                    onChange={handleInputChange}
                    min="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Create Tournament
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

      {/* Registration Modal */}
      {showRegistrationModal && selectedTournament && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Register Players - {selectedTournament.name}
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedTournament.registeredPlayers.length} / {selectedTournament.maxPlayers} players registered
            </p>

            <div className="space-y-2">
              {players.map((player) => {
                const isRegistered = selectedTournament.registeredPlayers.some(
                  (p) => p.playerId?.toString() === player._id.toString()
                );
                return (
                  <div key={player._id} className="flex items-center justify-between border border-gray-200 p-4 rounded">
                    <div>
                      <p className="font-semibold text-gray-900">{player.name}</p>
                      <p className="text-sm text-gray-600">{player.email}</p>
                    </div>
                    <button
                      onClick={() => handleRegisterPlayer(player._id)}
                      disabled={isRegistered}
                      className={`px-4 py-2 rounded font-medium transition-colors ${
                        isRegistered
                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
              className="mt-6 w-full bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 font-medium"
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
