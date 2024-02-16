import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Authenticated from ".";
import { updateProfileInfo } from "../../api-methods";
import { TokenContext } from "../../App";
import Alert from "../layout/Alert";

const UpdateProfile = (props) => {
  const { profile, getFullProfile } = props;
  const { profileInfo } = profile;

  const [formData, setFormData] = useState({
    designation: "",
    company: "",
    website: "",
    location: "",
    skills: "",
    githubusername: "",
    bio: "",
    youtube: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    instagram: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    designationError: "",
    companyError: "",
    skillsError: "",
  });

  const [profileErrors, setProfileErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { token } = useContext(TokenContext);

  useEffect(() => {
    if (profileInfo) {
      setFormData({
        ...profileInfo,
        skills: profileInfo.skills.join(","),
        youtube: profileInfo.social.youtube || "",
        twitter: profileInfo.social.twitter || "",
        facebook: profileInfo.social.facebook || "",
        linkedin: profileInfo.social.linkedin || "",
        instagram: profileInfo.social.instagram || "",
      });
    }
  }, [profileInfo]);

  const changeHandler = (e) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    const {
      designation,
      company,
      website,
      location,
      skills,
      githubusername,
      bio,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = formData;

    let designationError = "";
    let companyError = "";
    let skillsError = "";

    if (!designation) {
      designationError = "Designation is required";
    } else {
      designationError = "";
    }

    if (!company) {
      companyError = "Company is required";
    } else {
      companyError = "";
    }

    if (!skills) {
      skillsError = "Please enter skills";
    } else {
      skillsError = "";
    }

    setValidationErrors((prevValidationErrors) => {
      return {
        ...prevValidationErrors,
        designationError,
        companyError,
        skillsError,
      };
    });

    if (!designationError && !companyError && !skillsError) {
      const body = JSON.stringify({
        designation,
        company,
        website,
        location,
        skills,
        githubusername,
        bio,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
      });

      try {
        const response = await updateProfileInfo(body, token);
        const profile = response.data;
        if (profile) {
          setSuccess(true);
          getFullProfile(token);
          setTimeout(() => {
            navigate("/profile/dashboard");
          }, 2000);
        }
      } catch (error) {
        console.log("error", error);
        if (error?.response?.data?.errors) {
          const errors = error.response.data.errors;
          setProfileErrors(errors);
        } else if (error.response.status === 500) {
          setProfileErrors([
            { msg: "Something went wrong. Please try later." },
          ]);
        }
      }
    }
  };

  const {
    designation,
    company,
    website,
    location,
    skills,
    githubusername,
    bio,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
  } = formData;

  const { designationError, companyError, skillsError } = validationErrors;

  return (
    <>
      {profileInfo ? (
        <Authenticated>
          <section className="container">
            {success && (
              <Alert alertType={"success"} alertMsg={"Profile Updated"} />
            )}

            {profileErrors && profileErrors.length > 0
              ? profileErrors.map((error) => {
                  return <Alert alertType={"danger"} alertMsg={error.msg} />;
                })
              : null}

            <h1 className="large text-primary">Create Your Profile</h1>
            <p className="lead">
              <i className="fas fa-user"></i> Let's get some information to make
              your profile stand out
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={submitHandler}>
              <div className="form-group">
                <input
                  type={"text"}
                  placeholder={"* Designation"}
                  name={"designation"}
                  value={designation}
                  onChange={changeHandler}
                />
                {designationError && (
                  <p className="error alert-danger">{designationError}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="* Company"
                  name="company"
                  value={company}
                  onChange={changeHandler}
                />
                {companyError && (
                  <p className="error alert-danger">{companyError}</p>
                )}
                <small className="form-text">
                  Could be your own company or one you work for
                </small>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Website"
                  name="website"
                  value={website}
                  onChange={changeHandler}
                />
                <small className="form-text">
                  Could be your own or a company website
                </small>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Location"
                  name="location"
                  value={location}
                  onChange={changeHandler}
                />
                <small className="form-text">
                  City & state suggested (eg. Boston, MA)
                </small>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="* Skills"
                  name="skills"
                  value={skills}
                  onChange={changeHandler}
                />
                {skillsError && (
                  <p className="error alert-danger">{skillsError}</p>
                )}
                <small className="form-text">
                  Please use comma separated values (eg.
                  HTML,CSS,JavaScript,PHP)
                </small>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Github Username"
                  name="githubusername"
                  value={githubusername}
                  onChange={changeHandler}
                />
                <small className="form-text">
                  If you want your latest repos and a Github link, include your
                  username
                </small>
              </div>
              <div className="form-group">
                <textarea
                  placeholder="A short bio of yourself"
                  name="bio"
                  value={bio}
                  onChange={changeHandler}
                ></textarea>
                <small className="form-text">
                  Tell us a little about yourself
                </small>
              </div>

              <div className="my-2">
                <h3>Add Social Network Links</h3>
                <span>Optional</span>
              </div>

              <div className="form-group social-input">
                <i className="fab fa-twitter fa-2x"></i>
                <input
                  type="text"
                  placeholder="Twitter URL"
                  name="twitter"
                  value={twitter}
                  onChange={changeHandler}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-facebook fa-2x"></i>
                <input
                  type="text"
                  placeholder="Facebook URL"
                  name="facebook"
                  value={facebook}
                  onChange={changeHandler}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-youtube fa-2x"></i>
                <input
                  type="text"
                  placeholder="YouTube URL"
                  name="youtube"
                  value={youtube}
                  onChange={changeHandler}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-linkedin fa-2x"></i>
                <input
                  type="text"
                  placeholder="Linkedin URL"
                  name="linkedin"
                  value={linkedin}
                  onChange={changeHandler}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-instagram fa-2x"></i>
                <input
                  type="text"
                  placeholder="Instagram URL"
                  name="instagram"
                  value={instagram}
                  onChange={changeHandler}
                />
              </div>
              <input type="submit" className="btn btn-primary my-1" />
              <Link className="btn btn-light my-1" to="/profile/dashboard">
                Go Back
              </Link>
            </form>
          </section>
        </Authenticated>
      ) : null}
    </>
  );
};

export default UpdateProfile;
