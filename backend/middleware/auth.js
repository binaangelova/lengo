const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate CSRF token
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  // Skip CSRF check for GET requests and login/register routes
  if (req.method !== 'GET' && 
      !req.path.includes('/login') && 
      !req.path.includes('/register')) {
    const csrfToken = req.headers['x-csrf-token'];
    if (!csrfToken) {
      return res.status(403).json({ error: 'CSRF token missing' });
    }
    // Validate CSRF token here if needed
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Requires admin privileges.' });
  }
  next();
};

module.exports = { authenticateToken, isAdmin };
