const db = require('../config/db');

/**
 * Calculates a Hybrid Recommendation Score and ranks available books.
 * @param {number} userId - The user's ID
 * @returns {Promise<Array>} - Top 5 recommended books scored
 */
const getRecommendations = async (userId) => {
  // 1. Identify User Preference
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
  const favoriteCategory = topCategoryRow ? topCategoryRow.category : null;

  // 2. Fetch All Books (excluding currently borrowed ones by this user)
  const booksQuery = `
    SELECT * FROM Books 
    WHERE book_id NOT IN (
      SELECT book_id FROM BorrowedBooks WHERE user_id = ? AND status = "Borrowed"
    )
  `;
  const allBooks = await db.allAsync(booksQuery, [userId]);

  // Find max borrow_count among all books to normalize popularity
  let maxBorrowCount = 1;
  for (const b of allBooks) {
    if (b.borrow_count > maxBorrowCount) {
      maxBorrowCount = b.borrow_count;
    }
  }

  // 3. Compute Recommendation Score
  const scoredBooks = allBooks.map((book) => {
    // Category Match Score
    const isCategoryMatch = favoriteCategory && book.category === favoriteCategory;
    const categoryMatchScore = isCategoryMatch ? 1 : 0;

    // Popularity Score (Normalized 0 to 1)
    const popularityScore = (book.borrow_count || 0) / maxBorrowCount;

    // Availability Score
    const availabilityScore = book.availability_status === 'Available' ? 1 : 0;

    // Formula: (Category Match * 0.6) + (Popularity Score * 0.3) + (Availability Score * 0.1)
    const rawScore = (categoryMatchScore * 0.6) + (popularityScore * 0.3) + (availabilityScore * 0.1);
    
    // Normalize to a percentage suitable for display
    return {
      ...book,
      score: rawScore
    };
  });

  // 4. Rank Books
  scoredBooks.sort((a, b) => b.score - a.score);

  // 5. Return top 5 Recommended Books
  return scoredBooks.slice(0, 5);
};

module.exports = {
  getRecommendations
};
