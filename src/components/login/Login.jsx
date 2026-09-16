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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
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

            <div className="brand-logo">
              <span>DK</span>
            </div>

            <h1>Dhokotdwar</h1>

            <p className="brand-subtitle">
              Project Management Portal
            </p>

            <div className="brand-line"></div>

            <p className="brand-description">
              A secure digital platform for managing agricultural schemes,
              mushroom cultivation and horticulture projects.
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

        {/* Login Card */}
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
                <label htmlFor="emailOrPhone">
                  Email or Phone
                </label>

                <div className={`input-box ${errors.emailOrPhone ? 'input-error' : ''}`}>
                  <span className="input-symbol">
                    @
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
                  <span className="field-error">
                    {errors.emailOrPhone}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>

                <div className={`input-box ${errors.password ? 'input-error' : ''}`}>
                  <span className="input-symbol">
                    •••
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
                  <span className="field-error">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Role */}
              <div className="form-group">
                <label>Login as</label>

                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-button ${
                      formData.role === 'admin' ? 'active' : ''
                    }`}
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
                    className={`role-button ${
                      formData.role === 'officer' ? 'active' : ''
                    }`}
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

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
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