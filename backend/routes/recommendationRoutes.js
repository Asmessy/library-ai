const express = require('express');
const router = express.Router();
const { getUserRecommendations, getSmartDiscoveryHandler, getReadersAlsoBorrowedHandler, getBookOfTheDayHandler } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/book-of-the-day', getBookOfTheDayHandler);
router.get('/smart-discovery', protect, getSmartDiscoveryHandler);
router.get('/also-borrowed/:bookId', getReadersAlsoBorrowedHandler);
router.get('/:userId', protect, getUserRecommendations);

module.exports = router;
