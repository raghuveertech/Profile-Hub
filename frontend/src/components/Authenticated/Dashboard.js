import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Authenticated from ".";
import { getProfileInfo } from "../../api-methods";
import { formatDate } from "../../utils";

const Dashboard = () => {
  const [profile, setProfile] = useState({});
  useEffect(() => {
    async function getProfileData() {
      const response = await getProfileInfo();
      setProfile(response.data);
    }
    getProfileData();
  }, []);
  console.log(profile);
  const { basicInfo, profileInfo } = profile;
  const { name } = basicInfo;
  return (
    <Authenticated>
      <section class="container">
        <h1 class="large text-primary">Dashboard</h1>
        <p class="lead">
          <i class="fas fa-user"></i> Welcome {name}
        </p>
        <div class="dash-buttons">
          <Link to="/profile/edit" class="btn btn-light">
            <i class="fas fa-user-circle text-primary"></i> Edit Profile
          </Link>
          <a href="add-experience.html" class="btn btn-light">
            <i class="fab fa-black-tie text-primary"></i> Add Experience
          </a>
          <a href="add-education.html" class="btn btn-light">
            <i class="fas fa-graduation-cap text-primary"></i> Add Education
          </a>
        </div>

        <h2 class="my-2">Experience</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Company</th>
              <th class="hide-sm">Title</th>
              <th class="hide-sm">Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profileInfo.experience.map((exp) => {
              return (
                <tr>
                  <td>{exp.company}</td>
                  <td class="hide-sm">{exp.designation}</td>
                  <td class="hide-sm">
                    {formatDate(exp.from)} -{" "}
                    {exp.current ? "Current" : formatDate(exp.to)}
                  </td>
                  <td>
                    <button class="btn btn-danger">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2 class="my-2">Education</h2>
        <table class="table">
          <thead>
            <tr>
              <th>School</th>
              <th class="hide-sm">Degree</th>
              <th class="hide-sm">Field of Study</th>
              <th class="hide-sm">Years</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {profileInfo.education.map((edu) => {
              return (
                <tr>
                  <td>{edu.school}</td>
                  <td class="hide-sm">{edu.degree}</td>
                  <td class="hide-sm">{edu.fieldofstudy}</td>
                  <td class="hide-sm">
                    {formatDate(edu.from)} -{" "}
                    {edu.current ? "Current" : formatDate(edu.to)}
                  </td>
                  <td>
                    <button class="btn btn-danger">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div class="my-2">
          <button class="btn btn-danger">
            <i class="fas fa-user-minus"></i>
            Delete My Account
          </button>
        </div>
      </section>
    </Authenticated>
  );
};

export default Dashboard;
