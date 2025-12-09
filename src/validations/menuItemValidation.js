const { z } = require('zod');

const createMenuItemSchema = z.object({
  name: z.string({
    required_error: 'Name is required'
  }).min(3, 'Name must be at least 3 characters').max(100, 'Name must not exceed 100 characters'),
  description: z.string({
    required_error: 'Description is required'
  }).min(10, 'Description must be at least 10 characters').max(500, 'Description must not exceed 500 characters'),
  price: z.number({
    required_error: 'Price is required'
  }).min(1000, 'Price must be at least 1000').max(10000000, 'Price must not exceed 10000000'),
  categoryId: z.number({
    required_error: 'Category ID is required'
  }).int('Category ID must be an integer'),
  imageUrl: z.string().url('Invalid URL format').optional(),
  isAvailable: z.boolean().optional(),
  preparationTime: z.number({
    required_error: 'Preparation time is required'
  }).int('Preparation time must be an integer').min(1, 'Preparation time must be at least 1 minute').max(180, 'Preparation time must not exceed 180 minutes')
});

const updateMenuItemSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  price: z.number().min(1000).max(10000000).optional(),
  categoryId: z.number().int().optional(),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
  preparationTime: z.number().int().min(1).max(180).optional()
});

const queryMenuItemSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  categoryId: z.string().regex(/^\d+$/).transform(Number).optional(),
  isAvailable: z.enum(['true', 'false']).optional(),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['name', 'price', 'createdAt', 'updatedAt']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

module.exports = {
  createMenuItemSchema,
  updateMenuItemSchema,
  queryMenuItemSchema
};
