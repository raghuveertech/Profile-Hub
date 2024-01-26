import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from "../layout/Alert";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    emailError: "",
    passwordError: "",
  });

  const [loginErrors, setLoginErrors] = useState([]);

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
    const { email, password } = formData;

    let emailError = "";
    let passwordError = "";

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

    setValidationErrors((prevValidationErrors) => {
      return {
        ...prevValidationErrors,
        emailError: emailError,
        passwordError: passwordError,
      };
    });
    if (!emailError && !passwordError) {
      const body = JSON.stringify(formData);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await axios.post("/api/users/login", body, config);
        const token = response.data.token;
        if (token) {
          setLoginErrors([]);
          // redirect to profile dashboard
        }
      } catch (error) {
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          setLoginErrors(errors);
        } else if (error.response.status === 500) {
          setLoginErrors([{ msg: "Something went wrong. Please try later." }]);
        }
      }
    }
  };

  const { email, password } = formData;
  const { emailError, passwordError } = validationErrors;

  return (
    <section className="container">
      {loginErrors && loginErrors.length > 0
        ? loginErrors.map((error) => {
            return <Alert alertType={"danger"} alertMsg={error.msg} />;
          })
        : null}
      <h1 className="large text-primary">Sign In</h1>
      <form className="form" onSubmit={submitHandler}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={changeHandler}
          />
          {emailError && <p className="error alert-danger">{emailError}</p>}
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

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  );
};

export default Login;
