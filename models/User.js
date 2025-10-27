const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
}, {
  timestamps: true
});

// Improved password hashing with better detection
userSchema.pre('save', async function(next) {
  console.log('🔐 Pre-save hook triggered for:', this.email);
  
  try {
    console.log('🔑 Password value:', this.password);
    
    // Check if already hashed (starts with $2a$ or $2b$)
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
      console.log('⏩ Password already hashed, skipping');
      return next();
    }
    
    console.log('🔄 Hashing password...');
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('✅ Hashed password:', this.password.substring(0, 20) + '...');
    next();
  } catch (error) {
    console.error('❌ Hashing error:', error);
    next(error);
  }
});

// Fixed password comparison method
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    console.log('🔍 Comparing passwords for:', this.email);
    
    // Check if password is hashed (bcrypt hashes start with $2a$ or $2b$)
    const isHashed = this.password.startsWith('$2a$') || this.password.startsWith('$2b$');
    
    if (!isHashed) {
      console.log('⚠️ Stored password is NOT hashed!');
      console.log('📥 Entered password:', enteredPassword);
      console.log('📤 Stored plain text:', this.password);
      
      // Direct comparison for plain text
      const isMatch = enteredPassword === this.password;
      console.log('🔓 Plain text comparison result:', isMatch);
      return isMatch;
    }
    
    // Normal bcrypt comparison for hashed passwords
    console.log('✅ Password is properly hashed');
    console.log('📥 Entered password:', enteredPassword);
    console.log('📤 Stored hash:', this.password.substring(0, 25) + '...');
    
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('✅ Bcrypt comparison result:', isMatch);
    
    return isMatch;
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);