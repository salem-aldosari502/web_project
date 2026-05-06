const express = require("express");
const route = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
    createReview,
    getAllReviews,
    getUserReviews,
    deleteReview
} = require("../controllers/reviewController");

route.get("/", getAllReviews);                              // public - mainPage slider
route.post("/", protect, createReview);                    // logged-in users only
route.get("/user/:userId", protect, getUserReviews);       // logged-in user or admin
route.delete("/:id", protect, deleteReview);               // user or admin

module.exports = route;
