const db = require('../config/db');

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Private
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id; // from auth middleware

    // Check if book is available
    const book = await db.getAsync('SELECT * FROM Books WHERE book_id = ? AND availability_status = "Available"', [bookId]);
    
    if (!book) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    // Update book status and increment borrow_count
    await db.runAsync('UPDATE Books SET availability_status = "Borrowed", borrow_count = borrow_count + 1 WHERE book_id = ?', [bookId]);
    
    // Add to BorrowedBooks
    await db.runAsync('INSERT INTO BorrowedBooks (user_id, book_id) VALUES (?, ?)', [userId, bookId]);

    res.status(200).json({ message: 'Book borrowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Return a book
// @route   POST /api/return
// @access  Private
const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;
    
    // Find the borrow record
    const record = await db.getAsync('SELECT * FROM BorrowedBooks WHERE borrow_id = ? AND status = "Borrowed"', [borrowId]);

    if (!record) {
      return res.status(400).json({ message: 'Borrow record not found or book already returned' });
    }

    // Update BorrowedBooks status and return_date
    await db.runAsync('UPDATE BorrowedBooks SET status = "Returned", return_date = CURRENT_TIMESTAMP WHERE borrow_id = ?', [borrowId]);

    // Update book status to Available
    await db.runAsync('UPDATE Books SET availability_status = "Available" WHERE book_id = ?', [record.book_id]);

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's borrowed books
// @route   GET /api/borrow/my
// @access  Private
const getMyBorrowedBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT bb.borrow_id, bb.borrow_date, bb.status, b.book_id, b.title, b.author, b.category, b.image_url 
      FROM BorrowedBooks bb
      JOIN Books b ON bb.book_id = b.book_id
      WHERE bb.user_id = ? AND bb.status = "Borrowed"
      ORDER BY bb.borrow_date DESC
    `;
    const borrowedBooks = await db.allAsync(query, [userId]);
    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getMyBorrowedBooks
};
