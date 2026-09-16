import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    role: 'admin',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrPhone) && !/^[0-9]{10}$/.test(formData.emailOrPhone)) {
      newErrors.emailOrPhone = 'Enter a valid email or 10-digit phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const result = await login(formData.emailOrPhone, formData.password, formData.role);
    
    if (result.success) {
      navigate('/MushroomForm', { replace: true });
    }
    
    setIsSubmitting(false);
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="2"/>
                <path d="M30 15V45M15 30H45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="login-title">Dhokotdwar Portal</h1>
            <p className="login-subtitle">Sign in to access your dashboard</p>
          </div>

          <div className="login-divider">
            <span>Admin / Officer Login</span>
          </div>

          {authError && (
            <div className="alert alert-error" role="alert">
              <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{authError}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="emailOrPhone" className="form-label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email or Phone
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="emailOrPhone"
                  name="emailOrPhone"
                  className={`form-input ${errors.emailOrPhone ? 'has-error' : ''}`}
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="Enter email or phone number"
                  autoComplete="email"
                  disabled={isSubmitting || authLoading}
                  aria-invalid={errors.emailOrPhone ? 'true' : 'false'}
                  aria-describedby={errors.emailOrPhone ? 'emailOrPhone-error' : undefined}
                />
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                </span>
              </div>
              {errors.emailOrPhone && (
                <span id="emailOrPhone-error" className="form-error" role="alert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errors.emailOrPhone}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Password
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className={`form-input ${errors.password ? 'has-error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting || authLoading}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <span id="password-error" className="form-error" role="alert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-group role-selector">
              <label className="form-label">Role</label>
              <div className="role-options" role="radiogroup" aria-label="Select role">
                {['admin', 'officer'].map(role => (
                  <label key={role} className={`role-option ${formData.role === role ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={() => handleRoleChange(role)}
                      disabled={isSubmitting || authLoading}
                    />
                    <span className="role-label">
                      <svg className="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {role === 'admin' && <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>}
                        {role === 'officer' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
                      </svg>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={isSubmitting || authLoading}
              aria-busy={isSubmitting || authLoading}
            >
              <span className="btn-text">
                {isSubmitting || authLoading ? 'Signing in...' : 'Sign In'}
              </span>
              {(isSubmitting || authLoading) && (
                <svg className="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="footer-text">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
              </svg>
              Secure cookie-based authentication
            </p>
            <p className="footer-note">
              Tokens are automatically managed via HttpOnly cookies
            </p>
          </div>
        </div>

        <div className="login-side">
          <div className="side-content">
            <h2 className="side-title">Welcome Back</h2>
            <p className="side-description">
              Dhokotdwar Project Management Portal provides a comprehensive platform for managing agricultural schemes, mushroom cultivation, and horticulture missions.
            </p>
            <div className="features">
              <div className="feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Scheme Management</span>
              </div>
              <div className="feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>Secure Access</span>
              </div>
              <div className="feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <span>Real-time Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;