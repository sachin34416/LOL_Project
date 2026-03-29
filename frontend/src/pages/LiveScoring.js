import React, { useEffect, useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { matchAPI, scoreAPI } from '../services/api';
import { FiPlus, FiMinus } from 'react-icons/fi';
import toastr from 'toastr';

// Configure toastr
toastr.options = {
  closeButton: true,
  progressBar: false,
  timeOut: 4000,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
};

const LiveScoring = () => {
  const upcomingMatches = useMatchStore((state) => state.upcomingMatches);
  const fetchUpcomingMatches = useMatchStore((state) => state.fetchUpcomingMatches);

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
      toastr.error('Please select a match');
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
      toastr.success('Scoring started!');
    } catch (error) {
      toastr.error('Error starting match scoring');
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
      toastr.error('Error updating score');
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

      toastr.success('Match completed!');
      setSelectedMatch(null);
      setScores({});
    } catch (error) {
      toastr.error('Error ending match');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Scoring</h1>
      <p className="text-gray-600 mb-8">Update match scores in real-time</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Match</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <button
                    key={match._id}
                    onClick={() => handleSelectMatch(match)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      selectedMatch?._id === match._id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{match.gameName}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {match.players.map((p) => p.playerName).join(' vs ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(match.scheduledAt).toLocaleTimeString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold capitalize ${
                        match.status === 'ongoing'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
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
        <div className="lg:col-span-2">
          {selectedMatch ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMatch.gameName}</h2>
                <p className="text-gray-600">
                  {new Date(selectedMatch.scheduledAt).toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    selectedMatch.status === 'ongoing'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedMatch.status}
                </span>
              </div>

              {/* Score Board */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Score Board</h3>
                <div className="space-y-6">
                  {selectedMatch.players.map((player, index) => (
                    <div key={player.playerId} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-lg font-bold text-gray-900">{player.playerName}</p>
                          <p className="text-sm text-gray-600">Player {index + 1}</p>
                        </div>
                        <div className="text-4xl font-bold text-indigo-600">
                          {scores[player.playerId] || 0}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => handleUpdateScore(player.playerId, Math.max(0, (scores[player.playerId] || 0) - 1))}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                        >
                          <FiMinus /> Decrease
                        </button>
                        <button
                          onClick={() => handleUpdateScore(player.playerId, (scores[player.playerId] || 0) + 1)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                        >
                          <FiPlus /> Increase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Match Controls */}
                <div className="flex gap-4 mt-8 pt-6 border-t">
                  {selectedMatch.status === 'scheduled' && (
                    <button
                      onClick={handleStartScoring}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                    >
                      Start Match
                    </button>
                  )}
                  {selectedMatch.status === 'ongoing' && (
                    <button
                      onClick={handleEndMatch}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
                    >
                      End Match
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 text-lg">Select a match to start scoring</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveScoring;
