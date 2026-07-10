const jwt = require('jsonwebtoken');

// Unique signing key used to cryptographically sign tokens
const JWT_SECRET = "super_secret_university_grading_key_2026";

/**
 * Custom JWT Verification Middleware
 * Protects routes by validating the token passed in the request header
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Headers typically come as "Bearer TOKEN_STRING", so we split by space to get the token
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token missing. Authentication required." });
  }

  // Verify token integrity against our signing secret key
  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ error: "Invalid, manipulated, or expired session token." });
    }
    
    // Attach user profile summary data (id and role) directly onto the request stream
    req.user = userPayload;
    
    // Pass execution control seamlessly to the next step in line
    next();
  });
};

module.exports = authenticateToken;