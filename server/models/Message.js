const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        senderName:  { type: String, required: true },
        senderEmail: { type: String, required: true },
        senderUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user_info',
            required: false
        },

        recipientEmail: { type: String },
        recipientUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user_info',
            required: false
        },

        subject: { type: String, required: true, default: '(no subject)' },
        body:    { type: String, required: true },

        direction: {
            type: String,
            enum: ['in', 'out'],
            default: 'in'
        },

        status: {
            type: String,
            enum: ['unread', 'read', 'replied', 'ignored', 'sent'],
            default: 'unread'
        },

        adminReply: { type: String, default: '' },
        repliedAt:  { type: Date },
        
        contactMsgId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'contact_messages',
            required: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema, 'messages');
