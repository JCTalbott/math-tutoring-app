import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in');
      console.error(error);
    }

    setLoading(false);
  }

  async function handleSignUp(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create account');
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Math Tutor App</h2>
        <p>Sign in to access your math practice sessions</p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button disabled={loading} type="submit" className="primary-button">
            Sign In
          </button>
          
          <button 
            disabled={loading} 
            type="button" 
            onClick={handleSignUp}
            className="secondary-button"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
