const { z } = require('zod');

// Middleware untuk validasi request body dengan Zod
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Parse dan validasi request body
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format error messages dari Zod
        const errors = error.errors.map(err => {
          // Gabungkan path dan message untuk error yang lebih deskriptif
          const path = err.path.join('.');
          return path ? `${path}: ${err.message}` : err.message;
        });

        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors
        });
      }

      // Handle error lainnya
      next(error);
    }
  };
};

module.exports = validate;