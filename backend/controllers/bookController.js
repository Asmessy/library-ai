const db = require('../config/db');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM Books WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    const books = await db.allAsync(query, params);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private/Admin
const addBook = async (req, res) => {
  try {
    const { title, author, category, image_url } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    let pdf_url = null;
    if (req.file) {
      pdf_url = `/uploads/books/${req.file.filename}`;
    }

    await db.runAsync('INSERT INTO Books (title, author, category, image_url, pdf_url) VALUES (?, ?, ?, ?, ?)', [title, author, category, image_url || null, pdf_url]);
    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    await db.runAsync('DELETE FROM Books WHERE book_id = ?', [bookId]);
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBooks,
  addBook,
  deleteBook,
};
