const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path as needed

const testAuth = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-database-name');
    console.log('🧪 Testing authentication...');
    
    // Find the admin user
    const admin = await User.findOne({ email: 'admin@min-ecomm.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('📋 Admin user details:');
    console.log('   Email:', admin.email);
    console.log('   Password stored:', admin.password);
    console.log('   Is hashed?', (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$')) ? '✅ Yes' : '❌ No');
    console.log('   Hash algorithm:', admin.password.substring(0, 4));
    console.log('   Password length:', admin.password.length);

    // Test password match
    console.log('\n🔐 Testing password comparison...');
    
    console.log('\n1. Testing correct password "admin123":');
    const isMatch = await admin.matchPassword('admin123');
    console.log('   Result:', isMatch ? '✅ SUCCESS' : '❌ FAILED');
    
    console.log('\n2. Testing wrong password "wrongpassword":');
    const isWrongMatch = await admin.matchPassword('wrongpassword');
    console.log('   Result:', isWrongMatch ? '✅ SUCCESS' : '❌ FAILED (expected)');

    // Manual bcrypt test
    console.log('\n3. Manual bcrypt test:');
    try {
      const manualCompare = await require('bcryptjs').compare('admin123', admin.password);
      console.log('   Manual bcrypt.compare result:', manualCompare ? '✅ SUCCESS' : '❌ FAILED');
    } catch (err) {
      console.log('   Manual bcrypt error:', err.message);
    }

    await mongoose.disconnect();
    console.log('\n🎯 Test completed');
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testAuth();