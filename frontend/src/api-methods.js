import axios from "axios";
import apis from "./api-endpoints";

const { registration, login } = apis;

// configs
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
const authConfig = {
  headers: {
    "Content-Type": "application/json",
    token: localStorage.token,
  },
};

const postMethod = async (url, body, config) => {
  const response = await axios.post(url, body, config);
  return response;
};

// methods
export const registerUser = async (body) => {
  const response = await postMethod(registration, body, config);
  return response;
};

export const loginUser = async (body) => {
  const response = await postMethod(login, body, config);
  return response;
};
