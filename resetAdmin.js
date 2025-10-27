// resetAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const resetAdmin = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-database-name');
    
    // Delete existing admin
    await mongoose.connection.collection('users').deleteOne({ email: 'admin@min-ecomm.com' });
    console.log('✅ Deleted existing admin');
    
    // Create new admin with manually hashed password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await mongoose.connection.collection('users').insertOne({
      name: 'System Administrator',
      email: 'admin@min-ecomm.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Created new admin with properly hashed password');
    console.log('Password hash:', hashedPassword);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

resetAdmin();