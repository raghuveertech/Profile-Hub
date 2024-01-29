import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TokenContext } from "../../App";

const Logout = () => {
  const { setToken } = useContext(TokenContext);
  const navigate = useNavigate();
  useEffect(() => {
    setToken(null);
    navigate("/login");
  }, []);
};

export default Logout;
