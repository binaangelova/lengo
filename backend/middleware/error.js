const errorHandler = (err, req, res, next) => {
  // Only log stack traces in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  } else {
    console.error('Error:', err.message);
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: process.env.NODE_ENV === 'development' ? err.message : 'Invalid input provided'
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Authentication Error',
      details: 'Invalid or expired token'
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({ 
      error: 'Conflict',
      details: 'A resource with that identifier already exists'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: 'Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
};

module.exports = errorHandler;
