const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, checkRole } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createCategorySchema, updateCategorySchema } = require('../validations/categoryValidation');

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', verifyToken, checkRole('ADMIN'), validate(createCategorySchema), categoryController.createCategory);
router.put('/:id', verifyToken, checkRole('ADMIN'), validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', verifyToken, checkRole('ADMIN'), categoryController.deleteCategory);

module.exports = router;
