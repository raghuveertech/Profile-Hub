import { combineReducers } from "redux";
import { alertReducer } from "../alert/reducer";
import { registerReducer } from "../register/reducer";

const rootReducer = combineReducers({
  alert: alertReducer,
  register: registerReducer,
});

export default rootReducer;
