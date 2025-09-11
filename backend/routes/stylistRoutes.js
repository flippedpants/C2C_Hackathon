const express = require('express');
const router = express.Router();
const StylistController = require('../controllers/stylistController');

router.post('/ask/:uid', StylistController.askStylist);

module.exports = router;