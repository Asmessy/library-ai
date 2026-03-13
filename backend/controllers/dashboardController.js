const db = require('../config/db');

// @desc    Get user dashboard data (Borrowed books + Recommendations)
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get currently borrowed books
    const borrowQuery = `
      SELECT bb.borrow_id, bb.borrow_date, bb.status, b.book_id, b.title, b.author, b.category, b.image_url 
      FROM BorrowedBooks bb
      JOIN Books b ON bb.book_id = b.book_id
      WHERE bb.user_id = ? AND bb.status = "Borrowed"
    `;
    const borrowedBooks = await db.allAsync(borrowQuery, [userId]);

    // 2. Simple AI Recommendation Logic
    // Step A: Find the user's most frequently borrowed categories (from all time)
    const categoryQuery = `
      SELECT b.category, COUNT(b.category) as count
      FROM BorrowedBooks bb
      JOIN Books b ON bb.book_id = b.book_id
      WHERE bb.user_id = ?
      GROUP BY b.category
      ORDER BY count DESC
      LIMIT 1
    `;
    const topCategoryRow = await db.getAsync(categoryQuery, [userId]);

    let recommendedBooks = [];
    if (topCategoryRow) {
      const topCategory = topCategoryRow.category;
      
      // Step B: Recommend 5 available books from that category that the user isn't currently borrowing
      const recQuery = `
        SELECT * FROM Books 
        WHERE category = ? 
        AND availability_status = "Available"
        AND book_id NOT IN (
            SELECT book_id FROM BorrowedBooks WHERE user_id = ? AND status = "Borrowed"
        )
        LIMIT 5
      `;
      recommendedBooks = await db.allAsync(recQuery, [topCategory, userId]);
    } else {
      // Fallback: If no borrow history, recommend 5 random available books
      const randQuery = `SELECT * FROM Books WHERE availability_status = "Available" ORDER BY RANDOM() LIMIT 5`;
      recommendedBooks = await db.allAsync(randQuery);
    }

    res.json({
      borrowedBooks,
      recommendedBooks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboardData
};
