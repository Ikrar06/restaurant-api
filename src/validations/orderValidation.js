const { z } = require('zod');

const orderItemSchema = z.object({
  menuItemId: z.number({
    required_error: 'Menu item ID is required'
  }).int('Menu item ID must be an integer'),
  quantity: z.number({
    required_error: 'Quantity is required'
  }).int('Quantity must be an integer').min(1, 'Quantity must be at least 1').max(20, 'Quantity must not exceed 20'),
  notes: z.string().max(200, 'Notes must not exceed 200 characters').optional()
});

const createOrderSchema = z.object({
  tableId: z.number().int().optional(),
  orderType: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY'], {
    required_error: 'Order type is required'
  }),
  items: z.array(orderItemSchema, {
    required_error: 'Items are required'
  }).min(1, 'Order must contain at least 1 item'),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional()
}).refine(data => {
  if (data.orderType === 'DINE_IN' && !data.tableId) {
    return false;
  }
  return true;
}, {
  message: 'Table ID is required for DINE_IN orders',
  path: ['tableId']
});

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'], {
    required_error: 'Status is required'
  }),
  notes: z.string().max(500).optional()
});

const queryOrderSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']).optional(),
  orderType: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY']).optional(),
  userId: z.string().regex(/^\d+$/).transform(Number).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  minAmount: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  maxAmount: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  sortBy: z.enum(['orderNumber', 'totalAmount', 'createdAt', 'updatedAt']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

module.exports = {
  createOrderSchema,
  updateOrderSchema,
  queryOrderSchema
};
