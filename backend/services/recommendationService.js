const db = require('../config/db');

const getRecommendations = async (userId) => {
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

  const booksQuery = `
    SELECT * FROM Books 
    WHERE book_id NOT IN (
      SELECT book_id FROM BorrowedBooks WHERE user_id = ? AND status = "Borrowed"
    )
  `;
  const allBooks = await db.allAsync(booksQuery, [userId]);

  let maxBorrowCount = 1;
  for (const b of allBooks) {
    if (b.borrow_count > maxBorrowCount) {
      maxBorrowCount = b.borrow_count;
    }
  }

  const scoredBooks = allBooks.map((book) => {
    const isCategoryMatch = favoriteCategory && book.category === favoriteCategory;
    const categoryMatchScore = isCategoryMatch ? 1 : 0;
    const popularityScore = (book.borrow_count || 0) / maxBorrowCount;
    const availabilityScore = book.availability_status === 'Available' ? 1 : 0;
    const rawScore = (categoryMatchScore * 0.6) + (popularityScore * 0.3) + (availabilityScore * 0.1);
    
    return {
      ...book,
      score: rawScore
    };
  });

  scoredBooks.sort((a, b) => b.score - a.score);
  return scoredBooks.slice(0, 5);
};

const getSmartDiscovery = async (userId) => {
  const borrowedCategoriesQuery = `
    SELECT DISTINCT b.category
    FROM BorrowedBooks bb
    JOIN Books b ON bb.book_id = b.book_id
    WHERE bb.user_id = ?
  `;
  const borrowedRows = await db.allAsync(borrowedCategoriesQuery, [userId]);
  const borrowedCategories = borrowedRows.map(r => r.category);

  let query = '';
  if (borrowedCategories.length === 0) {
    query = `SELECT * FROM Books WHERE availability_status = "Available" ORDER BY RANDOM() LIMIT 5`;
    return await db.allAsync(query);
  }

  const placeholders = borrowedCategories.map(() => '?').join(',');
  query = `SELECT * FROM Books WHERE category NOT IN (${placeholders}) AND availability_status = "Available" ORDER BY RANDOM() LIMIT 5`;
  const books = await db.allAsync(query, borrowedCategories);
  
  if (books.length === 0) {
     return await db.allAsync(`SELECT * FROM Books WHERE availability_status = "Available" ORDER BY RANDOM() LIMIT 5`);
  }
  return books;
};

const getReadersAlsoBorrowed = async (bookId) => {
  const query = `
    SELECT b.*
    FROM BorrowedBooks bb1
    JOIN BorrowedBooks bb2 ON bb1.user_id = bb2.user_id
    JOIN Books b ON bb2.book_id = b.book_id
    WHERE bb1.book_id = ? AND bb2.book_id != ?
    GROUP BY b.book_id
    ORDER BY COUNT(bb2.book_id) DESC
    LIMIT 3
  `;
  return await db.allAsync(query, [bookId, bookId]);
};

const getBookOfTheDay = async () => {
  const query = `
    SELECT * FROM Books 
    WHERE availability_status = "Available"
    ORDER BY borrow_count DESC, RANDOM()
    LIMIT 1
  `;
  return await db.getAsync(query);
};

module.exports = {
  getRecommendations, getSmartDiscovery, getReadersAlsoBorrowed, getBookOfTheDay
};
