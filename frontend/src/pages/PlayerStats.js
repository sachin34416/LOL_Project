import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { playerAPI, scoreAPI } from '../services/api';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PlayerStats = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const playerResponse = await playerAPI.getPlayerById(playerId);
        setPlayer(playerResponse.data.data);

        const historyResponse = await scoreAPI.getScoreHistory(playerId, null, 20);
        setScoreHistory(historyResponse.data.data);
      } catch (error) {
        console.error('Error fetching player data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!player) {
    return <div className="p-8">Player not found</div>;
  }

  const winRate = player.stats.totalMatches > 0 
    ? ((player.stats.wins / player.stats.totalMatches) * 100).toFixed(2) 
    : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/players')}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
          <p className="text-gray-600">{player.email}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Matches</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{player.stats.totalMatches}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Wins</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{player.stats.wins}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Losses</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{player.stats.losses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Win Percentage</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{winRate}%</p>
        </div>
      </div>

      {/* Game-wise Stats */}
      {player.gameStats && player.gameStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Game-wise Statistics</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Game</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Matches</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Wins</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Losses</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {player.gameStats.map((gameStat, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{gameStat.gameName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{gameStat.matches}</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">{gameStat.wins}</td>
                    <td className="px-6 py-4 text-sm text-red-600 font-medium">{gameStat.losses}</td>
                    <td className="px-6 py-4 text-sm text-indigo-600 font-medium">
                      {gameStat.matches > 0 ? ((gameStat.wins / gameStat.matches) * 100).toFixed(2) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tournament History */}
      {player.tournaments && player.tournaments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tournament History</h2>
          <div className="space-y-3">
            {player.tournaments.map((tournament, index) => (
              <div key={index} className="flex items-center justify-between border border-gray-200 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{tournament.name}</p>
                  <p className="text-sm text-gray-600">{new Date(tournament.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">#{tournament.position}</p>
                  <p className="text-xs text-gray-600">Position</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score History */}
      {scoreHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Scores</h2>
          <div className="space-y-3">
            {scoreHistory.slice(0, 10).map((score, index) => (
              <div key={index} className="flex items-center justify-between border border-gray-200 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{score.gameId}</p>
                  <p className="text-xs text-gray-600">{new Date(score.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${score.isWinner ? 'text-green-600' : 'text-gray-600'}`}>
                    {score.totalScore}
                  </p>
                  <p className="text-xs text-gray-600">{score.isWinner ? 'Won' : 'Lost'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
