const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    unique: true,
  },
  description: String,
  logo: String,
  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Team', teamSchema);
