import React, { useEffect, useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { useAuthStore } from '../store/authStore';
import { matchAPI, scoreAPI } from '../services/api';
import { FiPlus, FiMinus } from 'react-icons/fi';
import useToastStore from '../store/toastStore';
import { roleCheck } from '../utils/roleCheck';

const LiveScoring = () => {
  const { user } = useAuthStore();
  const upcomingMatches = useMatchStore((state) => state.upcomingMatches);
  const fetchUpcomingMatches = useMatchStore((state) => state.fetchUpcomingMatches);
  const addToast = useToastStore((state) => state.addToast);

  // Role-based checks
  const canEditScores = roleCheck.canEditScores(user);

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scores, setScores] = useState({});
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    fetchUpcomingMatches();
  }, []);

  const handleSelectMatch = async (match) => {
    setSelectedMatch(match);
    try {
      const response = await scoreAPI.getMatchScores(match._id);
      const scoresMap = {};
      response.data.data.forEach((score) => {
        scoresMap[score.playerId] = score.currentScore;
      });
      setScores(scoresMap);
    } catch (error) {
      // Initialize scores if not found
      const scoresMap = {};
      match.players.forEach((player) => {
        scoresMap[player.playerId] = 0;
      });
      setScores(scoresMap);
    }
  };

  const handleStartScoring = async () => {
    if (!selectedMatch) {
      addToast('Please select a match', 'error');
      return;
    }

    try {
      await matchAPI.startMatch(selectedMatch._id);
      const scoreSheetData = {
        matchId: selectedMatch._id,
        gameId: selectedMatch.gameId,
        players: selectedMatch.players,
      };
      await scoreAPI.initializeScoreSheet(scoreSheetData);
      addToast('Scoring started!', 'success');
    } catch (error) {
      addToast('Error starting match scoring', 'error');
    }
  };

  const handleUpdateScore = async (playerId, newScore) => {
    if (!selectedMatch) return;

    const updatedScores = { ...scores, [playerId]: newScore };
    setScores(updatedScores);

    try {
      await scoreAPI.updateScore({
        matchId: selectedMatch._id,
        playerId,
        playerName: selectedMatch.players.find((p) => p.playerId === playerId)?.playerName,
        gameId: selectedMatch.gameId,
        currentScore: newScore,
        totalScore: newScore,
      });
    } catch (error) {
      addToast('Error updating score', 'error');
    }
  };

  const handleEndMatch = async () => {
    if (!selectedMatch) return;

    try {
      // Determine winners based on scores
      const maxScore = Math.max(...Object.values(scores));
      const winners = selectedMatch.players
        .filter((p) => scores[p.playerId] === maxScore)
        .map((p) => p.playerId);

      await matchAPI.endMatch(selectedMatch._id, { winners });
      await scoreAPI.finalizeMatchScore(selectedMatch._id, { winners });

      addToast('Match completed!', 'success');
      setSelectedMatch(null);
      setScores({});
    } catch (error) {
      addToast('Error ending match', 'error');
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen overflow-y-auto flex flex-col">
      <h1 className="text-3xl font-bold text-red-600 mb-2">Live Scoring</h1>
      <p className="text-gray-700 mb-8">{canEditScores ? 'Update match scores in real-time' : 'View live match scores'}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-y-auto">
        {/* Match Selection */}
        <div className="lg:col-span-1 overflow-y-auto flex flex-col">
          <div className="bg-white rounded-lg shadow border border-gray-300 p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-red-600 mb-4">Select Match</h2>
            <div className="space-y-2 overflow-y-auto flex-1">
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <button
                    key={match._id}
                    onClick={() => handleSelectMatch(match)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedMatch?._id === match._id
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-semibold text-red-600">{match.gameName}</p>
                    <p className="text-xs text-gray-700 mt-1">
                      {match.players.map((p) => p.playerName).join(' vs ')}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(match.scheduledAt).toLocaleTimeString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold capitalize ${
                        match.status === 'ongoing'
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {match.status}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-gray-600 text-center py-8">No upcoming matches</p>
              )}
            </div>
          </div>
        </div>

        {/* Score Entry */}
        <div className="lg:col-span-2 overflow-y-auto flex flex-col">
          {selectedMatch ? (
            <div className="bg-white rounded-lg shadow border border-gray-300 p-6 flex-1 flex flex-col overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-red-600 mb-2">{selectedMatch.gameName}</h2>
                <p className="text-gray-700">
                  {new Date(selectedMatch.scheduledAt).toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    selectedMatch.status === 'ongoing'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {selectedMatch.status}
                </span>
              </div>

              {/* Score Board */}
              <div className="border-t border-gray-300 pt-6 flex-1 overflow-y-auto">
                <h3 className="text-lg font-semibold text-red-600 mb-6">Score Board</h3>
                <div className="space-y-6">
                  {selectedMatch.players.map((player, index) => (
                    <div key={player.playerId} className="border border-gray-300 bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-lg font-bold text-red-600">{player.playerName}</p>
                          <p className="text-sm text-gray-700">Player {index + 1}</p>
                        </div>
                        <div className="text-4xl font-bold text-red-600">
                          {scores[player.playerId] || 0}
                        </div>
                      </div>

                      {canEditScores ? (
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleUpdateScore(player.playerId, Math.max(0, (scores[player.playerId] || 0) - 1))}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all"
                          >
                            <FiMinus /> Decrease
                          </button>
                          <button
                            onClick={() => handleUpdateScore(player.playerId, (scores[player.playerId] || 0) + 1)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all"
                          >
                            <FiPlus /> Increase
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
                          <p className="text-blue-800 text-center font-medium">
                            {!canEditScores ? 'Organizers and Admins can edit scores' : 'Only organizers can edit scores'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Match Controls */}
                {canEditScores && (
                  <div className="flex gap-4 mt-8 pt-6 border-t border-gray-300">
                    {selectedMatch.status === 'scheduled' && (
                      <button
                        onClick={handleStartScoring}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all"
                      >
                        Start Match
                      </button>
                    )}
                    {selectedMatch.status === 'ongoing' && (
                      <button
                        onClick={handleEndMatch}
                        className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-all"
                      >
                        End Match
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 rounded-lg shadow border border-red-200 p-12 text-center flex items-center justify-center flex-1">
              <p className="text-gray-700 text-lg">Select a match to start scoring</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveScoring;
