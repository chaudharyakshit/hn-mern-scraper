const express = require('express');
const router = express.Router();
const {
  getStories,
  getStory,
  toggleBookmark,
  triggerScrape,
  getBookmarks,
} = require('../controllers/storyController');
const { protect } = require('../middleware/auth');

router.get('/', getStories);
router.get('/bookmarks', protect, getBookmarks);
router.get('/:id', getStory);
router.post('/:id/bookmark', protect, toggleBookmark);
router.post('/scrape', triggerScrape);

module.exports = router;
