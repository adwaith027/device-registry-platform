import React from "react";
import { Link } from "react-router-dom";
import '../styles/LoginPage.css'; 

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-card__header">
          <h2 className="login-card__title">Login</h2>
          <p className="login-card__subtitle">Sign in to continue</p>
        </div>

        <form className="login-form">
          {/* Username Field */}
          <div className="login-form__field">
            <input
              type="text"
              className="login-form__input"
              placeholder="Username"
              id="username"
              name="username"
              required
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
            />
            <span className="login-form__icon">
              <i className="fas fa-lock"></i>
            </span>
          </div>

          {/* Submit Button */}
          <div className="login-form__actions">
            <Link to="/dashboard" className="login-form__submit">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}