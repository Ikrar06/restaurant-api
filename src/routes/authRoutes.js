const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../validations/authValidation');

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authLimiter, validate(refreshTokenSchema), authController.refresh);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
