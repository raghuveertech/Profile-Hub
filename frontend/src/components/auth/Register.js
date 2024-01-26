import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from "../layout/Alert";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
    password2Error: "",
  });

  const [success, setSuccess] = useState(false);
  const [registationErrors, setRegistrationErrors] = useState([]);

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
    const { name, email, password, password2 } = formData;
    let nameError = "";
    let emailError = "";
    let passwordError = "";
    let password2Error = "";
    if (!name) {
      nameError = "Name is required";
    } else {
      nameError = "";
    }
    if (!email) {
      emailError = "Email is required";
    } else {
      emailError = "";
    }
    if (!password) {
      passwordError = "Password is required";
    } else {
      if (password.length < 6) {
        passwordError = "Password should be atleast 6 characters";
      } else {
        passwordError = "";
      }
    }
    if (!password2) {
      password2Error = "Confirm Password is required";
    } else {
      if (password !== password2) {
        password2Error = "Confirm Password should match with password";
      } else {
        password2Error = "";
      }
    }
    setValidationErrors((prevValidationErrors) => {
      return {
        ...prevValidationErrors,
        nameError: nameError,
        emailError: emailError,
        passwordError: passwordError,
        password2Error: password2Error,
      };
    });

    if (!nameError && !emailError && !passwordError && !password2Error) {
      const { name, email, password } = formData;
      const body = JSON.stringify({ name, email, password });
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await axios.post("/api/users/register", body, config);
        const token = response.data.token;
        if (token) {
          setRegistrationErrors([]);
          setSuccess(true);
          // redirect to profile dashboard
        }
      } catch (error) {
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          setRegistrationErrors(errors);
        } else if (error.response.status === 500) {
          setRegistrationErrors([
            { msg: "Something went wrong. Please try later." },
          ]);
        }
      }
    }
  };

  const { name, email, password, password2 } = formData;
  const { nameError, emailError, passwordError, password2Error } =
    validationErrors;

  return (
    <section className="container">
      {success && (
        <Alert
          alertType={"success"}
          alertMsg={
            "Registration Successful. You will be redirected to profile page."
          }
        />
      )}

      {registationErrors && registationErrors.length > 0
        ? registationErrors.map((error) => {
            return <Alert alertType={"danger"} alertMsg={error.msg} />;
          })
        : null}

      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={submitHandler}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={changeHandler}
          />
          {nameError && <p className="error alert-danger">{nameError}</p>}
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={changeHandler}
          />
          {emailError && <p className="error alert-danger">{emailError}</p>}
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={changeHandler}
          />
          {passwordError && (
            <p className="error alert-danger">{passwordError}</p>
          )}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={changeHandler}
          />
          {password2Error && (
            <p className="error alert-danger">{password2Error}</p>
          )}
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
  );
};

export default Register;
