const express = require('express');
const router = express.Router();
const { getBooks, addBook, deleteBook } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getBooks).post(protect, admin, upload.single('pdf'), addBook);
router.route('/:id').delete(protect, admin, deleteBook);

module.exports = router;
