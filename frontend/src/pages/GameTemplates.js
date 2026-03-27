import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { gameAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const GameTemplates = () => {
  const games = useGameStore((state) => state.games);
  const fetchAllGames = useGameStore((state) => state.fetchAllGames);
  const addGame = useGameStore((state) => state.addGame);
  const removeGame = useGameStore((state) => state.removeGame);
  const updateGame = useGameStore((state) => state.updateGame);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'sets-based',
    description: '',
    scoringSystem: {
      type: 'dual-score',
      maxScore: 21,
      winCondition: 'first-to-value',
      setsPerMatch: 3,
    },
    players: { min: 2, max: 2 },
    rules: [],
  });

  useEffect(() => {
    fetchAllGames();
  }, []);

  const categories = ['all', 'sets-based', 'goals-based', 'points-based', 'turns-based', 'time-based'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScoringSystemChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      scoringSystem: { ...prev.scoringSystem, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await gameAPI.updateGame(editingId, formData);
        updateGame(editingId, response.data.data);
        toast.success('Game template updated!');
      } else {
        const response = await gameAPI.createGame(formData);
        addGame(response.data.data);
        toast.success('Game template created!');
      }
      setShowModal(false);
      setFormData({
        name: '',
        category: 'sets-based',
        description: '',
        scoringSystem: {
          type: 'dual-score',
          maxScore: 21,
          winCondition: 'first-to-value',
          setsPerMatch: 3,
        },
        players: { min: 2, max: 2 },
        rules: [],
      });
      setEditingId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving game template');
    }
  };

  const handleEdit = (game) => {
    setFormData(game);
    setEditingId(game._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this game template?')) {
      try {
        await gameAPI.deleteGame(id);
        removeGame(id);
        toast.success('Game template deleted!');
      } catch (error) {
        toast.error('Error deleting game template');
      }
    }
  };

  const filteredGames =
    selectedCategory === 'all' ? games : games.filter((g) => g.category === selectedCategory);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Game Templates</h1>
          <p className="text-gray-600 mt-2">Create and manage custom game templates</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
            setFormData({
              name: '',
              category: 'sets-based',
              description: '',
              scoringSystem: {
                type: 'dual-score',
                maxScore: 21,
                winCondition: 'first-to-value',
                setsPerMatch: 3,
              },
              players: { min: 2, max: 2 },
              rules: [],
            });
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <FiPlus /> Create Template
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {cat === 'all' ? 'All Games' : cat.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div key={game._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full capitalize">
                {game.category.replace('-', ' ')}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4">{game.description}</p>

            <div className="space-y-2 mb-4 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Players:</span> {game.players.min}-{game.players.max}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Max Score:</span> {game.scoringSystem.maxScore || 'Unlimited'}
              </p>
              <p className="text-gray-700 capitalize">
                <span className="font-semibold">Win Condition:</span> {game.scoringSystem.winCondition.replace('-', ' ')}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(game)}
                className="flex-1 text-indigo-600 hover:text-indigo-900 py-2 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <FiEdit2 className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDelete(game._id)}
                className="flex-1 text-red-600 hover:text-red-900 py-2 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FiTrash2 className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Game Template' : 'Create New Game Template'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Game Name *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="sets-based">Sets-based (Badminton, Volleyball)</option>
                    <option value="goals-based">Goals-based (Football, Hockey)</option>
                    <option value="points-based">Points-based (Carrom)</option>
                    <option value="turns-based">Turns-based (Pool, Foosball)</option>
                    <option value="time-based">Time-based (Chess, Racing)</option>
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

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring System</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                    <input
                      type="number"
                      name="maxScore"
                      value={formData.scoringSystem.maxScore}
                      onChange={handleScoringSystemChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Win Condition</label>
                    <select
                      name="winCondition"
                      value={formData.scoringSystem.winCondition}
                      onChange={handleScoringSystemChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="highest-score">Highest Score</option>
                      <option value="first-to-value">First to Value</option>
                      <option value="accumulated-points">Accumulated Points</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  {editingId ? 'Update' : 'Create'} Template
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400"
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

export default GameTemplates;
