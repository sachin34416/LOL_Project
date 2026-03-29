import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { gameAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import toastr from 'toastr';

// Configure toastr
toastr.options = {
  closeButton: true,
  progressBar: false,
  timeOut: 4000,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
};

const GameTemplates = () => {
  const games = useGameStore((state) => state.games);
  const fetchAllGames = useGameStore((state) => state.fetchAllGames);
  const addGame = useGameStore((state) => state.addGame);
  const removeGame = useGameStore((state) => state.removeGame);
  const updateGame = useGameStore((state) => state.updateGame);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'sets-based',
    description: '',
    scoringSystem: {
      type: 'dual-score',
      maxScore: 21,
      winCondition: 'first-to-value',
      setsPerMatch: 3,
      pointsPerSet: 21,
      deucesAllowed: true,
    },
    players: { min: 2, max: 2 },
    rules: [],
    customFields: {},
  });

  useEffect(() => {
    fetchAllGames();
  }, [fetchAllGames]);

  const categories = ['all', 'sets-based', 'goals-based', 'points-based', 'turns-based', 'time-based'];

  // Define custom fields for each game type
  const customFieldsConfig = {
    'Pickleball': [
      { name: 'hasServerNumber', label: 'Track Server Number?', type: 'checkbox', default: true },
      { name: 'maxPoints', label: 'Max Points to Win', type: 'number', default: 11 },
      { name: 'winByTwo', label: 'Win by 2?', type: 'checkbox', default: true },
    ],
    'Badminton': [
      { name: 'setsPerMatch', label: 'Sets Per Match', type: 'number', default: 3 },
      { name: 'deucesAllowed', label: 'Allow Deuces?', type: 'checkbox', default: true },
    ],
    'Tennis': [
      { name: 'setsPerMatch', label: 'Sets Per Match', type: 'number', default: 3 },
      { name: 'gamesPerSet', label: 'Games Per Set', type: 'number', default: 6 },
      { name: 'deucesAllowed', label: 'Allow Deuces?', type: 'checkbox', default: true },
    ],
    'Volleyball': [
      { name: 'pointsToWin', label: 'Points to Win Set', type: 'number', default: 25 },
      { name: 'setsPerMatch', label: 'Sets Per Match', type: 'number', default: 5 },
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScoringSystemChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      scoringSystem: {
        ...prev.scoringSystem,
        [name]: type === 'checkbox' ? e.target.checked : value,
      },
    }));
  };

  const handleCustomFieldChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [name]: type === 'checkbox' ? e.target.checked : value,
      },
    }));
  };

  const handlePlayerCountChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      players: { ...prev.players, [name]: parseInt(value) },
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toastr.error('Game name is required');
      return false;
    }
    if (formData.scoringSystem.maxScore < 1) {
      toastr.error('Max score must be at least 1');
      return false;
    }
    if (formData.players.min < 1 || formData.players.max < formData.players.min) {
      toastr.error('Invalid player count range');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toastr.clear();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingId) {
        const response = await gameAPI.updateGame(editingId, formData);
        updateGame(editingId, response.data.data);
        toastr.success('Game template updated successfully!');
      } else {
        const response = await gameAPI.createGame(formData);
        addGame(response.data.data);
        toastr.success('Game template created successfully!');
      }
      resetForm();
      setShowModal(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
      toastr.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
        pointsPerSet: 21,
        deucesAllowed: true,
      },
      players: { min: 2, max: 2 },
      rules: [],
      customFields: {},
    });
    setEditingId(null);
  };

  const handleEdit = (game) => {
    setFormData(game);
    setEditingId(game._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this game template? This action cannot be undone.')) {
      setLoading(true);
      try {
        await gameAPI.deleteGame(id);
        removeGame(id);
        toastr.success('Game template deleted successfully!');
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to delete game template';
        toastr.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredGames =
    selectedCategory === 'all' ? games : games.filter((g) => g.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      'sets-based': 'from-emerald-50 to-teal-50 border-emerald-200',
      'goals-based': 'from-blue-50 to-cyan-50 border-blue-200',
      'points-based': 'from-purple-50 to-pink-50 border-purple-200',
      'turns-based': 'from-yellow-50 to-orange-50 border-yellow-200',
      'time-based': 'from-indigo-50 to-violet-50 border-indigo-200',
    };
    return colors[category] || 'from-gray-50 to-gray-50 border-gray-200';
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'sets-based': 'bg-emerald-100 text-emerald-800',
      'goals-based': 'bg-blue-100 text-blue-800',
      'points-based': 'bg-purple-100 text-purple-800',
      'turns-based': 'bg-yellow-100 text-yellow-800',
      'time-based': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Game Templates
          </h1>
          <p className="text-gray-600 mt-2">Create and manage custom game templates with dynamic scoring systems</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-teal-600 flex items-center gap-2 shadow-md transition-all hover:shadow-lg"
        >
          <FiPlus size={20} /> Create Template
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat === 'all' ? 'All Games' : cat.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div
              key={game._id}
              className={`bg-gradient-to-br ${getCategoryColor(
                game.category
              )} border rounded-lg shadow hover:shadow-lg transition-all hover:-translate-y-1`}
            >
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
                  <span
                    className={`inline-block mt-2 px-3 py-1 ${getCategoryBadgeColor(
                      game.category
                    )} text-xs font-semibold rounded-full capitalize`}
                  >
                    {game.category.replace('-', ' ')}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description || 'No description provided'}</p>

                <div className="space-y-2 mb-4 text-sm bg-white bg-opacity-50 p-3 rounded">
                  <p className="text-gray-700">
                    <span className="font-semibold text-emerald-600">Players:</span> {game.players.min}-{game.players.max}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-emerald-600">Max Score:</span> {game.scoringSystem.maxScore || 'Unlimited'}
                  </p>
                  <p className="text-gray-700 capitalize">
                    <span className="font-semibold text-emerald-600">Win Condition:</span> {game.scoringSystem.winCondition.replace('-', ' ')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(game)}
                    disabled={loading}
                    className="flex-1 text-emerald-600 hover:text-emerald-700 py-2 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiEdit2 className="inline mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(game._id)}
                    disabled={loading}
                    className="flex-1 text-red-600 hover:text-red-700 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 className="inline mr-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">No game templates found. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-3xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {editingId ? 'Edit Game Template' : 'Create New Game Template'}
              </h2>
              <button
                onClick={() => !loading && setShowModal(false)}
                disabled={loading}
                className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Game Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Pickleball, Tennis"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="sets-based">Sets-based (Badminton, Volleyball)</option>
                      <option value="goals-based">Goals-based (Football, Hockey)</option>
                      <option value="points-based">Points-based (Carrom, Pickleball)</option>
                      <option value="turns-based">Turns-based (Pool, Foosball)</option>
                      <option value="time-based">Time-based (Chess, Racing)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the game and its rules..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Player Configuration */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Player Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Players</label>
                    <input
                      type="number"
                      name="min"
                      value={formData.players.min}
                      onChange={handlePlayerCountChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Players</label>
                    <input
                      type="number"
                      name="max"
                      value={formData.players.max}
                      onChange={handlePlayerCountChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Scoring System Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring System</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                    <input
                      type="number"
                      name="maxScore"
                      value={formData.scoringSystem.maxScore}
                      onChange={handleScoringSystemChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Win Condition</label>
                    <select
                      name="winCondition"
                      value={formData.scoringSystem.winCondition}
                      onChange={handleScoringSystemChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="highest-score">Highest Score</option>
                      <option value="first-to-value">First to Value</option>
                      <option value="accumulated-points">Accumulated Points</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sets Per Match</label>
                    <input
                      type="number"
                      name="setsPerMatch"
                      value={formData.scoringSystem.setsPerMatch}
                      onChange={handleScoringSystemChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Points Per Set</label>
                    <input
                      type="number"
                      name="pointsPerSet"
                      value={formData.scoringSystem.pointsPerSet}
                      onChange={handleScoringSystemChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="deucesAllowed"
                      checked={formData.scoringSystem.deucesAllowed}
                      onChange={handleScoringSystemChange}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Allow Deuces (continuous play at tie)</span>
                  </label>
                </div>
              </div>

              {/* Custom Fields Section */}
              {customFieldsConfig[formData.name] && (
                <div className="border-b border-gray-200 pb-6 bg-emerald-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Settings for {formData.name}</h3>
                  <div className="space-y-4">
                    {customFieldsConfig[formData.name].map((field) => (
                      <div key={field.name}>
                        {field.type === 'checkbox' ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name={field.name}
                              checked={formData.customFields[field.name] !== undefined ? formData.customFields[field.name] : field.default}
                              onChange={handleCustomFieldChange}
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{field.label}</span>
                          </label>
                        ) : (
                          <>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData.customFields[field.name] !== undefined ? formData.customFields[field.name] : field.default}
                              onChange={handleCustomFieldChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-teal-600 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? 'Processing...' : editingId ? 'Update Template' : 'Create Template'}
                </button>
                <button
                  type="button"
                  onClick={() => !loading && setShowModal(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
