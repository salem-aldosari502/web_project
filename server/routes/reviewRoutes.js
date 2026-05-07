const express = require("express");
const route = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
    createReview,
    getAllReviews,
    getUserReviews,
    deleteReview
} = require("../controllers/reviewController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
    createReview,
    getAllReviews,
    getUserReviews,
    deleteReview
} = require("../controllers/reviewController");

route.get("/", getAllReviews);
route.post("/", protect, createReview);
route.get("/user/:userId", protect, getUserReviews);
route.delete("/:id", protect, deleteReview);

module.exports = route;
