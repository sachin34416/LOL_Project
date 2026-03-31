const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { verifyToken, isAdminOrOrganizer } = require('../middleware/auth');

// Public routes (read access for authenticated users)
router.get('/', verifyToken, matchController.getAllMatches);
router.get('/upcoming', verifyToken, matchController.getUpcomingMatches);
router.get('/today', verifyToken, matchController.getTodaysMatches);
router.get('/:id', verifyToken, matchController.getMatchById);
router.get('/tournament/:tournamentId', verifyToken, matchController.getMatchesByTournament);

// Admin/Organizer only routes
router.post('/', verifyToken, isAdminOrOrganizer, matchController.createMatch);
router.post('/tournament/:tournamentId/schedule', verifyToken, isAdminOrOrganizer, matchController.scheduleMatches);
router.put('/:id', verifyToken, isAdminOrOrganizer, matchController.updateMatch);
router.put('/:id/start', verifyToken, isAdminOrOrganizer, matchController.startMatch);
router.put('/:id/end', verifyToken, isAdminOrOrganizer, matchController.endMatch);

module.exports = router;
