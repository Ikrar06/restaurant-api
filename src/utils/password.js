const bcrypt = require('bcryptjs');

// Hash password dengan bcrypt (salt rounds 10)
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password dengan hash
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Validasi kekuatan password
const validatePasswordStrength = (password) => {
  // Minimal 8 karakter
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  // Harus ada huruf besar
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  // Harus ada angka
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true };
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength
};
