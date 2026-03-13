const { getReadingPersonality, getReadingTimeline } = require('../services/userProfileService');

const getProfileData = async (req, res) => {
  try {
    const userId = req.user.id;
    const [personality, timeline] = await Promise.all([
      getReadingPersonality(userId),
      getReadingTimeline(userId)
    ]);
    res.json({ personality, timeline });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProfileData };
