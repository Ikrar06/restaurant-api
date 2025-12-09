const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const { verifyToken, checkRole } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createMenuItemSchema, updateMenuItemSchema } = require('../validations/menuItemValidation');

router.get('/', menuItemController.getMenuItems);
router.get('/:id', menuItemController.getMenuItemById);
router.post('/', verifyToken, checkRole('STAFF', 'ADMIN'), validate(createMenuItemSchema), menuItemController.createMenuItem);
router.put('/:id', verifyToken, checkRole('STAFF', 'ADMIN'), validate(updateMenuItemSchema), menuItemController.updateMenuItem);
router.delete('/:id', verifyToken, checkRole('ADMIN'), menuItemController.deleteMenuItem);

module.exports = router;
