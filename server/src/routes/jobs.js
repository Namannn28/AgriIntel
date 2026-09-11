const express = require('express');
const router = express.Router();
let { JOB_POSTINGS } = require('../data/seedData');

// GET /api/jobs (List jobs)
router.get('/', (req, res) => {
  const { state, crop, minWage } = req.query;
  let results = [...JOB_POSTINGS];

  if (state && state !== 'All') {
    results = results.filter(j => j.state.toLowerCase() === state.toLowerCase());
  }
  if (crop) {
    results = results.filter(j => j.crop.toLowerCase().includes(crop.toLowerCase()));
  }
  if (minWage) {
    results = results.filter(j => j.wageOffered >= Number(minWage));
  }

  res.json({
    success: true,
    count: results.length,
    jobs: results
  });
});

// POST /api/jobs (Farmer creates job)
router.post('/', (req, res) => {
  const { farmerId, farmerName, taskType, crop, wageOffered, workersNeeded, startDate, endDate, state, district, locationName } = req.body;

  if (!taskType || !wageOffered || !workersNeeded) {
    return res.status(400).json({ error: 'Task type, wage, and workers needed are required' });
  }

  const newJob = {
    id: `job-${Date.now()}`,
    farmerId: farmerId || 'farmer-1',
    farmerName: farmerName || 'Ramesh Patel',
    taskType,
    crop: crop || 'Mixed Crops',
    wageOffered: Number(wageOffered),
    workersNeeded: Number(workersNeeded),
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    state: state || 'Madhya Pradesh',
    district: district || 'Sehore',
    locationName: locationName || 'District Mandi Sub-Center',
    status: 'OPEN',
    applicants: [],
    createdAt: new Date().toISOString()
  };

  JOB_POSTINGS.unshift(newJob);

  res.status(201).json({
    success: true,
    message: 'Farm labor job posted successfully',
    job: newJob
  });
});

// POST /api/jobs/:id/apply (Worker applies)
router.post('/:id/apply', (req, res) => {
  const { workerId, workerName, workerPhone, dailyWageExpected } = req.body;
  const job = JOB_POSTINGS.find(j => j.id === req.params.id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const alreadyApplied = job.applicants.some(a => a.workerId === workerId);
  if (alreadyApplied) {
    return res.status(400).json({ error: 'Worker has already applied for this job' });
  }

  const applicantEntry = {
    workerId: workerId || 'worker-1',
    workerName: workerName || 'Jagdish Mandloi',
    workerPhone: workerPhone || '+91 97555 43210',
    dailyWageExpected: dailyWageExpected || job.wageOffered,
    status: 'APPLIED',
    appliedAt: new Date().toISOString()
  };

  job.applicants.push(applicantEntry);

  res.json({
    success: true,
    message: 'Application submitted successfully to farmer',
    applicant: applicantEntry
  });
});

// PUT /api/jobs/:id/applicants/:workerId (Farmer hires or shortlists)
router.put('/:id/applicants/:workerId', (req, res) => {
  const { status } = req.body; // 'SHORTLISTED' | 'HIRED' | 'REJECTED'
  const job = JOB_POSTINGS.find(j => j.id === req.params.id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const applicant = job.applicants.find(a => a.workerId === req.params.workerId);
  if (!applicant) {
    return res.status(404).json({ error: 'Applicant not found' });
  }

  applicant.status = status || applicant.status;

  res.json({
    success: true,
    message: `Worker application status updated to ${status}`,
    job
  });
});

module.exports = router;
