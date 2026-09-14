const express = require('express');
const router = express.Router();

let NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'weather_hazard',
    title: '⚠️ Fungal Blight Advisory',
    message: 'High humidity (>78%) forecasted across Sehore district for the next 48h. Inspect lower tomato foliage for early blight.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
    badgeColor: 'amber'
  },
  {
    id: 'notif-2',
    type: 'price_spike',
    title: '📈 Mandi Price Spike Alert',
    message: 'Wheat modal price increased by +₹75/Qtl in Bhopal Mandi. Current average ₹2,525/Qtl.',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    read: false,
    badgeColor: 'emerald'
  },
  {
    id: 'notif-3',
    type: 'subsidy_deadline',
    title: '🏛️ PMFBY Insurance Enrollment Deadline',
    message: 'Final enrollment for Rabi crop insurance closes on 30th September. Ensure land records are updated.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    badgeColor: 'blue'
  },
  {
    id: 'notif-4',
    type: 'order_status',
    title: '📦 Order Pickup Dispatched',
    message: 'Truck dispatch scheduled for 20 Quintals Wheat. Buyer: Amit Agrotech Mills.',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    read: true,
    badgeColor: 'purple'
  }
];

// GET /api/notifications
router.get('/', (req, res) => {
  res.json({
    success: true,
    unreadCount: NOTIFICATIONS.filter(n => !n.read).length,
    notifications: NOTIFICATIONS
  });
});

// PUT /api/notifications/mark-all-read
router.put('/mark-all-read', (req, res) => {
  NOTIFICATIONS.forEach(n => n.read = true);
  res.json({ success: true, message: 'All notifications marked as read' });
});

// POST /api/notifications/subscribe (for push alerts)
router.post('/subscribe', (req, res) => {
  const { phone, alertTypes } = req.body;
  res.json({
    success: true,
    message: `Phone ${phone || 'user'} subscribed to SMS/Push agro-advisories.`
  });
});

module.exports = router;
