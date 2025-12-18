import React, { useState } from "react";
import '../styles/SignupPage.css';
import api, { BASE_URL } from '../assets/js/axiosConfig';
import { togglePassword } from "../assets/js/auth";
import { NavLink, useNavigate } from 'react-router-dom';

export default function SignupPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [mailid, setMailid] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    // const [role, setRole] = useState('employee');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const trimmedUsername = username.trim();
        const trimmedMailID = mailid.trim();
        const trimmedPassword = password.trim();
        const trimmedCPassword = cpassword.trim();

        if (!trimmedUsername || !trimmedMailID || !trimmedPassword || !trimmedCPassword) {
            setError("Please fill out all the fields");
            return;
        }

        if (trimmedPassword !== trimmedCPassword) {
            setError("Both passwords are not similar");
            return;
        }

        if (trimmedPassword.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            const signup_data = {
                username: trimmedUsername,
                mailid: trimmedMailID,
                password: trimmedPassword,
                cpassword: trimmedCPassword,
                // role: role
            };

            const response = await api.post(`${BASE_URL}/signup/`, signup_data);

            setMessage(response.data.message || 'Account created successfully!');
            
            // Clear form
            setUsername('');
            setMailid('');
            setPassword('');
            setCpassword('');
            // setRole('employee');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">

                <div className="signup-card__header">
                    <h2 className="signup-card__title">Sign Up</h2>
                    <p className="signup-card__subtitle">Create your account</p>
                </div>

                <form className="signup-form" onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div className="signup-form__field">
                        <input
                            type="text"
                            className="signup-form__input"
                            placeholder="Username"
                            id="username"
                            name="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                        />
                        <span className="signup-form__icon">
                            <i className="fas fa-user"></i>
                        </span>
                    </div>

                    {/* Email Field */}
                    <div className="signup-form__field">
                        <input
                            type="email"
                            className="signup-form__input"
                            placeholder="Email Address"
                            id="email"
                            name="email"
                            required
                            value={mailid}
                            onChange={(e) => setMailid(e.target.value)}
                            disabled={loading}
                        />
                        <span className="signup-form__icon">
                            <i className="fas fa-envelope"></i>
                        </span>
                    </div>  

                    {/* Password Field */}
                    <div className="signup-form__field">
                        <input
                            type="password"
                            className="signup-form__input"
                            placeholder="Password"
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <span className="signup-form__icon" onClick={() => togglePassword("password")}>
                            <i className="fas fa-lock"></i>
                        </span>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="signup-form__field">
                        <input
                            type="password"
                            className="signup-form__input"
                            placeholder="Confirm Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)}
                            disabled={loading}
                        />
                        <span className="signup-form__icon" onClick={() => togglePassword("confirmPassword")}>
                            <i className="fas fa-lock"></i>
                        </span>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="signup-form__error">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {message && (
                        <div className="signup-form__success">
                            {message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="signup-form__actions">
                        <button 
                            type="submit" 
                            className="signup-form__submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>

                    {/* Link to Login */}
                    <div className="signup-form__footer">
                        <p>Already have an account? <NavLink to="/login">Login here</NavLink></p>
                    </div>
                </form>
            </div>
        </div>
    );
}