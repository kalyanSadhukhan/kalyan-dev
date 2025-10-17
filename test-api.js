// Test script to verify the API endpoint works
import fetch from 'node-fetch';

const testData = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a test message to verify the contact form API is working correctly.'
};

console.log('=== API Endpoint Test ===');
console.log('Testing endpoint: /api/send-email');
console.log('Test data:', testData);

async function testAPI() {
  try {
    const response = await fetch('http://localhost:8080/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('✅ API test successful!');
    } else {
      console.log('❌ API test failed:', data.error);
    }

  } catch (error) {
    console.error('❌ Error testing API:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the development server is running on port 8080');
    }
  }
}

testAPI();