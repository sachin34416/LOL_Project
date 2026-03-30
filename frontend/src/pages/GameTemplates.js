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
      'sets-based': 'from-slate-700/40 to-purple-700/40 border-purple-600/50',
      'goals-based': 'from-slate-700/40 to-purple-700/40 border-purple-600/50',
      'points-based': 'from-slate-700/40 to-purple-700/40 border-purple-600/50',
      'turns-based': 'from-slate-700/40 to-purple-700/40 border-purple-600/50',
      'time-based': 'from-slate-700/40 to-purple-700/40 border-purple-600/50',
    };
    return colors[category] || 'from-slate-700/40 to-purple-700/40 border-purple-600/50';
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'sets-based': 'bg-amber-500/30 text-amber-200 border border-amber-500/50',
      'goals-based': 'bg-purple-500/30 text-purple-200 border border-purple-500/50',
      'points-based': 'bg-orange-500/30 text-orange-200 border border-orange-500/50',
      'turns-based': 'bg-amber-500/30 text-amber-200 border border-amber-500/50',
      'time-based': 'bg-purple-500/30 text-purple-200 border border-purple-500/50',
    };
    return colors[category] || 'bg-purple-500/30 text-purple-200 border border-purple-500/50';
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-8 bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 shadow-lg border border-purple-700/50">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Game Templates
          </h1>
          <p className="text-purple-200 mt-2">Create and manage custom game templates with dynamic scoring systems</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 flex items-center gap-2 shadow-lg transition-all hover:shadow-2xl"
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
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border border-amber-400/50'
                : 'bg-slate-800/40 text-purple-200 hover:bg-slate-700/40 border border-purple-700/50'
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
          <div className="col-span-full bg-slate-800/40 backdrop-blur-xl rounded-lg p-12 text-center border border-purple-700/50">
            <p className="text-purple-200 text-lg">No game templates found. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-lg shadow-2xl p-8 max-w-3xl w-full max-h-[95vh] overflow-y-auto border border-purple-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                {editingId ? 'Edit Game Template' : 'Create New Game Template'}
              </h2>
              <button
                onClick={() => !loading && setShowModal(false)}
                disabled={loading}
                className="text-purple-300 hover:text-amber-400 transition-colors disabled:opacity-50"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="border-b border-purple-700/30 pb-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Game Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Pickleball, Tennis"
                      required
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                  <label className="block text-sm font-medium text-purple-200 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the game and its rules..."
                    rows="3"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Player Configuration */}
              <div className="border-b border-purple-700/30 pb-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">Player Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Minimum Players</label>
                    <input
                      type="number"
                      name="min"
                      value={formData.players.min}
                      onChange={handlePlayerCountChange}
                      min="1"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Maximum Players</label>
                    <input
                      type="number"
                      name="max"
                      value={formData.players.max}
                      onChange={handlePlayerCountChange}
                      min="1"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Scoring System Section */}
              <div className="border-b border-purple-700/30 pb-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">Scoring System</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Max Score</label>
                    <input
                      type="number"
                      name="maxScore"
                      value={formData.scoringSystem.maxScore}
                      onChange={handleScoringSystemChange}
                      min="1"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Win Condition</label>
                    <select
                      name="winCondition"
                      value={formData.scoringSystem.winCondition}
                      onChange={handleScoringSystemChange}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      <option value="highest-score">Highest Score</option>
                      <option value="first-to-value">First to Value</option>
                      <option value="accumulated-points">Accumulated Points</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Sets Per Match</label>
                    <input
                      type="number"
                      name="setsPerMatch"
                      value={formData.scoringSystem.setsPerMatch}
                      onChange={handleScoringSystemChange}
                      min="1"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Points Per Set</label>
                    <input
                      type="number"
                      name="pointsPerSet"
                      value={formData.scoringSystem.pointsPerSet}
                      onChange={handleScoringSystemChange}
                      min="1"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                      className="w-4 h-4 text-amber-500 rounded focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-purple-200">Allow Deuces (continuous play at tie)</span>
                  </label>
                </div>
              </div>

              {/* Custom Fields Section */}
              {customFieldsConfig[formData.name] && (
                <div className="border-b border-purple-700/30 pb-6 bg-purple-900/30 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-amber-400 mb-4">Custom Settings for {formData.name}</h3>
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
                              className="w-4 h-4 text-amber-500 rounded focus:ring-2 focus:ring-amber-500"
                            />
                            <span className="text-sm font-medium text-purple-200">{field.label}</span>
                          </label>
                        ) : (
                          <>
                            <label className="block text-sm font-medium text-purple-200 mb-2">{field.label}</label>
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData.customFields[field.name] !== undefined ? formData.customFields[field.name] : field.default}
                              onChange={handleCustomFieldChange}
                              className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                  className="flex-1 bg-slate-700/50 text-purple-200 py-3 rounded-lg hover:bg-slate-600/50 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-purple-700/50"
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
