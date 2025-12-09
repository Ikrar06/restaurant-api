const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, checkRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createCategorySchema, updateCategorySchema, queryCategorySchema } = require('../validators/categoryValidation');

router.get('/', validate(queryCategorySchema, 'query'), categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', verifyToken, checkRole('ADMIN'), validate(createCategorySchema), categoryController.createCategory);
router.put('/:id', verifyToken, checkRole('ADMIN'), validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', verifyToken, checkRole('ADMIN'), categoryController.deleteCategory);

module.exports = router;
