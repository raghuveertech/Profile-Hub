import { v4 } from "uuid";
import { REMOVE_ALERT, SET_ALERT } from "./actionTypes";

export const setAlert = (alertMsg, alertType) => {
  return function (dispatch) {
    const id = v4();
    dispatch({
      type: SET_ALERT,
      payload: {
        id: id,
        alertMsg: alertMsg,
        alertType: alertType,
      },
    });

    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: {
          id: id,
        },
      });
    }, 5000);
  };
};
