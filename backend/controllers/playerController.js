const Player = require('../models/Player');

// Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json({ success: true, data: players });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    res.status(200).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register new player (handles both admin registration and self-registration)
exports.registerPlayer = async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    // Check if player already exists
    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
      return res.status(400).json({ success: false, message: 'Player with this email already exists' });
    }

    const player = new Player({
      name,
      email,
      phone,
      avatar,
      stats: {
        totalMatches: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winPercentage: 0,
      },
    });

    await player.save();

    // If this is self-registration, link player to the authenticated user
    if (req.user) {
      const User = require('../models/User');
      const user = await User.findById(req.user._id);
      if (user) {
        user.playerId = player._id;
        await user.save();
      }
    }

    res.status(201).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update player
exports.updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    res.status(200).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete player
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    res.status(200).json({ success: true, message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get player stats
exports.getPlayerStats = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    res.status(200).json({ success: true, data: player.stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, gameId } = req.query;
    let query = {};

    const players = await Player.find(query)
      .sort({ 'stats.winPercentage': -1, 'stats.wins': -1 })
      .limit(parseInt(limit));

    res.status(200).json({ success: true, data: players });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update player stats after match
exports.updatePlayerStats = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { won, gameId, gameName } = req.body;

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    // Update overall stats
    player.stats.totalMatches += 1;
    if (won) {
      player.stats.wins += 1;
    } else {
      player.stats.losses += 1;
    }

    player.stats.winPercentage = (player.stats.wins / player.stats.totalMatches * 100).toFixed(2);

    // Update game-specific stats
    const gameStatIndex = player.gameStats.findIndex(g => g.gameId?.toString() === gameId);
    if (gameStatIndex > -1) {
      player.gameStats[gameStatIndex].matches += 1;
      if (won) {
        player.gameStats[gameStatIndex].wins += 1;
      }
    } else {
      player.gameStats.push({
        gameId,
        gameName,
        matches: 1,
        wins: won ? 1 : 0,
        losses: won ? 0 : 1,
      });
    }

    const updatedPlayer = await player.save();
    res.status(200).json({ success: true, data: updatedPlayer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update player's own profile
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;
    const userId = req.user._id; // Get user ID from authenticated middleware

    // Find the user and their associated player
    const User = require('../models/User');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If user has a playerId, update the player record
    if (user.playerId) {
      const player = await Player.findById(user.playerId);
      if (player) {
        if (name) player.name = name;
        if (email) player.email = email;
        if (phone) player.phone = phone;
        if (avatar) player.avatar = avatar;
        await player.save();
      }
    }

    // Update user record
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: user.toJSON() 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
