import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import NavBar from "./components/nav_bar/NavBar";
import MushroomForm from "./components/MushroomForm/MushroomForm";
import BaagwaniMission from "./components/BaagwaniMission/BaagwaniMission";
import PMKSY from "./components/PMKSY/PMKSY";
import Login from "./components/login/Login";
import { AuthProvider, useAuth } from "./components/login/AuthContext";
import AdminHeader from "./components/admin_dashboard/AdminHeader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen" role="status" aria-label="Loading">
        <div className="loading-spinner">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="31.4 31.4"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => {
  const location = useLocation();

  // Hide global NavBar on MushroomForm
  const hideNavBar = location.pathname === "/MushroomForm" || location.pathname === "/BaagwaniMission" || location.pathname === "/PMKSY";

  // Show NavBar on all pages except MushroomForm
  const showNavBar = !hideNavBar;

  // Protected/Admin routes where Footer should NOT be shown
  const hideFooterRoutes = [
    "/MushroomForm",
    "/BaagwaniMission",
    "/PMKSY",
  ];

  // Check current route
  const hideFooter = hideFooterRoutes.includes(location.pathname);

  // Show Footer only when route is not in hideFooterRoutes
  const showFooter = !hideFooter;

  return (
    <>
      {/* Global NavBar */}
      {showNavBar && <NavBar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminHeader />

              <div className="main-content">
                <Routes>
                  <Route
                    path="/MushroomForm"
                    element={<MushroomForm />}
                  />

                  <Route
                    path="/BaagwaniMission"
                    element={<BaagwaniMission />}
                  />

                  <Route
                    path="/PMKSY"
                    element={<PMKSY />}
                  />
                </Routes>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Footer */}
      {showFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;