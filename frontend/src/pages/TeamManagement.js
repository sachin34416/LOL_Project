import React, { useEffect, useState } from 'react';
import { useTeamStore } from '../store/teamStore';
import { usePlayerStore } from '../store/playerStore';
import { teamAPI } from '../services/api';
import useToastStore from '../store/toastStore';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiSearch, FiX } from 'react-icons/fi';

const TeamManagement = () => {
  const teams = useTeamStore((state) => state.teams);
  const fetchAllTeams = useTeamStore((state) => state.fetchAllTeams);
  const createTeam = useTeamStore((state) => state.createTeam);
  const deleteTeam = useTeamStore((state) => state.deleteTeam);
  const addPlayerToTeam = useTeamStore((state) => state.addPlayerToTeam);
  const removePlayerFromTeam = useTeamStore((state) => state.removePlayerFromTeam);

  const players = usePlayerStore((state) => state.players);
  const fetchAllPlayers = usePlayerStore((state) => state.fetchAllPlayers);

  const addToast = useToastStore((state) => state.addToast);

  const [showModal, setShowModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
  });

  useEffect(() => {
    fetchAllTeams();
    fetchAllPlayers();
  }, [fetchAllTeams, fetchAllPlayers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await createTeam(formData);
    if (result.success) {
      addToast('Team created successfully!', 'success');
      setFormData({ name: '', description: '', logo: '' });
      setShowModal(false);
    } else {
      addToast(result.message, 'error');
    }
    setLoading(false);
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      const result = await deleteTeam(id);
      if (result.success) {
        addToast('Team deleted successfully!', 'success');
      } else {
        addToast(result.message, 'error');
      }
    }
  };

  const handleAddPlayer = async (playerId) => {
    if (!selectedTeam) return;
    
    const result = await addPlayerToTeam(selectedTeam._id, playerId);
    if (result.success) {
      addToast('Player added to team!', 'success');
      await fetchAllPlayers();
    } else {
      addToast(result.message, 'error');
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (!selectedTeam) return;
    
    const result = await removePlayerFromTeam(selectedTeam._id, playerId);
    if (result.success) {
      addToast('Player removed from team!', 'success');
      await fetchAllPlayers();
    } else {
      addToast(result.message, 'error');
    }
  };

  const availablePlayers = players.filter(
    (p) => !selectedTeam?.members.some(m => m._id === p._id)
  );

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-y-auto">
      <div className="mb-8 bg-slate-800/40 backdrop-blur-xl rounded-lg p-6 shadow-lg border border-purple-700/50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Team Management
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <FiPlus /> Create Team
          </button>
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div
            key={team._id}
            className="bg-slate-800/40 border border-purple-700/30 rounded-lg p-6 hover:border-amber-400/50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-400 mb-1">{team.name}</h3>
                <p className="text-sm text-purple-300">{team.code}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowPlayerModal(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 transition"
                  title="Edit"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDeleteTeam(team._id)}
                  className="text-red-400 hover:text-red-300 transition"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <p className="text-purple-200 text-sm mb-4">{team.description}</p>

            {/* Team Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-slate-700/30 rounded p-2">
                <p className="text-xs text-purple-300">Matches</p>
                <p className="text-lg font-bold text-amber-400">{team.stats.totalMatches}</p>
              </div>
              <div className="bg-slate-700/30 rounded p-2">
                <p className="text-xs text-purple-300">Win %</p>
                <p className="text-lg font-bold text-amber-400">{team.stats.winPercentage}%</p>
              </div>
              <div className="bg-slate-700/30 rounded p-2">
                <p className="text-xs text-purple-300">Wins</p>
                <p className="text-lg font-bold text-green-400">{team.stats.wins}</p>
              </div>
              <div className="bg-slate-700/30 rounded p-2">
                <p className="text-xs text-purple-300">Losses</p>
                <p className="text-lg font-bold text-red-400">{team.stats.losses}</p>
              </div>
            </div>

            {/* Members */}
            <div className="border-t border-purple-700/30 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <FiUsers className="text-purple-400" />
                <span className="text-purple-300 text-sm font-semibold">
                  Members ({team.members.length})
                </span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {team.members.length > 0 ? (
                  team.members.map((member) => (
                    <div key={member._id} className="flex justify-between items-center bg-slate-700/20 p-2 rounded">
                      <span className="text-sm text-purple-200">{member.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-purple-400">No members yet</p>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedTeam(team);
                  setShowPlayerModal(true);
                }}
                className="mt-3 w-full bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 py-1 rounded text-sm transition"
              >
                Manage Members
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md border border-purple-700/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-amber-400">Create New Team</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-purple-300 hover:text-amber-400"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Team description"
                  rows="3"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white py-2 rounded-lg font-semibold transition"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Players Modal */}
      {showPlayerModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-2xl border border-purple-700/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-amber-400">Manage {selectedTeam.name} Members</h2>
              <button
                onClick={() => {
                  setShowPlayerModal(false);
                  setSelectedTeam(null);
                }}
                className="text-purple-300 hover:text-amber-400"
              >
                <FiX />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {/* Current Members */}
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Current Members</h3>
                <div className="space-y-2">
                  {selectedTeam.members.length > 0 ? (
                    selectedTeam.members.map((member) => (
                      <div
                        key={member._id}
                        className="flex justify-between items-center bg-slate-700/30 p-3 rounded"
                      >
                        <span className="text-purple-200">{member.name}</span>
                        <button
                          onClick={() => handleRemovePlayer(member._id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-purple-400 text-sm">No members yet</p>
                  )}
                </div>
              </div>

              {/* Available Players */}
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Available Players</h3>
                <div className="space-y-2">
                  {availablePlayers.length > 0 ? (
                    availablePlayers.map((player) => (
                      <div
                        key={player._id}
                        className="flex justify-between items-center bg-slate-700/30 p-3 rounded"
                      >
                        <span className="text-purple-200">{player.name}</span>
                        <button
                          onClick={() => handleAddPlayer(player._id)}
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-purple-400 text-sm">All players already in teams</p>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowPlayerModal(false);
                setSelectedTeam(null);
              }}
              className="w-full mt-4 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
