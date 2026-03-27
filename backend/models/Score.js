const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameTemplate',
    required: true,
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  playerName: String,
  currentSet: {
    type: Number,
    default: 1,
  },
  setScores: [
    {
      setNumber: Number,
      score: Number,
      won: Boolean,
      timestamp: Date,
    },
  ],
  currentScore: {
    type: Number,
    default: 0,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  isWinner: Boolean,
  updatedBy: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Score', scoreSchema);
