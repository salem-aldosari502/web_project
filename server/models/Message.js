const mongoose = require('mongoose');

/**
 * Unified message model for the admin inbox.
 *
 * direction = "in"  → message sent by a user/visitor TO the admin
 *                     (replaces the old "contact_messages" collection for the
 *                     admin dashboard inbox).
 * direction = "out" → message composed by the admin and sent TO a user.
 *
 * Status lifecycle (matches what the React admin page expects):
 *   unread → read → replied
 *   unread/read → ignored
 *
 * For "out" messages (admin -> user) the status is set to "sent" right away.
 */
const messageSchema = new mongoose.Schema(
    {
        // who wrote the message
        senderName:  { type: String, required: true },
        senderEmail: { type: String, required: true },
        senderUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user_info',
            required: false
        },

        // who it is for (only filled in for direction === "out")
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

        // link back to the original contact_messages doc (set when mirrored from the contact form)
        contactMsgId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'contact_messages',
            required: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema, 'messages');
