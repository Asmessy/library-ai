const express = require('express');
const router = express.Router();
const { getProfileData } = require('../controllers/userProfileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProfileData);

module.exports = router;
