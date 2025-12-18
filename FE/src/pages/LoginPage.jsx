import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import '../styles/LoginPage.css'; 
import api, { BASE_URL } from '../assets/js/axiosConfig';
import { togglePassword } from '../assets/js/auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername && !trimmedPassword) {
      setError("Please fill out all the fields");
      return;
    }
    else if (!trimmedUsername) {
      setError("Please enter a valid username");
      return;
    }
    else if (!trimmedPassword) {
      setError("Please enter a valid password");
      setPassword('');
      return;
    }

    setLoading(true);

    try {
      const login_data = { 
        username: trimmedUsername, 
        password: trimmedPassword 
      };

      const response = await api.post(`${BASE_URL}/login/`, login_data);

      // Store user info in localStorage (optional)
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Navigate to dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-card__header">
          <h2 className="login-card__title">Login</h2>
          <p className="login-card__subtitle">Sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="login-form__field">
            <input
              type="text"
              className="login-form__input"
              placeholder="Username"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <span className="login-form__icon">
              <i className="fas fa-user"></i>
            </span>
          </div>

          {/* Password Field */}
          <div className="login-form__field">
            <input
              type="password"
              className="login-form__input"
              placeholder="Password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <span className="login-form__icon" onClick={() => togglePassword("password")}>
              <i className="fas fa-lock"></i>
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-form__error">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="login-form__actions">
            <button 
              type="submit" 
              className="login-form__submit"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          {/* Link to Signup */}
          <div className="login-form__footer">
            <p>Don't have an account? <NavLink to="/signup">Sign up here</NavLink></p>
          </div>
        </form>
      </div>
    </div>
  );
}