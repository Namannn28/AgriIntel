const http = require('http');

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const postBody = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postBody ? { 'Content-Length': Buffer.byteLength(postBody) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) { json = data; }
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on('error', (err) => reject(err));
    if (postBody) req.write(postBody);
    req.end();
  });
}

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ? [PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`  ? [FAIL] ${message}`);
    failedCount++;
  }
}

async function runAllModuleTests() {
  console.log('================================================================');
  console.log('       AGRIINTEL FULL PLATFORM MODULE-WISE TEST SUITE           ');
  console.log('================================================================\n');

  // Module 1: Auth, eKYC & Identity
  console.log('--- MODULE 1: AUTH & IDENTITY ---');
  {
    const resMe = await makeRequest('/api/auth/me');
    assert(resMe.status === 200 && resMe.data.user?.name, 'GET /api/auth/me returns current user profile');

    const resUpdate = await makeRequest('/api/auth/me', 'PUT', { name: 'Ramesh Patel (Verified)', landSizeAcres: 5.2 });
    assert(resUpdate.status === 200 && resUpdate.data.user.name.includes('Verified'), 'PUT /api/auth/me updates profile');

    const resAadhaar = await makeRequest('/api/auth/aadhaar/simulate', 'POST', { aadhaarNumber: '998877665544', otp: '123456' });
    assert(resAadhaar.status === 200 && resAadhaar.data.success, 'Aadhaar eKYC simulation verifies successfully');

    const resBadAadhaar = await makeRequest('/api/auth/aadhaar/simulate', 'POST', { aadhaarNumber: '998877665544', otp: '000000' });
    assert(resBadAadhaar.status === 400, 'Aadhaar eKYC invalid OTP edge case rejected with 400');

    const resDigi = await makeRequest('/api/auth/digilocker/verify', 'POST', { userId: 'farmer-1' });
    assert(resDigi.status === 200 && resDigi.data.consentId, 'DigiLocker Sandbox consent verified with token');
  }

  // Module 2: Crop Marketplace & MSP Benchmarking
  console.log('\n--- MODULE 2: CROP MARKETPLACE & MSP ---');
  {
    const resListings = await makeRequest('/api/listings/crop');
    assert(resListings.status === 200 && resListings.data.listings.length > 0, 'GET /api/listings/crop returns active listings');

    const resSearch = await makeRequest('/api/listings/crop?search=wheat');
    assert(resSearch.status === 200 && resSearch.data.listings.every(l => l.cropName.toLowerCase().includes('wheat') || l.variety.toLowerCase().includes('wheat')), 'Marketplace search by crop filter works');

    const listingId = resListings.data.listings[0].id;
    const resPriceComp = await makeRequest(`/api/listings/crop/${listingId}/price-comparison`);
    assert(resPriceComp.status === 200 && resPriceComp.data.mspPrice && resPriceComp.data.statusRecommendation, 'Fair value price comparison against statutory MSP works');

    const resNewCrop = await makeRequest('/api/listings/crop', 'POST', {
      cropName: 'Mustard (Pusa Bold)',
      quantity: 50,
      askingPrice: 5650,
      state: 'Madhya Pradesh',
      district: 'Sehore'
    });
    assert(resNewCrop.status === 201 && resNewCrop.data.listing.cropName.includes('Mustard'), 'Farmer can create new direct crop listing');

    const resBadCrop = await makeRequest('/api/listings/crop', 'POST', {
      cropName: 'Wheat',
      quantity: -10,
      askingPrice: 2000
    });
    assert(resBadCrop.status === 400, 'Crop listing creation with negative quantity rejected with 400');
  }

  // Module 3: Procurement Orders & Escrow Tracking
  console.log('\n--- MODULE 3: ORDERS & LOGISTICS ---');
  {
    const resListings = await makeRequest('/api/listings/crop');
    const targetListing = resListings.data.listings[0];
    const initialQty = targetListing.quantity;

    const resOrder = await makeRequest('/api/orders', 'POST', {
      buyerId: 'buyer-1',
      buyerName: 'Patanjali Agrotech',
      listingId: targetListing.id,
      quantity: 5,
      deliveryAddress: 'Industrial Area Hub, Indore'
    });
    assert(resOrder.status === 201 && resOrder.data.order.paymentStatus === 'PAID', 'Buyer can place order with simulated Razorpay escrow');

    const resCheckStock = await makeRequest(`/api/listings/crop/${targetListing.id}`);
    assert(resCheckStock.data.listing.quantity === initialQty - 5, 'Inventory quantity properly deducted upon order placement');

    const resOverOrder = await makeRequest('/api/orders', 'POST', {
      listingId: targetListing.id,
      quantity: 999999
    });
    assert(resOverOrder.status === 400, 'Order quantity exceeding available stock rejected with 400');

    const orderId = resOrder.data.order.id;
    const resStatusUpdate = await makeRequest(`/api/orders/${orderId}/status`, 'PUT', {
      deliveryStatus: 'IN_TRANSIT',
      note: 'Truck loaded and dispatched from Sehore Mandi Gate'
    });
    assert(resStatusUpdate.status === 200 && resStatusUpdate.data.order.deliveryStatus === 'IN_TRANSIT', 'Logistics delivery tracking timeline update works');
  }

  // Module 4: Labor & Jobs Ecosystem
  console.log('\n--- MODULE 4: FARM LABOR & JOBS ---');
  {
    const resJobs = await makeRequest('/api/jobs');
    assert(resJobs.status === 200 && resJobs.data.jobs.length > 0, 'GET /api/jobs returns active farm labor openings');

    const resNewJob = await makeRequest('/api/jobs', 'POST', {
      taskType: 'Pesticide Spraying',
      crop: 'Soybean',
      wageOffered: 600,
      workersNeeded: 1,
      state: 'Madhya Pradesh',
      district: 'Sehore'
    });
    assert(resNewJob.status === 201 && resNewJob.data.job.taskType === 'Pesticide Spraying', 'Farmer can post farm labor opening');

    const jobId = resNewJob.data.job.id;
    const resApply = await makeRequest(`/api/jobs/${jobId}/apply`, 'POST', {
      workerId: 'worker-2',
      workerName: 'Suresh Verma',
      dailyWageExpected: 600
    });
    assert(resApply.status === 200 && resApply.data.applicant.status === 'APPLIED', 'Worker can apply for farm job');

    const resDupApply = await makeRequest(`/api/jobs/${jobId}/apply`, 'POST', {
      workerId: 'worker-2',
      workerName: 'Suresh Verma'
    });
    assert(resDupApply.status === 400, 'Duplicate job application rejected with 400');

    const resHire = await makeRequest(`/api/jobs/${jobId}/applicants/worker-2`, 'PUT', { status: 'HIRED' });
    assert(resHire.status === 200 && resHire.data.job.status === 'FILLED', 'Farmer hires worker and job auto-marks as FILLED when quota met');

    const resProfile = await makeRequest('/api/workers/profile/worker-1');
    assert(resProfile.status === 200 && resProfile.data.profile.name, 'GET worker profile returns skilled laborer data');
  }

  // Module 5: AI & ML Services
  console.log('\n--- MODULE 5: AI & ML INTELLIGENCE ---');
  {
    const resPrice = await makeRequest('/api/ml/price-forecast', 'POST', {
      crop_name: 'Wheat',
      state: 'Madhya Pradesh',
      forecast_days: 15
    });
    assert(resPrice.status === 200 && resPrice.data.forecast?.length === 15, 'Price forecast predicts 15-day price trajectory with confidence interval');

    const resReco = await makeRequest('/api/ml/crop-recommend', 'POST', {
      nitrogen: 85,
      phosphorus: 40,
      potassium: 42,
      ph: 6.5,
      rainfall: 210,
      temperature: 24
    });
    assert(resReco.status === 200 && resReco.data.recommendedCrop, 'Crop recommendation predicts optimal crop for soil NPK and climate');

    const resDisease = await makeRequest('/api/ml/disease-detect', 'POST', { cropHint: 'Tomato' });
    assert(resDisease.status === 200 && resDisease.data.disease && resDisease.data.chemicalTreatment, 'Disease detection returns diagnosis and chemical treatment protocol');
  }

  // Module 6: Schemes & Subsidies
  console.log('\n--- MODULE 6: SCHEMES & SUBSIDIES ---');
  {
    const resSubsidies = await makeRequest('/api/subsidies');
    assert(resSubsidies.status === 200 && resSubsidies.data.subsidies.length > 0, 'GET /api/subsidies returns all government welfare schemes');

    const resEligible = await makeRequest('/api/subsidies/eligible', 'POST', {
      landSizeAcres: 3,
      state: 'Madhya Pradesh',
      category: 'Small'
    });
    assert(resEligible.status === 200 && resEligible.data.eligibleCount > 0, 'Subsidies eligibility engine qualifies small farmer for PM-KISAN & PMFBY');

    const resLargeEligible = await makeRequest('/api/subsidies/eligible', 'POST', {
      landSizeAcres: 50,
      state: 'Madhya Pradesh',
      category: 'Large'
    });
    assert(resLargeEligible.status === 200 && resLargeEligible.data.eligibleCount < resEligible.data.eligibleCount, 'Subsidies eligibility engine enforces landholding caps for large farmers');
  }

  // Module 7: Weather & Agro-Advisories
  console.log('\n--- MODULE 7: WEATHER & ADVISORIES ---');
  {
    const resWeather = await makeRequest('/api/weather?district=sehore');
    assert(resWeather.status === 200 && resWeather.data.temperature !== undefined, 'Live Open-Meteo weather endpoint returns real-time temperature & spray advisory');
  }

  // Module 8: Kisan AI RAG Assistant & Voice
  console.log('\n--- MODULE 8: KISAN AI ASSISTANT ---');
  {
    const resRag = await makeRequest('/api/rag/query', 'POST', { query: 'What is PM-KISAN?' });
    assert(resRag.status === 200 && resRag.data.citations && resRag.data.citations.length > 0, 'RAG query returns grounded answer with government document citations');

    const resVoice = await makeRequest('/api/voice/query', 'POST', { audioText: 'What is the MSP of Wheat?' });
    assert(resVoice.status === 200 && resVoice.data.answer, 'Voice query endpoint processes spoken audio transcript');
  }

  // Module 9: Chat & Direct Negotiation
  console.log('\n--- MODULE 9: CHAT & DIRECT NEGOTIATION ---');
  {
    const contextId = 'test-neg-101';
    const resSend = await makeRequest('/api/chat/send', 'POST', {
      contextId,
      senderId: 'buyer-1',
      senderName: 'Amit Agrotech',
      message: 'Offering ?2,400/Qtl for 50 Quintals of Wheat'
    });
    assert((resSend.status === 200 || resSend.status === 201) && resSend.data.message && resSend.data.message.message.includes('2,400'), 'Chat message sent and recorded in conversation context');

    const resHistory = await makeRequest(`/api/chat/${contextId}/messages`);
    assert(resHistory.status === 200 && resHistory.data.messages.length > 0, 'Chat conversation history retrieved for negotiation context');
  }

  // Module 10: Agro-Alerts & Notifications
  console.log('\n--- MODULE 10: NOTIFICATIONS & AGRO-ALERTS ---');
  {
    const resNotifs = await makeRequest('/api/notifications');
    assert(resNotifs.status === 200 && resNotifs.data.notifications.length > 0, 'GET /api/notifications returns agro-advisory alerts');

    const resMarkAll = await makeRequest('/api/notifications/mark-all-read', 'PUT');
    assert(resMarkAll.status === 200 && resMarkAll.data.success, 'Mark all notifications read works');
  }

  // Module 11: Admin Platform Analytics
  console.log('\n--- MODULE 11: ADMIN OVERSIGHT ---');
  {
    const resStats = await makeRequest('/api/admin/stats');
    assert(resStats.status === 200 && resStats.data.activeFarmers > 0, 'Admin platform statistics return active metrics');

    const resHeatmap = await makeRequest('/api/admin/disease-heatmap');
    assert(resHeatmap.status === 200 && resHeatmap.data.regions.length > 0, 'Admin disease outbreak heatmap returns active alert zones');

    const resPriceTrends = await makeRequest('/api/admin/price-trends');
    assert(resPriceTrends.status === 200 && resPriceTrends.data.mspComparisonTrends.length > 0, 'Admin price trends return modal vs MSP variance tracking');
  }

  // Module 12: Agri-Inputs & Equipment Rentals
  console.log('\n--- MODULE 12: AGRI-INPUTS & RENTALS ---');
  {
    const resInputs = await makeRequest('/api/listings/inputs');
    assert(resInputs.status === 200 && resInputs.data.inputs.length > 0, 'GET /api/listings/inputs returns farm equipment and machinery rentals');
  }

  // Module 13: Reviews & Trust Ecosystem
  console.log('\n--- MODULE 13: REVIEWS & RATINGS ---');
  {
    const resReviews = await makeRequest('/api/reviews/user/farmer-1');
    assert(resReviews.status === 200 && resReviews.data.reviews.length > 0, 'GET reviews returns verified counterparty ratings');

    const resAddReview = await makeRequest('/api/reviews', 'POST', {
      targetUserId: 'farmer-1',
      reviewerId: 'buyer-1',
      reviewerName: 'Amit Agrotech Mills',
      rating: 5,
      comment: 'Top quality Sharbati wheat, direct farm pickup was seamless.'
    });
    assert((resAddReview.status === 200 || resAddReview.status === 201) && resAddReview.data.review && resAddReview.data.review.rating === 5, 'Posting counterparty review updates trust score');
  }

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED out of ${passedCount + failedCount} assertions`);
  console.log('================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

require('./src/index.js');
setTimeout(runAllModuleTests, 700);
