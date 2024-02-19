import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Authenticated from ".";
import { deleteEducation, deleteExperience } from "../../api-methods";
import { TokenContext } from "../../App";
import { formatDate } from "../../utils";

const Dashboard = (props) => {
  const { profile, getFullProfile } = props;

  const { token } = useContext(TokenContext);

  const { basicInfo, profileInfo } = profile;

  const confirmDeleteExperience = async (expId) => {
    if (window.confirm("Are you sure?")) {
      const response = await deleteExperience(expId, token);
      if (response.status === 200) {
        getFullProfile();
      }
    }
  };

  const confirmDeleteEducation = async (eduId) => {
    if (window.confirm("Are you sure?")) {
      const response = await deleteEducation(eduId, token);
      if (response.status === 200) {
        getFullProfile();
      }
    }
  };
  return (
    <Authenticated>
      <section className="container">
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Welcome{" "}
          {basicInfo ? basicInfo.name : ""}
        </p>
        <div className="dash-buttons">
          <Link to="/profile/edit" className="btn btn-light">
            <i className="fas fa-user-circle text-primary"></i> Edit Profile
          </Link>
          <Link to="/profile/modify-experience" className="btn btn-light">
            <i className="fab fa-black-tie text-primary"></i> Add Experience
          </Link>
          <Link to="/profile/modify-education" className="btn btn-light">
            <i className="fas fa-graduation-cap text-primary"></i> Add Education
          </Link>
        </div>

        <h2 className="my-2">Experience</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th className="hide-sm">Title</th>
              <th className="hide-sm">Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profileInfo &&
              profileInfo.experience.length > 0 &&
              profileInfo.experience.map((exp) => {
                return (
                  <tr key={exp._id}>
                    <td>{exp.company}</td>
                    <td className="hide-sm">{exp.designation}</td>
                    <td className="hide-sm">
                      {formatDate(exp.from)} -{" "}
                      {exp.current ? "Current" : formatDate(exp.to)}
                    </td>
                    <td>
                      <Link
                        to={`/profile/modify-experience/${exp._id}`}
                        className="btn btn-dark"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => confirmDeleteExperience(exp._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <h2 className="my-2">Education</h2>
        <table className="table">
          <thead>
            <tr>
              <th>School</th>
              <th className="hide-sm">Degree</th>
              <th className="hide-sm">Field of Study</th>
              <th className="hide-sm">Years</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {profileInfo &&
              profileInfo.education.length > 0 &&
              profileInfo.education.map((edu) => {
                return (
                  <tr key={edu._id}>
                    <td>{edu.school}</td>
                    <td className="hide-sm">{edu.degree}</td>
                    <td className="hide-sm">{edu.fieldofstudy}</td>
                    <td className="hide-sm">
                      {formatDate(edu.from)} -{" "}
                      {edu.current ? "Current" : formatDate(edu.to)}
                    </td>
                    <td>
                      <Link
                        to={`/profile/modify-education/${edu._id}`}
                        className="btn btn-dark"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => confirmDeleteEducation(edu._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className="my-2">
          <button className="btn btn-danger">
            <i className="fas fa-user-minus"></i>
            Delete My Account
          </button>
        </div>
      </section>
    </Authenticated>
  );
};

export default Dashboard;
