import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser } from "../../redux/register/actions";

const Register = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
    password2Error: "",
  });

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
      passwordError = "";
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
    setErrors((prevErrors) => {
      return {
        ...prevErrors,
        nameError: nameError,
        emailError: emailError,
        passwordError: passwordError,
        password2Error: password2Error,
      };
    });

    if (!nameError && !emailError && !passwordError && !password2Error) {
      const { name, email, password } = formData;
      dispatch(registerUser(name, email, password));
    }
  };

  const { name, email, password, password2 } = formData;
  const { nameError, emailError, passwordError, password2Error } = errors;

  return (
    <section className="container">
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
