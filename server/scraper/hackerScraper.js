const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

let lastScrapedAt = null;

async function runScraper() {
  // Rate limit — skip if last scrape was less than 60s ago
  if (lastScrapedAt && Date.now() - lastScrapedAt < 60 * 1000) {
    console.log('Scraper rate-limited, skipping...');
    return;
  }

  try {
    const { data } = await axios.get('https://news.ycombinator.com/');
    const $ = cheerio.load(data);

    const stories = [];
    const rows = $('.athing').slice(0, 10);

    rows.each((i, el) => {
      const id = $(el).attr('id');
      const titleEl = $(el).find('.titleline > a').first();
      const title = titleEl.text();
      const url = titleEl.attr('href') || '';

      // The subtext row is the next sibling tr
      const subtext = $(el).next('tr').find('.subtext, .subline');

      const scoreEl = subtext.find(`#score_${id}`);
      const points = scoreEl.length
        ? parseInt(scoreEl.text(), 10) || 0
        : 0;

      const author = subtext.find('.hnuser').text() || 'unknown';
      const postedAt = subtext.find('.age').attr('title') || '';

      // Filter out job posts / rows with 0 points
      if (points > 0) {
        stories.push({ title, url, points, author, postedAt, scrapedAt: new Date() });
      }
    });

    // Replace old stories with fresh scrape
    await Story.deleteMany({});
    if (stories.length > 0) {
      await Story.insertMany(stories);
    }

    lastScrapedAt = Date.now();
    console.log(`Scraped ${stories.length} stories from Hacker News`);
  } catch (err) {
    console.error('Scraper error:', err.message);
  }
}

function getLastScrapedAt() {
  return lastScrapedAt;
}

module.exports = { runScraper, getLastScrapedAt };
