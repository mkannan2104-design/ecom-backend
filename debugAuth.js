// debugAuth.js
const bcrypt = require('bcryptjs');

const debugPassword = async () => {
  const storedHash = '$2a$12$Hb716w3Nqp.8k6MeHcn5vuYU/B8RimnQ2BJgws9BYxMR0VuCRKhZW';
  const testPassword = 'admin123';
  
  console.log('🔍 Debugging password comparison:');
  console.log('Stored hash:', storedHash);
  console.log('Test password:', testPassword);
  console.log('Hash starts with $2a$:', storedHash.startsWith('$2a$'));
  console.log('Hash starts with $2b$:', storedHash.startsWith('$2b$'));
  console.log('Hash length:', storedHash.length);
  
  try {
    console.log('\n🧪 Testing bcrypt.compare:');
    const result = await bcrypt.compare(testPassword, storedHash);
    console.log('Comparison result:', result);
    
    // Test if the hash is valid
    console.log('\n🧪 Testing hash validity:');
    const newHash = await bcrypt.hash(testPassword, 12);
    console.log('New hash for same password:', newHash);
    console.log('New hash starts with:', newHash.substring(0, 4));
    
    const compareNew = await bcrypt.compare(testPassword, newHash);
    console.log('Compare with new hash:', compareNew);
    
    const compareOldWithNew = await bcrypt.compare(testPassword, storedHash);
    console.log('Compare with old hash:', compareOldWithNew);
    
  } catch (error) {
    console.error('Error:', error);
  }
};

debugPassword();