const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.get('/', matchController.getAllMatches);
router.get('/upcoming', matchController.getUpcomingMatches);
router.get('/today', matchController.getTodaysMatches);
router.get('/:id', matchController.getMatchById);
router.get('/tournament/:tournamentId', matchController.getMatchesByTournament);
router.post('/', matchController.createMatch);
router.post('/tournament/:tournamentId/schedule', matchController.scheduleMatches);
router.put('/:id', matchController.updateMatch);
router.put('/:id/start', matchController.startMatch);
router.put('/:id/end', matchController.endMatch);

module.exports = router;
