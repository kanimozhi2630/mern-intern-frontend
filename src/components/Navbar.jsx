import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Student Progress Tracker
        </Link>
        <div className="navbar-links">
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registration</Link>
            </>
          ) : (
            <>
              <Link to={user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard'}>
                Dashboard
              </Link>
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
