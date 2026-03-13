const db = require('../config/db');

const getReadingPersonality = async (userId) => {
  const query = `
    SELECT b.category, COUNT(b.category) as count
    FROM BorrowedBooks bb
    JOIN Books b ON bb.book_id = b.book_id
    WHERE bb.user_id = ?
    GROUP BY b.category
    ORDER BY count DESC
  `;
  const categories = await db.allAsync(query, [userId]);
  
  if (categories.length === 0) {
    return { title: 'Newcomer', emoji: '🌱', description: 'Borrow some books to discover your reading personality!' };
  }

  const topCategory = categories[0].category;
  
  const personalities = {
    'Finance': { title: 'Strategist', emoji: '📊', description: 'You enjoy books about finance, business, and productivity.' },
    'Self Help': { title: 'Deep Thinker', emoji: '🧘', description: 'You seek self-improvement, philosophy, and focus.' },
    'Fiction': { title: 'Story Seeker', emoji: '🎭', description: 'You love getting lost in literature and captivating tales.' },
    'Technology': { title: 'Innovator', emoji: '💻', description: 'You explore programming, algorithms, and the future.' },
    'History': { title: 'Explorer', emoji: '🧭', description: 'You love learning about the past and human history.' },
  };

  if (categories.length >= 3 && (categories[0].count - categories[categories.length - 1].count <= 2)) {
      return { title: 'Explorer', emoji: '🧭', description: 'You have diverse tastes and read across many genres.' };
  }

  return personalities[topCategory] || { title: 'Avid Reader', emoji: '📚', description: 'You love reading and exploring ideas.' };
};

const getReadingTimeline = async (userId) => {
  const query = `
    SELECT bb.borrow_date, b.title, b.author
    FROM BorrowedBooks bb
    JOIN Books b ON bb.book_id = b.book_id
    WHERE bb.user_id = ? AND bb.status IN ('Borrowed', 'Returned')
    ORDER BY bb.borrow_date DESC
  `;
  const records = await db.allAsync(query, [userId]);
  return records.map(r => ({
    date: r.borrow_date,
    title: r.title,
    author: r.author
  }));
};

module.exports = { getReadingPersonality, getReadingTimeline };
