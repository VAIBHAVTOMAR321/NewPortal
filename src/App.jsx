import React from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Footer from "./components/footer/Footer";


import Home from "./components/home/Home";
import NavBar from "./components/nav_bar/NavBar";


// A wrapper component to conditionally render the NavBar
const AppContent = () => {
  const location = useLocation();
  const isDisRoute = [""].some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {!isDisRoute && <NavBar />}
      <div className={!isDisRoute ? "main-content" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
         
   
          

         
          
          {/* Add other Dis routes from DisLeftNav here as needed */}
        </Routes>
      </div>
      {!isDisRoute && <Footer />}
    </>
  );
};

function App() {
  return (
      <AppContent />
  );
}

export default App;