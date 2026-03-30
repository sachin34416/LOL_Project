import React, { useEffect, useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { matchAPI, scoreAPI } from '../services/api';
import { FiPlus, FiMinus } from 'react-icons/fi';
import useToastStore from '../store/toastStore';

const LiveScoring = () => {
  const upcomingMatches = useMatchStore((state) => state.upcomingMatches);
  const fetchUpcomingMatches = useMatchStore((state) => state.fetchUpcomingMatches);
  const addToast = useToastStore((state) => state.addToast);

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
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-y-auto flex flex-col">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">Live Scoring</h1>
      <p className="text-purple-200 mb-8">Update match scores in real-time</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-y-auto">
        {/* Match Selection */}
        <div className="lg:col-span-1 overflow-y-auto flex flex-col">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg border border-purple-700/50 p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-amber-300 mb-4">Select Match</h2>
            <div className="space-y-2 overflow-y-auto flex-1">
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <button
                    key={match._id}
                    onClick={() => handleSelectMatch(match)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedMatch?._id === match._id
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-purple-700/50 hover:border-purple-600/70 bg-slate-700/20 hover:bg-slate-700/40'
                    }`}
                  >
                    <p className="font-semibold text-amber-300">{match.gameName}</p>
                    <p className="text-xs text-purple-300 mt-1">
                      {match.players.map((p) => p.playerName).join(' vs ')}
                    </p>
                    <p className="text-xs text-purple-400 mt-1">
                      {new Date(match.scheduledAt).toLocaleTimeString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold capitalize ${
                        match.status === 'ongoing'
                          ? 'bg-green-500/30 text-green-200 border border-green-500/50'
                          : 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                      }`}
                    >
                      {match.status}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-purple-300 text-center py-8">No upcoming matches</p>
              )}
            </div>
          </div>
        </div>

        {/* Score Entry */}
        <div className="lg:col-span-2 overflow-y-auto flex flex-col">
          {selectedMatch ? (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg border border-purple-700/50 p-6 flex-1 flex flex-col overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-amber-300 mb-2">{selectedMatch.gameName}</h2>
                <p className="text-purple-300">
                  {new Date(selectedMatch.scheduledAt).toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    selectedMatch.status === 'ongoing'
                      ? 'bg-green-500/30 text-green-200 border border-green-500/50'
                      : 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                  }`}
                >
                  {selectedMatch.status}
                </span>
              </div>

              {/* Score Board */}
              <div className="border-t border-purple-700/30 pt-6 flex-1 overflow-y-auto">
                <h3 className="text-lg font-semibold text-amber-300 mb-6">Score Board</h3>
                <div className="space-y-6">
                  {selectedMatch.players.map((player, index) => (
                    <div key={player.playerId} className="border border-purple-700/50 bg-slate-700/20 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-lg font-bold text-amber-300">{player.playerName}</p>
                          <p className="text-sm text-purple-300">Player {index + 1}</p>
                        </div>
                        <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                          {scores[player.playerId] || 0}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => handleUpdateScore(player.playerId, Math.max(0, (scores[player.playerId] || 0) - 1))}
                          className="flex-1 bg-orange-600/80 hover:bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all"
                        >
                          <FiMinus /> Decrease
                        </button>
                        <button
                          onClick={() => handleUpdateScore(player.playerId, (scores[player.playerId] || 0) + 1)}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all"
                        >
                          <FiPlus /> Increase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Match Controls */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-purple-700/30">
                  {selectedMatch.status === 'scheduled' && (
                    <button
                      onClick={handleStartScoring}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-lg font-semibold transition-all"
                    >
                      Start Match
                    </button>
                  )}
                  {selectedMatch.status === 'ongoing' && (
                    <button
                      onClick={handleEndMatch}
                      className="flex-1 bg-purple-600/80 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-all"
                    >
                      End Match
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-lg border border-purple-700/50 p-12 text-center flex items-center justify-center flex-1">
              <p className="text-purple-300 text-lg">Select a match to start scoring</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveScoring;
