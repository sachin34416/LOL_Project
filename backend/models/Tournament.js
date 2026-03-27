const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameTemplate',
    required: true,
  },
  gameName: String,
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  location: String,
  maxPlayers: Number,
  registeredPlayers: [
    {
      playerId: mongoose.Schema.Types.ObjectId,
      playerName: String,
      joinedAt: Date,
    },
  ],
  format: {
    type: String,
    enum: ['single-elimination', 'double-elimination', 'round-robin', 'group-stage'],
    default: 'single-elimination',
  },
  rounds: [
    {
      roundNumber: Number,
      matches: [mongoose.Schema.Types.ObjectId],
      completed: Boolean,
    },
  ],
  standings: [
    {
      position: Number,
      playerId: mongoose.Schema.Types.ObjectId,
      playerName: String,
      wins: Number,
      losses: Number,
      pointsFor: Number,
      pointsAgainst: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tournament', tournamentSchema);
