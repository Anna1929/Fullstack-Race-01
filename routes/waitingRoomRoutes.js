//waitingRoomController.js
const express = require('express');
const waitingRoomController = require('../controllers/waitingRoomController');
const router = express.Router();

router.get('/create-waiting-page', waitingRoomController.createRoom);
router.get('/waiting-page', waitingRoomController.getWaitingPage);
router.get('/create-join-page', waitingRoomController.getJoinPage);
router.get('/create-room-page', waitingRoomController.getCreateRoomPage);
router.post('/join-room', waitingRoomController.joinRoom);
router.get('/status/:roomId', waitingRoomController.getRoomStatus);

module.exports = router;