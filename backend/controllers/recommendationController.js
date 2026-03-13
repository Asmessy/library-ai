const { getRecommendations, getSmartDiscovery, getReadersAlsoBorrowed, getBookOfTheDay } = require('../services/recommendationService');

const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const recommendedBooks = await getRecommendations(userId);
    res.json({ recommendedBooks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getSmartDiscoveryHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const books = await getSmartDiscovery(userId);
    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getReadersAlsoBorrowedHandler = async (req, res) => {
  try {
    const { bookId } = req.params;
    const books = await getReadersAlsoBorrowed(bookId);
    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBookOfTheDayHandler = async (req, res) => {
  try {
    const book = await getBookOfTheDay();
    res.json({ book });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserRecommendations,
  getSmartDiscoveryHandler,
  getReadersAlsoBorrowedHandler,
  getBookOfTheDayHandler
};
