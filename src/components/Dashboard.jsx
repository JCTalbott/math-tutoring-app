import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Math Tutor Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {currentUser?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="sections-grid">
        <div className="section-card" onClick={() => navigate('/geometry')}>
          <h2>📐 Geometry</h2>
          <p>Practice angle relationships with parallel lines and transversals</p>
          <div className="section-tags">
            <span className="tag">Angle Pairs</span>
            <span className="tag">Parallel Lines</span>
          </div>
        </div>

        <div className="section-card" onClick={() => navigate('/calculus')}>
          <h2>📊 Calculus</h2>
          <p>Master derivative rules and function differentiation</p>
          <div className="section-tags">
            <span className="tag">Chain Rule</span>
            <span className="tag">Product Rule</span>
            <span className="tag">Quotient Rule</span>
            <span className="tag">Power Rule</span>
          </div>
        </div>

        <div className="section-card" onClick={() => navigate('/algebra')}>
          <h2>🔢 Algebra</h2>
          <p>Practice polynomial multiplication and expansion</p>
          <div className="section-tags">
            <span className="tag">FOIL Method</span>
            <span className="tag">Polynomials</span>
          </div>
        </div>
      </div>
    </div>
  );
}
