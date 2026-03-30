import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { playerAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import useToastStore from '../store/toastStore';

const PlayerManagement = () => {
  const players = usePlayerStore((state) => state.players);
  const fetchAllPlayers = usePlayerStore((state) => state.fetchAllPlayers);
  const addPlayer = usePlayerStore((state) => state.addPlayer);
  const removePlayer = usePlayerStore((state) => state.removePlayer);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  const addToast = useToastStore((state) => state.addToast);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await playerAPI.updatePlayer(editingId, formData);
        updatePlayer(editingId, response.data.data);
        addToast('Player updated successfully!', 'success');
      } else {
        const response = await playerAPI.registerPlayer(formData);
        addPlayer(response.data.data);
        addToast('Player registered successfully!', 'success');
      }
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', avatar: '' });
      setEditingId(null);
    } catch (error) {
      addToast(error.response?.data?.message || 'Error saving player', 'error');
    }
  };

  const handleEdit = (player) => {
    setFormData({
      name: player.name,
      email: player.email,
      phone: player.phone || '',
      avatar: player.avatar || '',
    });
    setEditingId(player._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await playerAPI.deletePlayer(id);
        removePlayer(id);
        addToast('Player deleted successfully!', 'success');
      } catch (error) {
        addToast('Error deleting player', 'error');
      }
    }
  };

  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-8 bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 shadow-lg border border-purple-700/50">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Player Management</h1>
          <p className="text-purple-200 mt-2">Manage and register tournament players</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
            setFormData({ name: '', email: '', phone: '', avatar: '' });
          }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 flex items-center gap-2 shadow-lg transition-all hover:shadow-2xl"
        >
          <FiPlus /> Register Player
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-purple-400" />
          <input
            type="text"
            placeholder="Search players by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Players Table */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg border border-purple-700/50 overflow-y-auto flex-1 flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Matches</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Win %</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700/30">
              {filteredPlayers.map((player) => (
                <tr key={player._id} className="hover:bg-purple-700/30 transition-colors bg-slate-700/20">
                  <td className="px-6 py-4 text-sm font-medium text-amber-300">{player.name}</td>
                  <td className="px-6 py-4 text-sm text-purple-300">{player.email}</td>
                  <td className="px-6 py-4 text-sm text-purple-300">{player.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-purple-200">{player.stats.totalMatches}</td>
                  <td className="px-6 py-4 text-sm text-purple-200">{player.stats.winPercentage}%</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handleEdit(player)}
                      className="text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(player._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-lg shadow-2xl p-8 max-w-md w-full border border-purple-700/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-6">
              {editingId ? 'Edit Player' : 'Register New Player'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
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
                <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  {editingId ? 'Update' : 'Register'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700/50 text-purple-200 py-2 rounded-lg hover:bg-slate-600/50 transition-all border border-purple-700/50"
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

export default PlayerManagement;
