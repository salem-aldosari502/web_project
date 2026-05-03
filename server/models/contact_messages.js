const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_info',
        required: false  // Optional - guest users can also send messages
    },
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Message: {
        type: String,
        required: true
    },
    DateSent: {
        type: Date,
        default: Date.now
    },
    Status: {
        type: String,
        enum: ['Pending', 'Read', 'Resolved'],
        default: 'Pending'
    }
}, { timestamps: true });


module.exports = mongoose.model('contact_messages', contactMessageSchema, 'contact_messages');
