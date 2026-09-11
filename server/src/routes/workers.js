const express = require('express');
const router = express.Router();
let { WORKER_PROFILES } = require('../data/seedData');

// GET /api/workers (Search profiles)
router.get('/', (req, res) => {
  const { skill, state, maxWage } = req.query;
  let results = [...WORKER_PROFILES];

  if (skill) {
    results = results.filter(w => w.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
  }

  if (state && state !== 'All') {
    results = results.filter(w => w.state.toLowerCase() === state.toLowerCase());
  }

  if (maxWage) {
    results = results.filter(w => w.dailyWage <= Number(maxWage));
  }

  res.json({
    success: true,
    count: results.length,
    workers: results
  });
});

// GET /api/workers/profile/:id (or current worker profile)
router.get('/profile/:id', (req, res) => {
  const worker = WORKER_PROFILES.find(w => w.id === req.params.id || w.userId === req.params.id);
  if (!worker) {
    return res.status(404).json({ error: 'Worker profile not found' });
  }
  res.json({ success: true, profile: worker });
});

// POST /api/workers/profile (Create / Update profile)
router.post('/profile', (req, res) => {
  const { userId, name, phone, skills, dailyWage, experienceYears, city, state, availability } = req.body;

  let existing = WORKER_PROFILES.find(w => w.userId === userId || w.id === userId);

  if (existing) {
    existing.name = name || existing.name;
    existing.phone = phone || existing.phone;
    existing.skills = skills || existing.skills;
    existing.dailyWage = Number(dailyWage) || existing.dailyWage;
    existing.experienceYears = Number(experienceYears) || existing.experienceYears;
    existing.city = city || existing.city;
    existing.state = state || existing.state;
    existing.availability = availability || existing.availability;

    return res.json({
      success: true,
      message: 'Worker profile updated successfully',
      profile: existing
    });
  }

  const newProfile = {
    id: `worker-${Date.now()}`,
    userId: userId || `user-${Date.now()}`,
    name: name || 'Farm Specialist',
    phone: phone || '+91 90000 11111',
    skills: skills || ['Harvesting', 'Crop Tilling'],
    dailyWage: Number(dailyWage) || 500,
    experienceYears: Number(experienceYears) || 3,
    availability: availability || 'AVAILABLE',
    rating: 5.0,
    ratingCount: 1,
    completedJobs: 0,
    city: city || 'Sehore',
    state: state || 'Madhya Pradesh',
    lat: 23.2031,
    lng: 77.0844,
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  };

  WORKER_PROFILES.push(newProfile);

  res.status(201).json({
    success: true,
    message: 'Worker profile registered successfully',
    profile: newProfile
  });
});

module.exports = router;
