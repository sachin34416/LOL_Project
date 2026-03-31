const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Get all teams with leaderboard
router.get('/leaderboard', teamController.getTeamLeaderboard);

// Get all teams
router.get('/', teamController.getAllTeams);

// Create new team
router.post('/', teamController.createTeam);

// Get team by ID
router.get('/:id', teamController.getTeamById);

// Update team
router.put('/:id', teamController.updateTeam);

// Add player to team
router.post('/:id/add-player', teamController.addPlayerToTeam);

// Remove player from team
router.delete('/:id/remove-player', teamController.removePlayerFromTeam);

// Update team stats
router.put('/:id/stats', teamController.updateTeamStats);

// Delete team
router.delete('/:id', teamController.deleteTeam);

module.exports = router;
