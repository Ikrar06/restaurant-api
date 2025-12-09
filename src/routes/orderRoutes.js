const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, checkRole } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createOrderSchema, updateOrderSchema, queryOrderSchema } = require('../validations/orderValidation');

router.get('/', verifyToken, validate(queryOrderSchema, 'query'), orderController.getOrders);
router.get('/:id', verifyToken, orderController.getOrderById);
router.post('/', verifyToken, validate(createOrderSchema), orderController.createOrder);
router.put('/:id', verifyToken, validate(updateOrderSchema), orderController.updateOrder);
router.delete('/:id', verifyToken, checkRole('ADMIN'), orderController.deleteOrder);

module.exports = router;
