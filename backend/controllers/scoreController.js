const Score = require('../models/Score');
const Match = require('../models/Match');
const Player = require('../models/Player');

// Update score in real-time
exports.updateScore = async (req, res) => {
  try {
    const { matchId, playerId, playerName, currentSet, setScores, currentScore, totalScore, gameId } = req.body;

    let score = await Score.findOne({ matchId, playerId });

    if (!score) {
      score = new Score({
        matchId,
        playerId,
        playerName,
        gameId,
        currentSet,
        setScores,
        currentScore,
        totalScore,
      });
    } else {
      score.currentSet = currentSet || score.currentSet;
      score.setScores = setScores || score.setScores;
      score.currentScore = currentScore !== undefined ? currentScore : score.currentScore;
      score.totalScore = totalScore !== undefined ? totalScore : score.totalScore;
      score.timestamp = new Date();
    }

    const savedScore = await score.save();
    res.status(200).json({ success: true, data: savedScore });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get scores for a match
exports.getMatchScores = async (req, res) => {
  try {
    const scores = await Score.find({ matchId: req.params.matchId });
    res.status(200).json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get scores for a player in a match
exports.getPlayerMatchScore = async (req, res) => {
  try {
    const { matchId, playerId } = req.params;
    const score = await Score.findOne({ matchId, playerId });

    if (!score) {
      return res.status(404).json({ success: false, message: 'Score not found' });
    }

    res.status(200).json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add set score
exports.addSetScore = async (req, res) => {
  try {
    const { matchId, playerId } = req.params;
    const { setNumber, score, won } = req.body;

    let scoreRecord = await Score.findOne({ matchId, playerId });

    if (!scoreRecord) {
      return res.status(404).json({ success: false, message: 'Score record not found' });
    }

    scoreRecord.setScores.push({
      setNumber,
      score,
      won,
      timestamp: new Date(),
    });

    if (won) {
      scoreRecord.currentSet = setNumber + 1;
    }

    scoreRecord.timestamp = new Date();
    const updatedScore = await scoreRecord.save();

    res.status(200).json({ success: true, data: updatedScore });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get player statistics for a game
exports.getPlayerGameStats = async (req, res) => {
  try {
    const { playerId, gameId } = req.params;

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    const gameStats = player.gameStats.find(g => g.gameId?.toString() === gameId);

    if (!gameStats) {
      return res.status(404).json({ success: false, message: 'No stats found for this game' });
    }

    res.status(200).json({ success: true, data: gameStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tournament leaderboard
exports.getTournamentLeaderboard = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const scores = await Score.find({ tournamentId })
      .group({
        _id: '$playerId',
        playerName: { $first: '$playerName' },
        totalScore: { $sum: '$totalScore' },
        matches: { $sum: 1 },
        wins: { $sum: { $cond: ['$isWinner', 1, 0] } },
      })
      .sort({ totalScore: -1, wins: -1 });

    res.status(200).json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Initialize match score sheet
exports.initializeScoreSheet = async (req, res) => {
  try {
    const { matchId, gameId, players } = req.body;

    const scores = [];
    for (const player of players) {
      const score = new Score({
        matchId,
        playerId: player.playerId,
        playerName: player.playerName,
        gameId,
        currentSet: 1,
        setScores: [],
        currentScore: 0,
        totalScore: 0,
      });
      scores.push(await score.save());
    }

    res.status(201).json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Finalize match score
exports.finalizeMatchScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { winners } = req.body;

    const scores = await Score.find({ matchId });

    const updatedScores = scores.map(score => {
      score.isWinner = winners.includes(score.playerId.toString());
      return score;
    });

    await Promise.all(updatedScores.map(score => score.save()));

    res.status(200).json({ success: true, data: updatedScores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get score history
exports.getScoreHistory = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { gameId, limit = 10 } = req.query;

    let query = { playerId };
    if (gameId) {
      query.gameId = gameId;
    }

    const history = await Score.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
