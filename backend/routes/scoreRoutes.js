const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

router.get('/match/:matchId', scoreController.getMatchScores);
router.get('/match/:matchId/player/:playerId', scoreController.getPlayerMatchScore);
router.get('/player/:playerId/game/:gameId', scoreController.getPlayerGameStats);
router.get('/tournament/:tournamentId/leaderboard', scoreController.getTournamentLeaderboard);
router.get('/history/:playerId', scoreController.getScoreHistory);
router.post('/', scoreController.updateScore);
router.post('/initialize', scoreController.initializeScoreSheet);
router.post('/match/:matchId/finalize', scoreController.finalizeMatchScore);
router.post('/match/:matchId/player/:playerId/set', scoreController.addSetScore);

module.exports = router;
