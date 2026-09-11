const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'agriintel_dev_secret_key_2026';

// In-memory demo users
let USERS = [
  {
    id: 'farmer-1',
    name: 'Ramesh Patel',
    phone: '9823456780',
    role: 'farmer',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    aadhaarNumber: 'XXXX-XXXX-4819',
    digilockerVerified: true,
    aadhaarSimVerified: true,
    landSizeAcres: 4.5,
    cropsGrown: ['Wheat', 'Gram']
  },
  {
    id: 'buyer-1',
    name: 'Amit Agrotech Mills',
    phone: '9900122334',
    role: 'buyer',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    aadhaarNumber: 'XXXX-XXXX-9120',
    digilockerVerified: true,
    aadhaarSimVerified: true
  },
  {
    id: 'worker-1',
    name: 'Jagdish Mandloi',
    phone: '9755543210',
    role: 'worker',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    aadhaarNumber: 'XXXX-XXXX-3341',
    digilockerVerified: false,
    aadhaarSimVerified: true
  },
  {
    id: 'admin-1',
    name: 'GovTech Agriculture Admin',
    phone: '9999900000',
    role: 'admin',
    state: 'Delhi',
    district: 'New Delhi',
    digilockerVerified: true,
    aadhaarSimVerified: true
  }
];

// Register or Login by Phone
router.post('/register', (req, res) => {
  const { phone, name, role, state, district, landSizeAcres, cropsGrown } = req.body;

  if (!phone || !name || !role) {
    return res.status(400).json({ error: 'Phone, name, and role are required' });
  }

  let user = USERS.find(u => u.phone === phone);
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      phone,
      name,
      role,
      state: state || 'Madhya Pradesh',
      district: district || 'Sehore',
      landSizeAcres: Number(landSizeAcres) || 3.0,
      cropsGrown: cropsGrown || ['Wheat'],
      digilockerVerified: false,
      aadhaarSimVerified: false,
      createdAt: new Date().toISOString()
    };
    USERS.push(user);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

  res.status(200).json({
    success: true,
    message: 'User authenticated successfully',
    token,
    user
  });
});

// Quick Login (mock or phone auth)
router.post('/login', (req, res) => {
  const { phone, role } = req.body;
  let user = USERS.find(u => u.phone === phone);
  
  if (!user && role) {
    user = USERS.find(u => u.role === role);
  }

  if (!user) {
    user = USERS[0]; // default to farmer-1
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
  res.json({
    success: true,
    token,
    user
  });
});

// Current User profile
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ user: USERS[0] });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = USERS.find(u => u.id === decoded.id) || USERS[0];
    res.json({ user });
  } catch (err) {
    res.json({ user: USERS[0] });
  }
});

// Simulated Aadhaar eKYC
router.post('/aadhaar/simulate', (req, res) => {
  const { aadhaarNumber, otp, userId } = req.body;

  if (!aadhaarNumber || aadhaarNumber.replace(/\D/g, '').length !== 12) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Aadhaar number. Must be exactly 12 numerical digits.'
    });
  }

  // Accept OTP 123456 or any 6-digit number
  if (!otp || otp.length !== 6) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid 6-digit OTP (hint: use 123456 for instant simulation).'
    });
  }

  // Find user and mark verified
  let user = USERS.find(u => u.id === userId);
  if (!user && USERS.length > 0) {
    user = USERS[0];
  }

  if (user) {
    user.aadhaarSimVerified = true;
    user.aadhaarNumber = `XXXX-XXXX-${aadhaarNumber.slice(-4)}`;
  }

  res.json({
    success: true,
    verified: true,
    maskedAadhaar: `XXXX-XXXX-${aadhaarNumber.slice(-4)}`,
    verificationSource: 'Simulated UIDAI eKYC Gateway',
    timestamp: new Date().toISOString(),
    message: 'Aadhaar eKYC verified successfully. Farmer profile updated.'
  });
});

// DigiLocker Sandbox Verification
router.post('/digilocker/verify', (req, res) => {
  const { userId } = req.body;
  let user = USERS.find(u => u.id === userId) || USERS[0];

  user.digilockerVerified = true;
  user.digilockerConsentId = `DL-SBOX-${Date.now()}`;

  res.json({
    success: true,
    verified: true,
    consentId: user.digilockerConsentId,
    verifiedDocuments: ['Aadhaar Card', 'Khasra Khatauni Land Record'],
    message: 'DigiLocker documents fetched and verified from Partner Sandbox.'
  });
});

module.exports = router;
