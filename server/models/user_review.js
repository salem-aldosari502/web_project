const mongoose = require('mongoose');

const userReviewSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_info',
        required: true
    },
    Evaluate: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    Rating: {
        type: Number,
        min: 1,
        max: 5
    },
    Comment: {
        type: String,
        required: true
    },
    ReviewDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


module.exports = mongoose.model('user_review', userReviewSchema, 'user_review');
