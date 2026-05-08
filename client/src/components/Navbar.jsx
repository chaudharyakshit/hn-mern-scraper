import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">HN Board</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.username}</span>
            <Link to="/bookmarks">Bookmarks</Link>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
