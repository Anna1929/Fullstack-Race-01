const express = require('express');
const MainController = require('../controllers/mainController');

const router = express.Router();

router.get('/', MainController.showMainPage);

module.exports = router;