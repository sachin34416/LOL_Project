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
  registeredTeams: [
    {
      teamId: mongoose.Schema.Types.ObjectId,
      teamName: String,
      captainId: mongoose.Schema.Types.ObjectId,
      captainName: String,
      memberCount: Number,
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
      teamId: mongoose.Schema.Types.ObjectId,
      teamName: String,
      wins: Number,
      losses: Number,
      draws: Number,
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
