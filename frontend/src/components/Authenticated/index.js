import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../App";

const Authenticated = (props) => {
  const { token } = useContext(TokenContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);
  if (token) {
    return <div className="authenticated">{props.children}</div>;
  }
};

export default Authenticated;
