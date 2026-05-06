const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const jwt = require('jsonwebtoken');

// ── Auth middleware (same pattern as your other routes) ──────────────────────
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Admins only' });
  next();
}

// ── Public: users submit a message (e.g. from Contact page) ─────────────────
// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { senderName, senderEmail, subject, body } = req.body;
    if (!senderName || !senderEmail || !subject || !body)
      return res.status(400).json({ message: 'All fields are required' });

    const message = await Message.create({ senderName, senderEmail, subject, body });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin: get all messages ──────────────────────────────────────────────────
// GET /api/messages
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin: reply to a message ────────────────────────────────────────────────
// PUT /api/messages/:id/reply
router.put('/:id/reply', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { adminReply } = req.body;
    if (!adminReply)
      return res.status(400).json({ message: 'Reply text is required' });

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { adminReply, status: 'replied', repliedAt: new Date() },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin: ignore a message ──────────────────────────────────────────────────
// PUT /api/messages/:id/ignore
router.put('/:id/ignore', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: 'ignored' },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin: mark as read ──────────────────────────────────────────────────────
// PUT /api/messages/:id/read
router.put('/:id/read', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin: delete a message ──────────────────────────────────────────────────
// DELETE /api/messages/:id
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;    