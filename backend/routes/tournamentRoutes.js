const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { verifyToken, isAdminOrOrganizer } = require('../middleware/auth');

// Public routes (read access for authenticated users)
router.get('/', verifyToken, tournamentController.getAllTournaments);
router.get('/:id', verifyToken, tournamentController.getTournamentById);
router.get('/:id/standings', verifyToken, tournamentController.getTournamentStandings);

// Admin/Organizer only routes
router.post('/', verifyToken, isAdminOrOrganizer, tournamentController.createTournament);
router.put('/:id', verifyToken, isAdminOrOrganizer, tournamentController.updateTournament);
router.put('/:id/standings', verifyToken, isAdminOrOrganizer, tournamentController.updateStandings);
router.post('/:id/register-team', verifyToken, isAdminOrOrganizer, tournamentController.registerTeamToTournament);
router.post('/:id/register-player', verifyToken, isAdminOrOrganizer, tournamentController.registerPlayerToTournament);
router.delete('/:id/remove-team', verifyToken, isAdminOrOrganizer, tournamentController.removeTeamFromTournament);
router.post('/:id/remove-player', verifyToken, isAdminOrOrganizer, tournamentController.removePlayerFromTournament);
router.delete('/:id', verifyToken, isAdminOrOrganizer, tournamentController.deleteTournament);

module.exports = router;
