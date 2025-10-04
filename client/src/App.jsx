import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import Series from "./pages/Series";
import Reviews from "./pages/Reviews";
import Gamification from "./pages/Gamification";
import Navbar from "./pages/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<Books />} />
          <Route path="/series" element={<Series />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/gamification" element={<Gamification />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
