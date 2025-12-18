const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  // Log error berdasarkan environment
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
  } else {
    console.error('Error:', err.message);
  }

  // Prisma P2002: Unique constraint violation
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Data already exists',
      ...(process.env.NODE_ENV === 'development' && { error: err.meta })
    });
  }

  // Prisma P2025: Record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Data not found',
      ...(process.env.NODE_ENV === 'development' && { error: err.meta })
    });
  }

  // JWT Token Expired
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // JWT Invalid Token
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Zod Validation Errors
  if (err instanceof ZodError) {
    const errors = err.errors.map(e => {
      const path = e.path.join('.');
      return path ? `${path}: ${e.message}` : e.message;
    });

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // Generic Error Response
  const statusCode = err.status || err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal server error'
  };

  // Tambahkan stack trace hanya di development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
