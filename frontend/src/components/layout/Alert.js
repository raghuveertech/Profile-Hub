import React from "react";
import { useSelector } from "react-redux";

const Alert = () => {
  const alerts = useSelector((state) => state.alert);
  let alertsContainer;
  if (alerts && alerts.length > 0) {
    alertsContainer = alerts.map((alert) => {
      return (
        <div className={`alert alert-${alert.alertType} `}>
          {alert.alertMsg}
        </div>
      );
    });
  } else {
    alertsContainer = null;
  }
  return <div className="container">{alertsContainer}</div>;
};

export default Alert;
