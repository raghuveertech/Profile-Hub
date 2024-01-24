import axios from "axios";
import { REGISTER_FAIL, REGISTER_SUCCESS } from "./actionTypes";
import { setAlert } from "../alert/actions";

export const registerUser = (name, email, password) => {
  return async (dispatch) => {
    let data = { name, email, password };
    try {
      const body = JSON.stringify(data);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post("/api/users", body, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      const errosArray = error.response.data.errors;
      errosArray.forEach((err) => {
        dispatch(setAlert(err.msg, "danger"));
      });
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
};
