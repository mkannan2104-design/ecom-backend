const mongoose = require('mongoose');
const User = require('./models/User');

const createAdminUser = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-database-name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔗 Connected to MongoDB');

    // Delete existing admin first
    await User.deleteOne({ email: 'admin@min-ecomm.com' });
    console.log('🧹 Cleaned up existing admin');

    // Create new admin user
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@min-ecomm.com',
      password: 'admin123', // This WILL be hashed by our fixed pre-save hook
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password (hashed):', adminUser.password);
    console.log('👑 Role:', adminUser.role);
    console.log('🆔 ID:', adminUser._id);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();