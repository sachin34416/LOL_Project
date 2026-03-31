const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { verifyToken, isAdminOrOrganizer, canAccess } = require('../middleware/auth');

// Public routes (read access for authenticated users)
router.get('/', verifyToken, playerController.getAllPlayers);
router.get('/leaderboard', verifyToken, playerController.getLeaderboard);
router.get('/:id', verifyToken, playerController.getPlayerById);
router.get('/:id/stats', verifyToken, playerController.getPlayerStats);

// Player self-registration (any authenticated user can register as player)
router.post('/register', verifyToken, playerController.registerPlayer);

// Admin/Organizer only routes (for managing players)
router.post('/', verifyToken, isAdminOrOrganizer, playerController.registerPlayer);
router.put('/:id', verifyToken, isAdminOrOrganizer, playerController.updatePlayer);
router.put('/:id/stats', verifyToken, isAdminOrOrganizer, playerController.updatePlayerStats);
router.delete('/:id', verifyToken, isAdminOrOrganizer, playerController.deletePlayer);

// Player can update their own profile
router.put('/my-profile', verifyToken, playerController.updateMyProfile);

module.exports = router;
