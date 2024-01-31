import axios from "axios";
import apis from "./api-endpoints";

const { registrationAPI, loginAPI, getProfileInfoAPI, modifyExperienceAPI } =
  apis;

// configs
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
const authConfigGET = {
  headers: {
    "x-auth-token": localStorage.token,
  },
};

const authConfigPOST = {
  headers: {
    "Content-Type": "application/json",
    "x-auth-token": localStorage.token,
  },
};

const postMethod = async (url, body, config) => {
  const response = await axios.post(url, body, config);
  return response;
};

const getMethod = async (url, config) => {
  const response = await axios.get(url, config);
  return response;
};

const putMethod = async (url, body, config) => {
  const response = await axios.put(url, body, config);
  return response;
};

// methods
export const registerUser = async (body) => {
  const response = await postMethod(registrationAPI, body, config);
  return response;
};

export const loginUser = async (body) => {
  const response = await postMethod(loginAPI, body, config);
  return response;
};

export const getProfileInfo = async () => {
  const response = await getMethod(getProfileInfoAPI, authConfigGET);
  return response;
};

export const modifyExperience = async (body) => {
  const response = await putMethod(modifyExperienceAPI, body, authConfigPOST);
  return response;
};
