const Match = require('../models/Match');
const Tournament = require('../models/Tournament');
const { v4: uuidv4 } = require('uuid');

// Get all matches
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get match by ID
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }
    res.status(200).json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get matches by tournament
exports.getMatchesByTournament = async (req, res) => {
  try {
    const matches = await Match.find({ tournamentId: req.params.tournamentId });
    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create match
exports.createMatch = async (req, res) => {
  try {
    const { tournamentId, gameId, gameName, players, scheduledAt, round, matchNumber, court } = req.body;

    if (!tournamentId || !gameId || !players || players.length < 2) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const match = new Match({
      tournamentId,
      gameId,
      gameName,
      players: players.map(p => ({
        ...p,
        finalScore: 0,
        isWinner: false,
        setScores: [],
      })),
      scheduledAt,
      round,
      matchNumber,
      court,
      status: 'scheduled',
      scores: [],
    });

    const savedMatch = await match.save();
    res.status(201).json({ success: true, data: savedMatch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update match
exports.updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    res.status(200).json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Start match
exports.startMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'ongoing',
        startedAt: new Date(),
        updatedAt: Date.now() 
      },
      { new: true }
    );

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    res.status(200).json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// End match
exports.endMatch = async (req, res) => {
  try {
    const { winners } = req.body;
    
    // First fetch the match to access its players
    let match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // Update match status and players
    match = await Match.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'completed',
        endedAt: new Date(),
        players: match.players.map(p => ({
          ...p,
          isWinner: winners.includes(p.playerId.toString())
        })),
        updatedAt: Date.now() 
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Schedule matches for tournament
exports.scheduleMatches = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { pairingSchedule } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    const matches = [];
    for (const pairing of pairingSchedule) {
      const match = new Match({
        tournamentId,
        gameId: tournament.gameId,
        gameName: tournament.gameName,
        players: pairing.players,
        scheduledAt: pairing.scheduledAt,
        round: pairing.round,
        matchNumber: pairing.matchNumber,
        status: 'scheduled',
      });
      matches.push(await match.save());
    }

    res.status(201).json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get upcoming matches
exports.getUpcomingMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { status: 'scheduled', scheduledAt: { $gte: new Date() } },
        { status: 'ongoing' }
      ]
    }).sort({ scheduledAt: 1 });

    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get today's matches
exports.getTodaysMatches = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const matches = await Match.find({
      scheduledAt: {
        $gte: today,
        $lt: tomorrow,
      },
    }).sort({ scheduledAt: 1 });

    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
