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
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrPhone) &&
      !/^[0-9]{10}$/.test(formData.emailOrPhone)
    ) {
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
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await login(
        formData.emailOrPhone,
        formData.password,
        formData.role
      );

      if (result.success) {
        navigate('/MushroomForm', { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = isSubmitting || authLoading;

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <div className="login-wrapper">
        {/* Left Branding */}
        <div className="login-brand">
          <div className="brand-content">
            
            {/* Centered Logo */}
            <div className="brand-logo">
              <span>DK</span>
            </div>

            {/* Heading with Centered Border Bottom */}
            <h1>Dhokotdwar</h1>
            <div className="brand-line"></div>
            
            <p className="brand-subtitle">Project Management Portal</p>
            
            {/* Justified Paragraph */}
            <p className="brand-description">
              A secure digital platform for managing agricultural schemes,
              mushroom cultivation and horticulture projects. Designed to bring
              efficiency and real-time tracking to the department.
            </p>

            <div className="brand-features">
              <div>
                <span className="feature-dot">✓</span>
                Secure Authentication
              </div>
              <div>
                <span className="feature-dot">✓</span>
                Centralized Management
              </div>
              <div>
                <span className="feature-dot">✓</span>
                Real-time Information
              </div>
            </div>
          </div>
          
          <div className="brand-footer">
            © {new Date().getFullYear()} Dhokotdwar Portal
          </div>
        </div>

        {/* Right Login Card */}
        <div className="login-section">
          <div className="login-card">
            
            <div className="mobile-logo">
              <div className="brand-logo">
                <span>DK</span>
              </div>
            </div>

            <div className="login-header">
              <h2>Welcome back</h2>
              <p>Sign in to continue to your account</p>
            </div>

            {authError && (
              <div className="login-error">
                <span className="error-symbol">!</span>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email / Phone */}
              <div className="form-group">
                <label htmlFor="emailOrPhone">Email or Phone</label>
                <div className={`input-box ${errors.emailOrPhone ? 'input-error' : ''}`}>
                  <span className="input-symbol">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  <input
                    type="text"
                    id="emailOrPhone"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    placeholder="Enter email or phone"
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
                {errors.emailOrPhone && (
                  <span className="field-error">{errors.emailOrPhone}</span>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className={`input-box ${errors.password ? 'input-error' : ''}`}>
                  <span className="input-symbol">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>

              {/* Role */}
              <div className="form-group">
                <label>Login as</label>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-button ${formData.role === 'admin' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('admin')}
                    disabled={loading}
                  >
                    <span className="role-icon">A</span>
                    <span>
                      <strong>Admin</strong>
                      <small>Administrator</small>
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`role-button ${formData.role === 'officer' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('officer')}
                    disabled={loading}
                  >
                    <span className="role-icon">O</span>
                    <span>
                      <strong>Officer</strong>
                      <small>Department Officer</small>
                    </span>
                  </button>
                </div>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="secure-note">
              <span>🔒</span>
              Secure cookie-based authentication
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;