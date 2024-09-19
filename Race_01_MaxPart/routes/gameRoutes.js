const express = require('express');
const gameController = require('../controllers/gameController');
const router = express.Router();

router.get('/start-game', gameController.createMatch);
router.get('/start-game-page', gameController.showGamePage);
router.post('/turn', gameController.playTurn);
router.get('/status/:matchId', gameController.getMatchState);

module.exports = router;