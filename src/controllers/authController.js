const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

// Register user baru
const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Cek apakah email sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'CUSTOMER' // default role
      }
    });

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    // Jangan kirim password ke client
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Cek password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    // Jangan kirim password ke client
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Refresh access token
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      role: decoded.role
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    // req.user sudah diisi oleh auth middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Jangan kirim password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  refresh,
  getMe
};
