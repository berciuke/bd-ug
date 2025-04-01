const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.addReview);
router.get('/product/:productId', reviewController.getReviews);
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.get('/stats/:productId', reviewController.getReviewStats);
router.get('/search', reviewController.searchReviews);
router.patch('/vote/:id', reviewController.voteHelpful);

module.exports = router;
