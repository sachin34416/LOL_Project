const GameTemplate = require('../models/GameTemplate');

// Get all game templates
exports.getAllGames = async (req, res) => {
  try {
    const games = await GameTemplate.find();
    res.status(200).json({ success: true, data: games });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get game template by ID
exports.getGameById = async (req, res) => {
  try {
    const game = await GameTemplate.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game template not found' });
    }
    res.status(200).json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get games by category
exports.getGamesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const games = await GameTemplate.find({ category });
    res.status(200).json({ success: true, data: games });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new game template
exports.createGame = async (req, res) => {
  try {
    const { name, category, description, scoringSystem, players, rules, customRules, icon } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Name and category are required' });
    }

    const game = new GameTemplate({
      name,
      category,
      description,
      scoringSystem,
      players,
      rules,
      customRules,
      icon,
    });

    const savedGame = await game.save();
    res.status(201).json({ success: true, data: savedGame });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update game template
exports.updateGame = async (req, res) => {
  try {
    const game = await GameTemplate.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game template not found' });
    }

    res.status(200).json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete game template
exports.deleteGame = async (req, res) => {
  try {
    const game = await GameTemplate.findByIdAndDelete(req.params.id);

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game template not found' });
    }

    res.status(200).json({ success: true, message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get default game templates
exports.getDefaultTemplates = async (req, res) => {
  try {
    const templates = [
      {
        name: 'Badminton',
        category: 'sets-based',
        description: 'Badminton match with sets and points',
        scoringSystem: {
          type: 'dual-score',
          maxScore: 21,
          winCondition: 'first-to-value',
          setsPerMatch: 3,
          pointsPerSet: 21,
          deucesAllowed: true,
        },
        players: { min: 2, max: 4 },
        rules: ['Best of 3 sets', 'First to 21 points wins a set', 'Deuce allowed at 20-20'],
      },
      {
        name: 'Volleyball',
        category: 'sets-based',
        description: 'Volleyball match with sets',
        scoringSystem: {
          type: 'dual-score',
          maxScore: 25,
          winCondition: 'first-to-value',
          setsPerMatch: 5,
          pointsPerSet: 25,
          deucesAllowed: true,
        },
        players: { min: 12, max: 14 },
        rules: ['Best of 5 sets', 'First to 25 points wins a set', 'Must win by 2 points'],
      },
      {
        name: 'Football',
        category: 'goals-based',
        description: 'Football match with goals',
        scoringSystem: {
          type: 'dual-score',
          maxScore: null,
          winCondition: 'highest-score',
        },
        players: { min: 22, max: 22 },
        rules: ['90 minutes total', '1 point per goal', 'Extra time if tied'],
      },
      {
        name: 'Cricket',
        category: 'runs-based',
        description: 'Cricket match',
        scoringSystem: {
          type: 'single-score',
          maxScore: null,
          winCondition: 'highest-score',
        },
        players: { min: 22, max: 22 },
        rules: ['Team scoring', '1 point per run', 'Wickets matter'],
      },
      {
        name: 'Pool',
        category: 'turns-based',
        description: 'Pool game',
        scoringSystem: {
          type: 'single-score',
          maxScore: 8,
          winCondition: 'first-to-value',
        },
        players: { min: 2, max: 2 },
        rules: ['First to sink all balls of their type', 'Then sink the 8-ball to win'],
      },
      {
        name: 'Carrom',
        category: 'points-based',
        description: 'Carrom board game',
        scoringSystem: {
          type: 'single-score',
          maxScore: 29,
          winCondition: 'highest-score',
        },
        players: { min: 2, max: 4 },
        rules: ['Pieces worth 1 point each', 'Queen worth 3 points', 'First to 29 wins'],
      },
    ];

    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
