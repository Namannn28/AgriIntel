const express = require('express');
const router = express.Router();

let REVIEWS = [
  {
    id: 'rev-1',
    contextType: 'order',
    contextId: 'ord-901',
    fromUserId: 'buyer-1',
    fromUserName: 'Amit Agrotech Mills',
    toUserId: 'farmer-1',
    rating: 5,
    comment: 'Exceptional wheat quality, precisely as described. Clean and on-time pickup.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'rev-2',
    contextType: 'job',
    contextId: 'job-301',
    fromUserId: 'farmer-1',
    fromUserName: 'Ramesh Patel',
    toUserId: 'worker-1',
    rating: 5,
    comment: 'Jagdish and his team did flawless harvesting with zero crop wastage. Highly recommended.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

// GET /api/reviews/user/:id
router.get('/user/:id', (req, res) => {
  const userReviews = REVIEWS.filter(r => r.toUserId === req.params.id);
  const avgRating = userReviews.length > 0
    ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
    : '5.0';

  res.json({
    success: true,
    userId: req.params.id,
    averageRating: Number(avgRating),
    reviewCount: userReviews.length,
    reviews: userReviews
  });
});

// POST /api/reviews
router.post('/', (req, res) => {
  const { contextType, contextId, fromUserId, fromUserName, toUserId, rating, comment } = req.body;

  if (!toUserId || !rating) {
    return res.status(400).json({ error: 'toUserId and rating are required' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    contextType: contextType || 'order',
    contextId: contextId || 'general',
    fromUserId: fromUserId || 'anonymous',
    fromUserName: fromUserName || 'Verified Farmer',
    toUserId,
    rating: Number(rating),
    comment: comment || 'Smooth transaction',
    createdAt: new Date().toISOString()
  };

  REVIEWS.unshift(newReview);

  res.status(201).json({
    success: true,
    message: 'Review recorded successfully',
    review: newReview
  });
});

module.exports = router;
