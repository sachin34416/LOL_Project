const Tournament = require('../models/Tournament');
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
      registeredPlayers: [],
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

// Register player to tournament
exports.registerPlayerToTournament = async (req, res) => {
  try {
    const { playerId, playerName } = req.body;
    const { id: tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    // Check if player already registered
    const isRegistered = tournament.registeredPlayers.some(
      p => p.playerId?.toString() === playerId
    );

    if (isRegistered) {
      return res.status(400).json({ success: false, message: 'Player already registered for this tournament' });
    }

    // Check max players limit
    if (tournament.maxPlayers && tournament.registeredPlayers.length >= tournament.maxPlayers) {
      return res.status(400).json({ success: false, message: 'Tournament is full' });
    }

    tournament.registeredPlayers.push({
      playerId,
      playerName,
      joinedAt: new Date(),
    });

    const updatedTournament = await tournament.save();
    res.status(200).json({ success: true, data: updatedTournament });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove player from tournament
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
