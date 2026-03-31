const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Player = require('../models/Player');

// Get all tournaments
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json({ success: true, data: tournaments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tournament by ID
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }
    res.status(200).json({ success: true, data: tournament });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create tournament
exports.createTournament = async (req, res) => {
  try {
    const { name, gameId, gameName, startDate, location, maxPlayers, format, description } = req.body;

    if (!name || !gameId || !startDate) {
      return res.status(400).json({ success: false, message: 'Name, gameId, and startDate are required' });
    }

    const tournament = new Tournament({
      name,
      gameId,
      gameName,
      startDate,
      location,
      maxPlayers,
      format,
      description,
      status: 'upcoming',
      registeredTeams: [],
      standings: [],
    });

    const savedTournament = await tournament.save();
    res.status(201).json({ success: true, data: savedTournament });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update tournament
exports.updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    res.status(200).json({ success: true, data: tournament });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete tournament
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    res.status(200).json({ success: true, message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register team to tournament
exports.registerTeamToTournament = async (req, res) => {
  try {
    const { teamId, teamName, captainId, captainName, memberCount } = req.body;
    const { id: tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    // Check if team already registered
    const isRegistered = tournament.registeredTeams.some(
      t => t.teamId?.toString() === teamId
    );

    if (isRegistered) {
      return res.status(400).json({ success: false, message: 'Team already registered for this tournament' });
    }

    // Check max teams limit
    if (tournament.maxPlayers && tournament.registeredTeams.length >= tournament.maxPlayers) {
      return res.status(400).json({ success: false, message: 'Tournament is full' });
    }

    tournament.registeredTeams.push({
      teamId,
      teamName,
      captainId,
      captainName,
      memberCount,
      joinedAt: new Date(),
    });

    const updatedTournament = await tournament.save();
    res.status(200).json({ success: true, data: updatedTournament });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove team from tournament
exports.removeTeamFromTournament = async (req, res) => {
  try {
    const { teamId } = req.body;
    const { id: tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    tournament.registeredTeams = tournament.registeredTeams.filter(
      t => t.teamId?.toString() !== teamId
    );

    const updatedTournament = await tournament.save();
    res.status(200).json({ success: true, data: updatedTournament });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove player from tournament (deprecated - kept for backward compatibility)
exports.removePlayerFromTournament = async (req, res) => {
  try {
    const { playerId } = req.body;
    const { id: tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    tournament.registeredPlayers = tournament.registeredPlayers.filter(
      p => p.playerId?.toString() !== playerId
    );

    const updatedTournament = await tournament.save();
    res.status(200).json({ success: true, data: updatedTournament });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tournament standings
exports.getTournamentStandings = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    res.status(200).json({ success: true, data: tournament.standings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update tournament standings
exports.updateStandings = async (req, res) => {
  try {
    const { standings } = req.body;
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { standings, updatedAt: Date.now() },
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    res.status(200).json({ success: true, data: tournament });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
