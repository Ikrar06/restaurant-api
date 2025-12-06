const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../validations/authValidation');

// Route untuk register
router.post('/register', validate(registerSchema), authController.register);

// Route untuk login
router.post('/login', validate(loginSchema), authController.login);

// Route untuk refresh token
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);

// Route untuk get current user (protected)
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
