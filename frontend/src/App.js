import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Developers from "./components/Developers";
import Blog from "./components/Blog";
import "./styles/App.css";

const App = () => {
  return (
    <React.Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </React.Fragment>
  );
};

export default App;
