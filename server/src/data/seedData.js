// AgriIntel In-Memory & Seed Data Store

const MSP_DATA = [
  { crop: 'Wheat', season: 'Rabi', msp: 2275, unit: 'Quintal', changePct: 7.1 },
  { crop: 'Paddy (Common)', season: 'Kharif', msp: 2300, unit: 'Quintal', changePct: 5.4 },
  { crop: 'Paddy (Grade A)', season: 'Kharif', msp: 2320, unit: 'Quintal', changePct: 5.3 },
  { crop: 'Maize', season: 'Kharif', msp: 2090, unit: 'Quintal', changePct: 6.5 },
  { crop: 'Gram (Chana)', season: 'Rabi', msp: 5440, unit: 'Quintal', changePct: 3.8 },
  { crop: 'Mustard', season: 'Rabi', msp: 5650, unit: 'Quintal', changePct: 5.6 },
  { crop: 'Cotton (Medium)', season: 'Kharif', msp: 7121, unit: 'Quintal', changePct: 7.5 },
  { crop: 'Soyabean (Yellow)', season: 'Kharif', msp: 4892, unit: 'Quintal', changePct: 6.3 },
  { crop: 'Moong', season: 'Kharif', msp: 8682, unit: 'Quintal', changePct: 1.4 },
  { crop: 'Tomato', season: 'Vegetables', msp: 1400, unit: 'Quintal', changePct: 0.0 }, // Benchmark
  { crop: 'Onion', season: 'Vegetables', msp: 1800, unit: 'Quintal', changePct: 0.0 }, // Benchmark
  { crop: 'Potato', season: 'Vegetables', msp: 1250, unit: 'Quintal', changePct: 0.0 }  // Benchmark
];

const SUBSIDIES_DATA = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    level: 'Central',
    state: 'All India',
    benefitAmount: '₹6,000 / year (in 3 installments of ₹2,000)',
    applicationLink: 'https://pmkisan.gov.in/',
    eligibilityRules: {
      cropTypes: ['All Crops'],
      landSizeMaxAcres: 5.0,
      categories: ['Marginal', 'Small', 'Medium']
    },
    description: 'Direct income support of ₹6,000 per year directly transferred to bank accounts of landholding farmer families.',
    documentsRequired: ['Aadhaar Card', 'Land Ownership Records (Khasra/Khatauni)', 'Bank Passbook']
  },
  {
    id: 'pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    level: 'Central',
    state: 'All India',
    benefitAmount: 'Up to 98% crop loss compensation at 1.5% - 2% premium',
    applicationLink: 'https://pmfby.gov.in/',
    eligibilityRules: {
      cropTypes: ['Wheat', 'Paddy', 'Cotton', 'Maize', 'Soyabean', 'Gram', 'Mustard'],
      landSizeMaxAcres: 50.0,
      categories: ['Marginal', 'Small', 'Medium', 'Large']
    },
    description: 'Comprehensive financial support against non-preventable natural risks from pre-sowing to post-harvest.',
    documentsRequired: ['Aadhaar Card', 'Sowing Certificate', 'Land Record (LPC)', 'Bank Account details']
  },
  {
    id: 'smam-machinery',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    level: 'Central',
    state: 'All India',
    benefitAmount: '40% to 50% subsidy on Tractors, Harvesters & Power Tillers',
    applicationLink: 'https://agrimachinery.nic.in/',
    eligibilityRules: {
      cropTypes: ['All Crops'],
      landSizeMaxAcres: 20.0,
      categories: ['Marginal', 'Small', 'Medium']
    },
    description: 'Financial assistance for purchasing advanced agricultural machinery to boost farm productivity.',
    documentsRequired: ['Aadhaar Card', 'Land Holding Proof', 'Caste Certificate (if applicable)', 'Bank Statement']
  },
  {
    id: 'pmksy-drip',
    name: 'PMKSY - Per Drop More Crop (Micro Irrigation)',
    level: 'Central',
    state: 'All India',
    benefitAmount: 'Up to 55% subsidy for Small/Marginal, 45% for other farmers',
    applicationLink: 'https://pmksy.gov.in/',
    eligibilityRules: {
      cropTypes: ['Horticulture', 'Sugarcane', 'Cotton', 'Tomato', 'Vegetables', 'All Crops'],
      landSizeMaxAcres: 12.5,
      categories: ['Marginal', 'Small', 'Medium']
    },
    description: 'Subsidy on drip and sprinkler irrigation systems to conserve water and improve nutrient uptake.',
    documentsRequired: ['Aadhaar Card', '7/12 or Khasra Extract', 'Electricity bill of tubewell/source', 'Bank Passbook']
  },
  {
    id: 'shc-soil-card',
    name: 'Soil Health Card Scheme',
    level: 'Central',
    state: 'All India',
    benefitAmount: 'Free soil testing & tailored nutrient advisory every 2 years',
    applicationLink: 'https://soilhealth.dac.gov.in/',
    eligibilityRules: {
      cropTypes: ['All Crops'],
      landSizeMaxAcres: 100.0,
      categories: ['Marginal', 'Small', 'Medium', 'Large']
    },
    description: 'Provides detailed soil nutrient status (N, P, K, micronutrients) along with customized dosage recommendations.',
    documentsRequired: ['Aadhaar Card', 'Land Parcel Identification']
  },
  {
    id: 'punjab-tubewell-solar',
    name: 'Punjab State Solar Agriculture Pump Scheme (PEDA)',
    level: 'State',
    state: 'Punjab',
    benefitAmount: 'Up to 80% subsidy on Solar Powered Tubewell Pumps',
    applicationLink: 'https://peda.gov.in/',
    eligibilityRules: {
      cropTypes: ['Wheat', 'Paddy', 'Vegetables'],
      landSizeMaxAcres: 10.0,
      categories: ['Marginal', 'Small', 'Medium']
    },
    description: 'Subsidized off-grid solar agricultural pumps to replace diesel engines and lower electricity dependency.',
    documentsRequired: ['Aadhaar Card', 'Punjab Residence Proof', 'Land Ownership document']
  },
  {
    id: 'mp-bhavantar',
    name: 'Madhya Pradesh Bhavantar Bhugtan Yojana',
    level: 'State',
    state: 'Madhya Pradesh',
    benefitAmount: 'Direct compensation of price difference between Mandi modal price & MSP',
    applicationLink: 'https://mpeuparjan.nic.in/',
    eligibilityRules: {
      cropTypes: ['Soyabean', 'Maize', 'Moong', 'Gram', 'Mustard'],
      landSizeMaxAcres: 15.0,
      categories: ['Marginal', 'Small', 'Medium']
    },
    description: 'Compensates farmers for distress sales when mandi market rates drop below official minimum floor prices.',
    documentsRequired: ['Samagra ID', 'Aadhaar Card', 'Mandi Anubandh Parchi (Sale Slip)']
  }
];

let CROP_LISTINGS = [
  {
    id: 'crop-101',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98234 56780',
    cropName: 'Wheat (Sharbati Gold)',
    variety: 'Sharbati A-Grade',
    quantity: 65,
    unit: 'Quintals',
    askingPrice: 2450,
    mspPrice: 2275,
    forecastPrice: 2520,
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
    ],
    state: 'Madhya Pradesh',
    district: 'Sehore',
    description: 'Premium organic Sharbati wheat, harvested March 2026. High protein, golden luster, zero chemical pesticide residue.',
    status: 'AVAILABLE',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'crop-102',
    farmerId: 'farmer-2',
    farmerName: 'Gurpreet Singh',
    farmerPhone: '+91 98721 34567',
    cropName: 'Basmati Paddy (Pusa 1121)',
    variety: '1121 Extra Long Grain',
    quantity: 120,
    unit: 'Quintals',
    askingPrice: 3850,
    mspPrice: 2320,
    forecastPrice: 3950,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
    ],
    state: 'Punjab',
    district: 'Ludhiana',
    description: 'Moisture tested at 12%, authentic aromatic Pusa 1121 basmati paddy ready for direct mill dispatch.',
    status: 'AVAILABLE',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'crop-103',
    farmerId: 'farmer-3',
    farmerName: 'Suresh More',
    farmerPhone: '+91 94220 11223',
    cropName: 'Tomato (Hybrid Vaishnavi)',
    variety: 'Firm Red Salad Grade',
    quantity: 80,
    unit: 'Crates (25kg each)',
    askingPrice: 850,
    mspPrice: 700,
    forecastPrice: 920,
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
    ],
    state: 'Maharashtra',
    district: 'Nashik',
    description: 'Freshly plucked vine-ripened tomatoes, uniform size, sturdy skin suitable for long-distance transport.',
    status: 'AVAILABLE',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'crop-104',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98234 56780',
    cropName: 'Gram (Desi Chana)',
    variety: 'JG-11 High Yield',
    quantity: 40,
    unit: 'Quintals',
    askingPrice: 5600,
    mspPrice: 5440,
    forecastPrice: 5720,
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80'
    ],
    state: 'Madhya Pradesh',
    district: 'Sehore',
    description: 'Clean, machine-sorted desi chana with negligible moisture. Ready for dal mills and wholesalers.',
    status: 'AVAILABLE',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'crop-105',
    farmerId: 'farmer-4',
    farmerName: 'Balwinder Kaur',
    farmerPhone: '+91 98144 99887',
    cropName: 'Mustard (Pusa Mustard-25)',
    variety: 'High Oil Content (41%)',
    quantity: 50,
    unit: 'Quintals',
    askingPrice: 5850,
    mspPrice: 5650,
    forecastPrice: 5900,
    images: [
      'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80'
    ],
    state: 'Haryana',
    district: 'Karnal',
    description: 'High oil percentage mustard seed, free from argemone adulteration, verified by local krishi vigyan kendra.',
    status: 'AVAILABLE',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let AGRI_INPUTS = [
  {
    id: 'input-201',
    sellerId: 'vendor-1',
    sellerName: 'Kisan Agro Equipment',
    category: 'Equipment Rental',
    itemName: 'Mahindra 575 DI Tractor (45 HP) with Rotavator',
    price: 900,
    rentalUnit: 'Per Hour (with Driver)',
    subsidyEligible: true,
    location: 'Ludhiana, Punjab',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    id: 'input-202',
    sellerId: 'vendor-2',
    sellerName: 'Bharat Bio-Fertilizers',
    category: 'Organic Fertilizer',
    itemName: 'Neem-Coated Enriched Vermicompost (50kg Bag)',
    price: 420,
    rentalUnit: 'Per Bag',
    subsidyEligible: true,
    location: 'Sehore, MP',
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    id: 'input-203',
    sellerId: 'vendor-3',
    sellerName: 'AgroLogistics Express',
    category: 'Truck Rental',
    itemName: 'Eicher 14-Feet Canopy Truck (6 Ton Capacity)',
    price: 38,
    rentalUnit: 'Per Kilometer',
    subsidyEligible: false,
    location: 'Nashik, Maharashtra',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    available: true
  }
];

let WORKER_PROFILES = [
  {
    id: 'worker-1',
    userId: 'user-w1',
    name: 'Jagdish Mandloi',
    phone: '+91 97555 43210',
    skills: ['Wheat Harvesting', 'Tractor Driving', 'Drip Maintenance'],
    dailyWage: 550,
    experienceYears: 8,
    availability: 'AVAILABLE',
    rating: 4.85,
    ratingCount: 24,
    completedJobs: 42,
    city: 'Sehore',
    state: 'Madhya Pradesh',
    lat: 23.2031,
    lng: 77.0844,
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'worker-2',
    userId: 'user-w2',
    name: 'Sukhdev Singh',
    phone: '+91 98880 76543',
    skills: ['Paddy Transplanting', 'Combine Harvester Operator', 'Spraying'],
    dailyWage: 650,
    experienceYears: 11,
    availability: 'AVAILABLE',
    rating: 4.92,
    ratingCount: 38,
    completedJobs: 65,
    city: 'Ludhiana',
    state: 'Punjab',
    lat: 30.9010,
    lng: 75.8573,
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'worker-3',
    userId: 'user-w3',
    name: 'Anil Sonawane',
    phone: '+91 93250 88776',
    skills: ['Vegetable Picking', 'Pruning', 'Organic Compost Bedding'],
    dailyWage: 500,
    experienceYears: 5,
    availability: 'AVAILABLE',
    rating: 4.78,
    ratingCount: 19,
    completedJobs: 29,
    city: 'Nashik',
    state: 'Maharashtra',
    lat: 19.9975,
    lng: 73.7898,
    profilePhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'
  }
];

let JOB_POSTINGS = [
  {
    id: 'job-301',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    taskType: 'Wheat Harvesting & Bagging',
    crop: 'Wheat',
    wageOffered: 600,
    workersNeeded: 6,
    startDate: '2026-09-15',
    endDate: '2026-09-19',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    locationName: 'Bilkisganj Tehsil, Farm 4B',
    status: 'OPEN',
    applicants: [
      { workerId: 'worker-1', workerName: 'Jagdish Mandloi', status: 'HIRED', appliedAt: '2026-09-08' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'job-302',
    farmerId: 'farmer-3',
    farmerName: 'Suresh More',
    taskType: 'Tomato Plucking & Sorting',
    crop: 'Tomato',
    wageOffered: 520,
    workersNeeded: 4,
    startDate: '2026-09-14',
    endDate: '2026-09-17',
    state: 'Maharashtra',
    district: 'Nashik',
    locationName: 'Pimpalgaon Baswant',
    status: 'OPEN',
    applicants: [
      { workerId: 'worker-3', workerName: 'Anil Sonawane', status: 'SHORTLISTED', appliedAt: '2026-09-09' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let ORDERS = [
  {
    id: 'ord-901',
    buyerId: 'buyer-1',
    buyerName: 'Amit Agrotech Mills',
    buyerPhone: '+91 99001 22334',
    listingId: 'crop-101',
    cropName: 'Wheat (Sharbati Gold)',
    quantity: 20,
    unit: 'Quintals',
    agreedPrice: 2450,
    totalAmount: 49000,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentId: 'pay_rzp_mock_9823412',
    deliveryStatus: 'PICKUP_SCHEDULED',
    pickupDate: '2026-09-14',
    deliveryAddress: 'Plot 44, Industrial Area Mandideep, Bhopal, MP',
    trackingUpdates: [
      { status: 'ORDER_PLACED', time: new Date(Date.now() - 86400000).toISOString(), note: 'Order placed and paid via Razorpay' },
      { status: 'CONFIRMED', time: new Date(Date.now() - 43200000).toISOString(), note: 'Farmer Ramesh Patel accepted the deal' },
      { status: 'PICKUP_SCHEDULED', time: new Date().toISOString(), note: 'Truck dispatch scheduled for 14 Sep 9:00 AM' }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const DISEASE_KNOWLEDGE_BASE = [
  {
    crop: 'Tomato',
    disease: 'Early Blight (Alternaria solani)',
    confidence: 0.942,
    symptoms: 'Concentric dark brown to black rings (bullseye pattern) surrounded by yellow chlorotic halos on lower leaves.',
    treatment: 'Spray Mancozeb 75 WP (2g/L) or Copper Oxychloride 50 WP (2.5g/L). In severe organic farming, apply Bacillus subtilis spray.',
    prevention: 'Maintain drip irrigation to avoid wet foliage. Remove lower infected leaves. Rotate tomato crops with non-solanaceous crops.'
  },
  {
    crop: 'Tomato',
    disease: 'Late Blight (Phytophthora infestans)',
    confidence: 0.961,
    symptoms: 'Large water-soaked irregular lesions on leaves that turn brown/purplish, accompanied by white mold growth beneath the leaf during humid mornings.',
    treatment: 'Spray Metalaxyl + Mancozeb (Ridomil MZ @ 2.5g/L) or Cymoxanil + Mancozeb immediately upon first sign.',
    prevention: 'Ensure good field drainage, avoid overhead sprinklers, use disease-resistant certified seedlings.'
  },
  {
    crop: 'Wheat',
    disease: 'Yellow (Stripe) Rust (Puccinia striiformis)',
    confidence: 0.935,
    symptoms: 'Yellow to orange-colored pustules arranged in prominent parallel stripes along the leaf veins.',
    treatment: 'Foliar spray with Propiconazole 25% EC (Tilt @ 1ml/L) or Tebuconazole 25.9% EC in 200 liters of water per acre.',
    prevention: 'Plant rust-resistant cultivars (HD 2967, DBW 187, PBW 550). Avoid excess nitrogen fertilizers during cooler months.'
  },
  {
    crop: 'Paddy',
    disease: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    confidence: 0.928,
    symptoms: 'Water-soaked wavy lesions starting from leaf margins, turning yellow-white, drying out with milky bacterial ooze beads.',
    treatment: 'Spray Copper Hydroxide (2g/L) combined with Streptocycline (0.1g/L) at 10-day intervals.',
    prevention: 'Do not over-apply urea. Drain stagnant field water for 24-48 hours. Use certified blight-free seed stock.'
  },
  {
    crop: 'Potato',
    disease: 'Early Blight',
    confidence: 0.915,
    symptoms: 'Target-board concentric rings on mature leaflets, premature defoliation.',
    treatment: 'Spray Chlorothalonil 75% WP @ 2g/L or Azoxystrobin @ 1ml/L.',
    prevention: 'Maintain optimal soil potassium, destroy volunteer potato plants from previous season.'
  },
  {
    crop: 'Healthy Leaf',
    disease: 'No Disease Detected (Healthy Crop)',
    confidence: 0.978,
    symptoms: 'Vibrant green coloration, uniform leaf turgor, no visible lesions, chlorosis, or fungal sporulation.',
    treatment: 'No chemical pesticide required. Maintain balanced N-P-K fertilization and regular scouting.',
    prevention: 'Follow integrated pest management (IPM) guidelines and regular soil testing.'
  }
];

module.exports = {
  MSP_DATA,
  SUBSIDIES_DATA,
  CROP_LISTINGS,
  AGRI_INPUTS,
  WORKER_PROFILES,
  JOB_POSTINGS,
  ORDERS,
  DISEASE_KNOWLEDGE_BASE
};
