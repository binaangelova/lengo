const sanitizeInput = (obj) => {
  if (!obj) return obj;
  
  const sanitized = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (typeof value === 'string') {
      // Remove potential XSS vectors
      sanitized[key] = value
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '')
        .replace(/vbscript:/gi, '')
        .trim();
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? item
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/data:/gi, '')
          .replace(/vbscript:/gi, '')
          .trim()
        : typeof item === 'object' ? sanitizeInput(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

const sanitizeMiddleware = (req, res, next) => {
  req.body = sanitizeInput(req.body);
  req.query = sanitizeInput(req.query);
  req.params = sanitizeInput(req.params);
  next();
};

module.exports = sanitizeMiddleware;
