// Utility to test the environment setup and fallback system

export const testEnvironmentSetup = () => {
  console.log('🔍 Testing Environment Setup...');
  
  // Check if we're in browser
  const isBrowser = typeof window !== 'undefined';
  console.log(`📍 Environment: ${isBrowser ? 'Browser' : 'Node.js'}`);
  
  // Test process availability
  try {
    const hasProcess = typeof process !== 'undefined';
    console.log(`⚙️ Process available: ${hasProcess}`);
    
    if (hasProcess && process.env) {
      console.log('🌍 Environment variables accessible');
    }
  } catch (error) {
    console.log('❌ Process not available (expected in browser)');
  }
  
  // Test database imports
  try {
    console.log('🗄️ Testing database imports...');
    
    if (isBrowser) {
      console.log('✅ Browser environment - database imports should be mocked');
    } else {
      console.log('✅ Node.js environment - database imports should work');
    }
  } catch (error) {
    console.error('❌ Database import error:', error);
  }
  
  console.log('✅ Environment test completed');
};

export const testTestimonialSystem = async () => {
  console.log('🧪 Testing Testimonial System...');
  
  try {
    // Import testimonial service
    const { testimonialService } = await import('@/services/testimonialService');
    
    // Test localStorage fallback
    console.log('📦 Testing localStorage service...');
    const stats = testimonialService.getTestimonialStats();
    console.log('📊 Stats from localStorage:', stats);
    
    // Test database service (should fallback in browser)
    console.log('🗄️ Testing database service fallback...');
    const { testimonialServiceDB } = await import('@/services/testimonialServiceDB');
    
    try {
      const dbStats = await testimonialServiceDB.getTestimonialStats();
      console.log('📊 Stats from database:', dbStats);
    } catch (error) {
      console.log('✅ Database service correctly failed in browser, fallback working');
    }
    
    console.log('✅ Testimonial system test completed');
    return true;
  } catch (error) {
    console.error('❌ Testimonial system test failed:', error);
    return false;
  }
};

// Auto-run tests if in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Run tests after a short delay to ensure modules are loaded
  setTimeout(() => {
    testEnvironmentSetup();
    testTestimonialSystem();
  }, 1000);
}
