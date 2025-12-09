const { z } = require('zod');

const createTableSchema = z.object({
  tableNumber: z.number({
    required_error: 'Table number is required'
  }).int('Table number must be an integer').min(1, 'Table number must be at least 1'),
  capacity: z.number({
    required_error: 'Capacity is required'
  }).int('Capacity must be an integer').min(1, 'Capacity must be at least 1').max(20, 'Capacity must not exceed 20'),
  location: z.enum(['INDOOR', 'OUTDOOR', 'VIP'], {
    required_error: 'Location is required'
  }),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED']).optional()
});

const updateTableSchema = z.object({
  tableNumber: z.number().int().min(1).optional(),
  capacity: z.number().int().min(1).max(20).optional(),
  location: z.enum(['INDOOR', 'OUTDOOR', 'VIP']).optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED']).optional()
});

module.exports = {
  createTableSchema,
  updateTableSchema
};
