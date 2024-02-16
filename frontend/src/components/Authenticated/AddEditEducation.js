import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Authenticated from ".";
import { getEducation, modifyEducation } from "../../api-methods";
import Alert from "../layout/Alert";
import { TokenContext } from "../../App";

const AddEditEducation = (props) => {
  const { setProfile } = props;
  const { eduId } = useParams();
  const [formData, setFormData] = useState({
    id: "",
    fieldofstudy: "",
    school: "",
    degree: "",
    fromMonth: "",
    fromYear: "",
    current: "",
    toMonth: "",
    toYear: "",
    description: "",
  });

  const [success, setSuccess] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    schoolError: "",
    degreeError: "",
    fieldofstudyError: "",
    fromMonthError: "",
    fromYearError: "",
  });

  const [educationErrors, setEducationErrors] = useState([]);

  const navigate = useNavigate();
  const { token } = useContext(TokenContext);

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
    const { school, degree, fieldofstudy, fromMonth, fromYear } = formData;
    let schoolError = "";
    let degreeError = "";
    let fieldofstudyError = "";
    let fromMonthError = "";
    let fromYearError = "";

    if (!school) {
      schoolError = "School is required";
    } else {
      schoolError = "";
    }

    if (!degree) {
      degreeError = "Degree is required";
    } else {
      degreeError = "";
    }

    if (!fieldofstudy) {
      fieldofstudyError = "Field of Study is required";
    } else {
      fieldofstudyError = "";
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
        schoolError,
        degreeError,
        fieldofstudyError,
        fromMonthError,
        fromYearError,
      };
    });

    if (
      !schoolError &&
      !degreeError &&
      !fieldofstudyError &&
      !fromMonthError &&
      !fromYearError
    ) {
      const {
        _id,
        fieldofstudy,
        school,
        degree,
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
        fieldofstudy,
        school,
        degree,
        from,
        current,
        to,
        description,
      });

      try {
        const response = await modifyEducation(body, token);
        const profile = response.data;
        if (profile) {
          setEducationErrors([]);
          setSuccess(true);
          setProfile(profile);
          // redirect to profile dashboard
          navigate("/profile/dashboard");
        }
      } catch (error) {
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          setEducationErrors(errors);
        } else if (error.response.status === 500) {
          setEducationErrors([
            { msg: "Something went wrong. Please try later." },
          ]);
        }
      }
    }
  };

  useEffect(() => {
    if (eduId) {
      async function getEducationMethod() {
        const response = await getEducation(eduId, token);

        const currentEducation = response.data;

        const fromMonth = 1 + moment(currentEducation.from).month();
        const fromYear = moment(currentEducation.from).year();
        let toMonth = "";
        let toYear = "";
        if (currentEducation.to) {
          toMonth = 1 + moment(currentEducation.to).month();
          toYear = moment(currentEducation.to).year();
        }
        setFormData({
          ...currentEducation,
          fromMonth,
          fromYear,
          toMonth,
          toYear,
        });
      }
      getEducationMethod();
    }
  }, [eduId, token]);

  const {
    _id,
    fieldofstudy,
    school,
    degree,
    fromMonth,
    fromYear,
    current,
    toMonth,
    toYear,
    description,
  } = formData;

  const {
    schoolError,
    degreeError,
    fieldofstudyError,
    fromMonthError,
    fromYearError,
  } = validationErrors;

  return (
    <Authenticated>
      <section className="container">
        {success && (
          <Alert alertType={"success"} alertMsg={"Profile Updated"} />
        )}

        {educationErrors && educationErrors.length > 0
          ? educationErrors.map((error) => {
              return <Alert alertType={"danger"} alertMsg={error.msg} />;
            })
          : null}
        <h1 className="large text-primary">
          {_id ? "Edit" : "Add An"} Education
        </h1>

        <small>* = required field</small>
        <form className="form" onSubmit={submitHandler}>
          <input type={"hidden"} value={_id} />
          <div className="form-group">
            <input
              type="text"
              placeholder="* School"
              name="school"
              value={school}
              onChange={changeHandler}
            />
            {schoolError && <p className="error alert-danger">{schoolError}</p>}
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="* Field of Study"
              name="fieldofstudy"
              value={fieldofstudy}
              onChange={changeHandler}
            />
            {fieldofstudyError && (
              <p className="error alert-danger">{fieldofstudyError}</p>
            )}
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="* Degree"
              name="degree"
              value={degree}
              onChange={changeHandler}
            />
            {degreeError && <p className="error alert-danger">{degreeError}</p>}
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
              Current
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
              placeholder="Description"
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

export default AddEditEducation;
