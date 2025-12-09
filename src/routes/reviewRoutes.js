const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createReviewSchema, updateReviewSchema, queryReviewSchema } = require('../validations/reviewValidation');

router.get('/', validate(queryReviewSchema, 'query'), reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/', verifyToken, validate(createReviewSchema), reviewController.createReview);
router.put('/:id', verifyToken, validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', verifyToken, reviewController.deleteReview);

module.exports = router;
