const { z } = require('zod');

const createCategorySchema = z.object({
  name: z.string({
    required_error: 'Name is required'
  }).min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters'),
  description: z.string().max(200, 'Description must not exceed 200 characters').optional(),
  imageUrl: z.string().url('Invalid URL format').optional()
});

const updateCategorySchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(200).optional(),
  imageUrl: z.string().url().optional()
});

const queryCategorySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  queryCategorySchema
};
