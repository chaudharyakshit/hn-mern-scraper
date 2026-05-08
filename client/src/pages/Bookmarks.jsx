import { useState, useEffect } from 'react';
import API from '../api/axios';
import StoryCard from '../components/StoryCard';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const { data } = await API.get('/stories/bookmarks');
      setBookmarks(data.bookmarks);
    } catch (err) {
      // fetch failed — empty state will show
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = (storyId, updatedBookmarks) => {
    setBookmarks((prev) => prev.filter((b) => updatedBookmarks.includes(b._id)));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading bookmarks...</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📑</span>
        <h3>No bookmarks yet</h3>
        <p>Start saving stories from the home page!</p>
      </div>
    );
  }

  return (
    <div className="bookmarks-page">
      <h2>Your Bookmarks</h2>
      <div className="stories-list">
        {bookmarks.map((story) => (
          <StoryCard
            key={story._id}
            story={story}
            isBookmarked={true}
            onBookmarkToggle={handleBookmarkToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
