const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

// Middleware untuk verifikasi token
const verifyToken = (req, res, next) => {
  // Ambil token dari header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded; // Simpan data user ke request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware untuk cek role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};
