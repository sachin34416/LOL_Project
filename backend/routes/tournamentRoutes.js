const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

router.get('/', tournamentController.getAllTournaments);
router.get('/:id', tournamentController.getTournamentById);
router.get('/:id/standings', tournamentController.getTournamentStandings);
router.post('/', tournamentController.createTournament);
router.put('/:id', tournamentController.updateTournament);
router.put('/:id/standings', tournamentController.updateStandings);
router.post('/:id/register-team', tournamentController.registerTeamToTournament);
router.delete('/:id/remove-team', tournamentController.removeTeamFromTournament);
router.delete('/:id', tournamentController.deleteTournament);

module.exports = router;
