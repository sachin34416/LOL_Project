const Team = require('../models/Team');
const Player = require('../models/Player');

// Generate unique team code
const generateTeamCode = () => {
  return 'TEAM' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('captainId', 'name email')
      .populate('members', 'name email stats')
      .populate('owner', 'name email');
    
    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('captainId', 'name email')
      .populate('members', 'name email stats')
      .populate('owner', 'name email');
    
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new team
exports.createTeam = async (req, res) => {
  try {
    const { name, description, logo, captainId, owner } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Team name is required' });
    }

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ success: false, message: 'Team with this name already exists' });
    }

    const team = new Team({
      name,
      code: generateTeamCode(),
      description,
      logo,
      captainId,
      owner,
      members: captainId ? [captainId] : [],
    });

    const savedTeam = await team.save();
    await savedTeam.populate('captainId', 'name email');
    
    res.status(201).json({ success: true, data: savedTeam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const { name, description, logo, captainId } = req.body;
    
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, description, logo, captainId, updatedAt: new Date() },
      { new: true }
    ).populate('captainId', 'name email')
     .populate('members', 'name email stats');

    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add player to team
exports.addPlayerToTeam = async (req, res) => {
  try {
    const { playerId } = req.body;
    const { id: teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if player already in team
    if (team.members.includes(playerId)) {
      return res.status(400).json({ success: false, message: 'Player already in team' });
    }

    // Update team
    team.members.push(playerId);
    await team.save();

    // Update player
    await Player.findByIdAndUpdate(playerId, { teamId });

    const updatedTeam = await team.populate('members', 'name email stats');
    res.status(200).json({ success: true, message: 'Player added to team', data: updatedTeam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove player from team
exports.removePlayerFromTeam = async (req, res) => {
  try {
    const { playerId } = req.body;
    const { id: teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    team.members = team.members.filter(id => id.toString() !== playerId);
    await team.save();

    // Update player
    await Player.findByIdAndUpdate(playerId, { teamId: null });

    res.status(200).json({ success: true, message: 'Player removed from team', data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get team leaderboard
exports.getTeamLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const leaderboard = await Team.find()
      .sort({ 'stats.wins': -1 })
      .limit(parseInt(limit))
      .populate('captainId', 'name email')
      .populate('members', 'name email');

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update team stats
exports.updateTeamStats = async (req, res) => {
  try {
    const { wins, losses, draws, totalMatches } = req.body;
    
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    team.stats.wins = wins || team.stats.wins;
    team.stats.losses = losses || team.stats.losses;
    team.stats.draws = draws || team.stats.draws;
    team.stats.totalMatches = totalMatches || team.stats.totalMatches;
    team.stats.winPercentage = team.stats.totalMatches > 0 
      ? ((team.stats.wins / team.stats.totalMatches) * 100).toFixed(2)
      : 0;

    const updatedTeam = await team.save();
    res.status(200).json({ success: true, data: updatedTeam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Remove team from all players
    await Player.updateMany({ teamId: req.params.id }, { teamId: null });

    res.status(200).json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
