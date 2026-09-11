const express = require('express');
const router = express.Router();
let { ORDERS, CROP_LISTINGS } = require('../data/seedData');

// GET /api/orders (List orders for buyer or farmer)
router.get('/', (req, res) => {
  const { buyerId, farmerId } = req.query;

  let results = [...ORDERS];
  if (buyerId) {
    results = results.filter(o => o.buyerId === buyerId);
  }
  if (farmerId) {
    const farmerCrops = CROP_LISTINGS.filter(c => c.farmerId === farmerId).map(c => c.id);
    results = results.filter(o => farmerCrops.includes(o.listingId));
  }

  res.json({
    success: true,
    count: results.length,
    orders: results
  });
});

// POST /api/orders (Create an order)
router.post('/', (req, res) => {
  const { buyerId, buyerName, buyerPhone, listingId, quantity, deliveryAddress, agreedPrice } = req.body;

  const listing = CROP_LISTINGS.find(c => c.id === listingId);
  if (!listing) {
    return res.status(404).json({ error: 'Crop listing not found' });
  }

  const orderQuantity = Number(quantity) || 1;
  const unitPrice = agreedPrice || listing.askingPrice;
  const totalAmount = orderQuantity * unitPrice;

  const newOrder = {
    id: `ord-${Date.now()}`,
    buyerId: buyerId || 'buyer-1',
    buyerName: buyerName || 'Amit Agrotech Mills',
    buyerPhone: buyerPhone || '+91 99001 22334',
    listingId,
    cropName: listing.cropName,
    quantity: orderQuantity,
    unit: listing.unit,
    agreedPrice: unitPrice,
    totalAmount,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentId: `pay_rzp_mock_${Math.floor(Math.random() * 9000000 + 1000000)}`,
    deliveryStatus: 'PICKUP_SCHEDULED',
    pickupDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    deliveryAddress: deliveryAddress || 'Wholesale Mandi Gate 2, City Center',
    trackingUpdates: [
      { status: 'ORDER_PLACED', time: new Date().toISOString(), note: 'Order placed & payment verified via Razorpay' },
      { status: 'CONFIRMED', time: new Date().toISOString(), note: 'Seller notified, dispatch pickup scheduled' }
    ],
    createdAt: new Date().toISOString()
  };

  ORDERS.unshift(newOrder);

  res.status(201).json({
    success: true,
    message: 'Order created and payment captured successfully',
    order: newOrder
  });
});

// PUT /api/orders/:id/status (Advance delivery status)
router.put('/:id/status', (req, res) => {
  const { deliveryStatus, note } = req.body;
  const order = ORDERS.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.deliveryStatus = deliveryStatus || order.deliveryStatus;
  order.trackingUpdates.push({
    status: deliveryStatus,
    time: new Date().toISOString(),
    note: note || `Order transitioned to ${deliveryStatus}`
  });

  res.json({
    success: true,
    message: `Order status updated to ${deliveryStatus}`,
    order
  });
});

// POST /api/payments/create-order (Razorpay Order Creation)
router.post('/payments/create-order', (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  // In test mode / without live key: return valid simulated order payload
  const mockRazorpayOrderId = `order_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

  res.json({
    success: true,
    orderId: mockRazorpayOrderId,
    amount: amount * 100, // in paise
    currency,
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_mode_agriintel',
    message: 'Razorpay order prepared (Test Mode)'
  });
});

// POST /api/payments/verify
router.post('/payments/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id } = req.body;

  res.json({
    success: true,
    verified: true,
    paymentId: razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 10)}`,
    orderId: razorpay_order_id,
    message: 'Payment verified and escrow authorized.'
  });
});

module.exports = router;
