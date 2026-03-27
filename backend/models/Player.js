const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  avatar: String,
  stats: {
    totalMatches: {
      type: Number,
      default: 0,
    },
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    draws: {
      type: Number,
      default: 0,
    },
    winPercentage: {
      type: Number,
      default: 0,
    },
  },
  gameStats: [
    {
      gameId: mongoose.Schema.Types.ObjectId,
      gameName: String,
      matches: Number,
      wins: Number,
      losses: Number,
      avgScore: Number,
    },
  ],
  tournaments: [
    {
      tournamentId: mongoose.Schema.Types.ObjectId,
      name: String,
      position: Number,
      date: Date,
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Player', playerSchema);
