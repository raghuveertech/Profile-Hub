import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Authenticated from ".";
import { modifyExperience } from "../../api-methods";
import Alert from "../layout/Alert";

const AddEditExperience = (props) => {
  const { setProfile, profile } = props;
  const { expId } = useParams();
  const [formData, setFormData] = useState({
    id: "",
    designation: "",
    company: "",
    location: "",
    fromMonth: "",
    fromYear: "",
    current: "",
    toMonth: "",
    toYear: "",
    description: "",
  });

  const [success, setSuccess] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    designationError: "",
    companyError: "",
    fromMonthError: "",
    fromYearError: "",
  });

  const [experienceErrors, setExperienceErrors] = useState([]);

  const navigate = useNavigate();

  const changeHandler = (e) => {
    if (e.target.name === "current") {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          [e.target.name]: e.target.checked,
        };
      });
    } else {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          [e.target.name]: e.target.value,
        };
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { designation, company, fromMonth, fromYear } = formData;
    let designationError = "";
    let companyError = "";
    let fromMonthError = "";
    let fromYearError = "";

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
    if (!fromMonth) {
      fromMonthError = "Please select month";
    } else {
      fromMonthError = "";
    }

    if (!fromYear) {
      fromYearError = "Please enter year";
    } else {
      fromYearError = "";
    }

    setValidationErrors((prevValidationErrors) => {
      return {
        ...prevValidationErrors,
        designationError,
        companyError,
        fromMonthError,
        fromYearError,
      };
    });

    if (
      !designationError &&
      !companyError &&
      !fromMonthError &&
      !fromYearError
    ) {
      const {
        _id,
        designation,
        company,
        location,
        fromMonth,
        fromYear,
        current,
        toMonth,
        toYear,
        description,
      } = formData;
      const fromMonthFormatted = fromMonth > 9 ? fromMonth : "0" + fromMonth;
      const toMonthFormatted = toMonth > 9 ? toMonth : "0" + toMonth;
      const from = `${fromYear}-${fromMonthFormatted}-01`;
      let to;
      if (current) {
        to = "";
      } else {
        to = `${toYear}-${toMonthFormatted}-01`;
      }

      const body = JSON.stringify({
        _id,
        designation,
        company,
        location,
        from,
        current,
        to,
        description,
      });
      try {
        const response = await modifyExperience(body);
        const profile = response.data;
        if (profile) {
          setExperienceErrors([]);
          setSuccess(true);
          setProfile(profile);
          // redirect to profile dashboard
          navigate("/profile/dashboard");
        }
      } catch (error) {
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          setExperienceErrors(errors);
        } else if (error.response.status === 500) {
          setExperienceErrors([
            { msg: "Something went wrong. Please try later." },
          ]);
        }
      }
    }
  };

  useEffect(() => {
    if (profile && Object.keys(profile).length !== 0 && expId) {
      const currentExperience = profile.profileInfo.experience.find((exp) => {
        return exp._id === expId;
      });
      const fromMonth = 1 + moment(currentExperience.from).month();
      const fromYear = moment(currentExperience.from).year();
      let toMonth = "";
      let toYear = "";
      if (currentExperience.to) {
        toMonth = 1 + moment(currentExperience.to).month();
        toYear = moment(currentExperience.to).year();
      }
      setFormData({
        ...currentExperience,
        fromMonth,
        fromYear,
        toMonth,
        toYear,
      });
    }
  }, [profile, expId]);

  const {
    _id,
    designation,
    company,
    location,
    fromMonth,
    fromYear,
    current,
    toMonth,
    toYear,
    description,
  } = formData;

  const { designationError, companyError, fromMonthError, fromYearError } =
    validationErrors;

  return (
    <Authenticated>
      <section className="container">
        {success && (
          <Alert alertType={"success"} alertMsg={"Profile Updated"} />
        )}

        {experienceErrors && experienceErrors.length > 0
          ? experienceErrors.map((error) => {
              return <Alert alertType={"danger"} alertMsg={error.msg} />;
            })
          : null}
        <h1 className="large text-primary">
          {_id ? "Edit" : "Add An"} Experience
        </h1>

        <p className="lead">
          <i className="fas fa-code-branch"></i> Add any developer/programming
          positions that you have had in the past
        </p>
        <small>* = required field</small>
        <form className="form" onSubmit={submitHandler}>
          <input type={"hidden"} value={_id} />
          <div className="form-group">
            <input
              type="text"
              placeholder="* Designation"
              name="designation"
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
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={location}
              onChange={changeHandler}
            />
          </div>
          <div className="form-group-wrap">
            <h4>From Date</h4>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <select
                    name="fromMonth"
                    value={fromMonth}
                    onChange={changeHandler}
                  >
                    <option value={""}>Select Month</option>
                    {moment.months().map((month, index) => {
                      return (
                        <option value={index + 1} key={month}>
                          {month}
                        </option>
                      );
                    })}
                  </select>
                  {fromMonthError && (
                    <p className="error alert-danger">{fromMonthError}</p>
                  )}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <input
                    name="fromYear"
                    type={"text"}
                    value={fromYear}
                    onChange={changeHandler}
                  />
                  {fromYearError && (
                    <p className="error alert-danger">{fromYearError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <p>
              <input
                type="checkbox"
                name="current"
                onChange={changeHandler}
                checked={current}
              />{" "}
              Current Job
            </p>
          </div>
          {!current && (
            <div className="form-group-wrap">
              <h4>To Date</h4>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <select
                      name="toMonth"
                      value={toMonth}
                      onChange={changeHandler}
                    >
                      <option value={""}>To Month</option>
                      {moment.months().map((month, index) => {
                        return (
                          <option value={index + 1} key={month}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      type={"text"}
                      name="toYear"
                      value={toYear}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="form-group">
            <textarea
              name="description"
              cols="30"
              rows="5"
              placeholder="Job Description"
              value={description}
              onChange={changeHandler}
            ></textarea>
          </div>
          <input type="submit" className="btn btn-primary my-1" />
          <Link className="btn btn-light my-1" to="/profile/dashboard">
            Go Back
          </Link>
        </form>
      </section>
    </Authenticated>
  );
};

export default AddEditExperience;
