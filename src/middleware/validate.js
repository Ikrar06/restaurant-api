const { z } = require('zod');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      // Tentukan sumber data berdasarkan parameter source
      let data;
      if (source === 'query') {
        data = req.query;
      } else if (source === 'params') {
        data = req.params;
      } else {
        data = req.body;
      }

      // Validasi data dengan schema
      const validated = schema.parse(data);

      // Update request object dengan data yang sudah divalidasi
      if (source === 'query') {
        req.query = validated;
      } else if (source === 'params') {
        req.params = validated;
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