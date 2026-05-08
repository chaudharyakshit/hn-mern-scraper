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

  return (
    <div className="story-card">
      <div className="story-points">
        {story.points}
      </div>
      <div className="story-body">
        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="story-title"
        >
          {story.title}
        </a>
        <div className="story-meta">
          <span className="author">by {story.author}</span>
          {story.postedAt && <span>{story.postedAt}</span>}
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
