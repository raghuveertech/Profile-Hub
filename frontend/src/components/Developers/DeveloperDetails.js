import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGitRepos, getSingleProfile } from "../../api-methods";
import { formatDate } from "../../utils";

const DeveloperDetails = () => {
  const [profile, setProfile] = useState({});
  const [gitRepos, setGitRepos] = useState([]);

  const params = useParams();

  useEffect(() => {
    async function getSingleProfileMethod() {
      const response = await getSingleProfile(params.userId);
      setProfile(response.data);
    }
    getSingleProfileMethod();
  }, []);

  useEffect(() => {
    if (
      profile &&
      Object.keys(profile).length !== 0 &&
      profile.githubusername
    ) {
      async function getGitReposMethod() {
        const response = await getGitRepos(profile.githubusername);
        setGitRepos(response.data);
      }
      getGitReposMethod();
    }
  }, [profile.githubusername]);

  return (
    <section className="container">
      <Link to="/developers" className="btn btn-light">
        Back To Profiles
      </Link>

      {profile && Object.keys(profile).length !== 0 ? (
        <div className="profile-grid my-1">
          <div className="profile-top bg-primary p-2">
            <img
              className="round-img my-1"
              src={`${
                profile.profilepicture && profile.profilepicture.path
                  ? `/${profile.profilepicture.path}`
                  : profile.user.avatar
              }`}
              alt=""
            />
            <h1 className="large">{profile.user.name}</h1>
            <p className="lead">
              {profile.designation} at {profile.company}
            </p>
            <p>{profile.location}</p>
            <div className="icons my-1">
              {profile.website ? (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-globe fa-2x"></i>
                </a>
              ) : null}
              {profile.social.twitter ? (
                <a
                  href={profile.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-twitter fa-2x"></i>
                </a>
              ) : null}

              {profile.social.facebook ? (
                <a
                  href={profile.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook fa-2x"></i>
                </a>
              ) : null}
              {profile.social.linkedin ? (
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin fa-2x"></i>
                </a>
              ) : null}
              {profile.social.youtube ? (
                <a
                  href={profile.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-youtube fa-2x"></i>
                </a>
              ) : null}
              {profile.social.instagram ? (
                <a
                  href={profile.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram fa-2x"></i>
                </a>
              ) : null}
            </div>
          </div>

          <div className="profile-about bg-light p-2">
            <h2 className="text-primary">{profile.user.name}'s Bio</h2>
            <p>{profile.bio}</p>
            <div className="line"></div>
            <h2 className="text-primary">Skill Set</h2>
            <div className="skills">
              {profile.skills && profile.skills.length > 0
                ? profile.skills.map((skill) => {
                    return (
                      <div className="p-1">
                        <i className="fa fa-check"></i> {skill}
                      </div>
                    );
                  })
                : null}
            </div>
          </div>

          <div className="profile-exp bg-white p-2">
            <h2 className="text-primary">Experience</h2>
            {profile.experience && profile.experience.length > 0
              ? profile.experience.map((exp) => {
                  return (
                    <div>
                      <h3 className="text-dark">{exp.company}</h3>
                      <p>
                        {formatDate(exp.from)} -{" "}
                        {exp.current ? "Current" : formatDate(exp.to)}
                      </p>
                      <p>
                        <strong>Designation: </strong>
                        {exp.designation}
                      </p>
                      {exp.description ? (
                        <p>
                          <strong>Description: </strong>
                          {exp.description}
                        </p>
                      ) : null}
                    </div>
                  );
                })
              : null}
          </div>

          <div className="profile-edu bg-white p-2">
            <h2 className="text-primary">Education</h2>

            {profile.education && profile.education.length > 0
              ? profile.education.map((edu) => {
                  return (
                    <div>
                      <h3>{edu.school}</h3>
                      <p>
                        {formatDate(edu.from)} -{" "}
                        {edu.current ? "Current" : formatDate(edu.to)}
                      </p>
                      <p>
                        <strong>Degree: </strong>
                        {edu.degree}
                      </p>
                      <p>
                        <strong>Field Of Study: </strong>
                        {edu.fieldofstudy}
                      </p>
                      {edu.description ? (
                        <p>
                          <strong>Description: </strong>
                          {edu.description}
                        </p>
                      ) : null}
                    </div>
                  );
                })
              : null}
          </div>
          {gitRepos && gitRepos.length ? (
            <div className="profile-github">
              <h2 className="text-primary my-1">
                <i className="fab fa-github"></i> Github Repos
              </h2>

              {gitRepos.map((repo) => {
                return (
                  <div className="repo bg-white p-1 my-1">
                    <div>
                      <h4>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {repo.name}
                        </a>
                      </h4>
                      {repo.description ? <p>{repo.description}</p> : null}
                    </div>
                    <div>
                      <ul>
                        <li className="badge badge-primary">
                          Stars: {repo.stargazers_count}
                        </li>
                        <li className="badge badge-dark">
                          Watchers: {repo.watchers_count}
                        </li>
                        <li className="badge badge-light">
                          Forks: {repo.forks_count}
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default DeveloperDetails;
