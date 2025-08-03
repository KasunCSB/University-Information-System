// Quick test to verify backend routes are working
const testBackendRoutes = async () => {
  const baseUrl = 'https://uis-backend-app.azurewebsites.net';
  
  console.log('Testing backend routes...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log('Health check:', healthResponse.status, await healthResponse.text());
    
    // Test auth route structure
    const authResponse = await fetch(`${baseUrl}/api/auth/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    console.log('Auth route test:', authResponse.status, await authResponse.text());
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testBackendRoutes();
