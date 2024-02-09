import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Developers from "./components/Developers";
import DeveloperDetails from "./components/Developers/DeveloperDetails";
import Blog from "./components/Blog";
import UpdateProfile from "./components/Authenticated/UpdateProfile";
import Dashboard from "./components/Authenticated/Dashboard";
import Logout from "./components/Authenticated/Logout";
import AddEditExperience from "./components/Authenticated/AddEditExperience";
import AddEditEducation from "./components/Authenticated/AddEditEducation";
import "./styles/App.css";

export const TokenContext = React.createContext();

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/developer/:userId" element={<DeveloperDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route
          path="/profile/dashboard"
          element={<Dashboard setProfile={setProfile} profile={profile} />}
        />
        <Route path="/profile/edit" element={<UpdateProfile />} />
        <Route
          path="/profile/modify-experience"
          element={<AddEditExperience setProfile={setProfile} />}
        />
        <Route
          path="/profile/modify-experience/:expId"
          element={
            <AddEditExperience setProfile={setProfile} profile={profile} />
          }
        />
        <Route
          path="/profile/modify-education"
          element={<AddEditEducation setProfile={setProfile} />}
        />
        <Route
          path="/profile/modify-education/:eduId"
          element={
            <AddEditEducation setProfile={setProfile} profile={profile} />
          }
        />
        <Route path="/profile/logout" element={<Logout />} />
      </Routes>
    </TokenContext.Provider>
  );
};

export default App;
