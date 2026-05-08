const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const {
    createMessage,
    getAllMessages,
    getMessageById,
    markAsRead,
    replyToMessage,
    ignoreMessage,
    updateMessage,
    deleteMessage,
    adminSendMessage
} = require('../controllers/messageController');

router.post('/', createMessage);

router.get('/', protect, authorizeRoles('admin'), getAllMessages);
router.get('/:id', protect, authorizeRoles('admin'), getMessageById);
router.put('/:id/read', protect, authorizeRoles('admin'), markAsRead);
router.put('/:id/reply', protect, authorizeRoles('admin'), replyToMessage);
router.put('/:id/ignore', protect, authorizeRoles('admin'), ignoreMessage);
router.post('/admin-send', protect, authorizeRoles('admin'), adminSendMessage);
router.put('/:id', protect, authorizeRoles('admin'), updateMessage);
router.delete('/:id', protect, authorizeRoles('admin'), deleteMessage);

module.exports = router;
