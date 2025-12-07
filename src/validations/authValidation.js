const { z } = require('zod');

// Validation untuk register
const registerSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  }).email('Email must be valid'),
  
  password: z.string({
    required_error: 'Password is required',
  })
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  name: z.string({
    required_error: 'Name is required',
  })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  
  phone: z.string().optional()
});

// Validation untuk login
const loginSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }).email('Email must be valid'),
  
  password: z.string({
    required_error: 'Password is required',
  })
});

// Validation untuk refresh token
const refreshTokenSchema = z.object({
  refreshToken: z.string({
    required_error: 'Refresh token is required',
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema
};