import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ setToken, setUser }) => {
  const [isLogin, setIsLogin] = useState(true); // Default to login for convenience
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Replace this with your deployed backend URL if you are testing on Vercel
  // const API_URL = window.location.hostname === 'localhost' 
  //   ? 'http://localhost:3000' 
  //   : 'https://your-backend-url.render.com'; // Replace with your Render/Railway URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const path = isLogin ? '/auth/login' : '/auth/signup';

    try {
      console.log(`Attempting ${isLogin ? 'Login' : 'Signup'} at: ${API_URL}${path}`);

      const res = await axios.post(`${API_URL}${path}`, formData);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        setToken(res.data.token);
        setUser(res.data);
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Auth Error:', err);
      const msg = err.response?.data?.error || err.message || 'Authentication failed';
      setError(`${msg} (Target: ${API_URL})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10H15L10 30H0L5 10Z" fill="#818CF8" />
            <path d="M12.5 10H22.5L17.5 30H7.5L12.5 10Z" fill="#6366F1" />
            <path d="M20 10H30L25 30H15L20 10Z" fill="#4F46E5" />
          </svg>
          <span className="logo-text">auth</span>
        </div>

        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        <p className="subtitle">{isLogin ? 'Welcome back!' : 'Join the engine today'}</p>

        <form onSubmit={onSubmit} style={{ width: '100%' }}>
          {!isLogin && (
            <div className="input-group">
              <span className="input-icon" style={{ fontSize: '1.2rem' }}>👤</span>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Full Name"
                required
              />
            </div>
          )}
          <div className="input-group">
            <span className="input-icon" style={{ fontSize: '1.2rem' }}>✉️</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
              required
            />
          </div>
          <div className="input-group">
            <span className="input-icon" style={{ fontSize: '1.2rem' }}>🔒</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
            {isLogin ? (
              <a href="#" className="forgot-password">Forgot Password?</a>
            ) : <div></div>}
          </div>

          <button type="submit" className="auth-button" disabled={loading} style={{ height: '3.5rem', marginTop: '0.5rem' }}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        {error && <div className="auth-error" style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginTop: '15px' }}>{error}</div>}

        <p className="toggle-auth">
          {isLogin ? "Don't have an account? " : "Already have an Account? "}
          <button
            type="button"
            className="link-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
