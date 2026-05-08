import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import StoryCard from '../components/StoryCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [lastScrapedAt, setLastScrapedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuth();

  const fetchStories = useCallback(async (p = page) => {
    try {
      const { data } = await API.get(`/stories?page=${p}&limit=10`);
      setStories(data.stories);
      setTotalPages(data.totalPages);
      setLastScrapedAt(data.lastScrapedAt);
    } catch (err) {
      // silently fail — UI shows empty list
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchBookmarks = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await API.get('/stories/bookmarks');
      setBookmarks(data.bookmarks.map((b) => b._id));
    } catch (err) {
      // silently fail — bookmarks just won't highlight
    }
  }, [token]);

  useEffect(() => {
    fetchStories();
    fetchBookmarks();
  }, [fetchStories, fetchBookmarks]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await API.post('/stories/scrape');
      setPage(1);
      await fetchStories(1);
    } catch (err) {
      // silently fail
    } finally {
      setRefreshing(false);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchStories(newPage);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchStories(newPage);
    }
  };

  const handleBookmarkToggle = (storyId, updatedBookmarks) => {
    setBookmarks(updatedBookmarks);
  };

  const getTimeSince = (timestamp) => {
    if (!timestamp) return 'N/A';
    const mins = Math.floor((Date.now() - timestamp) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading stories...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h2>Top Hacker News Stories</h2>
        <div className="home-meta">
          <span className="last-updated">
            Last updated: {getTimeSince(lastScrapedAt)}
          </span>
          <button
            className="btn-refresh"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Stories'}
          </button>
        </div>
      </div>
      <div className="stories-list">
        {stories.map((story) => (
          <StoryCard
            key={story._id}
            story={story}
            isBookmarked={bookmarks.includes(story._id)}
            onBookmarkToggle={handleBookmarkToggle}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={handlePrev}
            disabled={page <= 1}
            className="btn-page"
          >
            Previous
          </button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className="btn-page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
