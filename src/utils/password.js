const bcrypt = require('bcrypt');

// Hash password dengan bcrypt (salt rounds 10)
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password dengan hash
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};