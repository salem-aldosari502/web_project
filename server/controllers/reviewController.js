const Review = require('../models/user_review');

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const { UserID, Evaluate, Rating, Comment } = req.body;
        
        const newReview = await Review.create({
            UserID,
            Evaluate,
            Rating,
            Comment,
            ReviewDate: new Date()
        });
        
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all reviews (for admin)
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('UserID', 'name email')
            .sort({ ReviewDate: -1 });
        
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reviews by user
exports.getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ UserID: req.params.userId })
            .sort({ ReviewDate: -1 });
        
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
