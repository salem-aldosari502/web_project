const Message = require('../models/Message');
const ContactMessage = require('../models/contact_messages');
const User = require('../models/user_info');

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

exports.createMessage = async (req, res) => {
    try {
        const {
            senderName,
            senderEmail,
            subject,
            body,
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
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getMessageById = async (req, res) => {
    try {
        const msg = await Message.findById(req.params.id);
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        res.status(200).json(msg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

        if (update.status) await syncContactStatus(msg);

        res.status(200).json(msg);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const msg = await Message.findByIdAndDelete(req.params.id);
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        res.status(200).json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

        try {
            if (process.env.EAMIL_USER && process.env.EMAIL_PASS) {
                const nodemailer = require('nodemailer');
                const transporter = nodemailer.createTransport({
                    host: 'smtp-relay.brevo.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EAMIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });
                await transporter.sendMail({
                    from: `"Trip Kuwait Admin" <${process.env.EAMIL_USER}>`,
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
