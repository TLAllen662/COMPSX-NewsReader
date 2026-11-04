import { Link, useLocation } from 'react-router-dom';
import { useArticles } from '../context/ArticlesContext';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const location = useLocation();
  const { getUserSavedArticles } = useArticles();
  const { user, logout, isAuthenticated } = useAuth();
  const savedArticleCount = getUserSavedArticles().length;

  return (
    <nav>
      <div className="nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <h1 className="nav-brand">NewsReader</h1>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
            >
              Search
            </Link>
            <Link 
              to="/saved" 
              className={`nav-link ${location.pathname === '/saved' ? 'active' : ''}`}
            >
              Saved Articles ({savedArticleCount})
            </Link>
          </div>
        </div>
        <div className="nav-user">
          {isAuthenticated() ? (
            <>
              <span>{user.username}</span>
              <button type="button" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;