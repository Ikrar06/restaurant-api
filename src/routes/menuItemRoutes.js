const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const { verifyToken, checkRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createMenuItemSchema, updateMenuItemSchema, queryMenuItemSchema } = require('../validators/menuItemValidation');

router.get('/', validate(queryMenuItemSchema, 'query'), menuItemController.getMenuItems);
router.get('/:id', menuItemController.getMenuItemById);
router.post('/', verifyToken, checkRole('STAFF', 'ADMIN'), validate(createMenuItemSchema), menuItemController.createMenuItem);
router.put('/:id', verifyToken, checkRole('STAFF', 'ADMIN'), validate(updateMenuItemSchema), menuItemController.updateMenuItem);
router.delete('/:id', verifyToken, checkRole('ADMIN'), menuItemController.deleteMenuItem);

module.exports = router;
