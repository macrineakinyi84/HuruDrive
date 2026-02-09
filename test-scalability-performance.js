/**
 * HuruDrive Scalability and Performance Testing Script
 * Runs concurrent GET requests to /api/vehicles and /api/health, measures response times
 * Usage: Start server (npm run dev:server), then run: node test-scalability-performance.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const CONCURRENT_REQUESTS = 50;
const VEHICLES_ENDPOINT = '/api/vehicles';
const HEALTH_ENDPOINT = '/api/health';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const url = new URL(path, BASE_URL);
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const elapsed = Date.now() - start;
        resolve({ status: res.statusCode, elapsed });
      });
    }).on('error', (err) => reject(err));
  });
}

async function runConcurrentRequests(path, count) {
  const promises = Array(count).fill(null).map(() => makeRequest(path));
  const results = await Promise.all(promises);
  const times = results.map(r => r.elapsed);
  const statuses = results.map(r => r.status);
  const success = statuses.filter(s => s === 200).length;
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  const p95 = times.slice().sort((a, b) => a - b)[Math.floor(times.length * 0.95)] || 0;
  return { success, total: count, avg, min, max, p95, statuses };
}

async function main() {
  console.log('='.repeat(55));
  console.log('HuruDrive Scalability & Performance Testing');
  console.log('='.repeat(55));

  // 1. Single request baseline
  console.log('\n1. Baseline – single GET /api/health');
  try {
    const r = await makeRequest(HEALTH_ENDPOINT);
    console.log(`   Status: ${r.status}, Time: ${r.elapsed} ms`);
    if (r.status !== 200) {
      console.log('   Server not ready. Start with: npm run dev:server');
      process.exit(1);
    }
  } catch (err) {
    console.log('   Error:', err.message);
    console.log('   Start server with: npm run dev:server');
    process.exit(1);
  }

  // 2. Single GET /api/vehicles
  console.log('\n2. Baseline – single GET /api/vehicles');
  try {
    const r = await makeRequest(VEHICLES_ENDPOINT);
    console.log(`   Status: ${r.status}, Time: ${r.elapsed} ms`);
  } catch (err) {
    console.log('   Error:', err.message);
  }

  // 3. Concurrent GET /api/health
  console.log(`\n3. Concurrent requests – ${CONCURRENT_REQUESTS} x GET /api/health`);
  try {
    const h = await runConcurrentRequests(HEALTH_ENDPOINT, CONCURRENT_REQUESTS);
    console.log(`   Success: ${h.success}/${h.total}`);
    console.log(`   Response time – Avg: ${h.avg.toFixed(0)} ms, Min: ${h.min} ms, Max: ${h.max} ms, P95: ${h.p95} ms`);
  } catch (err) {
    console.log('   Error:', err.message);
  }

  // 4. Concurrent GET /api/vehicles
  console.log(`\n4. Concurrent requests – ${CONCURRENT_REQUESTS} x GET /api/vehicles`);
  try {
    const v = await runConcurrentRequests(VEHICLES_ENDPOINT, CONCURRENT_REQUESTS);
    console.log(`   Success: ${v.success}/${v.total}`);
    console.log(`   Response time – Avg: ${v.avg.toFixed(0)} ms, Min: ${v.min} ms, Max: ${v.max} ms, P95: ${v.p95} ms`);
  } catch (err) {
    console.log('   Error:', err.message);
  }

  console.log('\n' + '='.repeat(55));
  console.log('Scalability & performance test complete.');
  console.log('='.repeat(55));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
