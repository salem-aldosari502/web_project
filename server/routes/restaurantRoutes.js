const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');

router.get('/', restaurantController.getRestaurants);
router.get('/db', restaurantController.getDbRestaurants);
router.post('/', restaurantController.createRestaurants);

module.exports = router;

