const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  try {
    console.log('🔧 Generating token for user:', id);
    const token = jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_for_development', {
      expiresIn: '30d',
    });
    console.log('✅ Token generated successfully');
    return token;
  } catch (error) {
    console.error('❌ Token generation error:', error);
    throw new Error('Token generation failed');
  }
};

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development');
      console.log('🔍 Decoded token:', decoded);
      
      // You can fetch user from database here if needed
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      console.error('❌ Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

const admin = (req, res, next) => {
  // This would require fetching user from DB to check role
  // For now, we'll handle admin check in the routes
  next();
};

module.exports = {
  generateToken,
  protect,
  admin
};