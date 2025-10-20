// Test script to check API routes
const https = require('https');
const fs = require('fs');

// Test the health endpoint
const testHealthEndpoint = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Health API Status: ${res.statusCode}`);
        console.log(`Health API Response: ${data}`);
        resolve({ status: res.statusCode, data: data });
      });
    });
    
    req.on('error', (error) => {
      console.log('Health API Error (expected if server not running):', error.message);
      resolve({ status: 'error', error: error.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log('Health API Timeout (expected if server not running)');
      resolve({ status: 'timeout' });
    });
    
    req.end();
  });
};

// Test database API
const testDatabaseAPI = async () => {
  try {
    // This would normally be done through the actual API endpoints
    // For now, we'll just verify the Prisma client can connect
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test a simple query
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Database API Test: SUCCESS');
    console.log(`Sample user data: ${JSON.stringify(users[0], null, 2)}`);
    
    await prisma.$disconnect();
    return { status: 'success' };
  } catch (error) {
    console.error('Database API Test: FAILED', error.message);
    return { status: 'error', error: error.message };
  }
};

async function runTests() {
  console.log('Testing API Routes...\n');
  
  // Test health endpoint
  console.log('1. Testing Health API Endpoint:');
  await testHealthEndpoint();
  
  console.log('\n2. Testing Database API:');
  await testDatabaseAPI();
  
  console.log('\nAPI Route Tests Completed!');
}

runTests();