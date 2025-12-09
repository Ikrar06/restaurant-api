const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { verifyToken, checkRole } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createTableSchema, updateTableSchema, queryTableSchema } = require('../validations/tableValidation');

router.get('/', validate(queryTableSchema, 'query'), tableController.getTables);
router.get('/:id', tableController.getTableById);
router.post('/', verifyToken, checkRole('ADMIN'), validate(createTableSchema), tableController.createTable);
router.put('/:id', verifyToken, checkRole('STAFF', 'ADMIN'), validate(updateTableSchema), tableController.updateTable);
router.delete('/:id', verifyToken, checkRole('ADMIN'), tableController.deleteTable);

module.exports = router;
