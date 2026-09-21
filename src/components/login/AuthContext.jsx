import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';

const AuthContext = createContext(null);

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "/api"
  : "https://mahadevaaya.com/dhokotdwarproject2/dhokotdwarproject2_backend/api";

const getCSRFToken = () => {
  const name = 'csrftoken';
  if (!document.cookie || document.cookie === '') {
    return null;
  }
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.substring(0, name.length + 1) === `${name}=`) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiFetch = useCallback(async (url, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();
    const headers = { ...(options.headers || {}) };

    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }
    }

    return fetch(url, {
      ...options,
      method,
      headers,
      credentials: 'include',
    });
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        setUser(null);
        return;
      }

      const response = await apiFetch(`${API_BASE_URL}/refresh-token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          authenticated: true,
          role: data.role,
          unique_id: data.unique_id,
          username: data.username,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      // Don't log 401 as error - it's expected when no session exists
      if (err.name !== 'AbortError' && !err.message?.includes('401')) {
        console.error('Authentication check failed:', err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (emailOrPhone, password, role) => {
    setError(null);
    setLoading(true);

    try {
      const response = await apiFetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_or_phone: emailOrPhone,
          password,
          role,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.detail || data.message || 'Login failed'
        );
      }

      setUser({
        authenticated: true,
        role: data.role || role,
        unique_id: data.unique_id,
        username: data.username,
      });

      return { success: true, data };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiFetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;