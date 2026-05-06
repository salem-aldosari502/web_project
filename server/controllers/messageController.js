const Message = require('../models/Message');
const ContactMessage = require('../models/contact_messages');
const User = require('../models/user_info');

/* ------------------------------------------------------------------ *
 * Helper: sync the linked contact_messages doc whenever admin changes
 * the status of a message that originated from the contact form.
 *
 * messages.status  →  contact_messages.Status
 *   'read'         →  'Read'
 *   'replied'      →  'Resolved'
 *   'ignored'      →  'Read'      (seen but not acted on)
 * ------------------------------------------------------------------ */
async function syncContactStatus(msg) {
    if (!msg || !msg.contactMsgId) return;
    const statusMap = {
        read:    'Read',
        replied: 'Resolved',
        ignored: 'Read',
    };
    const contactStatus = statusMap[msg.status];
    if (!contactStatus) return;
    try {
        await ContactMessage.findByIdAndUpdate(
            msg.contactMsgId,
            { Status: contactStatus }
        );
    } catch (err) {
        console.warn('syncContactStatus failed:', err.message);
    }
}

/* ------------------------------------------------------------------ *
 * PUBLIC: a visitor / user submits the contact form
 * POST /api/messages
 * body: { senderName, senderEmail, subject, body }   (subject optional)
 * ------------------------------------------------------------------ */
exports.createMessage = async (req, res) => {
    try {
        const {
            senderName,
            senderEmail,
            subject,
            body,
            // legacy field names from the old Contact.js form
            Name, Email, Message: legacyBody, UserID
        } = req.body;

        const finalName  = senderName  || Name;
        const finalEmail = senderEmail || Email;
        const finalBody  = body        || legacyBody;

        if (!finalName || !finalEmail || !finalBody) {
            return res.status(400).json({
                message: 'senderName, senderEmail and body are required'
            });
        }

        const msg = await Message.create({
            senderName:   finalName,
            senderEmail:  finalEmail,
            senderUserId: UserID || (req.user && req.user.id) || undefined,
            subject:      subject || '(no subject)',
            body:         finalBody,
            direction:    'in',
            status:       'unread'
        });

        res.status(201).json(msg);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/* ------------------------------------------------------------------ *
 * ADMIN: list every message (inbox + sent)
 * GET /api/messages
 * ------------------------------------------------------------------ */
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ------------------------------------------------------------------ *
 * ADMIN: get one message
 * ------------------------------------------------------------------ */
exports.getMessageById = async (req, res) => {
    try {
        const msg = await Message.findById(req.params.id);
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        res.status(200).json(msg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ------------------------------------------------------------------ *
 * ADMIN: mark as read
 * PUT /api/messages/:id/read
 * ------------------------------------------------------------------ */
exports.markAsRead = async (req, res) => {
    try {
        const msg = await Message.findByIdAndUpdate(
            req.params.id,
            { status: 'read' },
            { new: true }
        );
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        await syncContactStatus(msg);
        res.status(200).json(msg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ------------------------------------------------------------------ *
 * ADMIN: reply to a message (also flips status to "replied")
 * PUT /api/messages/:id/reply
 * body: { adminReply }
 * ------------------------------------------------------------------ */
exports.replyToMessage = async (req, res) => {
    try {
        const { adminReply } = req.body;
        if (!adminReply || !adminReply.trim()) {
            return res.status(400).json({ message: 'adminReply is required' });
        }

        const msg = await Message.findByIdAndUpdate(
            req.params.id,
            {
                adminReply: adminReply.trim(),
                repliedAt:  new Date(),
                status:     'replied'
            },
            { new: true }
        );
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        await syncContactStatus(msg);
        res.status(200).json(msg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ------------------------------------------------------------------ *
 * ADMIN: mark as ignored
 * PUT /api/messages/:id/ignore
 * ------------------------------------------------------------------ */
exports.ignoreMessage = async (req, res) => {
    try {
        const msg = await Message.findByIdAndUpdate(
            req.params.id,
            { status: 'ignored' },
            { new: true }
        );
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        await syncContactStatus(msg);
        res.status(200).json(msg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ------------------------------------------------------------------ *
 * ADMIN: edit a message (subject / body / status / adminReply)
 * PUT /api/messages/:id
 * ------------------------------------------------------------------ */
exports.updateMessage = async (req, res) => {
    try {
        const allowed = ['subject', 'body', 'status', 'adminReply', 'recipientEmail'];
        const update = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) update[key] = req.body[key];
        }

        const msg = await Message.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );
        if (!msg) return res.status(404).json({ message: 'Message not found' });

        // sync back if the status was explicitly changed via the edit form
        if (update.status) await syncContactStatus(msg);

        res.status(200).json(msg);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/* ------------------------------------------------------------------ *
 * ADMIN: delete a message
 * DELETE /api/messages/:id
 * ------------------------------------------------------------------ */
exports.deleteMessage = async (req, res) => {
    try {
        const msg = await Message.findByIdAndDelete(req.params.id);
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        res.status(200).json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ------------------------------------------------------------------ *
 * ADMIN: compose a brand-new message and "send" it to a user
 * POST /api/messages/admin-send
 * body: { recipientEmail, subject, body }
 * ------------------------------------------------------------------ */
exports.adminSendMessage = async (req, res) => {
    try {
        const { recipientEmail, subject, body } = req.body;

        if (!recipientEmail || !body) {
            return res.status(400).json({
                message: 'recipientEmail and body are required'
            });
        }

        const user = await User.findOne({ email: recipientEmail });

        const msg = await Message.create({
            senderName:      (req.userData && req.userData.name)  || 'Admin',
            senderEmail:     (req.userData && req.userData.email) || 'admin',
            recipientEmail,
            recipientUserId: user ? user._id : undefined,
            subject:         subject || '(no subject)',
            body,
            direction:       'out',
            status:          'sent'
        });

        // best-effort email (silently skipped if not configured)
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const nodemailer = require('nodemailer');
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });
                await transporter.sendMail({
                    from: `"Trip Kuwait Admin" <${process.env.EMAIL_USER}>`,
                    to:   recipientEmail,
                    subject: subject || '(no subject)',
                    text: body
                });
            }
        } catch (mailErr) {
            console.warn('Email delivery failed:', mailErr.message);
        }

        res.status(201).json(msg);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
