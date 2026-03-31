const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { verifyToken, isAdminOrOrganizer } = require('../middleware/auth');

// Public routes (read access for authenticated users)
router.get('/', verifyToken, gameController.getAllGames);
router.get('/default-templates', verifyToken, gameController.getDefaultTemplates);
router.get('/category/:category', verifyToken, gameController.getGamesByCategory);
router.get('/:id', verifyToken, gameController.getGameById);

// Admin/Organizer only routes
router.post('/', verifyToken, isAdminOrOrganizer, gameController.createGame);
router.put('/:id', verifyToken, isAdminOrOrganizer, gameController.updateGame);
router.delete('/:id', verifyToken, isAdminOrOrganizer, gameController.deleteGame);

module.exports = router;
