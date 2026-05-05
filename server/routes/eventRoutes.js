const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getGoogleEvents);
router.get('/db', eventController.getDbEvents);
router.post('/', eventController.createEvents);

module.exports = router;