const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'ignored'],
      default: 'unread',
    },
    adminReply: { type: String, default: '' },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema, 'messages');