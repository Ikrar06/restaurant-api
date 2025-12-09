const { z } = require('zod');

const createReviewSchema = z.object({
  menuItemId: z.number({
    required_error: 'Menu item ID is required'
  }).int('Menu item ID must be an integer'),
  rating: z.number({
    required_error: 'Rating is required'
  }).int('Rating must be an integer').min(1, 'Rating must be at least 1').max(5, 'Rating must not exceed 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment must not exceed 500 characters').optional()
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(500).optional()
});

module.exports = {
  createReviewSchema,
  updateReviewSchema
};
