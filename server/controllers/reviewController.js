const Review = require('../models/user_review');

exports.createReview = async (req, res) => {
    try {
        const { UserID, Evaluate, Rating, Comment, title, itemType, itemId, itemName } = req.body;

        const newReview = await Review.create({
            UserID,
            Evaluate,
            Rating: Rating || Evaluate,
            title: title || '',
            Comment,
            itemType: itemType || 'general',
            itemId: itemId || '',
            itemName: itemName || '',
            ReviewDate: new Date()
        });

        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('UserID', 'name email avatar')
            .sort({ ReviewDate: -1 })
            .limit(50);

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ UserID: req.params.userId })
            .sort({ ReviewDate: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
