const express = require('express');
const router = express.Router();
const { SUBSIDIES_DATA } = require('../data/seedData');

// GET /api/subsidies (All schemes)
router.get('/', (req, res) => {
  const { state, level } = req.query;
  let results = [...SUBSIDIES_DATA];

  if (state && state !== 'All') {
    results = results.filter(s => s.state === 'All India' || s.state.toLowerCase() === state.toLowerCase());
  }

  if (level) {
    results = results.filter(s => s.level.toLowerCase() === level.toLowerCase());
  }

  res.json({
    success: true,
    count: results.length,
    subsidies: results
  });
});

// POST /api/subsidies/eligible (Automated eligibility evaluation engine)
router.post('/eligible', (req, res) => {
  const { landSizeAcres, state, category, crops } = req.body;

  const farmerLand = Number(landSizeAcres) || 2.5;
  const farmerState = state || 'Madhya Pradesh';
  const farmerCategory = category || 'Small'; // Marginal (<2.5 acres), Small (2.5 - 5 acres), Medium (5-10 acres), Large (>10 acres)
  const farmerCrops = Array.isArray(crops) ? crops : [crops || 'Wheat'];

  const matches = [];

  SUBSIDIES_DATA.forEach(scheme => {
    let eligible = true;
    let reasons = [];

    // State check
    if (scheme.state !== 'All India' && scheme.state.toLowerCase() !== farmerState.toLowerCase()) {
      eligible = false;
      reasons.push(`Scheme restricted to ${scheme.state}`);
    }

    // Land size check
    if (scheme.eligibilityRules.landSizeMaxAcres && farmerLand > scheme.eligibilityRules.landSizeMaxAcres) {
      eligible = false;
      reasons.push(`Landholding (${farmerLand} acres) exceeds scheme cap (${scheme.eligibilityRules.landSizeMaxAcres} acres)`);
    }

    // Category check
    if (scheme.eligibilityRules.categories && !scheme.eligibilityRules.categories.includes(farmerCategory)) {
      eligible = false;
      reasons.push(`Category '${farmerCategory}' not covered in priority list`);
    }

    if (eligible) {
      matches.push({
        ...scheme,
        matchScore: 95,
        eligibilityVerdict: 'HIGHLY ELIGIBLE',
        eligibleBasis: `Matches criteria for ${farmerCategory} farmer with ${farmerLand} acres in ${farmerState}`
      });
    }
  });

  res.json({
    success: true,
    farmerProfileEvaluated: {
      landSizeAcres: farmerLand,
      state: farmerState,
      category: farmerCategory,
      crops: farmerCrops
    },
    eligibleCount: matches.length,
    totalSchemesChecked: SUBSIDIES_DATA.length,
    eligibleSchemes: matches
  });
});

module.exports = router;
