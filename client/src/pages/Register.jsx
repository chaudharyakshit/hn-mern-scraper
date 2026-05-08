import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { username, email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="lp" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/loginbg.png)` }}>
      <div className="lp-overlay" />

      <div className="lp-particles">
        <span /><span /><span /><span /><span /><span />
      </div>

      <div className="lp-left">
        <div className="lp-header">
          <div className="lp-logo-icon">HN</div>
          <span className="lp-logo-text">HN Board</span>
        </div>

        <div className="lp-hero">
          <h1>Join <strong>HN Board!</strong> <span className="lp-wave">🚀</span></h1>
          <p>Create your account and start exploring<br/>the best of Hacker News.</p>
        </div>

        <div className="lp-features">
          <div className="lp-feature">
            <div className="lp-feature-icon">⚡</div>
            <div>
              <strong>Real-time Updates</strong>
              <span>Stay updated with latest hacker news</span>
            </div>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-icon">🔖</div>
            <div>
              <strong>Save & Bookmark</strong>
              <span>Bookmark your favorite stories to read later</span>
            </div>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-icon">🛡️</div>
            <div>
              <strong>Secure & Private</strong>
              <span>Your data is safe with us</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lp-right">
        <div className="lp-card">
          <div className="lp-card-logo">
            <div className="lp-logo-icon">HN</div>
            <span>HN Board</span>
          </div>

          <h2>Create account</h2>
          <p className="lp-card-sub">Get started with your free account</p>

          {error && <div className="lp-error">{error}</div>}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="lp-field">
              <label>Username</label>
              <div className="lp-input-wrap">
                <svg className="lp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className="lp-field">
              <label>Email</label>
              <div className="lp-input-wrap">
                <svg className="lp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="lp-field">
              <label>Password</label>
              <div className="lp-input-wrap">
                <svg className="lp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                />
                <button type="button" className="lp-eye" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="lp-submit" disabled={loading}>
              {loading ? (
                <span className="lp-btn-loading"><span className="lp-spinner" /> Creating account...</span>
              ) : (<>Create account <span className="lp-arrow">→</span></>)}
            </button>
          </form>

          <p className="lp-bottom">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
