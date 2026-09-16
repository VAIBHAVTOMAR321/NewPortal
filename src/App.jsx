import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import NavBar from "./components/nav_bar/NavBar";
import MushroomForm from "./components/MushroomForm/MushroomForm";
import BaagwaniMission from "./components/BaagwaniMission/BaagwaniMission";
import PMKSY from "./components/PMKSY/PMKSY";
const AppContent = () => {
  const location = useLocation();

  const isDisRoute = location.pathname === "/";

  return (
    <>
      {!isDisRoute && <NavBar />}

      <div className={!isDisRoute ? "main-content" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MushroomForm" element={<MushroomForm />} />
          <Route path="/BaagwaniMission" element={<BaagwaniMission />} />
          <Route path="/PMKSY" element={<PMKSY />} />
          

        </Routes>
      </div>

      {!isDisRoute && <Footer />}
    </>
  );
};

function App() {
  return <AppContent />;
}

export default App;
