import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { gameAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import useToastStore from '../store/toastStore';

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

  // Define predefined games by category
  const predefinedGamesByCategory = {
    'sets-based': ['Badminton', 'Tennis', 'Volleyball', 'Pickleball'],
    'goals-based': ['Football', 'Hockey', 'Basketball'],
    'points-based': ['Carrom', 'Badminton'],
    'turns-based': ['Pool', 'Foosball', 'Chess'],
    'time-based': ['Cricket', 'Racing', 'Esports'],
  };

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
    'Cricket': [
      { name: 'format', label: 'Match Format', type: 'select', default: 'ODI', options: ['T20', 'ODI', 'Test Match'] },
      { name: 'oversPerMatch', label: 'Overs Per Match', type: 'number', default: 20 },
      { name: 'ballsPerOver', label: 'Balls Per Over', type: 'number', default: 6 },
      { name: 'wicketsPerTeam', label: 'Total Wickets Per Team', type: 'number', default: 10 },
      { name: 'maxRunsPerOver', label: 'Max Runs Per Over (Optional)', type: 'number', default: null },
      { name: 'allowBoundaries', label: 'Allow Boundaries (4s & 6s)?', type: 'checkbox', default: true },
      { name: 'trackWides', label: 'Track Wide Balls?', type: 'checkbox', default: true },
      { name: 'trackNoBalls', label: 'Track No Balls?', type: 'checkbox', default: true },
    ],
    'Football': [
      { name: 'matchDuration', label: 'Match Duration (minutes)', type: 'number', default: 90 },
      { name: 'halves', label: 'Number of Halves', type: 'number', default: 2 },
      { name: 'breakDuration', label: 'Break Duration Between Halves (minutes)', type: 'number', default: 15 },
      { name: 'allowExtraTime', label: 'Allow Extra Time?', type: 'checkbox', default: true },
      { name: 'extraTimeDuration', label: 'Extra Time Duration (minutes)', type: 'number', default: 30 },
      { name: 'allowPenaltyShootout', label: 'Allow Penalty Shootout?', type: 'checkbox', default: true },
      { name: 'maxGoalsDisplay', label: 'Display Max Goals Allowed?', type: 'checkbox', default: false },
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

  const addToast = useToastStore((state) => state.addToast);

  const validateForm = () => {
    if (!formData.name.trim()) {
      addToast('Game name is required', 'error');
      return false;
    }
    if (formData.scoringSystem.maxScore < 1) {
      addToast('Max score must be at least 1', 'error');
      return false;
    }
    if (formData.players.min < 1 || formData.players.max < formData.players.min) {
      addToast('Invalid player count range', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingId) {
        const response = await gameAPI.updateGame(editingId, formData);
        updateGame(editingId, response.data.data);
        addToast('Game template updated successfully!', 'success');
      } else {
        const response = await gameAPI.createGame(formData);
        addGame(response.data.data);
        addToast('Game template created successfully!', 'success');
      }
      resetForm();
      setShowModal(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
      addToast(errorMsg, 'error');
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
        addToast('Game template deleted successfully!', 'success');
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to delete game template';
        addToast(errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredGames =
    selectedCategory === 'all' ? games : games.filter((g) => g.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      'sets-based': 'from-red-50 to-red-100 border-red-300',
      'goals-based': 'from-red-50 to-red-100 border-red-300',
      'points-based': 'from-red-50 to-red-100 border-red-300',
      'turns-based': 'from-red-50 to-red-100 border-red-300',
      'time-based': 'from-red-50 to-red-100 border-red-300',
    };
    return colors[category] || 'from-red-50 to-red-100 border-red-300';
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'sets-based': 'bg-red-100 text-red-800 border border-red-400',
      'goals-based': 'bg-red-100 text-red-800 border border-red-400',
      'points-based': 'bg-red-100 text-red-800 border border-red-400',
      'turns-based': 'bg-red-100 text-red-800 border border-red-400',
      'time-based': 'bg-red-100 text-red-800 border border-red-400',
    };
    return colors[category] || 'bg-red-100 text-red-800 border border-red-400';
  };

  return (
    <div className="p-8 bg-white min-h-screen overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-8 bg-red-50 rounded-lg p-6 shadow border border-red-200">
        <div>
          <h1 className="text-4xl font-bold text-red-600">
            Game Templates
          </h1>
          <p className="text-gray-700 mt-2">Create and manage custom game templates with dynamic scoring systems</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center gap-2 shadow transition-all hover:shadow-lg"
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
                ? 'bg-red-600 text-white shadow border border-red-700'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {cat === 'all' ? 'All Games' : cat.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-2">
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
          <div className="col-span-full bg-red-50 rounded-lg p-12 text-center border border-red-200">
            <p className="text-gray-700 text-lg">No game templates found. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-3xl w-full max-h-[95vh] overflow-y-auto border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-red-600">
                {editingId ? 'Edit Game Template' : 'Create New Game Template'}
              </h2>
              <button
                onClick={() => !loading && setShowModal(false)}
                disabled={loading}
                className="text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="border-b border-purple-700/30 pb-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Basic Information</h3>
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
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    >
                      <option value="sets-based">Sets-based (Badminton, Volleyball)</option>
                      <option value="goals-based">Goals-based (Football, Hockey)</option>
                      <option value="points-based">Points-based (Carrom, Pickleball)</option>
                      <option value="turns-based">Turns-based (Pool, Foosball)</option>
                      <option value="time-based">Time-based (Chess, Racing)</option>
                    </select>
                  </div>
                </div>

                {/* Suggested Games */}
                {formData.category && predefinedGamesByCategory[formData.category] && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Popular Games in this Category</label>
                    <div className="flex flex-wrap gap-2">
                      {predefinedGamesByCategory[formData.category].map((game) => (
                        <button
                          key={game}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, name: game }));
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-all border ${
                            formData.name === game
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/50 shadow-lg'
                              : 'bg-white text-gray-900 border border-gray-300 hover:border-red-500 hover:bg-red-50'
                          }`}
                        >
                          {game}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the game and its rules..."
                    rows="3"
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Player Configuration */}
              <div className="border-b border-purple-700/30 pb-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Player Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Players</label>
                    <input
                      type="number"
                      name="min"
                      value={formData.players.min}
                      onChange={handlePlayerCountChange}
                      min="1"
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Scoring System Section */}
              <div className="border-b border-purple-700/30 pb-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Scoring System</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                    <input
                      type="number"
                      name="maxScore"
                      value={formData.scoringSystem.maxScore}
                      onChange={handleScoringSystemChange}
                      min="1"
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Win Condition</label>
                    <select
                      name="winCondition"
                      value={formData.scoringSystem.winCondition}
                      onChange={handleScoringSystemChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
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
                      className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Allow Deuces (continuous play at tie)</span>
                  </label>
                </div>
              </div>

              {/* Custom Fields Section */}
              {customFieldsConfig[formData.name] && (
                <div className="border-b border-purple-700/30 pb-6 bg-purple-900/30 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">Custom Settings for {formData.name}</h3>
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
                              className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-600"
                            />
                            <span className="text-sm font-medium text-gray-700">{field.label}</span>
                          </label>
                        ) : field.type === 'select' ? (
                          <>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                            <select
                              name={field.name}
                              value={formData.customFields[field.name] !== undefined ? formData.customFields[field.name] : field.default}
                              onChange={handleCustomFieldChange}
                              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                            >
                              {field.options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData.customFields[field.name] !== undefined ? formData.customFields[field.name] : (field.default || '')}
                              onChange={handleCustomFieldChange}
                              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-purple-700/30">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl"
                >
                  {loading ? 'Processing...' : editingId ? 'Update Template' : 'Create Template'}
                </button>
                <button
                  type="button"
                  onClick={() => !loading && setShowModal(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
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
