const Story = require('../models/Story');
const User = require('../models/User');
const { runScraper, getLastScrapedAt } = require('../scraper/hackerScraper');

// GET /api/stories
const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Story.countDocuments();

    res.json({
      stories,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      lastScrapedAt: getLastScrapedAt(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/stories/:id
const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/stories/:id/bookmark
const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const user = await User.findById(req.user._id);

    const index = user.bookmarks.indexOf(storyId);
    if (index === -1) {
      user.bookmarks.push(storyId);
    } else {
      user.bookmarks.splice(index, 1);
    }

    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/stories/scrape
const triggerScrape = async (req, res) => {
  try {
    await runScraper();
    res.json({ message: 'Scrape completed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/stories/bookmarks
const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStories, getStory, toggleBookmark, triggerScrape, getBookmarks };
