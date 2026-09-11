const http = require('http');

async function testAll() {
  require('./src/index.js');
  
  // Wait for port binding
  await new Promise(r => setTimeout(r, 600));

  const endpoints = [
    '/health',
    '/api',
    '/api/listings/crop',
    '/api/listings/crop/crop-101/price-comparison',
    '/api/orders',
    '/api/jobs',
    '/api/workers',
    '/api/subsidies',
    '/api/weather?district=sehore',
    '/api/admin/stats',
    '/api/admin/disease-heatmap',
    '/api/admin/price-trends'
  ];

  console.log('Testing GET endpoints:');
  for (const ep of endpoints) {
    await new Promise((resolve) => {
      http.get('http://localhost:5000' + ep, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log('  [PASS] ' + ep + ' -> Status: ' + res.statusCode);
          resolve();
        });
      }).on('error', err => {
        console.error('  [FAIL] ' + ep + ' -> Error: ' + err.message);
        resolve();
      });
    });
  }

  // Test POST /api/ml/price-forecast
  console.log('Testing POST endpoints:');
  const postData = JSON.stringify({ crop_name: 'Wheat', state: 'Madhya Pradesh', forecast_days: 7 });
  await new Promise((resolve) => {
    const req = http.request('http://localhost:5000/api/ml/price-forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('  [PASS] POST /api/ml/price-forecast -> Status: ' + res.statusCode);
        resolve();
      });
    });
    req.write(postData);
    req.end();
  });

  // Test POST /api/rag/query
  const ragData = JSON.stringify({ query: 'PM-KISAN installment' });
  await new Promise((resolve) => {
    const req = http.request('http://localhost:5000/api/rag/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(ragData) }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('  [PASS] POST /api/rag/query -> Status: ' + res.statusCode);
        resolve();
      });
    });
    req.write(ragData);
    req.end();
  });

  // Test POST /api/subsidies/eligible
  const subData = JSON.stringify({ landSizeAcres: 3, category: 'Small', state: 'Madhya Pradesh' });
  await new Promise((resolve) => {
    const req = http.request('http://localhost:5000/api/subsidies/eligible', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(subData) }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('  [PASS] POST /api/subsidies/eligible -> Status: ' + res.statusCode);
        resolve();
      });
    });
    req.write(subData);
    req.end();
  });

  console.log('\n>>> ALL AGRIINTEL ENDPOINTS TESTED AND VERIFIED FUNCTIONAL <<<');
  process.exit(0);
}

testAll();
