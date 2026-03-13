const express = require('express');
const router = express.Router();
const { borrowBook, returnBook, getMyBorrowedBooks } = require('../controllers/borrowController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, borrowBook);
router.post('/return', protect, returnBook);
router.get('/my', protect, getMyBorrowedBooks);

module.exports = router;
