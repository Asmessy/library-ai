const { getLibraryAnalytics } = require('../services/analyticsService');

const getAnalytics = async (req, res) => {
  try {
    const data = await getLibraryAnalytics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAnalytics };
