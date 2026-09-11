const express = require('express');
const router = express.Router();
let { CROP_LISTINGS, AGRI_INPUTS, MSP_DATA } = require('../data/seedData');

// GET /api/listings/crop (Search & Filter)
router.get('/crop', (req, res) => {
  const { search, state, minPrice, maxPrice } = req.query;

  let results = [...CROP_LISTINGS];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(item =>
      item.cropName.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.variety.toLowerCase().includes(q)
    );
  }

  if (state && state !== 'All') {
    results = results.filter(item => item.state.toLowerCase() === state.toLowerCase());
  }

  if (minPrice) {
    results = results.filter(item => item.askingPrice >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter(item => item.askingPrice <= Number(maxPrice));
  }

  res.json({
    success: true,
    count: results.length,
    listings: results
  });
});

// GET /api/listings/crop/:id (Single listing)
router.get('/crop/:id', (req, res) => {
  const listing = CROP_LISTINGS.find(item => item.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json({ success: true, listing });
});

// GET /api/listings/crop/:id/price-comparison (Fair value analysis)
router.get('/crop/:id/price-comparison', (req, res) => {
  const listing = CROP_LISTINGS.find(item => item.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  // Extract base crop name (e.g. "Wheat" from "Wheat (Sharbati Gold)")
  const baseCrop = MSP_DATA.find(m => listing.cropName.toLowerCase().includes(m.crop.toLowerCase().split(' ')[0])) || MSP_DATA[0];

  const msp = listing.mspPrice || baseCrop.msp;
  const asking = listing.askingPrice;
  const forecast = listing.forecastPrice || Math.round(msp * 1.08);

  const diffVsMsp = asking - msp;
  const diffVsMspPct = ((diffVsMsp / msp) * 100).toFixed(1);

  const isBelowMsp = asking < msp;

  res.json({
    cropId: listing.id,
    cropName: listing.cropName,
    askingPrice: asking,
    mspPrice: msp,
    forecastPrice: forecast,
    unit: listing.unit,
    diffVsMsp,
    diffVsMspPct: Number(diffVsMspPct),
    isBelowMsp,
    statusRecommendation: isBelowMsp
      ? 'WARNING: Asking price is below Government MSP statutory floor. Consider raising price or selling via procurement centers.'
      : 'FAIR VALUE: Asking price provides a positive margin over statutory MSP.'
  });
});

// POST /api/listings/crop (Create new listing)
router.post('/crop', (req, res) => {
  const { farmerId, farmerName, farmerPhone, cropName, variety, quantity, unit, askingPrice, state, district, description, image } = req.body;

  if (!cropName || !quantity || !askingPrice) {
    return res.status(400).json({ error: 'Crop name, quantity, and asking price are required' });
  }

  // Find matching MSP
  const baseCrop = MSP_DATA.find(m => cropName.toLowerCase().includes(m.crop.toLowerCase().split(' ')[0]));
  const mspPrice = baseCrop ? baseCrop.msp : Math.round(Number(askingPrice) * 0.9);
  const forecastPrice = Math.round(Number(askingPrice) * 1.05);

  const newListing = {
    id: `crop-${Date.now()}`,
    farmerId: farmerId || 'farmer-1',
    farmerName: farmerName || 'Ramesh Patel',
    farmerPhone: farmerPhone || '+91 98234 56780',
    cropName,
    variety: variety || 'Standard Quality',
    quantity: Number(quantity),
    unit: unit || 'Quintals',
    askingPrice: Number(askingPrice),
    mspPrice,
    forecastPrice,
    images: [
      image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
    ],
    state: state || 'Madhya Pradesh',
    district: district || 'Sehore',
    description: description || 'Fresh farm harvest ready for direct procurement.',
    status: 'AVAILABLE',
    createdAt: new Date().toISOString()
  };

  CROP_LISTINGS.unshift(newListing);

  res.status(201).json({
    success: true,
    message: 'Crop listing created successfully',
    listing: newListing
  });
});

// GET /api/listings/inputs (Agri-Inputs Marketplace)
router.get('/inputs', (req, res) => {
  res.json({
    success: true,
    count: AGRI_INPUTS.length,
    inputs: AGRI_INPUTS
  });
});

module.exports = router;
