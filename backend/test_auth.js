const axios = require('axios');

async function testAuth() {
  console.log('Testing Backend Auth Endpoints...');
  
  try {
    const signupRes = await axios.post('http://localhost:3000/auth/signup', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    console.log('✅ Signup Successful:', signupRes.data.email);

    const loginRes = await axios.post('http://localhost:3000/auth/login', {
      email: signupRes.data.email,
      password: 'password123'
    });
    console.log('✅ Login Successful. Token received.');

  } catch (err) {
    console.error('❌ Auth Test Failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error('Error Message:', err.message);
      console.error('Check if your backend is running on http://localhost:3000 and MongoDB is connected.');
    }
  }
}

testAuth();
