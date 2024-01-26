import React from "react";

const Alert = (props) => {
  const { alertType, alertMsg } = props;
  return <div className={`alert alert-${alertType} `}>{alertMsg}</div>;
};

export default Alert;
