const mongoose = require('mongoose');

const gameTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['sets-based', 'goals-based', 'points-based', 'turns-based', 'time-based'],
    required: true,
  },
  description: {
    type: String,
  },
  scoringSystem: {
    type: {
      type: String,
      enum: ['single-score', 'dual-score', 'multi-player'],
    },
    maxScore: Number,
    minScore: {
      type: Number,
      default: 0,
    },
    winCondition: {
      type: String,
      enum: ['highest-score', 'first-to-value', 'accumulated-points', 'custom'],
    },
    setsPerMatch: Number,
    pointsPerSet: Number,
    pointsToWinSet: Number,
    deucesAllowed: Boolean,
  },
  players: {
    min: {
      type: Number,
      default: 2,
    },
    max: {
      type: Number,
      default: 2,
    },
  },
  rules: [String],
  customRules: String,
  icon: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GameTemplate', gameTemplateSchema);
