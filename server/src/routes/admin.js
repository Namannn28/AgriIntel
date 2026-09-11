const express = require('express');
const router = express.Router();
const { CROP_LISTINGS, WORKER_PROFILES, JOB_POSTINGS, ORDERS, MSP_DATA } = require('../data/seedData');

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const totalVolumeInRupees = ORDERS.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalProduceListedQuintals = CROP_LISTINGS.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  res.json({
    activeFarmers: 1420,
    registeredBuyers: 380,
    availableWorkers: WORKER_PROFILES.length + 240,
    activeListingsCount: CROP_LISTINGS.length,
    activeJobOpenings: JOB_POSTINGS.length,
    totalTradeVolumeRupees: totalVolumeInRupees + 2450000,
    totalProduceListedQuintals,
    platformUptimePct: 99.94,
    digilockerVerifiedPct: 88.4
  });
});

// GET /api/admin/disease-heatmap
router.get('/disease-heatmap', (req, res) => {
  res.json({
    regions: [
      { state: 'Madhya Pradesh', district: 'Sehore', disease: 'Wheat Yellow Rust', alertLevel: 'MODERATE', casesReported: 14, recommendedPesticide: 'Propiconazole' },
      { state: 'Maharashtra', district: 'Nashik', disease: 'Tomato Early Blight', alertLevel: 'HIGH', casesReported: 42, recommendedPesticide: 'Mancozeb' },
      { state: 'Punjab', district: 'Ludhiana', disease: 'Paddy Bacterial Leaf Blight', alertLevel: 'LOW', casesReported: 6, recommendedPesticide: 'Copper Hydroxide' },
      { state: 'Haryana', district: 'Karnal', disease: 'Mustard White Rust', alertLevel: 'LOW', casesReported: 8, recommendedPesticide: 'Ridomil MZ' }
    ]
  });
});

// GET /api/admin/price-trends
router.get('/price-trends', (req, res) => {
  res.json({
    mspComparisonTrends: MSP_DATA.map(m => ({
      crop: m.crop,
      msp: m.msp,
      averageMandiPrice: Math.round(m.msp * (1 + (Math.sin(m.msp) * 0.08 + 0.05))),
      premiumOverMspPct: m.changePct
    }))
  });
});

module.exports = router;
