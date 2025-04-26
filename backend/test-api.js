const axios = require('axios');

// Test endpoints
const testEndpoints = async () => {
  try {
    console.log('Testing CTA Bus API...');
    const busRoutesResponse = await axios.get('http://localhost:3001/api/transit/bus/routes');
    console.log('Bus API Status:', busRoutesResponse.status === 200 ? 'SUCCESS ✅' : 'FAILED ❌');
    console.log('Bus Routes Data Sample:', JSON.stringify(busRoutesResponse.data).substring(0, 300) + '...');
    console.log('-'.repeat(80));
    
    console.log('Testing CTA Train API...');
    // Test with a known station ID (40380 - Clark/Lake)
    const trainStationResponse = await axios.get('http://localhost:3001/api/transit/train/stations/40380/arrivals');
    console.log('Train API Status:', trainStationResponse.status === 200 ? 'SUCCESS ✅' : 'FAILED ❌');
    console.log('Train Station Data Sample:', JSON.stringify(trainStationResponse.data).substring(0, 300) + '...');
    
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
};

// Run the tests
testEndpoints();
