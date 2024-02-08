import React, { useEffect, useState } from "react";
import { getAllProfiles } from "../../api-methods";
import { Link } from "react-router-dom";

const Developers = () => {
  const [allProfiles, setAllProfiles] = useState([]);
  useEffect(() => {
    async function getAllProfilesMethod() {
      const response = await getAllProfiles();
      setAllProfiles(response.data);
    }
    getAllProfilesMethod();
  }, []);

  return (
    <section className="container">
      <h1 className="large text-primary">Developers</h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i> Browse and connect with
        developers
      </p>
      <div className="profiles">
        {allProfiles && allProfiles.length > 0
          ? allProfiles.map((profile) => {
              return (
                <div className="profile bg-light">
                  <img
                    className="round-img"
                    src={
                      profile.profilepicture && profile.profilepicture.path
                        ? profile.profilepicture.path
                        : profile.user.avatar
                    }
                    alt={profile.user.name}
                  />
                  <div>
                    <h2>{profile.user.name}</h2>
                    <p>
                      {profile.designation} at {profile.company}
                    </p>
                    <p>{profile.location}</p>
                    <Link to="/profile/" className="btn btn-primary">
                      View Profile
                    </Link>
                  </div>

                  <ul>
                    {profile.skills && profile.skills.length > 0
                      ? profile.skills.map((skill) => {
                          return (
                            <li className="text-primary">
                              <i className="fas fa-check"></i> {skill}
                            </li>
                          );
                        })
                      : null}
                  </ul>
                </div>
              );
            })
          : null}
      </div>
    </section>
  );
};

export default Developers;
