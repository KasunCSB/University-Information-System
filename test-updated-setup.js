const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Updated backend route tester
const testUpdatedBackend = async () => {
  console.log('🧪 Testing Updated Backend Configuration');
  console.log('=====================================');
  
  const tests = [
    {
      name: 'Azure Backend Health',
      url: 'https://uis-backend-app.azurewebsites.net/health',
      method: 'GET'
    },
    {
      name: 'Azure Backend API Auth Route',
      url: 'https://uis-backend-app.azurewebsites.net/api/auth/send-verification',
      method: 'POST',
      body: { email: 'test@example.com' }
    },
    {
      name: 'Local Backend Health (if running)',
      url: 'http://localhost:3001/health',
      method: 'GET'
    },
    {
      name: 'Local Backend API Auth Route (if running)',
      url: 'http://localhost:3001/api/auth/send-verification',
      method: 'POST',
      body: { email: 'test@example.com' }
    }
  ];

  for (const test of tests) {
    console.log(`\n🔍 Testing: ${test.name}`);
    console.log(`   URL: ${test.url}`);
    
    try {
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(test.url, options);
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const data = await response.json();
            console.log(`   ✅ Success: ${data.message || 'OK'}`);
            if (data.success !== undefined) {
              console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
            }
          } catch {
            console.log(`   ✅ Success: Response received but not JSON`);
          }
        } else {
          const text = await response.text();
          console.log(`   ✅ Success: ${text.substring(0, 100)}...`);
        }
      } else {
        const text = await response.text();
        console.log(`   ❌ Failed: ${text.substring(0, 200)}...`);
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`   ⏸️  Service not running (${error.message})`);
      } else if (error.type === 'request-timeout') {
        console.log(`   ⏰ Timeout: Service may be starting up...`);
      } else {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
  }

  console.log('\n📋 Test Summary');
  console.log('===============');
  console.log('✅ = Working correctly');
  console.log('❌ = Needs attention');
  console.log('⏸️  = Service not running');
  console.log('⏰ = Service may be starting');
  
  console.log('\n💡 Next Steps:');
  console.log('- If Azure tests pass: Your deployment is working!');
  console.log('- If Azure tests fail: Run deploy.bat to fix configuration');
  console.log('- If local tests fail: Run "docker-compose up --build" for local testing');
  console.log('- Check DEPLOYMENT_GUIDE.md for detailed troubleshooting');
};

// Run the tests
testUpdatedBackend().catch(console.error);
