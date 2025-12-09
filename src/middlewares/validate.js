const { z } = require('zod');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => {
          const path = err.path.join('.');
          return path ? `${path}: ${err.message}` : err.message;
        });

        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors
        });
      }
      next(error);
    }
  };
};

module.exports = validate;