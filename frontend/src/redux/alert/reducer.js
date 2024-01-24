import { REMOVE_ALERT, SET_ALERT } from "./actionTypes";

const initialAlertState = [];

export const alertReducer = (state = initialAlertState, action) => {
  const { payload, type } = action;
  switch (type) {
    case SET_ALERT: {
      return [...state, payload];
    }
    case REMOVE_ALERT: {
      return state.filter((alert) => {
        return alert.id !== payload.id;
      });
    }
    default:
      return state;
  }
};
