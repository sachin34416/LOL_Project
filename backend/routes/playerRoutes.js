const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/', playerController.getAllPlayers);
router.get('/leaderboard', playerController.getLeaderboard);
router.get('/:id', playerController.getPlayerById);
router.get('/:id/stats', playerController.getPlayerStats);
router.post('/', playerController.registerPlayer);
router.put('/:id', playerController.updatePlayer);
router.put('/:id/stats', playerController.updatePlayerStats);
router.delete('/:id', playerController.deletePlayer);

module.exports = router;
