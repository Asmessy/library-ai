const db = require('../config/db');

const getLibraryAnalytics = async () => {
  const topBooksQuery = `
    SELECT title, borrow_count, image_url, author 
    FROM Books 
    WHERE borrow_count > 0
    ORDER BY borrow_count DESC LIMIT 5
  `;
  const topBooks = await db.allAsync(topBooksQuery);
  
  const categoryDistributionQuery = `
    SELECT category, COUNT(*) as count
    FROM Books
    GROUP BY category
    ORDER BY count DESC
  `;
  const categoryDistribution = await db.allAsync(categoryDistributionQuery);
  
  const totalUsersRow = await db.getAsync(`SELECT COUNT(*) as count FROM Users WHERE role != 'admin'`);
  const totalUsers = totalUsersRow ? totalUsersRow.count : 0;

  const totalBooksRow = await db.getAsync(`SELECT COUNT(*) as count FROM Books`);
  const totalBooks = totalBooksRow ? totalBooksRow.count : 0;

  const borrowedTodayRow = await db.getAsync(`SELECT COUNT(*) as count FROM BorrowedBooks WHERE DATE(borrow_date) = DATE('now')`);
  const booksBorrowedToday = borrowedTodayRow ? borrowedTodayRow.count : 0;

  const availableBooksRow = await db.getAsync(`SELECT COUNT(*) as count FROM Books WHERE availability_status = 'Available'`);
  const availableBooks = availableBooksRow ? availableBooksRow.count : 0;

  const borrowActivityQuery = `
    SELECT DATE(borrow_date) as date, COUNT(*) as count 
    FROM BorrowedBooks 
    WHERE borrow_date >= date('now', '-7 days')
    GROUP BY DATE(borrow_date)
    ORDER BY DATE(borrow_date) ASC
  `;
  let borrowActivity = await db.allAsync(borrowActivityQuery);
  
  const filledActivity = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const found = borrowActivity.find(a => a.date === dateStr);
    filledActivity.push({
      date: dateStr,
      count: found ? found.count : 0,
      day: d.toLocaleDateString('en-US', { weekday: 'short' })
    });
  }

  const activeUsersQuery = `
    SELECT u.name, u.email, COUNT(bb.borrow_id) as books_borrowed, MAX(bb.borrow_date) as last_borrow_date
    FROM Users u
    JOIN BorrowedBooks bb ON u.user_id = bb.user_id
    GROUP BY u.user_id
    ORDER BY last_borrow_date DESC
    LIMIT 5
  `;
  const activeUsersTable = await db.allAsync(activeUsersQuery);

  const recentBorrowingsQuery = `
    SELECT u.name as user_name, b.title as book_title, bb.borrow_date, bb.status 
    FROM BorrowedBooks bb
    JOIN Users u ON bb.user_id = u.user_id
    JOIN Books b ON bb.book_id = b.book_id
    ORDER BY bb.borrow_date DESC
    LIMIT 10
  `;
  const recentBorrowings = await db.allAsync(recentBorrowingsQuery);

  const activeUsersRow = await db.getAsync(`SELECT COUNT(DISTINCT user_id) as count FROM BorrowedBooks`);
  const totalTxRow = await db.getAsync(`SELECT COUNT(*) as count FROM BorrowedBooks`);

  return {
    topBooks,
    topCategories: categoryDistribution,
    categoryDistribution,
    activeUsers: activeUsersRow ? activeUsersRow.count : 0,
    totalTransactions: totalTxRow ? totalTxRow.count : 0,
    totalUsers,
    totalBooks,
    booksBorrowedToday,
    availableBooks,
    borrowActivity: filledActivity,
    activeUsersTable,
    recentBorrowings
  };
};

module.exports = { getLibraryAnalytics };
