const express = require('express');
const router = express.Router();

const hotelController = require('../controllers/hotelController');

router.get('/', hotelController.getHotels);
router.post('/', hotelController.createHotels);
router.get('/google', hotelController.getGoogleHotels);

module.exports = router;
