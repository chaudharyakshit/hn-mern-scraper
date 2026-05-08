import { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StoryCard = ({ story, isBookmarked, onBookmarkToggle }) => {
  const { token } = useAuth();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (!token) return;

    // Optimistic UI — toggle locally first
    setBookmarked(!bookmarked);
    setLoading(true);

    try {
      const { data } = await API.post(`/stories/${story._id}/bookmark`);
      if (onBookmarkToggle) onBookmarkToggle(story._id, data.bookmarks);
    } catch (err) {
      // Revert on error
      setBookmarked(bookmarked);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = story.postedAt
    ? new Date(story.postedAt).toLocaleString()
    : '';

  return (
    <div className="story-card">
      <div className="story-points">
        <span className="points-badge">{story.points}</span>
      </div>
      <div className="story-content">
        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="story-title"
        >
          {story.title}
        </a>
        <div className="story-meta">
          <span>by {story.author}</span>
          {timeAgo && <span> · {timeAgo}</span>}
        </div>
      </div>
      {token && (
        <button
          className={`btn-bookmark ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
          disabled={loading}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark this story'}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      )}
    </div>
  );
};

export default StoryCard;
