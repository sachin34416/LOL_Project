const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameTemplate',
    required: true,
  },
  gameName: String,
  matchNumber: Number,
  round: Number,
  players: [
    {
      playerId: mongoose.Schema.Types.ObjectId,
      playerName: String,
      finalScore: Number,
      isWinner: Boolean,
      setScores: [Number],
    },
  ],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  startedAt: Date,
  endedAt: Date,
  court: String,
  umpire: String,
  notes: String,
  scores: [
    {
      setNumber: Number,
      scores: [Number],
      timestamp: Date,
    },
  ],
  matchData: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Match', matchSchema);
