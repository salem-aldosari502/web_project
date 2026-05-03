const express = require("express");
const route = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createReview } = require("../controllers/reviewController");

route.post("/reviews", protect, createReview);

module.exports = route;
