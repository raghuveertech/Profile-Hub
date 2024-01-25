import React from "react";

const Alert = (props) => {
  const { alert } = props;
  return (
    <div className={`alert alert-${alert.alertType} `}>{alert.alertMsg}</div>
  );
};

export default Alert;
