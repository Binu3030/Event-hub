import jwt from "jsonwebtoken";

// ✅ VERIFY TOKEN MIDDLEWARE
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Remove "Bearer "
    const cleanToken = token.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ ROLE AUTHORIZATION MIDDLEWARE
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};