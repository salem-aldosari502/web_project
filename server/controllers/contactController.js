const ContactMessage = require('../models/contact_messages');

exports.createMessage = async (req, res) => {
    try {
        const { UserID, Name, Email, Message } = req.body;
        
        const newMessage = await ContactMessage.create({
            UserID,
            Name,
            Email,
            Message,
            DateSent: new Date(),
            Status: 'Pending'
        });
        
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find()
            .populate('UserID', 'name email')
            .sort({ DateSent: -1 });
        
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find({ UserID: req.params.userId })
            .sort({ DateSent: -1 });
        
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMessageStatus = async (req, res) => {
    try {
        const { Status } = req.body;
        
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { Status },
            { new: true }
        );
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        
        res.status(200).json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
