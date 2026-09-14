const express = require('express');
const router = express.Router();

// In-memory chat storage
let CHAT_MESSAGES = [
  {
    id: 'msg-1',
    contextId: 'order-crop-101',
    contextType: 'order',
    senderId: 'buyer-1',
    senderName: 'Amit Agrotech Mills',
    message: 'Hello Ramesh ji, what is the moisture content of the Sharbati Wheat?',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'msg-2',
    contextId: 'order-crop-101',
    contextType: 'order',
    senderId: 'farmer-1',
    senderName: 'Ramesh Patel',
    message: 'Namaste Amit ji, moisture is tested at 11.5%, machine cleaned and ready for immediate loading.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'msg-3',
    contextId: 'job-301',
    contextType: 'job',
    senderId: 'worker-1',
    senderName: 'Jagdish Mandloi',
    message: 'Ramesh ji, I can bring 4 experienced laborers for the harvesting starting Monday.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// GET /api/chat/:contextId/messages
router.get('/:contextId/messages', (req, res) => {
  const { contextId } = req.params;
  const messages = CHAT_MESSAGES.filter(m => m.contextId === contextId);
  res.json({
    success: true,
    contextId,
    count: messages.length,
    messages
  });
});

// POST /api/chat/send
router.post('/send', (req, res) => {
  const { contextId, contextType, senderId, senderName, message } = req.body;

  if (!contextId || !message) {
    return res.status(400).json({ error: 'contextId and message are required' });
  }

  const newMsg = {
    id: `msg-${Date.now()}`,
    contextId,
    contextType: contextType || 'order',
    senderId: senderId || 'user-1',
    senderName: senderName || 'User',
    message,
    timestamp: new Date().toISOString()
  };

  CHAT_MESSAGES.push(newMsg);

  res.status(201).json({
    success: true,
    message: newMsg
  });
});

module.exports = router;
