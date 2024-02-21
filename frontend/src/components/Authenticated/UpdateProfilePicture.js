import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Authenticated from ".";
import { updateProfilePicture } from "../../api-methods";
import { TokenContext } from "../../App";
import Alert from "../layout/Alert";

const UpdateProfilePicture = (props) => {
  const { profileInfo } = props.profile;
  const { getFullProfile } = props;
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // actual file to be sent to backend
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // preview image
  const [profilePictureErrors, setProfilePictureErrors] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    profilePictureError: "",
  });
  const [success, setSuccess] = useState(false);

  const { profilePictureError } = validationErrors;

  const { token } = useContext(TokenContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationErrors({
        profilePictureError: "Please select a picture",
      });
    } else {
      setValidationErrors({
        profilePictureError: "",
      });
      try {
        const formData = new FormData();
        formData.append("profilepicture", selectedFile);
        const reponse = await updateProfilePicture(formData, token);
        if (reponse.status === 200) {
          setSuccess(true);
          setProfilePictureErrors([]);
          getFullProfile(token);
        }
      } catch (error) {
        console.log("error", error);
        if (error?.response?.data) {
          setProfilePictureErrors([error.response.data]);
          setSuccess(false);
        }
      }
    }
  };

  const changeHandler = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePreviewImage = (e) => {
    e.preventDefault();
    setImagePreviewUrl("");
    setSelectedFile(null);
  };
  useEffect(() => {
    let profilePicture = "";
    profilePicture = profileInfo?.profilepicture?.path;
    setProfilePicture(profilePicture);
    setImagePreviewUrl("");
  }, [profileInfo]);

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  return (
    <>
      {profileInfo ? (
        <Authenticated>
          <section className="container">
            {success && (
              <Alert
                alertType={"success"}
                alertMsg={"Profile Picture Updated"}
              />
            )}

            {profilePictureErrors && profilePictureErrors.length > 0
              ? profilePictureErrors.map((error) => {
                  return <Alert alertType={"danger"} alertMsg={error} />;
                })
              : null}

            <h1 className="large text-primary">Update Your Profile Picture</h1>
            <p className="lead">
              <i className="fas fa-user"></i> Select JPG/JPEG/PNG/SVG/WEBP file
              extensions
            </p>
            <small>* = required field</small>
            <form className="form" method="POST" onSubmit={submitHandler}>
              <div className="form-group dp">
                {imagePreviewUrl ? (
                  <button className="remove-pic" onClick={removePreviewImage}>
                    Remove
                  </button>
                ) : (
                  ""
                )}
                <div className="profile-picture-wrapper">
                  {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} />
                  ) : (
                    <>
                      {profilePicture ? (
                        <img
                          src={`${baseURL}/${
                            profilePicture ? profilePicture : ""
                          }`}
                        />
                      ) : (
                        <i className="fa-solid fa-user"></i>
                      )}
                    </>
                  )}

                  <label htmlFor="profilepicture">Choose Profile Picture</label>
                  <input
                    id="profilepicture"
                    type={"file"}
                    placeholder={"* Profile Picture"}
                    name={"profilepicture"}
                    onChange={changeHandler}
                    accept="image/*"
                  />
                </div>
                {profilePictureError && (
                  <p className="error alert-danger">{profilePictureError}</p>
                )}
              </div>

              <input
                type="submit"
                className="btn btn-primary my-1"
                value={"Update"}
              />

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

export default UpdateProfilePicture;
