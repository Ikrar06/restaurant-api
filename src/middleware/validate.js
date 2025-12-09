const { z } = require('zod');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = source === 'query' ? req.query : req.body;
      const validated = schema.parse(data);

      if (source === 'query') {
        req.query = validated;
      } else {
        req.body = validated;
      }

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